'use strict';
module.exports = (sequelize, DataTypes) => {
  var Factsheet = sequelize.define('Factsheet', {
    title: DataTypes.STRING,
    adress: DataTypes.STRING,
    note: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    country: DataTypes.STRING
  }, {});
  Factsheet.associate = function(models) {
    // associations can be defined here
  };
  return Factsheet;
};