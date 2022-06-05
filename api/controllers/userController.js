import userModel from '../models/userModel.js';
import { checkAcceptJson } from './controllerHelpers.js';

const userController = {

  get: async (req, res, next) => {
    try {
      checkAcceptJson(req);
      const usersData = await userModel.viewAllUsers();
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(usersData);

    } catch (err) {
      next(err);
    }
  },

  post: async (req, res, next) => {
    try {
      checkAcceptJson(req);
      const { name, email, password } = req.body;
      const userData = await userModel.createUser(name, email, password);
      res
        .status(201)
        .set('Content-Type', 'application/json')
        .send(userData);

    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      checkAcceptJson(req);
      const { username, password } = req.body;
      const authData = await userModel.login(username, password);
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .json(authData);

    } catch (err) {
      next(err);
    }
  },

  getUser: async (req, res, next) => {
    try {

      checkAcceptJson(req);
      const auth0Id = req.auth?.sub.slice(6);      
      const userId = req.params?.userId;
      const userData = await userModel.viewUser(userId, auth0Id);
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .json(userData);

    } catch (err) {
      next(err);
    }
  }
}

export default userController;