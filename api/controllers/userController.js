import userModel from '../models/userModel.js';
import { checkAcceptJson } from './controllerHelpers.js';

const userController = {

  get: (req, res, next) => {
    try {
      response
        .status(200)
        .send('Testing Controllers');

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
      console.error(err);
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
  }
}

export default userController;