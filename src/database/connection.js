const sql = require('mssql');
const dbConfig = require('../config/database');

let pool;

const connectDB = async () => {
  try {
    pool = await sql.connect(dbConfig);
    console.log('✅ SQL Server conectado correctamente');
  } catch (error) {
    console.error('❌ Error conectando a SQL Server:', error.message);
    process.exit(1);
  }
};

const checkDB = async () => {
  try {
    await pool.request().query('SELECT 1');
    return true;
  } catch {
    return false;
  }
};

module.exports = {
  connectDB,
  checkDB,
  sql
};
