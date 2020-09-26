'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tags = sequelize.define('Tags', {
    tagName: DataTypes.STRING
  }, {});
  Tags.associate = function(models) {
    // associations can be defined here
    Tags.belongsToMany(models.Article, {through: "ArticleTags", foreignKey: "tagID", otherKey:"articleID"});
  };
  return Tags;
};