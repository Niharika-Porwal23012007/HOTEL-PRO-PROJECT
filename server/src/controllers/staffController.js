import mongoose from 'mongoose';
import { Booking } from '../models/Booking.js';
import { Hotel } from '../models/Hotel.js';
import { RoomType } from '../models/RoomType.js';
import { mockHotels, mockRoomTypes } from '../config/mockData.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export class StaffController {
  static async getMyHotels(req, res, next) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return sendSuccess(res, 200, 'Staff hotels (in-memory mode)', { hotels: mockHotels });
      }
      const query = req.user.role === 'admin' ? {} : { managerIds: req.user._id };
      const hotels = await Hotel.find(query);
      return sendSuccess(res, 200, 'Staff hotels', { hotels });
    } catch (err) {
      next(err);
    }
  }

  static async getHotelBookings(req, res, next) {
    try {
      if (mongoose.connection.readyState !== 1) {
        const sampleStaffBookings = [
          {
            _id: 'bkg_staff_1',
            reference: 'HP-2026-928103',
            hotelId: mockHotels[0],
            roomTypeId: mockRoomTypes[0],
            userId: { name: 'Aarav Sharma', email: 'guest@hotelpro.com' },
            guestDetails: { name: 'Aarav Sharma' },
            checkIn: new Date(),
            checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            nights: 2,
            priceBreakdown: { totalAmount: 12320 },
            status: 'Confirmed',
          },
          {
            _id: 'bkg_staff_2',
            reference: 'HP-2026-481920',
            hotelId: mockHotels[1],
            roomTypeId: mockRoomTypes[2],
            userId: { name: 'Pooja Mehta', email: 'pooja@example.com' },
            guestDetails: { name: 'Pooja Mehta' },
            checkIn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            checkOut: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            nights: 2,
            priceBreakdown: { totalAmount: 8736 },
            status: 'Checked-in',
          },
        ];
        return sendSuccess(res, 200, 'Hotel bookings retrieved (in-memory mode)', { bookings: sampleStaffBookings });
      }

      const { hotelId } = req.query;
      const filter = {};
      if (hotelId) filter.hotelId = hotelId;

      const bookings = await Booking.find(filter)
        .populate('hotelId', 'name city')
        .populate('roomTypeId', 'name')
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 });

      return sendSuccess(res, 200, 'Hotel bookings retrieved', { bookings });
    } catch (err) {
      next(err);
    }
  }

  static async updateBookingStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['Checked-in', 'Completed', 'Cancelled'].includes(status)) {
        return sendError(res, 400, 'Invalid status update for staff');
      }

      if (mongoose.connection.readyState !== 1 || id.startsWith('bkg_')) {
        return sendSuccess(res, 200, `Booking status updated to ${status} (in-memory mode)`, {
          booking: { _id: id, status },
        });
      }

      const booking = await Booking.findById(id);
      if (!booking) return sendError(res, 404, 'Booking not found');

      booking.status = status;
      await booking.save();

      return sendSuccess(res, 200, `Booking status updated to ${status}`, { booking });
    } catch (err) {
      next(err);
    }
  }

  static async addRoomType(req, res, next) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return sendSuccess(res, 201, 'Room type added (in-memory mode)', { roomType: req.body });
      }
      const roomType = new RoomType(req.body);
      await roomType.save();
      return sendSuccess(res, 201, 'Room type added successfully', { roomType });
    } catch (err) {
      next(err);
    }
  }
}
