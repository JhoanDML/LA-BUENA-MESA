// server.js
// ========================================
// ✅ Configuración inicial del servidor
// ========================================
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const { User, Reservation } = require('./models');

// Inicializar Express
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ========================================
// ✅ Importar y usar las rutas
// ========================================
const authRouter = require('./routes/auth');
const reservationsRouter = require('./routes/reservations');

app.use('/api/auth', authRouter);
app.use('/api/reservations', reservationsRouter);

// ========================================
// ✅ Configuración del puerto
// ========================================
const PORT = process.env.PORT || 3000;

// ========================================
// ✅ Conexión y sincronización con MySQL
// ========================================
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL exitosa');

    // Esto actualiza la estructura de tablas sin perder datos
    await sequelize.sync({ alter: true });
    console.log('📦 Modelos sincronizados correctamente');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
  }
})();
