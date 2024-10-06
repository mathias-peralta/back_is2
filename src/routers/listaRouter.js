const express = require("express");
const router = express.Router();
const listaController = require("../controllers/listaController");

// Crear una nueva lista
router.post("/listas", listaController.createLista);

// Obtener una lista por ID
router.get("/listas/:id_lista", listaController.getLista);

// Actualizar una lista por ID
router.put("/listas/:id_lista", listaController.updateLista);

// Inactivar una lista por ID (Eliminación lógica)
router.delete("/listas/:id_lista", listaController.deleteLista);

module.exports = router;
