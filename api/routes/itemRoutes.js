import express from 'express';
import itemController from '../controllers/itemController.js';
import { invalidHttpMethod } from '../controllers/controllerHelpers.js';

const itemRoutes = express.Router();

itemRoutes.get('/', itemController.get);
itemRoutes.post('/', itemController.post);
itemRoutes.all('/', invalidHttpMethod(['GET','POST']));

itemRoutes.get('/:itemId', itemController.getItem);
itemRoutes.put('/:itemId', itemController.putItem);
itemRoutes.patch('/:itemId', itemController.patchItem);
itemRoutes.delete('/:itemId', itemController.deleteItem);
itemRoutes.all('/:itemId', invalidHttpMethod(['GET', 'PUT', 'PATCH', 'DELETE']));

export default itemRoutes;