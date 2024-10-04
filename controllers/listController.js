// controllers/listController.js
const { List, Board } = require('../models');

exports.createList = async (req, res) => {
  const { nombre, maxWIP, tablero_id } = req.body;

  try {
    // Verificar que el usuario tiene acceso al tablero
    const board = await Board.findByPk(tablero_id);
    const workspace = await board.getWorkspace();
    const users = await workspace.getUsers({ where: { id: req.user.id } });

    if (users.length === 0) {
      return res.status(403).json({ error: 'No tienes acceso a este tablero.' });
    }

    const list = await List.create({
      nombre,
      maxWIP,
      boardId: tablero_id,
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

    // Verificar que el usuario tiene acceso al tablero
    const board = await list.getBoard();
    const workspace = await board.getWorkspace();
    const users = await workspace.getUsers({ where: { id: req.user.id } });

    if (users.length === 0) {
      return res.status(403).json({ error: 'No tienes acceso a esta lista.' });
    }

    list.nombre = nombre;
    list.maxWIP = maxWIP;
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

    // Verificar que el usuario tiene acceso al tablero
    const board = await list.getBoard();
    const workspace = await board.getWorkspace();
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
      include: ['Tasks'],
    });

    // Verificar que el usuario tiene acceso al tablero
    const board = await list.getBoard();
    const workspace = await board.getWorkspace();
    const users = await workspace.getUsers({ where: { id: req.user.id } });

    if (users.length === 0) {
      return res.status(403).json({ error: 'No tienes acceso a esta lista.' });
    }

    res.json(list.Tasks);
  } catch (error) {
    console.error('Error al obtener las tareas de la lista:', error);
    res.status(500).json({ error: 'Error al obtener las tareas.' });
  }
};