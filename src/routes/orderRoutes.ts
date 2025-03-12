import { Router } from 'express';
import { createOrder,  getAllOrders, getOrderById } from '../controllers/orderController';
import { validateOrder } from '../middlewares/orderValidations';

const router = Router();

// Category routes
router.post('/Create', validateOrder, createOrder); // Create category
router.get('/all', getAllOrders)
router.get('/getOrderById/:orderId', getOrderById); 
// router.delete('/:orderId', deleteOrderById)

export default router;