const pool = require("../config/config");
const controller = {};

// Crear un nuevo espacio de trabajo
controller.createTablero = async (req, res) => {
    const { id_tablero, id_espacio, nombre_tablero } = req.body;

    try {
      // Insertar el nuevo tablero
      const newTablero = await pool.query(
        "INSERT INTO tablero (id_tablero, id_espacio, nombre_tablero) VALUES ($1, $2, $3) RETURNING *",
        [id_tablero, id_espacio, nombre_tablero]
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
