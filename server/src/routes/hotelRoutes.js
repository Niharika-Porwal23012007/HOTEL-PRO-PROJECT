import { Router } from 'express';
import { HotelController } from '../controllers/hotelController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', HotelController.getHotels);
router.get('/featured', HotelController.getFeatured);
router.get('/:id', HotelController.getHotelById);

// Staff and Admin routes
router.post('/', protect, authorize('staff', 'admin'), HotelController.createHotel);
router.put('/:id', protect, authorize('staff', 'admin'), HotelController.updateHotel);

export default router;
