import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

wishlistSchema.index({ userId: 1, hotelId: 1 }, { unique: true });

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
