const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

//ruta para obtener el usuario
router.get("/api/user/:id", controller.getUserById);

//ruta para actualizar usuario
router.put("/api/users/:id", controller.updateUser);

module.exports = router;
