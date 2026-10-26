import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    phone: z.string().optional(),
    role: z.enum(['guest', 'staff', 'admin']).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
  }),
});

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);
router.post('/logout-all', protect, AuthController.logoutAll);
router.get('/me', protect, AuthController.getMe);
router.put('/profile', protect, AuthController.updateProfile);
router.get('/sessions', protect, AuthController.getSessions);
router.post('/forgot-password', AuthController.forgotPassword);

export default router;
