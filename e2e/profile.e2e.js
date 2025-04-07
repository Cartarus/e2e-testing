const request = require('supertest');
const createApp = require('./../src/app');
const { models } = require('../src/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');
describe('Test for Profile', () => {
  let app = null;
  let server = null;
  let api = null;
  let accessToken = null;
  const baseurl = '/api/v1/profile';

  beforeAll(async () => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
    await upSeed()
  });

  describe('GET /my-user', () => {
    beforeAll(async () => {
      const user = await models.User.findByPk(1);
      const inputData = {
        email: user.email,
        password: 'admin123',
      };
      //act
      const { body: bodyLogin } = await api
        .post(`/api/v1/auth/login`)
        .send(inputData);
      accessToken = bodyLogin.access_token;
    });

    test('should return 401 [WRONG ACCES TOKEN]', async () => {
      const { statusCode } = await api.get(`${baseurl}/my-user`).set({
        authorizattion: `Bearer 12314`,
      });
      expect(statusCode).toEqual(401);
    });

    test('should return a user', async () => {
      const user = await models.User.findByPk(1);

      const { statusCode, body } = await api.get(`${baseurl}/my-user`).set({
        authorization: `Bearer ${accessToken}`,
      });

      expect(statusCode).toEqual(200);
      expect(body.email).toEqual(user.email);
    });

    afterAll(() => {
      accessToken=null
    });
  });

  afterAll(async () => {
    await downSeed()
    server.close();
  });
});
