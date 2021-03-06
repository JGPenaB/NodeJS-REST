'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    userID: DataTypes.INTEGER,
    articleID: DataTypes.INTEGER,
    Content: DataTypes.TEXT
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.User, {foreignKey: "userID",onDelete: 'CASCADE', hooks: true, constraints: true});
    Comment.belongsTo(models.Article, {foreignKey: "articleID",onDelete: 'CASCADE', hooks: true, constraints: true});
  };
  return Comment;
};