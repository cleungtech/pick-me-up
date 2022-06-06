import orderModel from '../models/orderModel.js';
import { checkAcceptJson } from './controllerHelpers.js';

const orderController = {

  // get: async (req, res, next) => {
  //   try {
  //     checkAcceptJson(req);
  //     const { limit, cursor } = req.query;
  //     const ordersData = await orderModel.viewAllOrders(limit, cursor);
  //     res
  //       .status(200)
  //       .set('Content-Type', 'application/json')
  //       .send(ordersData);

  //   } catch (err) {
  //     next(err);
  //   }
  // },

  post: async (req, res, next) => {
    try {
      checkAcceptJson(req);
      const auth0Id = req.auth?.sub.slice(6);
      const { items, requestTime } = req.body;
      const orderData = await orderModel.createOrder(auth0Id, items, requestTime);
      res
        .status(201)
        .set('Content-Type', 'application/json')
        .send(orderData);

    } catch (err) {
      next(err);
    }
  },

  // getOrder: async (req, res, next) => {
  //   try {
  //     checkAcceptJson(req);
  //     const orderId = req.params?.orderId;
  //     const orderData = await orderModel.viewOrder(orderId);
  //     res
  //       .status(200)
  //       .set('Content-Type', 'application/json')
  //       .json(orderData);

  //   } catch (err) {
  //     next(err);
  //   }
  // },

  // putOrder: async (req, res, next) => {
  //   try {
  //     const orderId = req.params?.orderId;
  //     const { name, price, inventory } = req.body;
  //     await orderModel.updateOrder(orderId, name, price, inventory, true);
  //     res
  //       .status(204)
  //       .end();
  //   } catch (err) {
  //     next(err);
  //   }
  // },

  // patchOrder: async (req, res, next) => {
  //   try {
  //     const orderId = req.params?.orderId;
  //     const { name, price, inventory } = req.body;
  //     await orderModel.updateOrder(orderId, name, price, inventory, false);
  //     res
  //       .status(204)
  //       .end();
  //   } catch (err) {
  //     next(err);
  //   }
  // },

  // deleteOrder: async (req, res, next) => {
  //   try {
  //     const orderId = req.params?.orderId;
  //     await orderModel.deleteOrder(orderId);
  //     res
  //       .status(204)
  //       .end();

  //   } catch (err) {
  //     next(err);
  //   }
  // },
}

export default orderController;