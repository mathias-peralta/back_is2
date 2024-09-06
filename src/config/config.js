const { Pool } = require("pg");
require("dotenv").config(); // Cargar las variables de entorno

// Configuración del pool de conexión
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Verificar la conexión
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error al conectar a la base de datos:", err.stack);
  }
  console.log("Conexión exitosa a la base de datos PostgreSQL");
  release(); // Liberar el cliente
});

module.exports = pool;
