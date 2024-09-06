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
      "INSERT INTO usuario (id_usuario, correo_usuario, password_usuario, nombre_usuario, apellido_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        id_usuario,
        correo_usuario,
        hashedPassword,
        nombre_usuario,
        apellido_usuario,
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
  const { nombre_usuario, password_usuario } = req.body;

  try {
    // Buscar el usuario por nombre de usuario
    const userResult = await pool.query(
      "SELECT * FROM usuario WHERE nombre_usuario = $1",
      [nombre_usuario]
    );
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const validPassword = await bcrypt.compare(password_usuario, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    // Generar el token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Expira en 1 hora
    });

    res.status(200).json({ token, message: "Login exitoso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
