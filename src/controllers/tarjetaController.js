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

module.exports = controller;
