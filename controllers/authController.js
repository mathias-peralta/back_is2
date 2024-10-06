// controllers/authController.js

const { User } = require('../models');

console.log('User:', User); // Agregar esta línea

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { nombreUsuario, apellidoUsuario, correoElectronico, contrasena } = req.body;

  try {
    // Verificar si el nombre de usuario o correo electrónico ya existen
    const userExists = await User.findOne({ where: { nombre_usuario: nombreUsuario } });
    const emailExists = await User.findOne({ where: { correo_electronico: correoElectronico } });

    if (userExists) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso.' });
    }

    if (emailExists) {
      return res.status(400).json({ error: 'El correo electrónico ya está en uso.' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear el usuario
    const User = await User.create({
      nombre_usuario: nombreUsuario,
      apellido_usuario: apellidoUsuario,
      correo_electronico: correoElectronico,
      contrasena: hashedPassword,
    });

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente.' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario.' });
  }
};

exports.login = async (req, res) => {
  const { nombreUsuario, contrasena } = req.body;

  try {
    const user = await User.findOne({ where: { nombre_usuario: nombreUsuario } });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Generar el token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
};
