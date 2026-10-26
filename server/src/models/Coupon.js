import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
      default: 'percentage',
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      default: 2000,
    },
    minBookingAmount: {
      type: Number,
      default: 0,
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validTo: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 100,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model('Coupon', couponSchema);
