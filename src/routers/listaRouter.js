const express = require("express");
const router = express.Router();
const listaController = require("../controllers/listaController");

// Crear una nueva lista
router.post("/listas", listaController.createLista);

// Obtener una lista por ID
router.get("/listas/:id_lista", listaController.getLista);

// Obtener una lista por ID
router.get("/listas_tablero/:id_tablero", listaController.getListaByTablero);

// Actualizar una lista por ID
router.put("/listas/:id_lista", listaController.updateLista);

// Inactivar una lista por ID (Eliminación lógica)
router.delete("/listas/:id_lista", listaController.deleteLista);

// Ruta para obtener todas las tarjetas de una lista
router.get("/listas_tarjeta/:id_lista", listaController.getTarjetabyList);

// Ruta para verificar la alerta WIP de una lista específica
router.get("/listas/:id_lista/alerta-wip", listaController.checkWIP);

module.exports = router;
