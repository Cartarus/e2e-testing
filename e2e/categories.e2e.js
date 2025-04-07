const request = require('supertest');
const createApp =require("../src/app");
const {models} = require('../src/db/sequelize');
const {upSeed, downSeed} = require('./utils/umzug')

describe('Test for Users', () => {
  let app = null;
  let server = null;
  let api = null;
  const baseurl= '/api/v1/categories'
  let accessToken = null;
  beforeAll(async () => {
    app = createApp()

    server = app.listen(9000);
    api = request(app);
    await upSeed()
  });

  describe('POST /categories with admin role', () => {

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

    test('should return 401 [NO ACCESS TOKEN]', async () => {
      const inputData = {
        name: 'new category',
        image:"https://via.placeholder.com/150"
      }
      const {statusCode} = await api.post(`${baseurl}`).send(inputData)
      expect(statusCode).toEqual(401)
    });

    test('should return a new category', async () => {
      const inputData = {
        name: 'new category',
        image:"https://via.placeholder.com/150"
      }
      const {statusCode,body} = await api.post(`${baseurl}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(inputData)
      expect(statusCode).toEqual(201)
      const category = await models.Category.findByPk(body.id)
      expect(category.name).toEqual(inputData.name)
      expect(category.image).toEqual(inputData.image)
    });

    afterAll(async () => {
      accessToken = null;
    });

  })

  describe('POST /categories with customer role', () => {

    beforeAll(async () => {
      const user = await models.User.findByPk(2);
      const inputData = {
        email: user.email,
        password: 'customer123',
      };
      //act
      const { body: bodyLogin } = await api
        .post(`/api/v1/auth/login`)
        .send(inputData);
      accessToken = bodyLogin.access_token;
    });


    test('should return 401 [NO ACCESS TOKEN]', async () => {
      const inputData = {
        name: 'new category',
        image:"https://via.placeholder.com/150"
      }
      const {statusCode} = await api.post(`${baseurl}`).send(inputData)
      expect(statusCode).toEqual(401)
    });

    test('should return 401 [NO ADMIN ROLE]', async () => {
      const inputData = {
        name: 'new category',
        image:"https://via.placeholder.com/150"
      }
      const {statusCode} = await api.post(`${baseurl}`).send(inputData)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(statusCode).toEqual(401)
    })

    afterAll(async () => {
      accessToken = null;
    });
  })


  afterAll(async () => {
    await downSeed()
    server.close()
  });
});
