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
    try {
      checkAcceptJson(req);
      const itemId = req.params?.itemId;
      const itemData = await itemModel.viewItem(itemId);
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .json(itemData);

    } catch (err) {
      next(err);
    }
  },

  putItem: async (req, res, next) => {
    try {
      const itemId = req.params?.itemId;
      const { name, price, inventory } = req.body;
      await itemModel.updateItem(itemId, name, price, inventory, true);
      res
        .status(204)
        .end();
    } catch (err) {
      next(err);
    }
  },

  patchItem: async (req, res, next) => {

  },

  deleteItem: async (req, res, next) => {

  },
}

export default itemController;