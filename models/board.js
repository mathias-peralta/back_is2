// models/board.js
module.exports = (sequelize, DataTypes) => {
    const Board = sequelize.define('Board', {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    Board.associate = (models) => {
      Board.belongsTo(models.Workspace, { foreignKey: 'workspaceId' });
      Board.hasMany(models.List, { foreignKey: 'boardId' });
    };
  
    return Board;
  };