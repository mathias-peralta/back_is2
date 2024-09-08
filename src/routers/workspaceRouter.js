const express = require("express");
const router = express.Router();
const workspaceController = require("../controllers/workspaceController");

// Crear un nuevo espacio de trabajo
router.post("/workspaces", workspaceController.createWorkspace);

// Obtener un espacio de trabajo por ID
router.get("/workspaces/:id", workspaceController.getWorkspace);

// Actualizar un espacio de trabajo (solo inactivar, no borrar)
router.put("/workspaces/:id", workspaceController.updateWorkspace);

module.exports = router;