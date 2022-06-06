import express from 'express';
import userRoutes from './routes/userRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { handleErrors } from './customErrors.js';

const api = express.Router();

api.use('/users', userRoutes);
api.use('/items', itemRoutes);
api.use('/orders', orderRoutes);

api.use((err, req, res, next) => {
  // console.log(err);
  handleErrors(err, res);
})

export default api;