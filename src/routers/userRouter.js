const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

//ruta para obtener el usuario
router.get("/api/users/:id", controller.getUser);

//ruta para actualizar usuario
router.get("/api/users/:id", controller.updateUser);

module.exports = router;
