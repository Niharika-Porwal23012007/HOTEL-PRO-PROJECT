import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
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
    roomTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoomType',
      required: true,
      index: true,
    },
    rooms: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
      default: 1,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    nights: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
    },
    guests: {
      adults: { type: Number, required: true, default: 2 },
      children: { type: Number, default: 0 },
    },
    guestDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      specialRequests: { type: String, default: '' },
    },
    priceBreakdown: {
      pricePerNight: { type: Number, required: true },
      nights: { type: Number, required: true },
      roomCount: { type: Number, required: true },
      subtotal: { type: Number, required: true },
      couponDiscount: { type: Number, default: 0 },
      taxPercent: { type: Number, default: 12 },
      taxAmount: { type: Number, required: true },
      totalAmount: { type: Number, required: true },
    },
    couponCode: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Checked-in', 'Completed', 'Cancelled', 'Expired'],
      default: 'Pending',
      index: true,
    },
    holdExpiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundStatus: {
      type: String,
      enum: ['none', 'pending', 'processed', 'failed'],
      default: 'none',
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index for lightning-fast date overlap queries
bookingSchema.index({ roomTypeId: 1, status: 1, checkIn: 1, checkOut: 1, holdExpiresAt: 1 });

export const Booking = mongoose.model('Booking', bookingSchema);
