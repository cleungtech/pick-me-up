import express from 'express';
import orderController from '../controllers/orderController.js';
import { invalidHttpMethod } from '../controllers/controllerHelpers.js';
import { checkJWT } from '../models/authorizationModel.js';

const orderRoutes = express.Router();

// orderRoutes.get('/', orderController.get);
orderRoutes.post('/', checkJWT, orderController.post);
// orderRoutes.all('/', invalidHttpMethod(['GET','POST']));

// orderRoutes.get('/:orderId', orderController.getItem);
// orderRoutes.put('/:orderId', orderController.putItem);
// orderRoutes.patch('/:orderId', orderController.patchItem);
// orderRoutes.delete('/:orderId', orderController.deleteItem);
// orderRoutes.all('/:orderId', invalidHttpMethod(['GET', 'PUT', 'PATCH', 'DELETE']));

export default orderRoutes;