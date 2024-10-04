// routes/listRoutes.js
const express = require('express');
const router = express.Router();
const {
  createList,
  updateList,
  deleteList,
  getTasksByList,
} = require('../controllers/listController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/listas', authMiddleware, createList);
router.put('/listas/:id', authMiddleware, updateList);
router.delete('/listas/:id', authMiddleware, deleteList);
router.get('/listas/:id/tareas', authMiddleware, getTasksByList);

module.exports = router;