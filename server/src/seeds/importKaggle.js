import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Hotel } from '../models/Hotel.js';
import { RoomType } from '../models/RoomType.js';

dotenv.config();

/**
 * Kaggle / CSV Dataset Importer for HotelPro
 * Usage:
 *   node src/seeds/importKaggle.js <path-to-csv-file>
 *
 * Example:
 *   node src/seeds/importKaggle.js data/hotels.csv
 */
const importKaggleData = async () => {
  const filePath = process.argv[2];

  if (!filePath) {
    console.log(`
======================================================
  HotelPro - Kaggle & CSV Dataset Importer
======================================================
Usage:
  node src/seeds/importKaggle.js <path-to-your-csv>

Example:
  node src/seeds/importKaggle.js ./hotels_sample.csv

If you don't have a CSV, you can simply run:
  npm run seed
which populates verified luxury & boutique hotels in
Goa, Mumbai, Jaipur, Delhi, and Bengaluru out of the box!
======================================================
`);
    process.exit(0);
  }

  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`Error: File not found at ${fullPath}`);
    process.exit(1);
  }

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hotelpro';
    await mongoose.connect(mongoUri);
    console.log('[Importer] Connected to MongoDB.');

    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n').filter((l) => l.trim().length > 0);
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''));

    console.log(`[Importer] Found ${lines.length - 1} records. Parsing headers:`, headers);

    let importedCount = 0;

    for (let i = 1; i < lines.length; i++) {
      // Basic CSV parser handling quotes
      const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const cleanRow = row.map((val) => val.replace(/^"|"$/g, '').trim());

      const getVal = (colName) => {
        const idx = headers.findIndex((h) => h.includes(colName));
        return idx !== -1 ? cleanRow[idx] : null;
      };

      const name = getVal('name') || getVal('property') || getVal('hotel');
      const city = getVal('city') || 'Goa';
      const address = getVal('address') || `${city}, India`;
      const price = Number(getVal('price') || getVal('rate')) || 4500;
      const starRating = Number(getVal('star')) || 4;
      const avgRating = Number(getVal('rating')) || 4.5;

      if (!name) continue;

      const hotel = await Hotel.create({
        name,
        city,
        address,
        description: `Experience premier hospitality at ${name} in ${city}. Featuring top-tier amenities and exceptional dining.`,
        starRating: Math.min(5, Math.max(1, starRating)),
        avgRating: Math.min(5, Math.max(1, avgRating)),
        reviewCount: Math.floor(Math.random() * 80) + 10,
        amenities: ['Free WiFi', 'Air Conditioning', 'Room Service', 'Swimming Pool'],
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
        ],
        policies: {
          checkInTime: '12:00 PM',
          checkOutTime: '11:00 AM',
          cancellation: 'Free cancellation up to 48 hours before check-in.',
          petsAllowed: false,
        },
        propertyType: 'hotel',
        status: 'active',
      });

      // Create default Deluxe room category for this imported hotel
      await RoomType.create({
        hotelId: hotel._id,
        name: 'Deluxe Comfort Room',
        capacity: { adults: 2, children: 1 },
        pricePerNight: price,
        totalRooms: 10,
        amenities: ['Air Conditioning', 'King Bed', 'Free WiFi', 'Flat-screen TV'],
        images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'],
      });

      importedCount++;
    }

    console.log(`\n✅ Successfully imported ${importedCount} hotels and room types from ${filePath}!`);
    process.exit(0);
  } catch (err) {
    console.error('[Import Error]:', err.message);
    process.exit(1);
  }
};

importKaggleData();
