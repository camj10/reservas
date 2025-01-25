import mysql from 'mysql2/promise';

const connection = async () => {
  try {
    // Establecer la conexión con la base de datos
    const db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'abm3',
    });
    console.log(`DB connected`);
    // console.log(`DB connected to: ${process.env.DB_NAME}`);
    return db;  

  } catch (err) {
    console.error(`Error in the DB connection: ${err.message}`);
    throw err;  
  }
};
export default connection

