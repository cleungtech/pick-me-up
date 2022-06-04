import dotenv from 'dotenv';
import userModel from '../models/userModel.js';
import { checkAcceptJson } from './controllerHelpers.js';
import {
  invalidLogin,
} from '../customErrors.js';

dotenv.config();

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
      const { username, password } = req.body;
      const authData = await userModel.login(username, password);
      if (!authData) throw invalidLogin;

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