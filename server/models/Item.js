import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Electronics',
        'Clothing',
        'Jewelry',
        'Documents',
        'Keys',
        'Wallet/Purse',
        'Bag/Backpack',
        'Pet',
        'Vehicle',
        'Other',
      ],
    },
    type: {
      type: String,
      required: true,
      enum: ['lost', 'found'],
    },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'claimed', 'resolved', 'deleted'],
      default: 'active',
    },
    contactInfo: {
      type: String,
      default: '',
    },
    reward: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Indexes for search performance
itemSchema.index({ title: 'text', description: 'text', location: 'text' });
itemSchema.index({ type: 1, status: 1, category: 1 });
itemSchema.index({ userId: 1 });

export default mongoose.model('Item', itemSchema);