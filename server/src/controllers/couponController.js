import { Coupon } from '../models/Coupon.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export class CouponController {
  /**
   * Validate coupon code
   */
  static async validateCoupon(req, res, next) {
    try {
      const { code, amount } = req.body;
      if (!code) return sendError(res, 400, 'Coupon code is required');

      const coupon = await Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validTo: { $gte: new Date() },
      });

      if (!coupon) {
        return sendError(res, 404, 'Invalid or expired coupon code');
      }

      if (amount && amount < coupon.minBookingAmount) {
        return sendError(
          res,
          400,
          `Minimum booking amount of ₹${coupon.minBookingAmount} required for this coupon.`
        );
      }

      return sendSuccess(res, 200, 'Coupon applied successfully', { coupon });
    } catch (err) {
      next(err);
    }
  }

  /**
   * List all coupons (Admin)
   */
  static async getAllCoupons(req, res, next) {
    try {
      const coupons = await Coupon.find().sort({ createdAt: -1 });
      return sendSuccess(res, 200, 'Coupons list', { coupons });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Create coupon (Admin)
   */
  static async createCoupon(req, res, next) {
    try {
      const coupon = new Coupon(req.body);
      await coupon.save();
      return sendSuccess(res, 201, 'Coupon created', { coupon });
    } catch (err) {
      next(err);
    }
  }
}
