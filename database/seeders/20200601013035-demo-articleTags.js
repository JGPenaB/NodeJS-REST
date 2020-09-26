'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ArticleTags', [{
      tagID: 1,
      articleID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      tagID: 2,
      articleID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      tagID: 3,
      articleID: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      tagID: 3,
      articleID: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ArticleTags', null, {});
  }
};
