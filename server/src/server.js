import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { Booking } from './models/Booking.js';
import { autoSeedData } from './seeds/autoSeed.js';

import authRoutes from './routes/authRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB();

// Security and standard middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

const getAllowedOrigins = () => {
  const envUrl = process.env.CLIENT_URL;
  if (!envUrl) return ['http://localhost:5173', 'http://127.0.0.1:5173'];
  const origins = envUrl.split(',').map((u) => u.trim().replace(/\/$/, ''));
  return origins.length === 1 ? origins[0] : origins;
};

app.use(
  cors({
    origin: getAllowedOrigins(),
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Background Task: Auto-expire holds older than 10 mins (BR-03)
setInterval(async () => {
  try {
    const now = new Date();
    await Booking.updateMany(
      { status: 'Pending', holdExpiresAt: { $lt: now } },
      { $set: { status: 'Expired' } }
    );
  } catch (err) {
    // Non-critical background worker catch
  }
}, 60 * 1000);

// Base Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'HotelPro API',
  });
});

// Database Seed Endpoint (accessible via browser or webhook to seed/reseed MongoDB Atlas)
app.all('/api/seed', async (req, res) => {
  try {
    const result = await autoSeedData(true);
    res.status(200).json({
      success: true,
      message: 'HotelPro database seeded successfully with 5 hotels, rooms, coupons and demo accounts!',
      result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: err.message,
    });
  }
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 HotelPro Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    console.log(`🔗 Health check available at: http://localhost:${PORT}/api/health`);
  });
}

export default app;
