import mysql from 'mysql2/promise';

export async function executeQuery({ query, values = [] }) {  const dbConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: true
    } : undefined,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });
  
  try {
    const [results] = await dbConnection.execute(query, values);
    return results;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    await dbConnection.end();
  }
} 