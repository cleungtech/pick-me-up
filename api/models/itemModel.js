import * as database from './databaseModel.js';
import { 
  missingRequiredProperty,
  invalidPrice,
  invalidInventory,
  nameNotUnique,
  notFound,
} from '../customErrors.js';
import { isNumberObject } from 'util/types';

const ITEM = 'item';
const ITEMS_PER_PAGE = 5;

const itemModel = {

  viewAllItems: async (limit, cursor) => {

    const numPerPage = limit ? limit : ITEMS_PER_PAGE;
    const foundItems = await database.viewAll(ITEM, numPerPage, cursor);

    return foundItems;
  },

  createItem: async (name, price, inventory) => {

    if (!name || price === undefined || inventory === undefined)
      throw missingRequiredProperty;

    if (typeof price !== 'number')
      throw invalidPrice;

    if (!Number.isInteger(inventory) || inventory < 0)
      throw invalidInventory;

    const foundItem = await database.queryAll(ITEM, 'name', name);
    if (foundItem.length > 0) throw nameNotUnique;

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
  }
}

export default itemModel;