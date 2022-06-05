import express from 'express';
import userRoutes from './routes/userRoutes.js';
import { handleErrors } from './customErrors.js';

const api = express.Router();

api.use('/users', userRoutes);

api.use((err, req, res, next) => {
  handleErrors(err, res);
})

export default api;