import { Router } from 'express';
import { CouponController } from '../controllers/couponController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/validate', CouponController.validateCoupon);
router.get('/', protect, authorize('admin'), CouponController.getAllCoupons);
router.post('/', protect, authorize('admin'), CouponController.createCoupon);

export default router;
