'use strict';
module.exports = (sequelize, DataTypes) => {
  var AirlineCompany = sequelize.define('AirlineCompany', {
    name: DataTypes.STRING
  }, {});
  AirlineCompany.associate = function(models) {
    // associations can be defined here
  };
  return AirlineCompany;
};