import mongoose from 'mongoose';
import { Booking } from '../models/Booking.js';
import { BookingService } from '../services/bookingService.js';
import { PaymentService } from '../services/paymentService.js';
import { mockHotels, mockRoomTypes } from '../config/mockData.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export class BookingController {
  static async calculatePrice(req, res, next) {
    try {
      const { roomTypeId, rooms, checkIn, checkOut, couponCode } = req.body;
      let priceBreakdown;

      if (mongoose.connection.readyState !== 1) {
        const room = mockRoomTypes.find((r) => r._id === roomTypeId) || mockRoomTypes[0];
        const nights = BookingService.calculateNights(checkIn, checkOut) || 1;
        const subtotal = room.pricePerNight * nights * (Number(rooms) || 1);
        const discount = couponCode ? 500 : 0;
        const discounted = Math.max(0, subtotal - discount);
        const taxAmount = Math.round((discounted * 12) / 100);
        priceBreakdown = {
          pricePerNight: room.pricePerNight,
          nights,
          roomCount: Number(rooms) || 1,
          subtotal,
          couponDiscount: discount,
          taxPercent: 12,
          taxAmount,
          totalAmount: discounted + taxAmount,
        };
      } else {
        priceBreakdown = await BookingService.calculatePrice({
          roomTypeId,
          rooms: Number(rooms) || 1,
          checkIn,
          checkOut,
          couponCode,
        });
      }

      return sendSuccess(res, 200, 'Price calculated', { priceBreakdown });
    } catch (err) {
      next(err);
    }
  }

  static async createHold(req, res, next) {
    try {
      const {
        hotelId,
        roomTypeId,
        rooms = 1,
        checkIn,
        checkOut,
        guests,
        guestDetails,
        couponCode,
      } = req.body;

      if (mongoose.connection.readyState !== 1) {
        const hotel = mockHotels.find((h) => h._id === hotelId) || mockHotels[0];
        const room = mockRoomTypes.find((r) => r._id === roomTypeId) || mockRoomTypes[0];
        const nights = BookingService.calculateNights(checkIn, checkOut) || 1;
        const subtotal = room.pricePerNight * nights * Number(rooms);
        const discount = couponCode ? 500 : 0;
        const discounted = Math.max(0, subtotal - discount);
        const taxAmount = Math.round((discounted * 12) / 100);
        const totalAmount = discounted + taxAmount;

        const simulatedBooking = {
          _id: `bkg_${Date.now()}`,
          reference: BookingService.generateReference(),
          userId: req.user?._id || 'user_demo',
          hotelId: hotel,
          roomTypeId: room,
          rooms: Number(rooms),
          checkIn,
          checkOut,
          nights,
          guests: guests || { adults: 2, children: 0 },
          guestDetails: guestDetails || { name: 'Aarav Sharma', email: 'guest@hotelpro.com', phone: '+91 9876543210' },
          priceBreakdown: {
            pricePerNight: room.pricePerNight,
            nights,
            roomCount: Number(rooms),
            subtotal,
            couponDiscount: discount,
            taxPercent: 12,
            taxAmount,
            totalAmount,
          },
          couponCode,
          status: 'Pending',
          holdExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        };

        return sendSuccess(res, 201, 'Room reserved for 10 minutes (in-memory mode)', {
          booking: simulatedBooking,
          holdExpiresAt: simulatedBooking.holdExpiresAt,
        });
      }

      const booking = await BookingService.createHoldBooking({
        userId: req.user._id,
        hotelId,
        roomTypeId,
        rooms: Number(rooms) || 1,
        checkIn,
        checkOut,
        guests,
        guestDetails,
        couponCode,
      });

      return sendSuccess(res, 201, 'Room reserved for 10 minutes', {
        booking,
        holdExpiresAt: booking.holdExpiresAt,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMyBookings(req, res, next) {
    try {
      if (mongoose.connection.readyState !== 1) {
        const sampleBookings = [
          {
            _id: 'bkg_sample_1',
            reference: 'HP-2026-849102',
            hotelId: mockHotels[0],
            roomTypeId: mockRoomTypes[0],
            checkIn: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            nights: 2,
            rooms: 1,
            priceBreakdown: { totalAmount: 12320 },
            status: 'Confirmed',
          },
          {
            _id: 'bkg_sample_2',
            reference: 'HP-2026-102948',
            hotelId: mockHotels[1],
            roomTypeId: mockRoomTypes[2],
            checkIn: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            checkOut: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
            nights: 2,
            rooms: 1,
            priceBreakdown: { totalAmount: 8736 },
            status: 'Completed',
          },
        ];

        return sendSuccess(res, 200, 'Bookings retrieved (in-memory mode)', {
          all: sampleBookings,
          upcoming: [sampleBookings[0]],
          past: [sampleBookings[1]],
          cancelled: [],
        });
      }

      const bookings = await Booking.find({ userId: req.user._id })
        .populate('hotelId', 'name city area images address starRating')
        .populate('roomTypeId', 'name bedType amenities')
        .sort({ createdAt: -1 });

      const now = new Date();
      const upcoming = [];
      const past = [];
      const cancelled = [];

      bookings.forEach((b) => {
        if (b.status === 'Cancelled' || b.status === 'Expired') {
          cancelled.push(b);
        } else if (new Date(b.checkOut) < now || b.status === 'Completed') {
          past.push(b);
        } else {
          upcoming.push(b);
        }
      });

      return sendSuccess(res, 200, 'Bookings retrieved', {
        all: bookings,
        upcoming,
        past,
        cancelled,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getBookingById(req, res, next) {
    try {
      const { id } = req.params;

      if (mongoose.connection.readyState !== 1 || id.startsWith('bkg_')) {
        const hotel = mockHotels[0];
        const room = mockRoomTypes[0];
        const mockBooking = {
          _id: id,
          reference: 'HP-2026-782194',
          userId: req.user?._id || 'user_demo',
          hotelId: hotel,
          roomTypeId: room,
          rooms: 1,
          checkIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          checkOut: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          nights: 2,
          guests: { adults: 2, children: 0 },
          guestDetails: { name: 'Aarav Sharma', email: 'guest@hotelpro.com', phone: '+91 9876543210' },
          priceBreakdown: {
            pricePerNight: room.pricePerNight,
            nights: 2,
            roomCount: 1,
            subtotal: room.pricePerNight * 2,
            couponDiscount: 0,
            taxPercent: 12,
            taxAmount: Math.round((room.pricePerNight * 2 * 12) / 100),
            totalAmount: Math.round(room.pricePerNight * 2 * 1.12),
          },
          status: 'Confirmed',
          holdExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        };
        return sendSuccess(res, 200, 'Booking details (in-memory mode)', { booking: mockBooking });
      }

      const booking = await Booking.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { reference: id }],
      })
        .populate('hotelId')
        .populate('roomTypeId')
        .populate('paymentId');

      if (!booking) return sendError(res, 404, 'Booking not found');

      return sendSuccess(res, 200, 'Booking details', { booking });
    } catch (err) {
      next(err);
    }
  }

  static async cancelBooking(req, res, next) {
    try {
      const { id } = req.params;

      if (mongoose.connection.readyState !== 1 || id.startsWith('bkg_')) {
        return sendSuccess(res, 200, 'Booking cancelled successfully (in-memory mode)', {
          booking: { _id: id, status: 'Cancelled' },
          refundPercentage: 100,
          refundAmount: 12320,
        });
      }

      const booking = await Booking.findById(id);
      if (!booking) return sendError(res, 404, 'Booking not found');

      const { refundPercentage, refundAmount } = BookingService.calculateRefund(booking);

      booking.status = 'Cancelled';
      booking.cancelledAt = new Date();
      booking.refundAmount = refundAmount;
      booking.refundStatus = refundAmount > 0 ? 'processed' : 'none';

      if (refundAmount > 0 && booking.paymentId) {
        await PaymentService.processRefund(booking, refundAmount);
      }

      await booking.save();

      return sendSuccess(res, 200, 'Booking cancelled successfully', {
        booking,
        refundPercentage,
        refundAmount,
      });
    } catch (err) {
      next(err);
    }
  }
}
