import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} from '../controllers/productController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);

// Admin routes
router.post('/',
  authenticate,
  requireAdmin,
  [
    body('sku').trim().notEmpty().withMessage('SKU is required'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
  ],
  createProduct
);

router.put('/:id',
  authenticate,
  requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
  ],
  updateProduct
);

router.delete('/:id',
  authenticate,
  requireAdmin,
  deleteProduct
);

export default router;

