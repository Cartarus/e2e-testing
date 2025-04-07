const request = require('supertest');
const createApp =require("./../src/app");
const {models} = require('../src/db/sequelize');
const {upSeed, downSeed} = require('./utils/umzug')

describe('Test for Users', () => {
  let app = null;
  let server = null;
  let api = null;
  const baseurl= '/api/v1/users'

  beforeAll(async () => {
    app = createApp()

    server = app.listen(9000);
    api = request(app);
    await upSeed()
  });

  describe('GET /users/{id}', () => {
    test('should return a user', async () => {
      const user =  await models.User.findByPk(1)
      const input = 1
      const {statusCode,body} = await api.get(`${baseurl}/${input}`)
      expect(statusCode).toEqual(200)
      expect(body.id).toEqual(user.id)
      expect(body.email).toEqual(user.email)
    });

  })

  describe('POST /users', () => {
    test('Should return 400 bad request Bad request [WRONG PASSWORD]', async () => {
      //aragnge
      const inputData = {
        email: 'camilo@gmail.com',
        password: '---',
      };
      //act
      const response = await api.post('/api/v1/users').send(inputData)
      //assert
      expect(response.statusCode).toBe(400)
    });

    test('Should return 400 bad request Bad request [WRONG EMAIL]', async () => {
      //aragnge
      const inputData = {
        email: '----',
        password: 'contraseña123',
      };
      //act
      const response = await api.post('/api/v1/users').send(inputData)
      // console.log(response.body.message)
      //assert
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toMatch(/email/)
    });

    test('Should return a new user', async () => {
      //aragnge
      const inputData = {
        email: 'alex@gmail.com',
        password: 'contraseña123',
      };
      //act
      const {statusCode, body} = await api.post('/api/v1/users').send(inputData)
      //assert
      expect(statusCode).toBe(201)

      const user =  await models.User.findByPk(body.id)
      expect(user).toBeTruthy()
      expect(user.role).toEqual('admin')
      expect(user.email).toEqual(inputData.email)
    });

  })

  describe('PUT /users', () => {

  })

  afterAll(async () => {
    await downSeed()
    server.close()
  });
});
