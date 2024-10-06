// controllers/listController.js

const { List, Board, Workspace } = require('../models');

exports.createList = async (req, res) => {
  const { nombre, maxWIP, tablero_id } = req.body;

  try {
    // Verificar que el usuario tiene acceso al tablero
    const board = await Board.findByPk(tablero_id);

    if (!board) {
      return res.status(404).json({ error: 'El tablero no existe.' });
    }

    const workspace = await Workspace.findByPk(board.workspace_id);
    const users = await workspace.getUsers({ where: { id: req.user.id } });

    if (users.length === 0) {
      return res.status(403).json({ error: 'No tienes acceso a este tablero.' });
    }

    // Crear la lista
    const list = await List.create({
      nombre,
      max_wip: maxWIP,
      board_id: tablero_id,
    });

    res.status(201).json(list);
  } catch (error) {
    console.error('Error al crear la lista:', error);
    res.status(500).json({ error: 'Error al crear la lista.' });
  }
};

exports.updateList = async (req, res) => {
  const { id } = req.params;
  const { nombre, maxWIP } = req.body;

  try {
    const list = await List.findByPk(id);

    if (!list) {
      return res.status(404).json({ error: 'La lista no existe.' });
    }

    // Verificar que el usuario tiene acceso al tablero
    const board = await Board.findByPk(list.board_id);
    const workspace = await Workspace.findByPk(board.workspace_id);
    const users = await workspace.getUsers({ where: { id: req.user.id } });

    if (users.length === 0) {
      return res.status(403).json({ error: 'No tienes acceso a esta lista.' });
    }

    // Actualizar la lista
    list.nombre = nombre || list.nombre;
    list.max_wip = maxWIP || list.max_wip;
    await list.save();

    res.json(list);
  } catch (error) {
    console.error('Error al actualizar la lista:', error);
    res.status(500).json({ error: 'Error al actualizar la lista.' });
  }
};

exports.deleteList = async (req, res) => {
  const { id } = req.params;

  try {
    const list = await List.findByPk(id);

    if (!list) {
      return res.status(404).json({ error: 'La lista no existe.' });
    }

    // Verificar que el usuario tiene acceso al tablero
    const board = await Board.findByPk(list.board_id);
    const workspace = await Workspace.findByPk(board.workspace_id);
    const users = await workspace.getUsers({ where: { id: req.user.id } });

    if (users.length === 0) {
      return res.status(403).json({ error: 'No tienes acceso a esta lista.' });
    }

    await list.destroy();
    res.json({ mensaje: 'Lista eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar la lista:', error);
    res.status(500).json({ error: 'Error al eliminar la lista.' });
  }
};

exports.getTasksByList = async (req, res) => {
  const { id } = req.params;

  try {
    const list = await List.findByPk(id, {
      include: [
        {
          model: require('../models').Task,
          as: 'tasks',
        },
      ],
    });

    if (!list) {
      return res.status(404).json({ error: 'La lista no existe.' });
    }

    // Verificar que el usuario tiene acceso al tablero
    const board = await Board.findByPk(list.board_id);
    const workspace = await Workspace.findByPk(board.workspace_id);
    const users = await workspace.getUsers({ where: { id: req.user.id } });

    if (users.length === 0) {
      return res.status(403).json({ error: 'No tienes acceso a esta lista.' });
    }

    res.json(list.tasks);
  } catch (error) {
    console.error('Error al obtener las tareas de la lista:', error);
    res.status(500).json({ error: 'Error al obtener las tareas.' });
  }
};
