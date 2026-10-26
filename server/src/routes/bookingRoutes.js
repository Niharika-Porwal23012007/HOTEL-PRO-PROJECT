import { Router } from 'express';
import { BookingController } from '../controllers/bookingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/calculate-price', BookingController.calculatePrice);
router.post('/hold', protect, BookingController.createHold);
router.get('/mine', protect, BookingController.getMyBookings);
router.get('/:id', protect, BookingController.getBookingById);
router.patch('/:id/cancel', protect, BookingController.cancelBooking);

export default router;
