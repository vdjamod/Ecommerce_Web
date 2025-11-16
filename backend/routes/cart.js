import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;

