import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
      index: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    area: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    starRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4,
      index: true,
    },
    avgRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
      index: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    amenities: {
      type: [String],
      default: ['Free WiFi', 'Air Conditioning', 'Room Service'],
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    policies: {
      checkInTime: { type: String, default: '12:00 PM' },
      checkOutTime: { type: String, default: '11:00 AM' },
      cancellation: {
        type: String,
        default: 'Free cancellation up to 48 hours before check-in. 50% refund between 24-48 hours.',
      },
      petsAllowed: { type: Boolean, default: false },
      idRequired: { type: String, default: 'Government-issued photo ID required' },
    },
    propertyType: {
      type: String,
      enum: ['hotel', 'resort', 'villa', 'apartment'],
      default: 'hotel',
    },
    managerIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['active', 'pending_approval', 'disabled'],
      default: 'active',
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Hotel = mongoose.model('Hotel', hotelSchema);
