import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { 
  invalidLogin,
  userAlreadyExist,
  invalidEmailFormat,
  passwordTooWeak,
} from '../customErrors.js';
import { AUTH0_URL } from '../constants.js';
import { expressjwt } from "express-jwt";
import jwksRsa from 'jwks-rsa';

dotenv.config();

const createUserAuth0 = async (name, email, password) => {
  const response = await fetch(`${AUTH0_URL}/api/v2/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.API_TOKEN}`
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          connection: "Username-Password-Authentication"
        })
      })
  
      const responseJson = await response.json();
      if (response.status === 201)
        return responseJson;

      const error = responseJson.message;

      if (error.indexOf('user already exists') !== -1)
        throw userAlreadyExist;
      
      if (error.indexOf('didn\'t pass validation for format email') !== -1)
        throw invalidEmailFormat;

      if (error.indexOf('PasswordStrengthError') !== -1)
        throw passwordTooWeak;

      throw error;
}

const loginAuth0 = async (username, password) => {
  const response = await fetch(`${AUTH0_URL}/oauth/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'password',
        username: username,
        password: password,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
      })
    })

  const responseJson = await response.json();
  if (response.status === 200) return responseJson;
  throw invalidLogin;
}

const checkJWT = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${AUTH0_URL}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  issuer: `${AUTH0_URL}`,
  algorithms: ['RS256']
});

export {
  createUserAuth0,
  loginAuth0,
  checkJWT,
}