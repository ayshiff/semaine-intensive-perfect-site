'use strict';
module.exports = (sequelize, DataTypes) => {
  var UserAdmin = sequelize.define('UserAdmin', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {});
  UserAdmin.associate = function(models) {
    // associations can be defined here
  };
  return UserAdmin;
};