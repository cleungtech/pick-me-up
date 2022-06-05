import itemModel from '../models/itemModel.js';
import { checkAcceptJson } from './controllerHelpers.js';

const itemController = {

  get: async (req, res, next) => {
    try {
      checkAcceptJson(req);
      const { limit, cursor } = req.query;
      const itemsData = await itemModel.viewAllItems(limit, cursor);
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(itemsData);

    } catch (err) {
      next(err);
    }

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