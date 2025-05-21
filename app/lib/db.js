import mysql from 'mysql2/promise';

// Create a connection pool for better performance and connection management
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true
  } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  connectTimeout: 20000, // 20 seconds
  acquireTimeout: 30000, // 30 seconds
  timezone: 'Z',
  typeCast: function (field, next) {
    if (field.type === 'TINY' && field.length === 1) {
      return field.string() === '1'; // Convert tinyint(1) to boolean
    }
    return next();
  }
});

// Function to execute query with retries
async function executeQueryWithRetry(query, values, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const connection = await pool.getConnection();
      try {
        const [results] = await connection.execute(query, values);
        return results;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error(`Database error (attempt ${attempt}/${maxRetries}):`, error);
      if (attempt === maxRetries) {
        throw new Error(`Database error after ${maxRetries} attempts: ${error.message}`);
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt), 10000)));
    }
  }
}

export async function executeQuery({ query, values = [] }) {
  try {
    return await executeQueryWithRetry(query, values);
  } catch (error) {
    console.error('Final database error:', error);
    throw error;
  }
}