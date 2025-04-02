import { Router } from 'express';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import orderRoutes from './orderRoutes'
import paymentRoutes from './paymentRoutes'
const router = Router();

// Define user Routes
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/order', orderRoutes);
router.use('/paypal', paymentRoutes);

export default router; 