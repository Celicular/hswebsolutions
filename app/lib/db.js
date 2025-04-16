import mysql from 'mysql2/promise';

export async function executeQuery({ query, values = [] }) {
  const dbConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
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