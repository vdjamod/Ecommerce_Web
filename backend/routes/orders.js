import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);

export default router;

