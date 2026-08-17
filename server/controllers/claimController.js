import asyncHandler from 'express-async-handler';
import Claim from '../models/Claim.js';
import Item from '../models/Item.js';

// @desc    Create claim request
// @route   POST /api/claims
// @access  Private
export const createClaim = asyncHandler(async (req, res) => {
  const { itemId, message, proofDescription } = req.body;

  const item = await Item.findById(itemId);
  if (!item || item.status !== 'active') {
    res.status(404);
    throw new Error('Item not found or no longer available');
  }

  // Cannot claim own item
  if (item.userId.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot claim your own item');
  }

  // Check for existing claim
  const existingClaim = await Claim.findOne({ itemId, claimantId: req.user._id });
  if (existingClaim) {
    res.status(400);
    throw new Error('You have already submitted a claim for this item');
  }

  const claim = await Claim.create({
    itemId,
    claimantId: req.user._id,
    ownerId: item.userId,
    message,
    proofDescription,
  });

  res.status(201).json({
    success: true,
    message: 'Claim submitted successfully',
    data: claim,
  });
});

// @desc    Get claims for user (as claimant or owner)
// @route   GET /api/claims/my-claims
// @access  Private
export const getMyClaims = asyncHandler(async (req, res) => {
  const { role = 'claimant' } = req.query;

  const filter =
    role === 'owner'
      ? { ownerId: req.user._id }
      : { claimantId: req.user._id };

  const claims = await Claim.find(filter)
    .populate('itemId', 'title type image category location')
    .populate('claimantId', 'name email avatar')
    .populate('ownerId', 'name email avatar')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: claims });
});

// @desc    Get claims for a specific item
// @route   GET /api/claims/item/:itemId
// @access  Private (owner only)
export const getItemClaims = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const claims = await Claim.find({ itemId: req.params.itemId })
    .populate('claimantId', 'name email avatar phone')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: claims });
});

// @desc    Update claim status (approve/reject)
// @route   PUT /api/claims/:id
// @access  Private (item owner or admin)
export const updateClaimStatus = asyncHandler(async (req, res) => {
  const { status, responseMessage } = req.body;

  const claim = await Claim.findById(req.params.id).populate('itemId');

  if (!claim) {
    res.status(404);
    throw new Error('Claim not found');
  }

  // Check if current user is item owner or admin
  if (
    claim.ownerId.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to update this claim');
  }

  claim.status = status;
  claim.responseMessage = responseMessage || '';

  // If approved, update item status
  if (status === 'approved') {
    await Item.findByIdAndUpdate(claim.itemId._id, { status: 'claimed' });
  }

  await claim.save();

  res.json({ success: true, message: `Claim ${status}`, data: claim });
});