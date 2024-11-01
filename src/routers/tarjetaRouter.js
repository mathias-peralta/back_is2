const express = require("express");
const router = express.Router();
const tarjetaController = require("../controllers/tarjetaController");

// Crear una nueva tarjeta
router.post("/tarjetas", tarjetaController.createTarjeta);

// Obtener una tarjeta por ID
router.get("/tarjetas/:id_tarjeta", tarjetaController.getTarjeta);

// Actualizar solo el título de una tarjeta por ID
router.put("/tarjetas/:id_tarjeta/titulo", tarjetaController.updateTituloTarjeta);

// Actualizar solo la descripción de una tarjeta por ID
router.put("/tarjetas/:id_tarjeta/descripcion", tarjetaController.updateDescripcionTarjeta);

// Actualizar solo la fecha de vencimiento de una tarjeta por ID
router.put("/tarjetas/:id_tarjeta/fecha-vencimiento", tarjetaController.updateFechaVencimientoTarjeta);

// Eliminar (o inactivar) una tarjeta por ID
router.delete("/tarjetas/:id_tarjeta", tarjetaController.deleteTarjeta);

// Ruta para verificar si una tarjeta está vencida
router.get("/tarjetas/:id_tarjeta/vencimiento", tarjetaController.isTarjetaVencida);

// Ruta para listar todas las tareas de una tarjeta
router.get("/tarjetas/:id_tarjeta/tareas", tarjetaController.getTareaByTarjeta);

// Ruta para cambiar el usuario asignado a una tarjeta
router.put("/tarjetas/:id_tarjeta/asignar-usuario", tarjetaController.updateUserAsignado);

// Ruta para actualizar la lista de una tarjeta
router.put('/tarjetas/:id_tarjeta/lista', tarjetaController.updateListaTarjeta);

module.exports = router;
