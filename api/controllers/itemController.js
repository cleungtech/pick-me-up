import itemModel from '../models/itemModel.js';
import { checkAcceptJson } from './controllerHelpers.js';

const itemController = {
  get: async (req, res, next) => {

  },

  post: async (req, res, next) => {
    try {
      checkAcceptJson(req);
      const { name, price, inventory } = req.body;
      const itemData = await itemModel.createItem(name, price, inventory);
      res
        .status(201)
        .set('Content-Type', 'application/json')
        .send(itemData);

    } catch (err) {
      next(err);
    }
  },

  getItem: async (req, res, next) => {

  },

  putItem: async (req, res, next) => {

  },

  patchItem: async (req, res, next) => {

  },

  deleteItem: async (req, res, next) => {

  },
}

export default itemController;