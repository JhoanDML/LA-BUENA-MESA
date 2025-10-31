// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const router = express.Router();

// 🟩 REGISTRO DE USUARIO
router.post('/register', async (req, res) => {
  try {
    console.log('📩 Datos recibidos en registro:', req.body); // 👈 esto le agregué así

    const { nombre, correo, contraseña, rol } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { correo } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear nuevo usuario
    const user = await User.create({
      nombre,
      correo,
      contraseña: hashedPassword,
      rol: rol || 'cliente', // 👈 esto le agregué así (rol por defecto)
    });

    console.log('✅ Usuario registrado correctamente:', user.nombre);

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error('❌ Error en /register:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// 🟦 INICIO DE SESIÓN
router.post('/login', async (req, res) => {
  try {
    console.log('📩 Intento de inicio de sesión:', req.body); // 👈 esto le agregué así

    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { correo } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Verificar contraseña
    const valid = await bcrypt.compare(contraseña, user.contraseña);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    // Generar token
    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    console.log(`🔐 Usuario ${user.nombre} inició sesión correctamente`);

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error('❌ Error en /login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;
