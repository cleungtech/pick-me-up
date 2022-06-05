import express from 'express';
import userController from '../controllers/userController.js';
import { invalidHttpMethod } from '../controllers/controllerHelpers.js';
import { checkJWT } from '../models/authorizationModel.js';
const userRoutes = express.Router();

userRoutes.get('/', userController.get);
userRoutes.post('/', userController.post);
userRoutes.all('/', invalidHttpMethod(['GET','POST']));

userRoutes.post('/login', userController.login);
userRoutes.all('/login', invalidHttpMethod(['POST']));

userRoutes.get('/:userId', checkJWT, userController.getUser);
userRoutes.all('/:userId', invalidHttpMethod(['GET']));

export default userRoutes;