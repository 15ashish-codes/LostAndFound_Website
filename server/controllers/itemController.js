// import asyncHandler from 'express-async-handler';
// import Item from '../models/Item.js';
// // import cloudinary from '../config/cloudinary.js';

// // // Helper: upload buffer to Cloudinary
// // const uploadToCloudinary = (buffer) =>
// //   new Promise((resolve, reject) => {
// //     cloudinary.uploader.upload_stream(
// //       { folder: 'smart-lost-found', transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }] },
// //       (error, result) => {
// //         if (error) reject(error);
// //         else resolve(result);
// //       }
// //     ).end(buffer);
// //   });

// import configureCloudinary from '../config/cloudinary.js';

// const uploadToCloudinary = (buffer) =>
//   new Promise((resolve, reject) => {
//     const cloudinary = configureCloudinary(); // ← configured at call time, not import time
//     cloudinary.uploader.upload_stream(
//       { folder: 'smart-lost-found', transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }] },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }
//     ).end(buffer);
//   });

// // @desc    Get all items with search/filter/pagination
// // @route   GET /api/items
// // @access  Public
// export const getItems = asyncHandler(async (req, res) => {
//   const {
//     type,
//     category,
//     location,
//     status = 'active',
//     search,
//     page = 1,
//     limit = 12,
//     sortBy = 'createdAt',
//     order = 'desc',
//     startDate,
//     endDate,
//   } = req.query;

//   const query = {};

//   if (type) query.type = type;
//   if (category) query.category = category;
//   if (status) query.status = status;

//   // Location partial match (case-insensitive)
//   if (location) query.location = { $regex: location, $options: 'i' };

//   // Text search across title, description
//   if (search) query.$text = { $search: search };

//   // Date range filter
//   if (startDate || endDate) {
//     query.date = {};
//     if (startDate) query.date.$gte = new Date(startDate);
//     if (endDate) query.date.$lte = new Date(endDate);
//   }

//   const skip = (Number(page) - 1) * Number(limit);
//   const sortOrder = order === 'desc' ? -1 : 1;

//   const [items, total] = await Promise.all([
//     Item.find(query)
//       .populate('userId', 'name email avatar')
//       .sort({ [sortBy]: sortOrder })
//       .skip(skip)
//       .limit(Number(limit)),
//     Item.countDocuments(query),
//   ]);

//   res.json({
//     success: true,
//     data: items,
//     pagination: {
//       currentPage: Number(page),
//       totalPages: Math.ceil(total / Number(limit)),
//       totalItems: total,
//       hasNextPage: skip + items.length < total,
//       hasPrevPage: Number(page) > 1,
//     },
//   });
// });

// // @desc    Get single item
// // @route   GET /api/items/:id
// // @access  Public
// export const getItemById = asyncHandler(async (req, res) => {
//   const item = await Item.findById(req.params.id).populate(
//     'userId',
//     'name email avatar phone createdAt'
//   );

//   if (!item || item.status === 'deleted') {
//     res.status(404);
//     throw new Error('Item not found');
//   }

//   res.json({ success: true, data: item });
// });

// // @desc    Create item
// // @route   POST /api/items
// // @access  Private
// export const createItem = asyncHandler(async (req, res) => {
//   console.log('req.file:', req.file);
//   console.log('req.body keys:', Object.keys(req.body));
//   console.log('Content-Type:', req.headers['content-type']);
//   const { title, description, category, type, location, date, contactInfo, reward } = req.body;

//   // const imageData = {};
//   // if (req.file) {
//   //   imageData.url = req.file.path;
//   //   imageData.publicId = req.file.filename;
//   // }

//   const imageData = {};
//   if (req.file) {
//     try {
//       const result = await uploadToCloudinary(req.file.buffer);
//       console.log('✅ Cloudinary result:', result.secure_url); // ADD THIS
//       imageData.url = result.secure_url;
//       imageData.publicId = result.public_id;
//     } catch (err) {
//       console.log('❌ Cloudinary error:', err); // ADD THIS
//     }
//   }

//   const item = await Item.create({
//     title,
//     description,
//     category,
//     type,
//     image: imageData,
//     location,
//     date,
//     contactInfo,
//     reward,
//     userId: req.user._id,
//   });

//   res.status(201).json({
//     success: true,
//     message: `${type === 'lost' ? 'Lost' : 'Found'} item reported successfully`,
//     data: item,
//   });
// });

// // @desc    Update item
// // @route   PUT /api/items/:id
// // @access  Private (owner only)
// export const updateItem = asyncHandler(async (req, res) => {
//   const item = await Item.findById(req.params.id);

//   if (!item) {
//     res.status(404);
//     throw new Error('Item not found');
//   }

//   // Check ownership
//   if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//     res.status(403);
//     throw new Error('Not authorized to update this item');
//   }

//   // Update image if provided
//   if (req.file) {
//     // Delete old image from cloudinary
//     if (item.image?.publicId) {
//       await cloudinary.uploader.destroy(item.image.publicId);
//     }
//     item.image = { url: req.file.path, publicId: req.file.filename };
//   }

//   const updatableFields = ['title', 'description', 'category', 'location', 'date', 'contactInfo', 'reward', 'status'];
//   updatableFields.forEach((field) => {
//     if (req.body[field] !== undefined) item[field] = req.body[field];
//   });

//   const updatedItem = await item.save();

//   res.json({ success: true, message: 'Item updated', data: updatedItem });
// });

// // @desc    Delete item
// // @route   DELETE /api/items/:id
// // @access  Private (owner or admin)
// export const deleteItem = asyncHandler(async (req, res) => {
//   const item = await Item.findById(req.params.id);

//   if (!item) {
//     res.status(404);
//     throw new Error('Item not found');
//   }

//   if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//     res.status(403);
//     throw new Error('Not authorized to delete this item');
//   }

//   // Delete image from cloudinary
//   if (item.image?.publicId) {
//     await cloudinary.uploader.destroy(item.image.publicId);
//   }

//   // Soft delete
//   item.status = 'deleted';
//   await item.save();

//   res.json({ success: true, message: 'Item deleted successfully' });
// });

// // @desc    Get current user's items
// // @route   GET /api/items/my-items
// // @access  Private
// export const getMyItems = asyncHandler(async (req, res) => {
//   const items = await Item.find({ userId: req.user._id, status: { $ne: 'deleted' } })
//     .sort({ createdAt: -1 });

//   res.json({ success: true, data: items });
// });




import asyncHandler from 'express-async-handler';
import Item from '../models/Item.js';
import configureCloudinary from '../config/cloudinary.js';

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const cloudinary = configureCloudinary();
    cloudinary.uploader.upload_stream(
      { folder: 'smart-lost-found', transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }] },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });

export const getItems = asyncHandler(async (req, res) => {
  const { type, category, location, status = 'active', search, page = 1, limit = 12, sortBy = 'createdAt', order = 'desc', startDate, endDate } = req.query;
  const query = {};
  if (type) query.type = type;
  if (category) query.category = category;
  if (status) query.status = status;
  if (location) query.location = { $regex: location, $options: 'i' };
  if (search) query.$text = { $search: search };
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  const skip = (Number(page) - 1) * Number(limit);
  const sortOrder = order === 'desc' ? -1 : 1;
  const [items, total] = await Promise.all([
    Item.find(query).populate('userId', 'name email avatar').sort({ [sortBy]: sortOrder }).skip(skip).limit(Number(limit)),
    Item.countDocuments(query),
  ]);
  res.json({
    success: true, data: items,
    pagination: { currentPage: Number(page), totalPages: Math.ceil(total / Number(limit)), totalItems: total, hasNextPage: skip + items.length < total, hasPrevPage: Number(page) > 1 },
  });
});

export const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate('userId', 'name email avatar phone createdAt');
  if (!item || item.status === 'deleted') { res.status(404); throw new Error('Item not found'); }
  res.json({ success: true, data: item });
});

export const createItem = asyncHandler(async (req, res) => {
  const { title, description, category, type, location, date, contactInfo, reward } = req.body;

  const imageData = {};
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);
    imageData.url = result.secure_url;
    imageData.publicId = result.public_id;
  }

  const item = await Item.create({
    title, description, category, type, image: imageData,
    location, date, contactInfo, reward, userId: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: `${type === 'lost' ? 'Lost' : 'Found'} item reported successfully`,
    data: item,
  });
});

export const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) { res.status(404); throw new Error('Item not found'); }
  if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized to update this item');
  }

  if (req.file) {
    const cloudinary = configureCloudinary();
    if (item.image?.publicId) await cloudinary.uploader.destroy(item.image.publicId);
    const result = await uploadToCloudinary(req.file.buffer);
    item.image = { url: result.secure_url, publicId: result.public_id };
  }

  const updatableFields = ['title', 'description', 'category', 'location', 'date', 'contactInfo', 'reward', 'status'];
  updatableFields.forEach((field) => { if (req.body[field] !== undefined) item[field] = req.body[field]; });
  const updatedItem = await item.save();
  res.json({ success: true, message: 'Item updated', data: updatedItem });
});

export const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) { res.status(404); throw new Error('Item not found'); }
  if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized to delete this item');
  }
  if (item.image?.publicId) {
    const cloudinary = configureCloudinary();
    await cloudinary.uploader.destroy(item.image.publicId);
  }
  item.status = 'deleted';
  await item.save();
  res.json({ success: true, message: 'Item deleted successfully' });
});

export const getMyItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ userId: req.user._id, status: { $ne: 'deleted' } }).sort({ createdAt: -1 });
  res.json({ success: true, data: items });
});