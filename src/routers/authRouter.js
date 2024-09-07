const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");

const router = express.Router();

// Ruta para registro de usuario
router.post("/register", registerUser);

// Ruta para login de usuario
router.post("/login", loginUser);

//ruta para logout de usuario 
router.post("/logout", logoutUser);

module.exports = router;
