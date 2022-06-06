import express from 'express';
import fetch from 'node-fetch';
import { API_URL } from '../api/constants.js';
const web = express.Router();

web.get('/', (req, res, next) => {
  res.render('index');
})

web.post('/', async (req, res, next) => {

  const { name, email, password } = req.body;
  const apiRes = await fetch(`${API_URL}users`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      })
    }
  )
  const apiResData = await apiRes.json()
  if (apiRes.status === 201) {
    res.render('user', apiResData);

  } else {
    res.render('index', {
      errorMessage: apiResData.Error
    });
  }
})

web.get('/login', (req, res, next) => {
  res.render('login');
})

web.post('/login', async (req, res, next) => {

  const { email, password } = req.body;
  const apiRes = await fetch(`${API_URL}users/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password,
      })
    }
  )
  const apiResData = await apiRes.json()
  if (apiRes.status === 200) {
    res.render('token', apiResData);

  } else {
    res.render('login', {
      errorMessage: apiResData.Error
    });
  }
})

web.all('*', (req, res) => {
  res.render('error', {
    code: 404,
    status: 'Not Found'
  });
});

web.use((err, req, res, next) => {
  console.log(err);
  next(err);
})

export default web;