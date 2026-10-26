import { Router } from 'express';
import { StaffController } from '../controllers/staffController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect, authorize('staff', 'admin'));

router.get('/hotels', StaffController.getMyHotels);
router.get('/bookings', StaffController.getHotelBookings);
router.patch('/bookings/:id/status', StaffController.updateBookingStatus);
router.post('/rooms', StaffController.addRoomType);

export default router;
