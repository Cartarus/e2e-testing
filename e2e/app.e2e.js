const request = require('supertest');
const createApp = require('./../src/app');
const { config } = require('../src/config/config');

describe('pruebas para app', () => {
  let app = null;
  let server = null;
  let api = null;

  beforeAll(() => {
    app = createApp();

    server = app.listen(9000);
    api = request(app);
  });

  test('GET /hello', async () => {
    const response = await api.get('/hello');
    expect(response).toBeTruthy();
    expect(response.statusCode).toEqual(200);
    expect(response.body.name).toEqual('cris');
    expect(response.headers['content-type']).toMatch(/json/);
  });

  describe('GET /nueva-ruta', () => {
    test('should return 401 [NO API KEY]', async () => {
      const { statusCode } = await api.get('/nueva-ruta');
      expect(statusCode).toEqual(401);
    });

    test('shoul return 401 [WRONG API KEY]', async () => {
      const { statusCode } = await api.get('/nueva-ruta').set({
        api:'12563'
      });
      expect(statusCode).toEqual(401);
    });

    test('shoul return 200 [CORRECT API KEY]', async () => {
      const { statusCode } = await api.get('/nueva-ruta').set({
        api:config.apiKey
      });
      expect(statusCode).toEqual(200);
    });
  });

  afterAll(() => {
    server.close();
  });
});
