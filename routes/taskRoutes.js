// routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para crear una nueva tarea
router.post('/tareas', authMiddleware, taskController.createTask);

// Ruta para actualizar una tarea existente
router.put('/tareas/:id', authMiddleware, taskController.updateTask);

// Ruta para eliminar una tarea
router.delete('/tareas/:id', authMiddleware, taskController.deleteTask);

module.exports = router;
