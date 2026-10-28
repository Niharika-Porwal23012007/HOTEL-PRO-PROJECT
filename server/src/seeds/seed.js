import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { autoSeedData } from './autoSeed.js';

dotenv.config();

const run = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hotelpro';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to database at:', mongoUri);

    const result = await autoSeedData(true);
    console.log('[Seed] Seeding completed successfully:', result);

    console.log('\n===============================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('===============================================');
    console.log('Credentials:');
    console.log('• Admin: admin@hotelpro.com / Admin@123');
    console.log('• Staff: staff@hotelpro.com / Staff@123');
    console.log('• Guest: guest@hotelpro.com / Guest@123');
    console.log('===============================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

run();
