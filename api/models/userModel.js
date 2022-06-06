import * as database from './databaseModel.js';
import { createUserAuth0, loginAuth0 } from './authorizationModel.js';
import { 
  missingRequiredProperty,
  invalidLogin,
  forbidden,
  notFound,
  invalidToken,
} from '../customErrors.js';
import jwt_decode from 'jwt-decode';

const USER = 'user';

const userModel = {

  viewAllUsers: async () => {
    const foundUsers = await database.queryAll(USER);
    const usersData = foundUsers.map(user => {
      const userId = database.getId(user);
      const userData = {
        name: user.name,
        email: user.email,
      };
      return database.displayEntity(userId, userData, USER);
    })
    return usersData;
  },

  createUser: async (name, email, password) => {

    if (!name || !email || !password) throw missingRequiredProperty;
    const response = await createUserAuth0(name, email, password);

    const userData = {
      name: response.name,
      email: response.email,
      orders: []
    }

    const userId = await database.create(USER, {
      auth0Id: response.identities[0].user_id,
      ...userData
    });

    return database.displayEntity(userId, userData, USER);
  },

  login: async (username, password) => {

    if (!username || !password) throw invalidLogin;
    const response = await loginAuth0(username, password);

    const { email, name, sub } = jwt_decode(response.id_token);
    const auth0Id = sub.slice(6); // remove "auth0|"

    const foundUser = (await database.queryAll(USER, 'auth0Id', auth0Id))[0];
    if (!foundUser) throw invalidLogin;

    return database.displayEntity(database.getId(foundUser), {
        name: foundUser.name,
        email: foundUser.email,
        orders: foundUser.orders,
        jwt: response.id_token
    }, USER);
  },

  viewUser: async (userId, auth0Id) => {
    const foundUser = await database.view(USER, userId);
    if (!foundUser) throw notFound;
    if (foundUser.auth0Id !== auth0Id) throw forbidden;

    return database.displayEntity(database.getId(foundUser), {
      name: foundUser.name,
      email: foundUser.email,
      orders: foundUser.orders
    }, USER);
  },

  findUserId: async (auth0Id) => {
    const foundUser = await database.queryAll(USER, 'auth0Id', auth0Id);
    if (foundUser.length === 0) throw invalidToken;
    return database.getId(foundUser[0]);
  },

  addOrder: async (userId, orderId) => {
    const foundUser = await database.view(USER, userId);
    if (!foundUser) throw notFound;
    foundUser.orders?.push(orderId);
    await database.update(USER, foundUser);
  },

  removeOrder: async (userId, orderId) => {
    const foundUser = await database.view(USER, userId);
    if (!foundUser) throw notFound;
    for (let i = 0; i < foundUser.orders.length; i++){ 
      if (foundUser.orders[i] === orderId)
        foundUser.orders.splice(i, 1);
    }
    await database.update(USER, foundUser);
  }
}

export default userModel;