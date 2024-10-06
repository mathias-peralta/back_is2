// models/user.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nombre_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    apellido_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo_electronico: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contrasena: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'users',
    timestamps: false, // Deshabilitar createdAt y updatedAt
  });

  User.associate = (models) => {
    // Relación muchos a muchos con Workspace a través de WorkspaceUser
    User.belongsToMany(models.Workspace, {
      through: 'workspace_users',
      foreignKey: 'user_id',
      otherKey: 'workspace_id',
      as: 'workspaces',
    });

    // Relación uno a muchos (un usuario puede tener varios espacios de trabajo como propietario)
    User.hasMany(models.Workspace, {
      foreignKey: 'owner_id',
      as: 'ownedWorkspaces',
    });
  };

  return User;
};
