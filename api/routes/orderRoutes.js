import express from 'express';
import orderController from '../controllers/orderController.js';
import { invalidHttpMethod } from '../controllers/controllerHelpers.js';
import { checkJWT } from '../models/authorizationModel.js';

const orderRoutes = express.Router();

orderRoutes.get('/', checkJWT, orderController.get);
orderRoutes.post('/', checkJWT, orderController.post);
orderRoutes.all('/', invalidHttpMethod(['GET','POST']));

orderRoutes.get('/:orderId', checkJWT, orderController.getOrder);
orderRoutes.put('/:orderId', checkJWT, orderController.putOrder);
orderRoutes.patch('/:orderId', checkJWT, orderController.patchOrder);
orderRoutes.delete('/:orderId', checkJWT, orderController.deleteOrder);
orderRoutes.all('/:orderId', invalidHttpMethod(['GET', 'PUT', 'PATCH', 'DELETE']));

export default orderRoutes;