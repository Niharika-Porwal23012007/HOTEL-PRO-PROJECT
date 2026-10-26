import { PaymentService } from '../services/paymentService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export class PaymentController {
  /**
   * Create Razorpay Order (PAY-01, PAY-02)
   */
  static async createOrder(req, res, next) {
    try {
      const { bookingId } = req.body;
      if (!bookingId) return sendError(res, 400, 'Booking ID is required');

      const orderData = await PaymentService.createOrder(bookingId);
      return sendSuccess(res, 200, 'Order created successfully', orderData);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Verify Payment Signature (PAY-03)
   */
  static async verifyPayment(req, res, next) {
    try {
      const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
      const result = await PaymentService.verifyPayment({
        bookingId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      return sendSuccess(res, 200, 'Payment verified successfully. Booking confirmed!', result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Razorpay Webhook (PAY-04)
   */
  static async webhook(req, res, next) {
    try {
      // Idempotent webhook handler
      return sendSuccess(res, 200, 'Webhook received');
    } catch (err) {
      next(err);
    }
  }
}
