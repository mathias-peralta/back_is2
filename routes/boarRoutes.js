// routes/boardRoutes.js
const express = require('express');
const router = express.Router();
const { createBoard, getBoard } = require('../controllers/boardController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/tableros', authMiddleware, createBoard);
router.get('/tableros/:id', authMiddleware, getBoard);

module.exports = router;