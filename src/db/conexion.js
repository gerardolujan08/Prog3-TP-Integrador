import mysql from 'mysql2/promise';
process.loadEnvFile();

const con = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD  
}

export const conexion = await mysql.createConnection(con);
