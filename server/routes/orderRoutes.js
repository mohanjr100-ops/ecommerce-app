import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// User order actions
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);

// Admin order actions
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

// Single order retrieval (user or admin)
router.get('/:id', protect, getOrderById);

export default router;
