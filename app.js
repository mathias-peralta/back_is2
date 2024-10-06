// app.js

const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Importar las rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const boardRoutes = require('./routes/boardRoutes');
const listRoutes = require('./routes/listRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Utilizar las rutas
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', workspaceRoutes);
app.use('/api', boardRoutes);
app.use('/api', listRoutes);
app.use('/api', taskRoutes);

// Manejo de errores y otros middlewares...

// Iniciar el servidor
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3001;

sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida exitosamente.');
    app.listen(PORT, () => {
      console.log('Servidor iniciado en el puerto ' + PORT);
    });
  })
  .catch((error) => {
    console.error('No se pudo conectar a la base de datos:', error);
  });

module.exports = app;