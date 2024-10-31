const pool = require("../config/config");
const controller = {};

// Crear un nuevo espacio de trabajo
controller.createTablero = async (req, res) => {
    const { id_espacio, nombre_tablero } = req.body;

    try {
      // Obtener el valor máximo de id_tablero y sumarle 1
      const result = await pool.query("SELECT COALESCE(MAX(id_tablero), 0) + 1 AS new_id FROM tablero");
      const newId = result.rows[0].new_id;

      // Insertar el nuevo tablero
      const newTablero = await pool.query(
        "INSERT INTO tablero (id_tablero, id_espacio, nombre_tablero) VALUES ($1, $2, $3) RETURNING *",
        [newId, id_espacio, nombre_tablero]
      );
  
      res.status(201).json({
        message: "Tablero creado correctamente",
        tablero: newTablero.rows[0],
      });
    } catch (err) {
      console.error("Error al crear el tablero:", err.message);
      res.status(500).json({ error: "Error al crear el tablero" });
    }
  };

// Obtener un espacio de trabajo por ID
controller.getTablero = async (req, res) => {
    const { id_tablero } = req.params;

    try {
      const tableroResult = await pool.query(
        "SELECT * FROM tablero WHERE id_tablero = $1",
        [id_tablero]
      );
  
      if (tableroResult.rows.length === 0) {
        return res.status(404).json({ error: "Tablero no encontrado" });
      }
  
      res.status(200).json(tableroResult.rows[0]);
    } catch (err) {
      console.error("Error al obtener el tablero:", err.message);
      res.status(500).json({ error: "Error al obtener el tablero" });
    }
};

controller.getTablerosByWorkspace = async (req, res) => {
  const { id_espacio } = req.params;

  try {
    const tableroResult = await pool.query(
      "SELECT * FROM tablero WHERE id_espacio = $1",
      [id_espacio]
    );

    if (tableroResult.rows.length === 0) {
      return res.status(404).json({ error: "No se encontraron tableros para este espacio de trabajo" });
    }

    res.status(200).json(tableroResult.rows); // Devuelve todos los tableros encontrados
  } catch (err) {
    console.error("Error al obtener los tableros:", err.message);
    res.status(500).json({ error: "Error al obtener los tableros" });
  }
};

// Actualizar (inactivar) un espacio de trabajo
controller.updateTablero = async (req, res) => {
    const { id_tablero } = req.params;
    const { nombre_tablero } = req.body;
  
    try {
      // Actualizar el nombre del tablero
      const result = await pool.query(
        "UPDATE tablero SET nombre_tablero = $1 WHERE id_tablero = $2",
        [nombre_tablero, id_tablero]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Tablero no encontrado" });
      }
  
      res.status(200).json({ message: "Tablero actualizado correctamente" });
    } catch (err) {
      console.error("Error al actualizar el tablero:", err.message);
      res.status(500).json({ error: "Error al actualizar el tablero" });
    }
  };



module.exports = controller;
