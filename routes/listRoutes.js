// routes/listRoutes.js

const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para crear una nueva lista
router.post('/listas', authMiddleware, listController.createList);

// Ruta para actualizar una lista existente
router.put('/listas/:id', authMiddleware, listController.updateList);

// Ruta para eliminar una lista
router.delete('/listas/:id', authMiddleware, listController.deleteList);

// Ruta para obtener las tareas de una lista específica
router.get('/listas/:id/tareas', authMiddleware, listController.getTasksByList);

module.exports = router;
