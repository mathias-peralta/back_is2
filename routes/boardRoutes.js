// routes/boardRoutes.js

const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para crear un nuevo tablero
router.post('/tableros', authMiddleware, boardController.createBoard);

// Ruta para obtener un tablero específico
router.get('/tableros/:id', authMiddleware, boardController.getBoard);

module.exports = router;
