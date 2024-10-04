// models/user.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      nombreUsuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      apellidoUsuario: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      correoElectronico: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      contraseña: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    User.associate = (models) => {
      User.belongsToMany(models.Workspace, { through: 'WorkspaceUser' });
      User.hasMany(models.Workspace, { as: 'ownedWorkspaces', foreignKey: 'ownerId' });
    };
  
    return User;
  };