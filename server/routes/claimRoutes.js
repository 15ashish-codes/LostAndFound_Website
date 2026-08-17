import express from 'express';
import {
  createClaim,
  getMyClaims,
  getItemClaims,
  updateClaimStatus,
} from '../controllers/claimController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createClaim);
router.get('/my-claims', protect, getMyClaims);
router.get('/item/:itemId', protect, getItemClaims);
router.put('/:id', protect, updateClaimStatus);

export default router;