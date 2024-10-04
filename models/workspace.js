// models/workspace.js


module.exports = (sequelize, DataTypes) => {
    const Workspace = sequelize.define('Workspace', {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    });
  
    Workspace.associate = (models) => {
      Workspace.belongsTo(models.User, { as: 'owner', foreignKey: 'ownerId' });
      Workspace.belongsToMany(models.User, { through: 'WorkspaceUser' });
      Workspace.hasMany(models.Board, { foreignKey: 'workspaceId' });
    };
  
    return Workspace;
  };