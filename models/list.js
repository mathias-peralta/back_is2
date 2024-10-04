// models/list.js
module.exports = (sequelize, DataTypes) => {
    const List = sequelize.define('List', {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      maxWIP: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    List.associate = (models) => {
      List.belongsTo(models.Board, { foreignKey: 'boardId' });
      List.hasMany(models.Task, { foreignKey: 'listId' });
    };
  
    return List;
  };