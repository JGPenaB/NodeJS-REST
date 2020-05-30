'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define("Article", {
    Title: DataTypes.STRING,
    Slug: DataTypes.STRING,
    Content: DataTypes.TEXT,
    Author: DataTypes.INTEGER
  }, {});
  Article.associate = function(models) {
    // associations can be defined here
    Article.belongsTo(models.User, {foreignKey: "Author", as: "authorData"});
  };
  return Article;
};