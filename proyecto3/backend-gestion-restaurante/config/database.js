// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de la conexión a MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,     // nombre de la base de datos
  process.env.DB_USER,     // usuario
  process.env.DB_PASSWORD, // contraseña
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306, // 🔹 esto le agregué así
    dialect: 'mysql',
    logging: false, // para no mostrar consultas en consola
  }
);

module.exports = sequelize;
