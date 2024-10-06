const pool = require("../config/config");
const controller = {};

// Crear un nuevo espacio de trabajo
controller.createWorkspace = async (req, res) => {
  const { 
    id_espacio, 
    propietario, 
    descripcion_espacio, 
    nombre_espacio, 
    fecha_creacion, 
    estado_espacio
  } = req.body;

  try {
    // Insertar el nuevo espacio de trabajo
    const newWorkspace = await pool.query(
      "INSERT INTO espacio_trabajo (id_espacio, propietario, descripcion_espacio, nombre_espacio, fecha_creacion, estado_espacio) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [ id_espacio, 
        propietario, 
        descripcion_espacio, 
        nombre_espacio, 
        fecha_creacion, 
        estado_espacio]
    );

    // crear el propietario como miembro
    const newMember = await pool.query(
        "INSERT INTO miembros (id_usuario, id_espacio) VALUES ($1, $2)",
        [propietario, id_espacio ]
    );

    res.status(201).json({
      message: "Espacio de trabajo creado correctamente",
      workspace: newWorkspace.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear el espacio de trabajo" });
  }
};

// Obtener un espacio de trabajo por ID
controller.getWorkspace = async (req, res) => {
  const { id } = req.params;

  try {
    const workspaceResult = await pool.query(
      "SELECT * FROM espacio_trabajo WHERE id_espacio = $1",
      [id]
    );

    if (workspaceResult.rows.length === 0) {
      return res.status(404).json({ error: "Espacio de trabajo no encontrado" });
    }

    res.status(200).json(workspaceResult.rows[0]);
  } catch (err) {
    console.error("Error ejecutando la consulta", err.stack);
    res.status(500).json({ error: "Error al obtener el espacio de trabajo" });
  }
};

// Actualizar (inactivar) un espacio de trabajo
controller.updateWorkspace = async (req, res) => {
  const { id } = req.params;
  const { estado_espacio } = req.body;

  try {
    // Actualizar el estado del espacio de trabajo
    const result = await pool.query(
      "UPDATE espacio_trabajo SET estado_espacio = $1 WHERE id_espacio = $2",
      [estado_espacio, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Espacio de trabajo no encontrado" });
    }

    res.status(200).json({ message: "Espacio de trabajo actualizado correctamente" });
  } catch (err) {
    console.error("Error ejecutando la actualización", err.stack);
    res.status(500).json({ error: "Error al actualizar el espacio de trabajo" });
  }
};

// Controlador para obtener la lista de miembros de un espacio de trabajo
controller.getWorkspaceMembers = async (req, res) => {
//const getWorkspaceMembers = async (req, res) => {
  const { id_espacio } = req.params; // Obtener el id del espacio de trabajo de los parámetros de la URL

  try {
    // Hacer una consulta para obtener todos los miembros del espacio de trabajo
    const result = await pool.query(
      `SELECT u.id_usuario, u.nombre_usuario, u.apellido_usuario, u.correo_usuario 
       FROM usuario u
       0.
       JOIN miembros m ON u.id_usuario = m.id_usuario
       WHERE m.id_espacio = $1`,
      [id_espacio]
    );

    const miembros = result.rows;

    if (miembros.length === 0) {
      return res.status(404).json({ message: "No se encontraron miembros para este espacio de trabajo" });
    }

    // Responder con la lista de miembros
    res.status(200).json({ id_espacio, miembros });
  } catch (err) {
    console.error('Error al obtener los miembros:', err.message);
    res.status(500).json({ error: "Error al obtener los miembros" });
  }
};

module.exports = controller;
