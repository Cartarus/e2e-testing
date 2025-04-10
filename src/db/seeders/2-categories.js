const { CATEGORY_TABLE } = require('../models/category.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkInsert(CATEGORY_TABLE, [
      {
        name: 'Category 1',
        image: 'https://via.placeholder.com/150',
        created_at: new Date(),
      },
      {
        name: 'Category 2',
        image: 'https://via.placeholder.com/150',
        created_at: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(CATEGORY_TABLE, null, {});
  },
};
