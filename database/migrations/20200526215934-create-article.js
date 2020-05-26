'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Slug: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      Author: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName:"Users",
            schema:"public"
          },
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Articles');
  }
};