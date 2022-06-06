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

  // viewOrder: async (orderId) => {
  //   const foundOrder = await database.view(ITEM, orderId);
  //   if (!foundOrder) throw notFound;
  //   return database.displayEntity(orderId, foundOrder, ITEM);
  // },

  // updateOrder: async (orderId, name, price, inventory, replaceAll) => {

  //   const foundOrder = await database.view(ITEM, orderId);
  //   if (!foundOrder) throw notFound;

  //   if (replaceAll) {
  //     validateName(name);
  //     await validateUniqueName(name, orderId);
  //     validatePrice(price);
  //     validateInventory(inventory);

  //   } else {
  //     name !== undefined && validateName(name);
  //     name !== undefined && await validateUniqueName(name, orderId);
  //     price !== undefined && validatePrice(price);
  //     inventory !== undefined && validateInventory(inventory);
  //   }

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

const validateItems = async (items) => {

  if (items === undefined) throw missingRequiredProperty;

  const itemsId = Object.keys(items);

  for (const id of Object.keys(items)) {
    try {
      const requestAmount = items[id];
      const foundItem = await itemModel.viewItem(id);
      const itemInventory = foundItem.inventory;
      if (itemInventory < requestAmount) throw outOfStock;

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