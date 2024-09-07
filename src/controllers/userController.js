const controller = {};
const pool = require("../config/config");

//obtener usuario por id 
controller.getUser = async (req, res) => {
  const {id} = req.params; //id usuario a obtener
  try {
    //consultar el usuario por id
    const result = await pool.query("SELECT * FROM usuario WHERE id_usuario = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error ejecutando la consulta", err.stack);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

// actualizar usuario
controller.updateUser = async (req, res) => {
  const { id } = req.params; // El ID del usuario a actualizar
  const { estado_usuario }  = req.body; //nuevo estado 
  try {
    // Verificar si el usuario existe
    const userResult = await pool.query("SELECT * FROM usuario WHERE id_usuario = $1", [id]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Actualizar el estado del usuario
    await pool.query(
      "UPDATE usuario SET estado_usuario = $1 WHERE id_usuario = $2",
      [estado_usuario, id]
    );

    res.status(200).json({ message: "Usuario actualizado correctamente" });
  } catch (err) {
    console.error("Error ejecutando la actualización", err.stack);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

module.exports = controller;
