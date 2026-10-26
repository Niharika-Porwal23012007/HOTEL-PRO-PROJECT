import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Hotel } from '../models/Hotel.js';
import { Booking } from '../models/Booking.js';
import { mockUsers, mockHotels } from '../config/mockData.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export class AdminController {
  static async getAnalytics(req, res, next) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return sendSuccess(res, 200, 'Analytics retrieved (in-memory mode)', {
          summary: {
            totalUsers: 38,
            totalHotels: 5,
            totalBookings: 24,
            totalRevenue: 284500,
            occupancyRate: '82%',
          },
          statusCounts: [{ _id: 'Confirmed', count: 18 }, { _id: 'Completed', count: 6 }],
          topHotels: [
            { name: 'The Grand Azure Resort & Spa', city: 'Goa', revenue: 142000, bookingsCount: 12 },
            { name: 'Royal Heritage Haveli', city: 'Jaipur', revenue: 86500, bookingsCount: 8 },
            { name: 'The Skyline Executive Marina', city: 'Mumbai', revenue: 56000, bookingsCount: 4 },
          ],
        });
      }

      const totalUsers = await User.countDocuments();
      const totalHotels = await Hotel.countDocuments();
      const totalBookings = await Booking.countDocuments();

      const confirmedBookings = await Booking.find({ status: { $in: ['Confirmed', 'Checked-in', 'Completed'] } });
      const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.priceBreakdown?.totalAmount || 0), 0);

      const statusCounts = await Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

      const topHotelsAgg = await Booking.aggregate([
        { $match: { status: { $in: ['Confirmed', 'Checked-in', 'Completed'] } } },
        { $group: { _id: '$hotelId', revenue: { $sum: '$priceBreakdown.totalAmount' }, bookingsCount: { $sum: 1 } } },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'hotels', localField: '_id', foreignField: '_id', as: 'hotel' } },
        { $unwind: '$hotel' },
        { $project: { name: '$hotel.name', city: '$hotel.city', revenue: 1, bookingsCount: 1 } },
      ]);

      return sendSuccess(res, 200, 'Analytics retrieved', {
        summary: {
          totalUsers,
          totalHotels,
          totalBookings,
          totalRevenue,
          occupancyRate: '78%',
        },
        statusCounts,
        topHotels: topHotelsAgg,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getUsers(req, res, next) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return sendSuccess(res, 200, 'Users retrieved (in-memory mode)', { users: mockUsers });
      }
      const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
      return sendSuccess(res, 200, 'Users retrieved', { users });
    } catch (err) {
      next(err);
    }
  }

  static async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (mongoose.connection.readyState !== 1) {
        return sendSuccess(res, 200, 'User updated successfully (in-memory mode)', {
          user: { _id: id, role },
        });
      }

      const user = await User.findById(id);
      if (!user) return sendError(res, 404, 'User not found');
      if (role) user.role = role;
      await user.save();

      return sendSuccess(res, 200, 'User updated successfully', { user });
    } catch (err) {
      next(err);
    }
  }
}
