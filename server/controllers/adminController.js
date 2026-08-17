import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Item from '../models/Item.js';
import Claim from '../models/Claim.js';

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Admin
export const getAnalytics = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalItems,
    lostItems,
    foundItems,
    totalClaims,
    pendingClaims,
    resolvedItems,
    recentUsers,
    recentItems,
  ] = await Promise.all([
    User.countDocuments(),
    Item.countDocuments({ status: { $ne: 'deleted' } }),
    Item.countDocuments({ type: 'lost', status: { $ne: 'deleted' } }),
    Item.countDocuments({ type: 'found', status: { $ne: 'deleted' } }),
    Claim.countDocuments(),
    Claim.countDocuments({ status: 'pending' }),
    Item.countDocuments({ status: 'resolved' }),
    User.find().sort({ createdAt: -1 }).limit(5).select('-password'),
    Item.find({ status: { $ne: 'deleted' } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email'),
  ]);

  // Category breakdown
  const categoryStats = await Item.aggregate([
    { $match: { status: { $ne: 'deleted' } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalItems,
        lostItems,
        foundItems,
        totalClaims,
        pendingClaims,
        resolvedItems,
        successRate:
          totalItems > 0 ? Math.round((resolvedItems / totalItems) * 100) : 0,
      },
      categoryStats,
      recentUsers,
      recentItems,
    },
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: users,
    pagination: { currentPage: Number(page), totalPages: Math.ceil(total / Number(limit)), total },
  });
});

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
// @access  Admin
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot deactivate admin accounts');
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
    data: { isActive: user.isActive },
  });
});

// @desc    Delete item (admin)
// @route   DELETE /api/admin/items/:id
// @access  Admin
export const adminDeleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  item.status = 'deleted';
  await item.save();

  res.json({ success: true, message: 'Item removed by admin' });
});

// @desc    Get all claims (admin)
// @route   GET /api/admin/claims
// @access  Admin
export const getAllClaims = asyncHandler(async (req, res) => {
  const claims = await Claim.find()
    .populate('itemId', 'title type')
    .populate('claimantId', 'name email')
    .populate('ownerId', 'name email')
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ success: true, data: claims });
});