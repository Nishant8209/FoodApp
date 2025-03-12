import { Router } from 'express';
import { createProducts, deleteProduct, getAllProducts, getProductsByCategory, updateProduct } from '../controllers/productsController';

const router = Router();
// Routes
router.get('/', getAllProducts);
router.post('/',createProducts);
router.delete('/:id',deleteProduct);
router.put('/:id',updateProduct);
router.get('/:id',getProductsByCategory)
export default router;