'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    Title: DataTypes.STRING,
    Slug: DataTypes.STRING,
    Content: DataTypes.TEXT,
    Author: DataTypes.INTEGER
  }, {});
  Article.associate = function(models) {
    // associations can be defined here
    models.Article.hasMany(models.User, {foreignKey: "Author", targetKey: "id"});
  };
  return Article;
};