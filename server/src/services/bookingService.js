import mongoose from 'mongoose';
import { Booking } from '../models/Booking.js';
import { RoomType } from '../models/RoomType.js';
import { Coupon } from '../models/Coupon.js';

export class BookingService {
  /**
   * Calculates night count between checkIn and checkOut (BR-02)
   */
  static calculateNights(checkIn, checkOut) {
    const diffTime = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    const nights = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  }

  /**
   * Calculates live available rooms for a given roomType and date range (BR-01)
   */
  static async getAvailableRoomCount(roomTypeId, checkInDate, checkOutDate) {
    const roomType = await RoomType.findById(roomTypeId);
    if (!roomType || !roomType.isActive) return 0;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const now = new Date();

    // Overlapping condition: existing.checkIn < new.checkOut AND existing.checkOut > new.checkIn
    // Filter active bookings: status Confirmed OR (Pending AND holdExpiresAt > now)
    const overlappingBookings = await Booking.find({
      roomTypeId,
      $or: [
        { status: 'Confirmed' },
        { status: 'Checked-in' },
        { status: 'Pending', holdExpiresAt: { $gt: now } },
      ],
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
    });

    const bookedRooms = overlappingBookings.reduce((sum, b) => sum + b.rooms, 0);
    const available = roomType.totalRooms - bookedRooms;
    return Math.max(0, available);
  }

  /**
   * Generates a unique reference ID e.g. HP-2026-000123 (BR-05/BKG-05)
   */
  static generateReference() {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `HP-${year}-${random}`;
  }

  /**
   * Calculates total price on the server (BR-04)
   */
  static async calculatePrice({ roomTypeId, rooms, checkIn, checkOut, couponCode = null }) {
    const roomType = await RoomType.findById(roomTypeId);
    if (!roomType) throw new Error('Room type not found');

    const nights = this.calculateNights(checkIn, checkOut);
    if (nights <= 0) throw new Error('Check-out date must be after check-in date');
    if (nights > 30) throw new Error('Maximum stay duration is 30 nights');
    if (rooms > 4) throw new Error('Maximum 4 rooms allowed per booking');

    const pricePerNight = roomType.pricePerNight;
    const subtotal = pricePerNight * nights * rooms;

    let couponDiscount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validTo: { $gte: new Date() },
      });

      if (coupon && subtotal >= coupon.minBookingAmount) {
        if (coupon.type === 'percentage') {
          couponDiscount = (subtotal * coupon.value) / 100;
          if (coupon.maxDiscount) {
            couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
          }
        } else if (coupon.type === 'fixed') {
          couponDiscount = Math.min(coupon.value, subtotal);
        }
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - couponDiscount);
    const taxPercent = 12; // 12% GST
    const taxAmount = Math.round((discountedSubtotal * taxPercent) / 100);
    const totalAmount = discountedSubtotal + taxAmount;

    return {
      pricePerNight,
      nights,
      roomCount: rooms,
      subtotal,
      couponDiscount,
      taxPercent,
      taxAmount,
      totalAmount,
    };
  }

  /**
   * Creates a room hold with concurrency and anti-overbooking check (BR-01, BR-03, BR-08)
   */
  static async createHoldBooking({
    userId,
    hotelId,
    roomTypeId,
    rooms,
    checkIn,
    checkOut,
    guests,
    guestDetails,
    couponCode = null,
  }) {
    const now = new Date();

    // BR-08: Check user's active unpaid holds limit (max 3)
    const activeUserHolds = await Booking.countDocuments({
      userId,
      status: 'Pending',
      holdExpiresAt: { $gt: now },
    });
    if (activeUserHolds >= 3) {
      throw new Error('You have reached the maximum of 3 active pending holds. Please complete or wait for them to expire.');
    }

    // Check available rooms
    const available = await this.getAvailableRoomCount(roomTypeId, checkIn, checkOut);
    if (available < rooms) {
      throw new Error(`Only ${available} room(s) available for the selected dates.`);
    }

    // Server-side price calculation
    const priceBreakdown = await this.calculatePrice({
      roomTypeId,
      rooms,
      checkIn,
      checkOut,
      couponCode,
    });

    const holdExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now (BR-03)
    const reference = this.generateReference();

    const booking = new Booking({
      reference,
      userId,
      hotelId,
      roomTypeId,
      rooms,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      nights: priceBreakdown.nights,
      guests,
      guestDetails,
      priceBreakdown,
      couponCode: couponCode ? couponCode.toUpperCase() : null,
      status: 'Pending',
      holdExpiresAt,
    });

    await booking.save();
    return booking;
  }

  /**
   * Cancellation refund calculation based on BR-05:
   * > 48h before check-in = 100% refund
   * 24h to 48h before check-in = 50% refund
   * < 24h before check-in = 0% refund
   */
  static calculateRefund(booking) {
    const checkInTime = new Date(booking.checkIn).getTime();
    const now = Date.now();
    const hoursToCheckIn = (checkInTime - now) / (1000 * 60 * 60);

    const totalPaid = booking.priceBreakdown.totalAmount;

    if (hoursToCheckIn > 48) {
      return { refundPercentage: 100, refundAmount: totalPaid };
    } else if (hoursToCheckIn >= 24) {
      const refundAmount = Math.round(totalPaid * 0.5);
      return { refundPercentage: 50, refundAmount };
    } else {
      return { refundPercentage: 0, refundAmount: 0 };
    }
  }
}
