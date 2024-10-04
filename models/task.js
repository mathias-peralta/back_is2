// models/task.js
module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    Task.associate = (models) => {
      Task.belongsTo(models.List, { foreignKey: 'listId' });
    };
  
    return Task;
  };