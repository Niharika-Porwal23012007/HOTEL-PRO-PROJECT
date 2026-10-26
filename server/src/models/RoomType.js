import mongoose from 'mongoose';

const roomTypeSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Room type name is required'],
      trim: true,
    },
    capacity: {
      adults: { type: Number, required: true, default: 2 },
      children: { type: Number, default: 1 },
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: 0,
    },
    totalRooms: {
      type: Number,
      required: [true, 'Total number of rooms is required'],
      min: 1,
    },
    amenities: {
      type: [String],
      default: ['Air Conditioning', 'Free WiFi', 'Flat-screen TV', 'Private Bathroom'],
    },
    images: {
      type: [String],
      default: [],
    },
    bedType: {
      type: String,
      default: 'King Bed',
    },
    roomSizeSqFt: {
      type: Number,
      default: 320,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const RoomType = mongoose.model('RoomType', roomTypeSchema);
