import mongoose from 'mongoose';
import { autoSeedData } from '../seeds/autoSeed.js';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hotelpro';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB connected: ${conn.connection.host}`);
    
    // Auto-seed default luxury hotels, rooms and accounts if database is empty
    await autoSeedData();
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to MongoDB at ${uri}: ${error.message}`);
    console.warn(`[Database Tip] To connect to MongoDB Atlas (Free Tier):`);
    console.warn(`  1. Create a free cluster on https://www.mongodb.com/cloud/atlas`);
    console.warn(`  2. Add your connection string to server/.env as MONGODB_URI=mongodb+srv://...`);
    console.warn(`  3. Run: npm run seed`);
  }
};
