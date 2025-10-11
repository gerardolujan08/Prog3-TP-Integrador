import mysql from 'mysql2/promise';
process.loadEnvFile();

export const conexion = await mysql.createConnection({
  host: process.env.HOSTDB,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD  
});
