const express = require("express");
const router = express.Router();
const workspaceController = require("../controllers/workspaceController");

// Crear un nuevo espacio de trabajo
router.post("/workspaces", workspaceController.createWorkspace);

// Obtener un espacio de trabajo por ID
router.get("/workspaces/:id", workspaceController.getWorkspace);

// Actualizar un espacio de trabajo (solo inactivar, no borrar)
router.put("/workspaces/:id", workspaceController.updateWorkspace);

// Ruta para obtener la lista de miembros en un espacio de trabajo específico
router.get('/workspaces/miembros/:id_espacio', workspaceController.getWorkspaceMembers);

// Ruta para agregar un nuevo miembro a un espacio de trabajo
router.post("/workspaces/miembros/", workspaceController.addMiembro);

module.exports = router;