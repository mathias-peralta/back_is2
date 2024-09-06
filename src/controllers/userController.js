const controller = {};
const pool = require("../config/config");

controller.getUser = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuario"); // Aquí ajusta el nombre de tu tabla
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error ejecutando la consulta", err.stack);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

module.exports = controller;
