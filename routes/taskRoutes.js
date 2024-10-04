// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { createTask } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/tareas', authMiddleware, createTask);

module.exports = router;