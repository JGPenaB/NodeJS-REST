'use strict';
module.exports = (sequelize, DataTypes) => {
  const ArticleTags = sequelize.define('ArticleTags', {
    articleID: DataTypes.INTEGER,
    tagID: DataTypes.INTEGER
  }, {});
  ArticleTags.associate = function(models) {
    ArticleTags.belongsTo(models.Article, {foreignKey: "articleID",onDelete: 'CASCADE', hooks: true, constraints: true});
    ArticleTags.belongsTo(models.Tags, {foreignKey: "tagID" ,onDelete: 'CASCADE', hooks: true, constraints: true});
  };
  return ArticleTags;
};