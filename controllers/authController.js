// controllers/authController.js
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { nombreUsuario, apellidoUsuario, correoElectronico, contraseña } = req.body;

  try {
    // Verificar si el usuario o correo ya existen
    const userExists = await User.findOne({
      where: { nombreUsuario },
    });

    const emailExists = await User.findOne({
      where: { correoElectronico },
    });

    if (userExists) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso.' });
    }

    if (emailExists) {
      return res.status(400).json({ error: 'El correo electrónico ya está en uso.' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear el usuario
    const user = await User.create({
      nombreUsuario,
      apellidoUsuario,
      correoElectronico,
      contraseña: hashedPassword,
    });

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar:', error);
    res.status(500).json({ error: 'Error al registrar el usuario.' });
  }
};

exports.login = async (req, res) => {
  const { nombreUsuario, contraseña } = req.body;

  try {
    const user = await User.findOne({
      where: { nombreUsuario },
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
};