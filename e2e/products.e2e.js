const request = require('supertest');
const createApp =require("./../src/app");
const {models} = require('../src/db/sequelize');
const {upSeed, downSeed} = require('./utils/umzug')

describe('Test for Products', () => {
  let app = null;
  let server = null;
  let api = null;
  const baseurl= '/api/v1/products'

  beforeAll(async () => {
    app = createApp()

    server = app.listen(9000);
    api = request(app);
    await upSeed()
  });

  describe('GET /products', () => {
    test('should return a product', async () => {
      const {statusCode,body} = await api.get(`${baseurl}`)
      expect(statusCode).toEqual(200)

      const products = await models.Product.findAll()
      expect(body.length).toEqual(products.length)
      expect(body[0].category).toBeTruthy()
    });

    test('should return 2 products with limit = 2 and offset = 0', async () => {
      const limit = 2
      const offset = 0
      const {statusCode,body} = await api.get(`${baseurl}?limit=${limit}&offset=${offset}`)
      expect(statusCode).toEqual(200)
      expect(body.length).toEqual(limit)
    });

    test('should return 2 products with limit = 2 and offset = 2', async () => {
      const limit = 2
      const offset = 2
      const {statusCode,body} = await api.get(`${baseurl}?limit=${limit}&offset=${offset}`)
      expect(statusCode).toEqual(200)
      expect(body.length).toEqual(limit)
    });

  })


  afterAll(async () => {
    await downSeed()
    server.close()
  });
});
