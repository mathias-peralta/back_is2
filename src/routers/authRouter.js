const express = require("express") ;
const { registerUser, loginUser, logoutUser, getAllUsers  } = require("../controllers/authController");

const router = express.Router();

// Ruta para registro de usuario
router.post("/register", registerUser);

// Ruta para login de usuario
router.post("/login", loginUser);

//ruta para logout de usuario 
router.post("/logout", logoutUser);

// Ruta para obtener todos los usuarios
router.get("/usuarios", getAllUsers);


module.exports = router;
