import mysql from 'mysql2/promise';

// Log database configuration (without sensitive info)
console.log('Database Configuration:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
});

// Create a connection pool for better performance and connection management
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certificates
    minVersion: 'TLSv1.2'
  },
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  connectTimeout: 60000,
  multipleStatements: true,
  timezone: 'Z',
  typeCast: function (field, next) {
    if (field.type === 'TINY' && field.length === 1) {
      return field.string() === '1';
    }
    return next();
  }
});

// Function to execute query with retries and proper connection handling
async function executeQueryWithRetry(query, values, maxRetries = 3) {
  const processedValues = values.map(value => {
    if (value === undefined || (typeof value === 'number' && isNaN(value))) {
      return null;
    }
    return value;
  });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    let connection;
    try {
      connection = await pool.getConnection();
      
      // Determine if we should use query() or execute() based on the SQL command
      const isCreateAlterDrop = 
        /^(CREATE|ALTER|DROP|TRUNCATE|RENAME|USE)/i.test(query.trim()) ||
        /^(START|COMMIT|ROLLBACK)/i.test(query.trim());
      
      let results;
      if (isCreateAlterDrop) {
        [results] = await connection.query(query, processedValues);
      } else {
        try {
          [results] = await connection.execute(query, processedValues);
        } catch (execError) {
          console.warn('Execute failed, falling back to query:', execError.message);
          [results] = await connection.query(query, processedValues);
        }
      }
      
      return results;
    } catch (error) {
      console.error(`Query attempt ${attempt}/${maxRetries} failed:`, {
        code: error.code,
        message: error.message,
        query: query
      });
      
      // Don't retry certain errors
      if (error.code === 'ER_ACCESS_DENIED_ERROR' ||
          error.code === 'ER_BAD_DB_ERROR') {
        throw error;
      }
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    } finally {
      if (connection) {
        try {
          connection.release();
        } catch (releaseError) {
          console.error('Error releasing connection:', releaseError);
        }
      }
    }
  }
}

export async function executeQuery({ query, values = [] }) {
  console.log('Executing query:', query);
  console.log('With values:', values);
  
  try {
    return await executeQueryWithRetry(query, values);
  } catch (error) {
    console.error('Database error:', error);
    
    // Enhance error information
    const enhancedError = new Error(error.message);
    enhancedError.code = error.code;
    enhancedError.errno = error.errno;
    enhancedError.sqlState = error.sqlState;
    enhancedError.sqlMessage = error.sqlMessage;
    enhancedError.query = query;
    
    throw enhancedError;
  }
}
