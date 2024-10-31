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

module.exports = router;
