// Simple script to test database connection

import mysql from 'mysql2/promise';

async function testConnection() {
  let connection;
  
  try {
    console.log('Trying to connect to database...');
      // Try to connect without database specified first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    });
    
    console.log('Connection successful!');
    
    // Check if database exists - using simpler query
    const [rows] = await connection.execute('SHOW DATABASES');
    console.log('Available databases:');
    
    const databases = rows.map(row => Object.values(row)[0]);
    console.log(databases);
    
    const dbExists = databases.includes(process.env.DB_NAME);
    
    if (!dbExists) {
      console.log(`Database '${process.env.DB_NAME}' does not exist. Creating it...`);
      
      // Create the database - use query() instead of execute() for this type of SQL
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
      console.log(`Database '${process.env.DB_NAME}' created successfully.`);
    } else {
      console.log(`Database '${process.env.DB_NAME}' exists.`);
    }
    
    // Close current connection and reconnect with database specified
    await connection.end();
    console.log('Reconnecting with database specified...');
    
    // Connect directly to the database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
    
    console.log(`Connected to ${process.env.DB_NAME} database!`);
      
    // Try to query tables
    try {
      const [tables] = await connection.execute('SHOW TABLES');
      console.log('Tables in database:');
      
      const tableNames = tables.map(t => Object.values(t)[0]);
      console.log(tableNames);
      
      // Check if our main table exists
      const tableExists = tableNames.includes('estimate_submissions');
      
      if (tableExists) {
        console.log('estimate_submissions table exists!');
        
        // Try to query one row to test full connectivity
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM estimate_submissions');
        console.log(`Number of submissions: ${rows[0].count}`);
        
      } else {
        console.log('estimate_submissions table does not exist. Need to run the schema script.');
        
        // Create test table if needed
        await connection.query(`
          CREATE TABLE IF NOT EXISTS test_connection (
            id INT AUTO_INCREMENT PRIMARY KEY,
            test_column VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        console.log('Test table created successfully.');
        
        // Insert a test row
        await connection.query(`
          INSERT INTO test_connection (test_column) VALUES ('Connection test successful')
        `);
        
        console.log('Test data inserted successfully.');
      }
    } catch (tableError) {
      console.error('Error checking tables:', tableError);
    }
    
  } catch (error) {
    console.error('Database connection test failed:', error);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔴 Access denied. Check username and password in .env.local file.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔴 Connection refused. Is MySQL server running?');
    } else {
      console.error('🔴 Other error:', error.message);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connection closed.');
    }
  }
}

// Run the test
testConnection(); 