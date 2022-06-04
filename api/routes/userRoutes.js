import express from 'express';
import userController from '../controllers/userController.js'
const userRoutes = express.Router();

userRoutes.get('/', userController.get);
userRoutes.post('/', userController.post);

export default userRoutes;