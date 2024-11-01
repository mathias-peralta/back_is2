const pool = require("../config/config");
const controller = {};

// Crear una nueva tarjeta
controller.createTarjeta = async (req, res) => {
  const { 
    usuario_asignado, 
    id_lista, 
    titulo_tarjeta, 
    descripcion_tarjeta, 
    fecha_creacion, 
    fecha_vencimiento 
  } = req.body;

  try {
     // Obtener el valor máximo de id_tarjeta y sumarle 1
     const result = await pool.query("SELECT COALESCE(MAX(id_tarjeta), 0) + 1 AS new_id FROM tarjeta");
     const newId = result.rows[0].new_id;

    // Insertar la nueva tarjeta
    const newTarjeta = await pool.query(
      "INSERT INTO tarjeta (id_tarjeta, usuario_asignado, id_lista, titulo_tarjeta, descripcion_tarjeta, fecha_creacion, fecha_vencimiento) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [newId, usuario_asignado, id_lista, titulo_tarjeta, descripcion_tarjeta, fecha_creacion, fecha_vencimiento]
    );

    res.status(201).json({
      message: "Tarjeta creada correctamente",
      tarjeta: newTarjeta.rows[0],
    });
  } catch (err) {
    console.error("Error al crear la tarjeta:", err.message);
    res.status(500).json({ error: "Error al crear la tarjeta" });
  }
};

// Obtener una tarjeta por ID
controller.getTarjeta = async (req, res) => {
  const { id_tarjeta } = req.params;

  try {
    const tarjetaResult = await pool.query(
      "SELECT * FROM tarjeta WHERE id_tarjeta = $1",
      [id_tarjeta]
    );

    if (tarjetaResult.rows.length === 0) {
      return res.status(404).json({ error: "Tarjeta no encontrada" });
    }

    res.status(200).json(tarjetaResult.rows[0]);
  } catch (err) {
    console.error("Error al obtener la tarjeta:", err.message);
    res.status(500).json({ error: "Error al obtener la tarjeta" });
  }
};

// Actualizar solo el título de una tarjeta por ID
controller.updateTituloTarjeta = async (req, res) => {
  const { id_tarjeta } = req.params;
  const { titulo_tarjeta } = req.body;

  try {
    const result = await pool.query(
      "UPDATE tarjeta SET titulo_tarjeta = $1 WHERE id_tarjeta = $2",
      [titulo_tarjeta, id_tarjeta]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tarjeta no encontrada" });
    }

    res.status(200).json({ message: "Título de la tarjeta actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar el título de la tarjeta:", err.message);
    res.status(500).json({ error: "Error al actualizar el título de la tarjeta" });
  }
};

// Actualizar solo la descripción de una tarjeta por ID
controller.updateDescripcionTarjeta = async (req, res) => {
  const { id_tarjeta } = req.params;
  const { descripcion_tarjeta } = req.body;

  try {
    const result = await pool.query(
      "UPDATE tarjeta SET descripcion_tarjeta = $1 WHERE id_tarjeta = $2",
      [descripcion_tarjeta, id_tarjeta]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tarjeta no encontrada" });
    }

    res.status(200).json({ message: "Descripción de la tarjeta actualizada correctamente" });
  } catch (err) {
    console.error("Error al actualizar la descripción de la tarjeta:", err.message);
    res.status(500).json({ error: "Error al actualizar la descripción de la tarjeta" });
  }
};

// Actualizar solo la fecha de vencimiento de una tarjeta por ID
controller.updateFechaVencimientoTarjeta = async (req, res) => {
  const { id_tarjeta } = req.params;
  const { fecha_vencimiento } = req.body;

  try {
    const result = await pool.query(
      "UPDATE tarjeta SET fecha_vencimiento = $1 WHERE id_tarjeta = $2",
      [fecha_vencimiento, id_tarjeta]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tarjeta no encontrada" });
    }

    res.status(200).json({ message: "Fecha de vencimiento de la tarjeta actualizada correctamente" });
  } catch (err) {
    console.error("Error al actualizar la fecha de vencimiento de la tarjeta:", err.message);
    res.status(500).json({ error: "Error al actualizar la fecha de vencimiento de la tarjeta" });
  }
};

// Inactivar o eliminar lógicamente una tarjeta por ID
controller.deleteTarjeta = async (req, res) => {
  const { id_tarjeta } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM tarjeta WHERE id_tarjeta = $1",
      [id_tarjeta]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tarjeta no encontrada" });
    }

    res.status(200).json({ message: "Tarjeta eliminada correctamente" });
  } catch (err) {
    console.error("Error al eliminar la tarjeta:", err.message);
    res.status(500).json({ error: "Error al eliminar la tarjeta" });
  }
};

controller.isTarjetaVencida = async (req, res) => {
  const { id_tarjeta } = req.params; // Recibiendo el id de la tarjeta como parámetro

  try {
    const result = await pool.query(
      `SELECT 
         CASE 
           WHEN t.fecha_vencimiento < CURRENT_TIMESTAMP THEN 'vencida'
           WHEN t.fecha_vencimiento >= CURRENT_TIMESTAMP THEN 'no vencida'
         END AS estado_vencimiento
       FROM tarjeta t
       WHERE t.id_tarjeta = $1`,
      [id_tarjeta]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tarjeta no encontrada" });
    }

    res.status(200).json({ estado_vencimiento: result.rows[0].estado_vencimiento });
  } catch (err) {
    console.error("Error ejecutando la consulta", err.stack);
    res.status(500).json({ error: "Error al verificar el estado de la tarjeta" });
  }
};

controller.getTareaByTarjeta = async (req, res) => {
  const { id_tarjeta } = req.params; // Recibiendo el id de la tarjeta como parámetro

  try {
    const result = await pool.query(
      `SELECT t.* 
       FROM tarea t
       INNER JOIN tarjeta t2 ON t.id_tarjeta = t2.id_tarjeta
       WHERE t2.id_tarjeta = $1`,
      [id_tarjeta]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No se encontraron tareas para esta tarjeta" });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error ejecutando la consulta", err.stack);
    res.status(500).json({ error: "Error al obtener las tareas de la tarjeta" });
  }
};

// Controlador para cambiar el usuario asignado a una tarjeta
controller.updateUserAsignado = async (req, res) => {
  const { id_tarjeta } = req.params; // ID de la tarjeta a actualizar
  const { nuevo_usuario_id } = req.body; // ID del nuevo usuario asignado

  try {
    // Verificar si el nuevo usuario es miembro activo del espacio de trabajo correspondiente
    const memberCheck = await pool.query(
      `SELECT m.*
      FROM usuario u 
      JOIN miembros m ON u.id_usuario = m.id_usuario 
      WHERE m.id_espacio = (
          SELECT t2.id_espacio 
          FROM tarjeta t 
          INNER JOIN lista l ON t.id_lista = l.id_lista 
          INNER JOIN tablero t2 ON t2.id_tablero = l.id_tablero 
          WHERE t.id_tarjeta = $1
      ) 
      AND u.estado_usuario = 'activo' 
      AND u.id_usuario = $2`,
      [id_tarjeta, nuevo_usuario_id]
    );

    // Si el usuario no es miembro activo, devolver un error
    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: "El usuario no es miembro activo del espacio de trabajo." });
    }

    // Si es miembro activo, proceder a actualizar la tarjeta
    await pool.query(
      `UPDATE tarjeta
      SET usuario_asignado = $1
      WHERE id_tarjeta = $2`,
      [nuevo_usuario_id, id_tarjeta]
    );

    res.status(200).json({ message: "Usuario asignado correctamente." });
  } catch (err) {
    console.error("Error ejecutando la consulta", err.stack);
    res.status(500).json({ error: "Error al cambiar el usuario asignado." });
  }
};

// Controlador para actualizar la lista de una tarjeta
controller.updateListaTarjeta = async (req, res) => {
  const { id_tarjeta } = req.params; // Obtener el ID de la tarjeta desde los parámetros de la ruta
  const { id_lista } = req.body; // Obtener el nuevo ID de la lista desde el cuerpo de la solicitud

  try {
    // Actualizar la tarjeta con el nuevo id_lista
    const result = await pool.query(
      'UPDATE tarjeta SET id_lista = $1 WHERE id_tarjeta = $2',
      [id_lista, id_tarjeta]
    );

    // Verificar si se actualizó alguna fila
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tarjeta no encontrada o no se actualizó.' });
    }

    res.status(200).json({ message: 'Tarjeta actualizada correctamente.' });
  } catch (err) {
    console.error('Error al actualizar la tarjeta', err.stack);
    res.status(500).json({ error: 'Error al actualizar la tarjeta.' });
  }
};

module.exports = controller;
