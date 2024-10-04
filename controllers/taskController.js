// controllers/taskController.js
const { Task, List } = require('../models');

exports.createTask = async (req, res) => {
  const { nombre, lista_id } = req.body;

  try {
    // Verificar que el usuario tiene acceso a la lista
    const list = await List.findByPk(lista_id);
    const board = await list.getBoard();
    const workspace = await board.getWorkspace();
    const users = await workspace.getUsers({ where: { id: req.user.id } });

    if (users.length === 0) {
      return res.status(403).json({ error: 'No tienes acceso a esta lista.' });
    }

    // Verificar si el número de tareas supera el maxWIP
    const tasks = await list.getTasks();
    if (tasks.length >= list.maxWIP) {
      return res.status(400).json({ error: 'Se ha alcanzado el máximo de tareas en esta lista.' });
    }

    const task = await Task.create({
      nombre,
      listId: lista_id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    res.status(500).json({ error: 'Error al crear la tarea.' });
  }
};