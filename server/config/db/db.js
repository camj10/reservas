import mysql from 'mysql2/promise';

const connection = async () => {
  try {
    const db = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log(`DB connected`);
    return db;  

  } catch (err) {
    console.error(`Error in the DB connection: ${err.message}`);
    throw err;  
  }
};
export default connection

