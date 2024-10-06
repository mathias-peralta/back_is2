// controllers/taskController.js

const { Task, List, Board, Workspace } = require('../models');

exports.createTask = async (req, res) => {
  const { nombre, lista_id } = req.body;

  try {
    const list = await List.findByPk(lista_id);

    if (!list) {
      return res.status(404).json({ error: 'La lista no existe.' });
    }

    // Verificar que el usuario tiene acceso a la lista
    const board = await Board.findByPk(list.board_id);
    const workspace = await Workspace.findByPk(board.workspace_id);
    const users = await workspace.getUsers({ where: { id: req.user.id } });

    if (users.length === 0) {
      return res.status(403).json({ error: 'No tienes acceso a esta lista.' });
    }

    // Verificar el maxWIP
    const tasksCount = await Task.count({ where: { list_id: lista_id } });

    if (tasksCount >= list.max_wip) {
      return res.status(400).json({ error: 'Se ha alcanzado el máximo de tareas en esta lista.' });
    }

    // Crear la tarea
    const task = await Task.create({
      nombre,
      list_id: lista_id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    res.status(500).json({ error: 'Error al crear la tarea.' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { nombre, lista_id } = req.body;

  try {
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: 'La tarea no existe.' });
    }

    // Verificar que el usuario tiene acceso a la tarea
    const list = await List.findByPk(task.list_id);
    const board = await Board.findByPk(list.board_id);
    const workspace = await Workspace.findByPk(board.workspace_id);
    const users = await workspace.getUsers({ where: { id: req.user.id } });

    if (users.length === 0) {
      return res.status(403).json({ error: 'No tienes acceso a esta tarea.' });
    }

    // Actualizar la tarea
    task.nombre = nombre || task.nombre;
    if (lista_id && lista_id !== task.list_id) {
      // Verificar que la nueva lista existe y que el usuario tiene acceso
      const newList = await List.findByPk(lista_id);
      if (!newList) {
        return res.status(404).json({ error: 'La lista destino no existe.' });
      }

      // Verificar maxWIP de la lista destino
      const tasksCount = await Task.count({ where: { list_id: lista_id } });
      if (tasksCount >= newList.max_wip) {
        return res.status(400).json({ error: 'Se ha alcanzado el máximo de tareas en la lista destino.' });
      }

      // Actualizar la referencia de la lista
      task.list_id = lista_id;
    }

    await task.save();

    res.json(task);
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    res.status(500).json({ error: 'Error al actualizar la tarea.' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: 'La tarea no existe.' });
    }

    // Verificar que el usuario tiene acceso a la tarea
    const list = await List.findByPk(task.list_id);
    const board = await Board.findByPk(list.board_id);
    const workspace = await Workspace.findByPk(board.workspace_id);
    const users = await workspace.getUsers({ where: { id: req.user.id } });

    if (users.length === 0) {
      return res.status(403).json({ error: 'No tienes acceso a esta tarea.' });
    }

    await task.destroy();

    res.json({ mensaje: 'Tarea eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    res.status(500).json({ error: 'Error al eliminar la tarea.' });
  }
};
