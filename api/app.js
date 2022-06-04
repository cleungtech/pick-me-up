import express from 'express';
import userRoutes from './routes/userRoutes.js';
import { 
  serverError, 
  invalidLogin,
  notAcceptable,
  missingRequiredProperty,
  userAlreadyExist,
  invalidEmailFormat,
  passwordTooWeak,
} from './customErrors.js';

const api = express.Router();

api.use('/users', userRoutes);

api.use((err, req, res, next) => {
  switch (err) {
    case missingRequiredProperty:
    case userAlreadyExist:
    case invalidEmailFormat:
    case passwordTooWeak:
      res.status(400);
      break;
    case invalidLogin:
      res.status(403);
      break;
    case notAcceptable:
      res.status(406);
      break;
    default:
      res.status(500);
      res.set('Content-Type', 'application/json');
      res.json({ Error: serverError.message });
      return;
  }
  res.set('Content-Type', 'application/json');
  res.json({ Error: err.message });
})

export default api;