import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/hotel/:hotelId', ReviewController.getHotelReviews);
router.post('/', protect, ReviewController.createReview);
router.post('/:id/reply', protect, authorize('staff', 'admin'), ReviewController.replyToReview);

export default router;
