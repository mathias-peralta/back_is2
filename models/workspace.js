// models/workspace.js

module.exports = (sequelize, DataTypes) => {
  const Workspace = sequelize.define('Workspace', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'workspaces',
    timestamps: false, // Deshabilitar createdAt y updatedAt
  });

  Workspace.associate = (models) => {
    // Relación muchos a muchos con User a través de WorkspaceUser
    Workspace.belongsToMany(models.User, {
      through: 'workspace_users',
      foreignKey: 'workspace_id',
      otherKey: 'user_id',
      as: 'users',
    });

    // Relación uno a muchos (un espacio de trabajo pertenece a un propietario)
    Workspace.belongsTo(models.User, {
      foreignKey: 'owner_id',
      as: 'owner',
    });

    // Relación uno a muchos con Board
    Workspace.hasMany(models.Board, {
      foreignKey: 'workspace_id',
      as: 'boards',
    });
  };

  return Workspace;
};
