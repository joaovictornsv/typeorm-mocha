import sinon from 'sinon';
import { expect } from 'chai';
import * as typeorm from 'typeorm';
import { v4 as uuid } from 'uuid';
import { UserRepository } from '../src/repositories/UserRepository';
import { UserController } from '../src/controllers/UserController';
import { userRequestData, userReturnedMock } from './mocks/userMock';
import { requestMock } from './mocks/requestMock';
import { responseMock } from './mocks/responseMock';

describe('User Controller', () => {
  let sandbox: sinon.SinonSandbox;
  let statusSpy: sinon.SinonSpy;
  const userRepositoryMock = sinon.createStubInstance(UserRepository);
  const getCustomRepositoryMock = sinon.stub(typeorm, 'getCustomRepository');
  const userController = new UserController();

  before(() => {
    sandbox = sinon.createSandbox();

    getCustomRepositoryMock.returns(userRepositoryMock);
  });
  beforeEach(() => {
    requestMock.body = {};
    sandbox.restore();
    statusSpy = sandbox.spy(responseMock, 'status');
  });

  describe('create()', () => {
    it('should able create a user successfully', async () => {
      userRepositoryMock.findOne.returns(null);
      userRepositoryMock.create.resolves(userReturnedMock);

      requestMock.body = userRequestData;

      const response = await userController.create(requestMock, responseMock);

      expect(response).to.have.property('id');
      expect(statusSpy.calledOnceWith(201)).to.equal(true);
    });

    it('should not able create a user without required fields', async () => {
      requestMock.body = {};

      const response = await userController.create(requestMock, responseMock);

      expect(response).to.have.property('error').to.equal('Please, fill the required fields');
      expect(statusSpy.calledOnceWith(400)).to.equal(true);
    });

    it('should not able create if an email is already registered', async () => {
      userRepositoryMock.findOne.resolves(userReturnedMock);

      requestMock.body = userRequestData;

      const response = await userController.create(requestMock, responseMock);

      expect(response).to.have.property('error').to.equal('This email has already been registered');
      expect(statusSpy.calledOnceWith(400)).to.equal(true);
    });
  });

  describe('index()', () => {
    it('should be return a array of users', async () => {
      userRepositoryMock.find.resolves([userReturnedMock]);
      const response = await userController.index(requestMock, responseMock);

      expect(response).is.instanceOf(Array);
      expect(statusSpy.calledOnceWith(200)).to.equal(true);
    });
  });
  describe('indexByID()', () => {
    it('should able return a user successfully', async () => {
      userReturnedMock.id = uuid();
      userRepositoryMock.findOne.resolves(userReturnedMock);

      requestMock.params = { id: userReturnedMock.id };

      const response = await userController.indexByID(requestMock, responseMock);

      expect(response).to.have.property('id');
      expect(statusSpy.calledOnceWith(200)).to.equal(true);
    });

    it('should not return a user if the id is invalid', async () => {
      userReturnedMock.id = 'mock-uuid';

      requestMock.params = { id: userReturnedMock.id };

      const response = await userController.indexByID(requestMock, responseMock);

      expect(response).to.have.property('error').to.equal('Invalid id format');
      expect(statusSpy.calledOnceWith(400)).to.equal(true);
    });

    it('should not return a user if it does not exist', async () => {
      userReturnedMock.id = uuid();
      userRepositoryMock.findOne.returns(null);

      requestMock.params = { id: userReturnedMock.id };

      const response = await userController.indexByID(requestMock, responseMock);

      expect(response).to.have.property('error').to.equal('User not found');
      expect(statusSpy.calledOnceWith(404)).to.equal(true);
    });
  });
});
