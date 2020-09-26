'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tags', [{
      tagName: 'Programming',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      tagName: 'NodeJS',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      tagName: 'Tutorial',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tags', null, {});
  }
};
