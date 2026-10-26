import mongoose from 'mongoose';
import { Review } from '../models/Review.js';
import { Booking } from '../models/Booking.js';
import { Hotel } from '../models/Hotel.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export class ReviewController {
  static async getHotelReviews(req, res, next) {
    try {
      const { hotelId } = req.params;

      if (mongoose.connection.readyState !== 1) {
        const mockReviews = [
          {
            _id: 'rev_1',
            rating: 5,
            text: 'Breathtaking ocean views, spotless rooms, and wonderfully courteous front desk staff. The private beach access was unforgettable!',
            userId: { name: 'Aarav Sharma' },
            createdAt: new Date(),
          },
          {
            _id: 'rev_2',
            rating: 5,
            text: 'Exquisite heritage property with royal hospitality. The breakfast spread and evening cultural performance were extraordinary.',
            userId: { name: 'Meera Patel' },
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
        ];
        return sendSuccess(res, 200, 'Reviews retrieved (in-memory mode)', { reviews: mockReviews });
      }

      const reviews = await Review.find({ hotelId, status: 'approved' })
        .populate('userId', 'name avatarUrl')
        .sort({ createdAt: -1 });

      return sendSuccess(res, 200, 'Reviews retrieved', { reviews });
    } catch (err) {
      next(err);
    }
  }

  static async createReview(req, res, next) {
    try {
      const { hotelId, bookingId, rating, text, title } = req.body;

      if (mongoose.connection.readyState !== 1) {
        return sendSuccess(res, 201, 'Review submitted successfully (in-memory mode)', {
          review: { _id: `rev_${Date.now()}`, rating, text, title },
        });
      }

      const booking = await Booking.findOne({ _id: bookingId, userId: req.user._id, hotelId });
      if (!booking) return sendError(res, 400, 'No matching booking found for this hotel.');

      const existing = await Review.findOne({ bookingId });
      if (existing) return sendError(res, 400, 'You have already submitted a review for this booking.');

      const ratingNum = Number(rating);
      const sentiment = ratingNum >= 4 ? 'positive' : ratingNum === 3 ? 'neutral' : 'negative';

      const review = new Review({
        userId: req.user._id,
        hotelId,
        bookingId,
        rating: ratingNum,
        title: title || '',
        text,
        sentiment,
      });
      await review.save();

      const allHotelReviews = await Review.find({ hotelId, status: 'approved' });
      const avg = allHotelReviews.reduce((sum, r) => sum + r.rating, 0) / allHotelReviews.length;

      await Hotel.findByIdAndUpdate(hotelId, {
        avgRating: Math.round(avg * 10) / 10,
        reviewCount: allHotelReviews.length,
      });

      return sendSuccess(res, 201, 'Review submitted successfully', { review });
    } catch (err) {
      next(err);
    }
  }

  static async replyToReview(req, res, next) {
    try {
      const { id } = req.params;
      const { replyText } = req.body;

      if (mongoose.connection.readyState !== 1) {
        return sendSuccess(res, 200, 'Reply posted successfully (in-memory mode)', {
          review: { _id: id, managerReply: { text: replyText, repliedAt: new Date() } },
        });
      }

      const review = await Review.findById(id);
      if (!review) return sendError(res, 404, 'Review not found');

      review.managerReply = { text: replyText, repliedAt: new Date() };
      await review.save();

      return sendSuccess(res, 200, 'Reply posted successfully', { review });
    } catch (err) {
      next(err);
    }
  }
}
