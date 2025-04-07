const { USER_TABLE } = require('../models/user.model');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkInsert(USER_TABLE, [
      {
        email: 'admin@mail.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        created_at: new Date(),
      },

      {
        email: 'customer@mail.com',
        password: await bcrypt.hash('customer123', 10),
        role: 'customer',
        created_at: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(USER_TABLE, null, {});
  },
};
