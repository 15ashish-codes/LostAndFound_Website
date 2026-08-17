import express from 'express';
import {
  getAnalytics,
  getAllUsers,
  toggleUserStatus,
  adminDeleteItem,
  getAllClaims,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.delete('/items/:id', adminDeleteItem);
router.get('/claims', getAllClaims);

export default router;