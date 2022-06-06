import * as database from './databaseModel.js';
import userModel from './userModel.js';
import itemModel from './itemModel.js';
import {
  missingRequiredProperty,
  invalidPrice,
  invalidInventory,
  nameNotUnique,
  notFound,
  invalidName,
  outOfStock,
  invalidItemId,
  invalidRequestTime,
  forbidden,
} from '../customErrors.js';

const ORDER = 'order';
const ORDERS_PER_PAGE = 5;

const orderModel = {

  viewAllOrders: async (auth0Id, limit, cursor) => {

    const customerId = await userModel.findUserId(auth0Id);
    const numPerPage = limit ? limit : ORDERS_PER_PAGE;
    const foundOrders = await database.viewAll(ORDER, numPerPage, cursor, "customerId", customerId);
    foundOrders.orders.forEach(convertDatetime);
    return foundOrders;
  },

  createOrder: async (auth0Id, items, requestTime) => {

    const customerId = await userModel.findUserId(auth0Id);
    const orderTime = Date.now();
    validateRequestTime(requestTime, orderTime);
    await validateItems(items);

    const orderData = {
      customerId: customerId,
      items: items,
      orderTime: orderTime,
      requestTime: requestTime,
      hasPickedUp: false
    }

    const orderId = await database.create(ORDER, orderData);
    await userModel.addOrder(customerId, orderId);
    await itemModel.updateItemsInventory(items);  
    convertDatetime(orderData);
    return database.displayEntity(orderId, orderData, ORDER);
  },

  viewOrder: async (auth0Id, orderId) => {
    const customerId = await userModel.findUserId(auth0Id);
    const foundOrder = await database.view(ORDER, orderId);
    if (!foundOrder) throw notFound;
    if (foundOrder.customerId !== customerId) throw forbidden;
    convertDatetime(foundOrder);
    return database.displayEntity(orderId, foundOrder, ORDER);
  },

  updateOrder: async (auth0Id, orderId, items, requestTime, replaceAll) => {

    const customerId = await userModel.findUserId(auth0Id);
    const foundOrder = await database.view(ORDER, orderId);

    if (!foundOrder) throw notFound;
    if (foundOrder.customerId !== customerId) throw forbidden;

    if (replaceAll) {
      validateRequestTime(requestTime, foundOrder.orderTime);
      await validateItems(items, foundOrder.items);

    } else {
      requestTime !== undefined && validateRequestTime(requestTime, foundOrder.orderTime);
      items !== undefined && await validateItems(items, foundOrder.items);
    }

    if (requestTime !== undefined) foundOrder.requestTime = requestTime;
    if (items !== undefined) {
      await itemModel.updateItemsInventory(items, foundOrder.items);  
      foundOrder.items = items;
    }
    await database.update(ORDER, foundOrder);
  }

  //   if (name !== undefined) foundOrder.name = name;
  //   if (price !== undefined) foundOrder.price = price;
  //   if (inventory !== undefined) foundOrder.inventory = inventory;

  //   await database.update(ITEM, foundOrder);
  // },

  // deleteOrder: async (orderId) => {
  //   if (!(await database.remove(ITEM, orderId)))
  //     throw notFound;
  // }
}

// const validateName = (name) => {
//   if (name === undefined) throw missingRequiredProperty;
//   if (name.length === 0) throw invalidName;
// }

// const validateUniqueName = async (name, orderId) => {
//   const foundOrder = await database.queryAll(ITEM, 'name', name);
//   if (foundOrder.length > 0 && database.getId(foundOrder[0]) !== orderId) {
//     throw nameNotUnique;
//   }
// }

const validateItems = async (newOrderItems, oldOrderItems) => {

  if (newOrderItems === undefined)
    throw missingRequiredProperty;


  for (const id of Object.keys(newOrderItems)) {
    try {
      const newRequestAmount = newOrderItems[id];
      let oldRequestAmount = 0;
      if (oldOrderItems && oldOrderItems[id]) {
        oldRequestAmount = oldOrderItems[id]
      }
      const foundItem = await itemModel.viewItem(id);
      const itemInventory = foundItem.inventory;
      if (itemInventory + oldRequestAmount < newRequestAmount)
        throw outOfStock;

    } catch (err) {
      if (err === notFound) throw invalidItemId;
      throw err;
    }
  }
}

const validateRequestTime = (requestTime, orderTime) => {

  if (requestTime === undefined) throw missingRequiredProperty;
  if (!Number.isInteger(requestTime) || requestTime < orderTime)
    throw invalidRequestTime;
}

const convertDatetime = (orderData) => {

  const requestTimeObj = new Date(orderData.requestTime);
  const orderTimeObj = new Date(orderData.orderTime);
  orderData.requestTime = requestTimeObj.toGMTString();
  orderData.orderTime = orderTimeObj.toGMTString();
}



export default orderModel;