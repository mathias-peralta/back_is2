// routes/workspaceRoutes.js

const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para crear un nuevo espacio de trabajo
router.post('/espacios', authMiddleware, workspaceController.createWorkspace);

// Ruta para obtener los espacios de trabajo del usuario autenticado
router.get('/espacios', authMiddleware, workspaceController.getWorkspaces);

module.exports = router;
