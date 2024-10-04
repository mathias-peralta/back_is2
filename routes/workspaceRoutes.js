// routes/workspaceRoutes.js
const express = require('express');
const router = express.Router();
const { createWorkspace, getWorkspaces } = require('../controllers/workspaceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/espacios', authMiddleware, createWorkspace);
router.get('/espacios', authMiddleware, getWorkspaces);

module.exports = router;