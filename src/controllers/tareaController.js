const pool = require("../config/config");
const controller = {};

// Crear una nueva tarea
controller.createTarea = async (req, res) => {
  const { id_tarjeta, nombre_tarea, id_estado } = req.body;

  try {
     // Obtener el valor máximo de id_tarea y sumarle 1
     const result = await pool.query("SELECT COALESCE(MAX(id_tarea), 0) + 1 AS new_id FROM tarea");
     const newId = result.rows[0].new_id;
 
     // Insertar la nueva tarea con el id_tarea calculado
     const newTarea = await pool.query(
       "INSERT INTO tarea (id_tarea, id_tarjeta, nombre_tarea, id_estado) VALUES ($1, $2, $3, $4) RETURNING *",
       [newId, id_tarjeta, nombre_tarea, id_estado]
     );

    res.status(201).json({
      message: "Tarea creada correctamente",
      tarea: newTarea.rows[0],
    });
  } catch (err) {
    console.error("Error al crear la tarea:", err.message);
    res.status(500).json({ error: "Error al crear la tarea" });
  }
};

// Obtener una tarea por ID
controller.getTarea = async (req, res) => {
  const { id_tarea } = req.params;

  try {
    const tareaResult = await pool.query(
      "SELECT * FROM tarea WHERE id_tarea = $1",
      [id_tarea]
    );

    if (tareaResult.rows.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.status(200).json(tareaResult.rows[0]);
  } catch (err) {
    console.error("Error al obtener la tarea:", err.message);
    res.status(500).json({ error: "Error al obtener la tarea" });
  }
};

// Actualizar nombre tarea
controller.updateNombreTarea = async (req, res) => {
  const { id_tarea } = req.params;
  const { nombre_tarea} = req.body;

  try {
    // Actualizar la tarea
    const result = await pool.query(
      "UPDATE tarea SET nombre_tarea = $1 WHERE id_tarea = $2",
      [nombre_tarea,  id_tarea]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.status(200).json({ message: "Tarea actualizada correctamente" });
  } catch (err) {
    console.error("Error al actualizar la tarea:", err.message);
    res.status(500).json({ error: "Error al actualizar la tarea" });
  }
};

// Actualizar estado tarea 
controller.updateEstadoTarea = async (req, res) => {
    const { id_tarea } = req.params;
    const { nombre_estado } = req.body;
  
    try {
      // Actualizar la tarea
      const result = await pool.query(
        "UPDATE tarea SET id_estado = (select t2.id_estado from estado_tarea t2 where t2.nombre_estado = $1) where id_tarea = $2",
        [nombre_estado, id_tarea]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Tarea no encontrada" });
      }
  
      res.status(200).json({ message: "Tarea actualizada correctamente" });
    } catch (err) {
      console.error("Error al actualizar la tarea:", err.message);
      res.status(500).json({ error: "Error al actualizar la tarea" });
    }
  };

// Inactivar una tarea por ID (Eliminación lógica)
controller.deleteTarea = async (req, res) => {
  const { id_tarea } = req.params;

  try {
    // Actualizar el estado de la tarea a un estado que indique que está inactiva
    const result = await pool.query(
      "UPDATE tarea SET id_estado = $1 WHERE id_tarea = $2",
      [4, id_tarea]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.status(200).json({ message: "Tarea inactivada correctamente" });
  } catch (err) {
    console.error("Error al inactivar la tarea:", err.message);
    res.status(500).json({ error: "Error al inactivar la tarea" });
  }
};

module.exports = controller;
