import mysql from 'mysql2/promise';

export async function executeQuery({ query, values = [] }) {
  console.log('Executing query:', query);
  
  // Check if values is null or undefined and set it to an empty array
  if (!values) values = [];
  
  // Ensure all values are of the correct type for MySQL
  values = values.map(value => {
    // Replace undefined with null (MySQL doesn't accept undefined)
    if (value === undefined) return null;
    
    // Convert NaN to null
    if (typeof value === 'number' && isNaN(value)) return null;
    
    // LIMIT and OFFSET need to be integers
    if (query.includes('LIMIT') || query.includes('OFFSET')) {
      if (typeof value === 'string' && /^\d+$/.test(value)) {
        return parseInt(value, 10);
      }
    }
    
    return value;
  });
  
  console.log('With processed values:', values);
  
  let dbConnection;
  
  try {
    // Try to create a connection
    dbConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'hswebsol',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'celi',
      // Add connection configuration to handle numeric values properly
      typeCast: function (field, next) {
        if (field.type === 'TINY' && field.length === 1) {
          return (field.string() === '1'); // Convert tinyint(1) to boolean
        }
        return next();
      }
    });
    
    // Determine if we should use query() or execute() based on the SQL command
    const isCreateAlterDrop = 
      /^(CREATE|ALTER|DROP|TRUNCATE|RENAME|USE)/i.test(query.trim()) ||
      /^(START|COMMIT|ROLLBACK)/i.test(query.trim());
    
    // Use query() for DDL statements and execute() for DML statements
    let results;
    if (isCreateAlterDrop) {
      [results] = await dbConnection.query(query, values);
    } else {
      try {
        [results] = await dbConnection.execute(query, values);
      } catch (execError) {
        // Fall back to regular query if execute fails
        console.warn('Execute failed, falling back to query:', execError.message);
        [results] = await dbConnection.query(query, values);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Database error:', error);
    
    // Add specific handling for common database errors
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Access denied to database. Check username and password.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection to database refused. Is MySQL server running?');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('Database does not exist. Need to run the schema script.');
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      console.error('Table does not exist. Need to run the schema script.');
    } else if (error.code === 'ER_WRONG_ARGUMENTS') {
      console.error('Wrong arguments to database. Check parameter types:', values);
    }
    
    throw error;
  } finally {
    // Close the connection if it was created
    if (dbConnection) {
      await dbConnection.end();
    }
  }
} 