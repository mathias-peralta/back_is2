// models/list.js

module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    max_wip: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'lists',
    timestamps: false, // Deshabilitar createdAt y updatedAt
  });

  List.associate = (models) => {
    // Relación pertenece a un Board
    List.belongsTo(models.Board, {
      foreignKey: 'board_id',
      as: 'board',
    });

    // Relación uno a muchos con Task
    List.hasMany(models.Task, {
      foreignKey: 'list_id',
      as: 'tasks',
    });
  };

  return List;
};
