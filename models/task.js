// models/task.js

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'tasks',
    timestamps: false, // Deshabilitar createdAt y updatedAt
  });

  Task.associate = (models) => {
    // Relación pertenece a una List
    Task.belongsTo(models.List, {
      foreignKey: 'list_id',
      as: 'list',
    });
  };

  return Task;
};
