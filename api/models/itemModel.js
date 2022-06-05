import * as database from './databaseModel.js';
import {
  missingRequiredProperty,
  invalidPrice,
  invalidInventory,
  nameNotUnique,
  notFound,
  invalidName,
} from '../customErrors.js';

const ITEM = 'item';
const ITEMS_PER_PAGE = 5;

const itemModel = {

  viewAllItems: async (limit, cursor) => {

    const numPerPage = limit ? limit : ITEMS_PER_PAGE;
    const foundItems = await database.viewAll(ITEM, numPerPage, cursor);

    return foundItems;
  },

  createItem: async (name, price, inventory) => {

    validateName(name);
    await validateUniqueName(name);
    validatePrice(price);
    validateInventory(inventory);

    const itemData = {
      name: name,
      price: price,
      inventory: inventory
    }

    const itemId = await database.create(ITEM, itemData);
    return database.displayEntity(itemId, itemData, ITEM);
  },

  viewItem: async (itemId) => {
    const foundItem = await database.view(ITEM, itemId);
    if (!foundItem) throw notFound;
    return database.displayEntity(itemId, foundItem, ITEM);
  },

  updateItem: async (itemId, name, price, inventory, replaceAll) => {

    const foundItem = await database.view(ITEM, itemId);
    if (!foundItem) throw notFound;

    if (replaceAll) {
      validateName(name);
      await validateUniqueName(name, itemId);
      validatePrice(price);
      validateInventory(inventory);

    } else {
      name !== undefined && validateName(name);
      name !== undefined && await validateUniqueName(name, itemId);
      price !== undefined && validatePrice(price);
      inventory !== undefined && validateInventory(inventory);
    }

    if (name !== undefined) foundItem.name = name;
    if (price !== undefined) foundItem.price = price;
    if (inventory !== undefined) foundItem.inventory = inventory;

    await database.update(ITEM, foundItem);
  }
}

const validateName = (name) => {
  if (name === undefined) throw missingRequiredProperty;
  if (name.length === 0) throw invalidName;
}

const validateUniqueName = async (name, itemId) => {
  const foundItem = await database.queryAll(ITEM, 'name', name);
  if (foundItem.length > 0 && database.getId(foundItem[0]) !== itemId) {
    throw nameNotUnique;
  }
}

const validatePrice = (price) => {
  if (price === undefined) throw missingRequiredProperty;
  if (typeof price !== 'number') throw invalidPrice;
}

const validateInventory = (inventory) => {
  if (inventory === undefined) throw missingRequiredProperty;
  if (!Number.isInteger(inventory) || inventory < 0)
    throw invalidInventory;
}

export default itemModel;