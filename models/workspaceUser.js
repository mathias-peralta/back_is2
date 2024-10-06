// models/workspaceUser.js

module.exports = (sequelize, DataTypes) => {
    const WorkspaceUser = sequelize.define('WorkspaceUser', {}, {
      tableName: 'workspace_users',
      timestamps: false, // Deshabilitar createdAt y updatedAt
    });
  
    return WorkspaceUser;
  };
  