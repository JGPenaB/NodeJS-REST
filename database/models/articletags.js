'use strict';
module.exports = (sequelize, DataTypes) => {
  const ArticleTags = sequelize.define('ArticleTags', {
    articleID: DataTypes.INTEGER,
    tagID: DataTypes.INTEGER
  }, {});
  ArticleTags.associate = function(models) {
    // associations can be defined here
  };
  return ArticleTags;
};