import express from 'express';
import {
  getDailyRevenue,
  getTopCustomers,
  getCategoryWiseSales,
  getAllReports
} from '../controllers/reportController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All report routes require authentication
router.use(authenticate);

router.get('/', getAllReports);
router.get('/daily-revenue', getDailyRevenue);
router.get('/top-customers', getTopCustomers);
router.get('/category-sales', getCategoryWiseSales);

export default router;

