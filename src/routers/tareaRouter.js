const express = require("express");
const router = express.Router();
const tareaController = require("../controllers/tareaController");

// Crear una nueva tarea
router.post("/tareas", tareaController.createTarea);

// Obtener una tarea por ID
router.get("/tareas/:id_tarea", tareaController.getTarea);

// Actualizar estado tarea
router.put("/tareas/:id_tarea/estado", tareaController.updateEstadoTarea);

// Actualizar nombre tarea
router.put("/tareas/:id_tarea/nombre", tareaController.updateNombreTarea);

// Inactivar una tarea por ID (Eliminación lógica)
router.delete("/tareas/:id_tarea", tareaController.deleteTarea);

module.exports = router;
