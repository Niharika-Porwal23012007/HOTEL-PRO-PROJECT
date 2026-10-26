import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
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
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    text: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      minlength: 10,
    },
    photos: {
      type: [String],
      default: [],
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'positive',
    },
    managerReply: {
      text: { type: String, default: null },
      repliedAt: { type: Date, default: null },
    },
    status: {
      type: String,
      enum: ['approved', 'hidden', 'flagged'],
      default: 'approved',
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model('Review', reviewSchema);
