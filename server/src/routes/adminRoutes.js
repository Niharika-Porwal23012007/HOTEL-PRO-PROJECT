import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/analytics', AdminController.getAnalytics);
router.get('/users', AdminController.getUsers);
router.patch('/users/:id', AdminController.updateUserRole);

export default router;
