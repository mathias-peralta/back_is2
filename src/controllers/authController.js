const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/config");

// Registro de usuario
const registerUser = async (req, res) => {
  const {
    id_usuario,
    correo_usuario,
    password_usuario,
    nombre_usuario,
    apellido_usuario,
    estado_usuario
  } = req.body;

  try {
    // Verificar si el correo ya está registrado
    const userExist = await pool.query(
      "SELECT * FROM usuario WHERE correo_usuario = $1",
      [correo_usuario]
    );
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password_usuario, saltRounds);

    // Insertar el nuevo usuario en la base de datos
    const newUser = await pool.query(
      "INSERT INTO usuario (id_usuario, correo_usuario, password_usuario, nombre_usuario, apellido_usuario, estado_usuario) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        id_usuario,
        correo_usuario,
        hashedPassword,
        nombre_usuario,
        apellido_usuario,
        estado_usuario
      ]
    );

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  const { 
    correo_usuario, 
    password_usuario 
  } = req.body;

  try {
    // Buscar el usuario por id
    const userResult = await pool.query(
      "SELECT * FROM usuario WHERE  correo_usuario = $1",
      [correo_usuario]
    );
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const validPassword = await bcrypt.compare(password_usuario, user.password_usuario);
    if (!validPassword) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    // Generar el token JWT
    const token = jwt.sign({ userId: user.id_usuario }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Expira en 1 hora
    });

    res.status(200).json({ token, message: "Login exitoso" });
  } catch (err) {
    console.error('Error al iniciar sesión:', err.message);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

// Logout de usuario
const logoutUser = (req, res) => {
  try {
    // Aquí el cliente debe eliminar el token localmente
    res.status(200).json({ message: "Logout exitoso, elimina el token en el cliente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};

// Controlador para listar todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    // Consulta para obtener todos los usuarios
    const result = await pool.query("SELECT id_usuario, correo_usuario, nombre_usuario, apellido_usuario FROM usuario where estado_usuario='activo'");
    
    res.status(200).json(result.rows); // Devolver los usuarios como JSON
  } catch (err) {
    console.error("Error al listar usuarios:", err.message);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  logoutUser
};
