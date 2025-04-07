const request = require('supertest');
const createApp = require('./../src/app');
const { models } = require('../src/db/sequelize');
const { downSeed, upSeed } = require('./utils/umzug');

const mockSendMail = jest.fn();
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(()=>{
    return {
      sendMail: mockSendMail,
    }
  }),
}));

describe('Test for Auth', () => {
  let app = null;
  let server = null;
  let api = null;
  const baseurl = '/api/v1/auth/';

  beforeAll(async () => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
    await upSeed()
  });

  describe('POST /login', () => {
    test('Should return 401 [WRONG USER]', async () => {
      //aragnge
      const inputData = {
        email: 'emailfake@gmail.com',
        password: '-asdasdsa12',
      };
      //act
      const {statusCode} = await api.post(`${baseurl}/login`).send(inputData);
      //assert
      expect(statusCode).toBe(401);
    });

    test('should return 200', async () => {
      //aragnge
      const user = await models.User.findByPk(1)
      const inputData = {
        email: user.email,
        password: 'admin123',
      };
      //act
      const {statusCode,body} = await api.post(`${baseurl}/login`).send(inputData);
      //assert
      expect(statusCode).toBe(200);
      expect(body.access_token).toBeTruthy();
      expect(body.user.email).toEqual(user.email);
      expect(body.user.password).toBeUndefined();
    });

  });

  describe('POST /recovery', () => {

    beforeAll(()=>{
      mockSendMail.mockClear();
    })

    test('should return 401 [WRONG EMAIL]', async () => {
      const inputData = {
        email: 'emailfake@gmail.com',
      };
      const {statusCode} = await api.post(`${baseurl}/recovery`).send(inputData);
      expect(statusCode).toBe(401);
    });

    test('should send email to user', async () => {
      const user = await models.User.findByPk(1)
      const inputData = {
        email: user.email,
      };
      mockSendMail.mockResolvedValue(true)
      const {statusCode,body} = await api.post(`${baseurl}/recovery`).send(inputData);
      expect(statusCode).toBe(200);
      expect(body.message).toEqual('mail sent');
      expect(mockSendMail).toHaveBeenCalled();
    });
  });


  afterAll(async () => {
    await downSeed()
    server.close();
  });
});
