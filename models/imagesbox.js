'use strict';
module.exports = (sequelize, DataTypes) => {
  var ImagesBox = sequelize.define('ImagesBox', {
    title: DataTypes.STRING,
    theme: DataTypes.STRING,
    image: DataTypes.STRING
  }, {});
  ImagesBox.associate = function(models) {
    // associations can be defined here
  };
  return ImagesBox;
};