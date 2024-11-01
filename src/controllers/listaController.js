const pool = require("../config/config");
const controller = {};

// Crear una nueva lista
controller.createLista = async (req, res) => {
  const { id_tablero, nombre_lista, orden, max_tareas } = req.body;

  try {
    // Obtener el valor máximo de id_lista y sumarle 1
    const result = await pool.query("SELECT COALESCE(MAX(id_lista), 0) + 1 AS new_id FROM lista");
    const newId = result.rows[0].new_id;

    // Insertar la nueva lista
    //estado = "activo";
    const newLista = await pool.query(
      "INSERT INTO lista (id_lista, id_tablero, nombre_lista, orden, max_tareas, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [newId, id_tablero, nombre_lista, orden, max_tareas, "activo"]
    );

    res.status(201).json({
      message: "Lista creada correctamente",
      lista: newLista.rows[0],
    });
  } catch (err) {
    console.error("Error al crear la lista:", err.message);
    res.status(500).json({ error: "Error al crear la lista" });
  }
};

// Obtener una lista por ID
controller.getLista = async (req, res) => {
  const { id_lista } = req.params;

  try {
    const listaResult = await pool.query(
      "SELECT * FROM lista WHERE id_lista = $1",
      [id_lista]
    );

    if (listaResult.rows.length === 0) {
      return res.status(404).json({ error: "Lista no encontrada" });
    }

    res.status(200).json(listaResult.rows[0]);
  } catch (err) {
    console.error("Error al obtener la lista:", err.message);
    res.status(500).json({ error: "Error al obtener la lista" });
  }
};

//obtener listas activas de un tablero
controller.getListaByTablero = async (req, res) => {
  const { id_tablero  } = req.params;

  try {
    const listaResult = await pool.query(
      "select l.* from lista l inner join tablero t on t.id_tablero = l.id_tablero where t.id_tablero = $1 and estado = 'activo'",
      [id_tablero]
    );

    if (listaResult.rows.length === 0) {
      return res.status(404).json({ error: "Lista no encontrada" });
    }

    res.status(200).json(listaResult.rows);
  } catch (err) {
    console.error("Error al obtener la lista:", err.message);
    res.status(500).json({ error: "Error al obtener la lista" });
  }
};

// Actualizar una lista por ID
controller.updateLista = async (req, res) => {
  const { id_lista } = req.params;
  const { nombre_lista} = req.body;

  try {
    // Actualizar la lista
    const result = await pool.query(
      "UPDATE lista SET nombre_lista = $1 WHERE id_lista = $2",
      [nombre_lista, id_lista]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Lista no encontrada" });
    }

    res.status(200).json({ message: "Lista actualizada correctamente" });
  } catch (err) {
    console.error("Error al actualizar la lista:", err.message);
    res.status(500).json({ error: "Error al actualizar la lista" });
  }
};

// Inactivar una lista por ID (Eliminar lógica)
controller.deleteLista = async (req, res) => {
    const { id_lista } = req.params;
  
    try {
      // Actualizar el estado a "inactivo"
      const result = await pool.query(
        "UPDATE lista SET estado = 'inactivo' WHERE id_lista = $1",
        [id_lista]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Lista no encontrada" });
      }
  
      res.status(200).json({ message: "Lista inactivada correctamente" });
    } catch (err) {
      console.error("Error al inactivar la lista:", err.message);
      res.status(500).json({ error: "Error al inactivar la lista" });
    }
  };

  controller.getTarjetabyList = async (req, res) => {
    const { id_lista } = req.params; // Recibiendo el id de la lista como parámetro
    const estado = 'activo';
  
    try {
      const cardResult = await pool.query(
        "SELECT t.* FROM tarjeta t INNER JOIN lista l ON t.id_lista = l.id_lista WHERE l.id_lista = $1 AND l.estado = $2",
        [id_lista, estado]
      );
  
      if (cardResult.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "No se encontraron tarjetas para esta lista activa" });
      }
  
      res.status(200).json(cardResult.rows); // Devolvemos todas las tarjetas encontradas
    } catch (err) {
      console.error("Error ejecutando la consulta", err.stack);
      res.status(500).json({ error: "Error al obtener las tarjetas de la lista" });
    }
  };

// Controlador para verificar la alerta WIP
controller.checkWIP = async (req, res) => {
  const { id_lista } = req.params; // Recibiendo el id de la lista como parámetro

  try {
    const result = await pool.query(
      `SELECT CASE 
          WHEN l2.max_tareas <= (
            SELECT COUNT(*) 
            FROM tarjeta t 
            INNER JOIN lista l ON t.id_lista = l.id_lista 
            WHERE l.id_lista = $1 AND l.estado = 'activo'
          ) 
          THEN 'WIP AL LIMITE' 
          ELSE 'WIP DENTRO DEL LIMITE' 
        END AS alerta_wip
      FROM lista l2 
      WHERE l2.id_lista = $1`,
      [id_lista]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Lista no encontrada" });
    }

    res.status(200).json(result.rows[0]); // Devolver el estado de la alerta WIP
  } catch (err) {
    console.error("Error ejecutando la consulta", err.stack);
    res.status(500).json({ error: "Error al verificar la alerta WIP" });
  }
};
module.exports = controller;
