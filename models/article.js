'use strict';
module.exports = (sequelize, DataTypes) => {
  var Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    subtitle: DataTypes.STRING,
    image: DataTypes.STRING,
    text: DataTypes.STRING,
    signature: DataTypes.STRING,
    logo: DataTypes.STRING
  }, {});
  Article.associate = function(models) {
    // associations can be defined here
  };
  return Article;
};