const express = require("express");
const router = express.Router();
const tableroController  = require("../controllers/tableroController");

// Crear un nuevo tablero
router.post("/tableros", tableroController.createTablero);

// Obtener un tablero por ID
router.get("/tableros/:id_tablero", tableroController.getTablero);

// Actualizar un tablero por ID
router.put("/tableros/:id_tablero", tableroController.updateTablero);

router.get("/tableros_all/:id_espacio", tableroController.getTablerosByWorkspace);

module.exports = router;