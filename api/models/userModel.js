import * as database from './modelHelpers.js';
import fetch from 'node-fetch';

const userModel = {
  login: async (username, password) => {
    const authRes = await fetch(
      'https://pick-me-up.us.auth0.com/oauth/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "grant_type": "password",
          "username": username,
          "password": password,
          "client_id": process.env.CLIENT_ID,
          "client_secret": process.env.CLIENT_SECRET
        })
      })

    const authResJson = await authRes.json();
    if (authRes.status === 200)
      return authResJson;
  }
}

export default userModel;