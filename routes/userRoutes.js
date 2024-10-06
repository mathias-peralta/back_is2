// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para obtener la lista de usuarios (requiere autenticación)
router.get('/usuarios', authMiddleware, userController.getUsers);

module.exports = router;
