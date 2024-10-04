// app.js
const express = require('express');
const app = express();
const { sequelize } = require('./models');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const boardRoutes = require('./routes/boardRoutes');
const listRoutes = require('./routes/listRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Usar rutas
app.use('/api', authRoutes);
app.use('/api', workspaceRoutes);
app.use('/api', boardRoutes);
app.use('/api', listRoutes);
app.use('/api', taskRoutes);

// Sincronizar modelos y comenzar el servidor
const PORT = process.env.PORT || 3005;

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
;