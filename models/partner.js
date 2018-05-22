'use strict';
module.exports = (sequelize, DataTypes) => {
  var Partner = sequelize.define('Partner', {
    title: DataTypes.STRING,
    signature: DataTypes.STRING,
    logo: DataTypes.STRING
  }, {});
  Partner.associate = function(models) {
    // associations can be defined here
  };
  return Partner;
};