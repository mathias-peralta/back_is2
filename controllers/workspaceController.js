// controllers/workspaceController.js

const { Workspace, User } = require('../models');

exports.createWorkspace = async (req, res) => {
  const { nombre, usuarios_id } = req.body;

  try {
    // Crear el espacio de trabajo
    const workspace = await Workspace.create({
      nombre,
      owner_id: req.user.id,
    });

    // Asociar usuarios al espacio de trabajo
    if (usuarios_id && usuarios_id.length > 0) {
      const users = await User.findAll({ where: { id: usuarios_id } });
      await workspace.addUsers(users);
    }

    // Agregar al propietario al espacio de trabajo
    const owner = await User.findByPk(req.user.id);
    await workspace.addUser(owner);

    res.status(201).json(workspace);
  } catch (error) {
    console.error('Error al crear el espacio de trabajo:', error);
    res.status(500).json({ error: 'Error al crear el espacio de trabajo.' });
  }
};

exports.getWorkspaces = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const workspaces = await user.getWorkspaces({
      where: { activo: true },
      attributes: ['id', 'nombre'],
    });
    res.json(workspaces);
  } catch (error) {
    console.error('Error al obtener los espacios de trabajo:', error);
    res.status(500).json({ error: 'Error al obtener los espacios de trabajo.' });
  }
};
