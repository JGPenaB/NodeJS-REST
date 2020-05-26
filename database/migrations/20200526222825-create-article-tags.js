'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ArticleTags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      articleID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName:"Articles",
            schema:"public"
          },
          key: "id"
        }
      },
      tagID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName:"Tags",
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
    return queryInterface.dropTable('ArticleTags');
  }
};