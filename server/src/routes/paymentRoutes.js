import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/create-order', protect, PaymentController.createOrder);
router.post('/verify', protect, PaymentController.verifyPayment);
router.post('/webhook', PaymentController.webhook);

export default router;
