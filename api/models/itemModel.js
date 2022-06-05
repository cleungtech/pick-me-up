import * as database from './databaseModel.js';
import { 
  missingRequiredProperty,
  invalidPrice,
  invalidInventory,
} from '../customErrors.js';
import { isNumberObject } from 'util/types';

const ITEM = 'item';

const itemModel = {

  viewAllItems: async () => {
    // const foundItems = await database.query(USER);
    // const itemsData = foundItems.map(item => {
    //   const itemId = database.getId(item);
    //   const itemData = {
    //     name: item.name,
    //     email: item.email,
    //   };
    //   return displayItem(itemId, itemData);
    // })
    // return itemsData;
  },

  createItem: async (name, price, inventory) => {

    if (!name || price === undefined || inventory === undefined)
      throw missingRequiredProperty;

    if (typeof price !== 'number')
      throw invalidPrice;

    if (!Number.isInteger(inventory) || inventory < 0)
      throw invalidInventory;

    const itemData = {
      name: name,
      price: price,
      inventory: inventory
    }

    const itemId = await database.create(ITEM, itemData);
    return database.displayEntity(itemId, itemData, ITEM);
  },

  viewItem: async (itemId, auth0Id) => {
    // const foundItem = await database.view(USER, itemId);
    // if (!foundItem) throw notFound;
    // if (foundItem.auth0Id !== auth0Id) throw forbidden;

    // return displayItem(database.getId(foundItem), {
    //   name: foundItem.name,
    //   email: foundItem.email,
    // })
  }
}

export default itemModel;