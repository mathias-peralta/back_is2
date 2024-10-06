// controllers/boardController.js

const { Board, Workspace, User } = require('../models');

exports.createBoard = async (req, res) => {
  const { nombre, espacio_id } = req.body;

  try {
    // Verificar que el usuario pertenece al espacio de trabajo
    const workspace = await Workspace.findByPk(espacio_id);

    if (!workspace) {
      return res.status(404).json({ error: 'El espacio de trabajo no existe.' });
    }

    const users = await workspace.getUsers({ where: { id: req.user.id } });

    if (users.length === 0) {
      return res.status(403).json({ error: 'No tienes acceso a este espacio de trabajo.' });
    }

    // Crear el tablero
    const board = await Board.create({
      nombre,
      workspace_id: espacio_id,
    });

    res.status(201).json(board);
  } catch (error) {
    console.error('Error al crear el tablero:', error);
    res.status(500).json({ error: 'Error al crear el tablero.' });
  }
};

exports.getBoard = async (req, res) => {
  const { id } = req.params;

  try {
    const board = await Board.findByPk(id, {
      include: [
        {
          model: require('../models').List,
          as: 'lists',
          include: [
            {
              model: require('../models').Task,
              as: 'tasks',
            },
          ],
        },
      ],
    });

    if (!board) {
      return res.status(404).json({ error: 'El tablero no existe.' });
    }

    // Verificar que el usuario tiene acceso al tablero
    const workspace = await Workspace.findByPk(board.workspace_id);
    const users = await workspace.getUsers({ where: { id: req.user.id } });

    if (users.length === 0) {
      return res.status(403).json({ error: 'No tienes acceso a este tablero.' });
    }

    res.json(board);
  } catch (error) {
    console.error('Error al obtener el tablero:', error);
    res.status(500).json({ error: 'Error al obtener el tablero.' });
  }
};
