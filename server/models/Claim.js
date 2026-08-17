import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    claimantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Claim message is required'],
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    // Proof of ownership details
    proofDescription: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    // Admin or owner response
    responseMessage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Prevent duplicate claims on same item by same user
claimSchema.index({ itemId: 1, claimantId: 1 }, { unique: true });

export default mongoose.model('Claim', claimSchema);