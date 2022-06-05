import * as database from './databaseModel.js';
import { API_URL } from '../constants.js';
import { createUserAuth0, loginAuth0, checkJWT } from './authorizationModel.js';
import { 
  missingRequiredProperty,
  invalidLogin,
} from '../customErrors.js';
import jwt_decode from 'jwt-decode';

const USER = 'user';

const userModel = {

  viewAllUsers: async () => {
    const foundUsers = await database.query(USER);
    const usersData = foundUsers.map(user => {
      const userId = database.getId(user);
      const userData = {
        name: user.name,
        email: user.email,
      };
      return displayUser(userId, userData);
    })
    return usersData;
  },

  createUser: async (name, email, password) => {

    if (!name || !email || !password) throw missingRequiredProperty;
    const response = await createUserAuth0(name, email, password);

    const userData = {
      name: response.name,
      email: response.email,
    }

    const userId = await database.create(USER, {
      auth0Id: response.identities[0].user_id,
      ...userData
    });

    return displayUser(userId, userData);
  },

  login: async (username, password) => {

    if (!username || !password) throw invalidLogin;
    const response = await loginAuth0(username, password);

    const { email, name, sub } = jwt_decode(response.id_token);
    const auth0Id = sub.slice(6); // remove "auth0|"

    const foundUser = (await database.query(USER, 'auth0Id', auth0Id))[0];

    if (!foundUser) throw invalidLogin;

    return {
      userId: database.getId(foundUser),
      name: foundUser.name,
      email: foundUser.email,
      jwt: response.id_token
    }
  }
}

const displayUser = (userId, userData) => {
  return {
    userId: userId,
    ...userData,
    self: `${API_URL}/users/${userId}`
  }
}

export default userModel;