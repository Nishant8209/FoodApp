import { Router } from 'express';
import {
  createCategories,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from '../controllers/categoryController';
import { validateCategory } from '../middlewares/CategoryValidation';


const router = Router();

// Category routes
router.post('/', validateCategory, createCategories); // Create category
router.get('/', getAllCategories); // Get all categories
router.get('/:id', getCategoryById); // Get a category by ID
router.put('/:id', updateCategory); // Update category
router.delete('/:id', deleteCategory); // Delete category

export default router;