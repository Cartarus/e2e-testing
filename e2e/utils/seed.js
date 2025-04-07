const sequelize = require('../../src/db/sequelize');
const bcrypt = require('bcrypt');
const { models } = sequelize;

const upSeed = async () => {
  try {
    await sequelize.sync({ force: true }); //no usar en produccion ,crea las tablas
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    await models.User.create({
      email: 'admin@mail.com',
      password: hash,
      role: 'admin',
    });
    await models.Category.bulkCreate([
      {
        name: 'Category 1',
        image: 'https://via.placeholder.com/150',
      },
      {
        name: 'Category 2',
        image: 'https://via.placeholder.com/150',
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};

const downSeed = async () => {
  await sequelize.drop();
};

module.exports = {
  upSeed,
  downSeed,
};
