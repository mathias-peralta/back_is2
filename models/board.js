// models/board.js

module.exports = (sequelize, DataTypes) => {
  const Board = sequelize.define('Board', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'boards',
    timestamps: false, // Deshabilitar createdAt y updatedAt
  });

  Board.associate = (models) => {
    // Relación pertenece a un Workspace
    Board.belongsTo(models.Workspace, {
      foreignKey: 'workspace_id',
      as: 'workspace',
    });

    // Relación uno a muchos con List
    Board.hasMany(models.List, {
      foreignKey: 'board_id',
      as: 'lists',
    });
  };

  return Board;
};
