'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Articles', [{
      Title: 'How to create something with NodeJS',
      Slug: 'It is easier than you think',
      Content: 'Download NodeJS, do stuff and call it a day.',
      Author: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      Title: 'Copy & Pasted article',
      Slug: 'Just a demo',
      Content: 'Right-click on an element and select \"Copy\". Then right-click somewhere and select \"Paste\".',
      Author: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Articles', null, {});
  }
};
