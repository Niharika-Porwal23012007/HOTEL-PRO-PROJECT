import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Hotel } from '../models/Hotel.js';
import { RoomType } from '../models/RoomType.js';
import { Coupon } from '../models/Coupon.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hotelpro';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to database.');

    // Clear collections
    await User.deleteMany({});
    await Hotel.deleteMany({});
    await RoomType.deleteMany({});
    await Coupon.deleteMany({});
    console.log('[Seed] Cleared existing data.');

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    const staffPassword = await bcrypt.hash('Staff@123', salt);
    const guestPassword = await bcrypt.hash('Guest@123', salt);

    const admin = await User.create({
      name: 'Niharika Admin',
      email: 'admin@hotelpro.com',
      passwordHash: adminPassword,
      role: 'admin',
      isVerified: true,
      phone: '+91 9876543210',
    });

    const staff = await User.create({
      name: 'Rakesh Manager',
      email: 'staff@hotelpro.com',
      passwordHash: staffPassword,
      role: 'staff',
      isVerified: true,
      phone: '+91 9876543211',
    });

    const guest = await User.create({
      name: 'Aarav Sharma',
      email: 'guest@hotelpro.com',
      passwordHash: guestPassword,
      role: 'guest',
      isVerified: true,
      phone: '+91 9876543212',
    });

    console.log('[Seed] Created default users: admin, staff, and guest.');

    // 2. Create Hotels & Rooms
    const hotelsData = [
      {
        name: 'The Grand Azure Resort & Spa',
        city: 'Goa',
        area: 'Calangute Beach',
        address: 'Holiday Street, Calangute, North Goa 403516',
        description: 'Luxury beachfront resort boasting private beach access, infinity pool, multi-cuisine dining, and tranquil ayurvedic spa services.',
        starRating: 5,
        avgRating: 4.8,
        reviewCount: 142,
        amenities: ['Swimming Pool', 'Spa', 'Free WiFi', 'Restaurant', 'Beachfront', 'Pet Friendly', 'Free Parking', 'Airport Shuttle'],
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        ],
        policies: {
          checkInTime: '02:00 PM',
          checkOutTime: '11:00 AM',
          cancellation: 'Free cancellation up to 48 hours before check-in. 50% refund between 24-48 hours.',
          petsAllowed: true,
        },
        propertyType: 'resort',
        featured: true,
        managerIds: [staff._id],
        rooms: [
          {
            name: 'Deluxe Ocean View King Suite',
            capacity: { adults: 2, children: 1 },
            pricePerNight: 5500,
            totalRooms: 10,
            amenities: ['King Bed', 'Balcony with Ocean View', 'Bathtub', 'High-Speed WiFi', 'Espresso Machine'],
            images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'],
          },
          {
            name: 'Beachfront Luxury Villa with Plunge Pool',
            capacity: { adults: 4, children: 2 },
            pricePerNight: 12500,
            totalRooms: 4,
            amenities: ['Private Pool', 'Direct Beach Walkway', 'Living Room', 'Kitchenette', 'Butler Service'],
            images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
          },
        ],
      },
      {
        name: 'Royal Heritage Haveli',
        city: 'Jaipur',
        area: 'Bani Park',
        address: 'Khatipura Road, Sindhi Camp, Jaipur 302016',
        description: 'Authentic 18th-century Rajput palace haveli meticulously restored with ornate frescoes, courtyards, marble fountain pools, and cultural performances.',
        starRating: 5,
        avgRating: 4.9,
        reviewCount: 98,
        amenities: ['Swimming Pool', 'Free WiFi', 'Heritage Dining', 'Free Parking', 'Spa', 'Air Conditioning'],
        images: [
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        ],
        policies: {
          checkInTime: '12:00 PM',
          checkOutTime: '11:00 AM',
          cancellation: 'Free cancellation up to 48 hours before arrival.',
          petsAllowed: false,
        },
        propertyType: 'hotel',
        featured: true,
        managerIds: [staff._id],
        rooms: [
          {
            name: 'Royal Maharaja Suite',
            capacity: { adults: 2, children: 1 },
            pricePerNight: 6200,
            totalRooms: 8,
            amenities: ['Four-Poster Bed', 'Carved Marble Bath', 'Courtyard View', 'Free Breakfast'],
            images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'],
          },
          {
            name: 'Heritage Deluxe Room',
            capacity: { adults: 2, children: 0 },
            pricePerNight: 3900,
            totalRooms: 12,
            amenities: ['Queen Bed', 'Traditional Decor', 'Air Conditioning', 'WiFi'],
            images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80'],
          },
        ],
      },
      {
        name: 'The Skyline Executive Marina',
        city: 'Mumbai',
        area: 'Marine Drive / Nariman Point',
        address: 'Netaji Subhash Chandra Bose Road, Churchgate, Mumbai 400020',
        description: 'Iconic modern tower directly facing the Queen’s Necklace with panoramic Arabian Sea views, rooftop lounge, and state-of-the-art business center.',
        starRating: 5,
        avgRating: 4.7,
        reviewCount: 210,
        amenities: ['Sea View', 'Gym', 'Swimming Pool', 'Bar & Lounge', 'Free WiFi', 'Airport Shuttle', 'Valet Parking'],
        images: [
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
        ],
        policies: {
          checkInTime: '03:00 PM',
          checkOutTime: '12:00 PM',
          cancellation: 'Free cancellation up to 24 hours prior to check-in.',
          petsAllowed: false,
        },
        propertyType: 'hotel',
        featured: true,
        managerIds: [staff._id],
        rooms: [
          {
            name: 'Sea View Premier King',
            capacity: { adults: 2, children: 1 },
            pricePerNight: 7800,
            totalRooms: 15,
            amenities: ['Panoramic Sea View', 'King Bed', 'Workstation', 'Bathtub'],
            images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'],
          },
          {
            name: 'Executive Club Room',
            capacity: { adults: 2, children: 0 },
            pricePerNight: 5800,
            totalRooms: 10,
            amenities: ['City Skyline View', 'Club Lounge Access', 'High-speed Internet'],
            images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'],
          },
        ],
      },
      {
        name: 'Gardenia Tech Park Suites',
        city: 'Bengaluru',
        area: 'Whitefield',
        address: 'ITPL Main Road, Whitefield, Bengaluru 560066',
        description: 'Contemporary tech-enabled urban sanctuary with lush landscaped gardens, smart room automation, co-working spaces, and artisanal coffee bar.',
        starRating: 4,
        avgRating: 4.6,
        reviewCount: 85,
        amenities: ['Free High-Speed WiFi', 'Gym', 'Restaurant', 'Co-working Lounge', 'EV Charging', 'Free Parking'],
        images: [
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
        ],
        policies: {
          checkInTime: '01:00 PM',
          checkOutTime: '11:00 AM',
          cancellation: 'Free cancellation up to 24 hours before check-in.',
          petsAllowed: true,
        },
        propertyType: 'hotel',
        featured: false,
        managerIds: [staff._id],
        rooms: [
          {
            name: 'Smart Urban Studio',
            capacity: { adults: 2, children: 0 },
            pricePerNight: 3200,
            totalRooms: 20,
            amenities: ['Queen Bed', 'Ergonomic Desk', 'Smart TV', 'Fast WiFi'],
            images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'],
          },
        ],
      },
      {
        name: 'The Imperial Diplomatic Residence',
        city: 'Delhi',
        area: 'Connaught Place / Janpath',
        address: 'Janpath Lane, Connaught Place, New Delhi 110001',
        description: 'Historic colonial masterpiece set in verdant palm gardens in the heart of the capital with museum-quality art, fine-dining restaurants, and luxury spa.',
        starRating: 5,
        avgRating: 4.9,
        reviewCount: 168,
        amenities: ['Spa', 'Swimming Pool', 'Fine Dining', 'Free Parking', 'Airport Transfer', 'Gym'],
        images: [
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
        ],
        policies: {
          checkInTime: '02:00 PM',
          checkOutTime: '12:00 PM',
          cancellation: 'Free cancellation up to 48 hours before check-in.',
          petsAllowed: false,
        },
        propertyType: 'hotel',
        featured: true,
        managerIds: [staff._id],
        rooms: [
          {
            name: 'Imperial Heritage Room',
            capacity: { adults: 2, children: 1 },
            pricePerNight: 8500,
            totalRooms: 12,
            amenities: ['Italian Marble Bath', 'Heritage Furnishings', 'Garden View', 'High Tea Access'],
            images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'],
          },
        ],
      },
    ];

    for (const h of hotelsData) {
      const { rooms, ...hotelInfo } = h;
      const hotel = await Hotel.create(hotelInfo);
      for (const r of rooms) {
        await RoomType.create({
          ...r,
          hotelId: hotel._id,
        });
      }
    }
    console.log(`[Seed] Seeded ${hotelsData.length} hotels with comprehensive room types.`);

    // 3. Create Coupons
    await Coupon.create([
      {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        maxDiscount: 1500,
        minBookingAmount: 2000,
        validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'PRO500',
        type: 'fixed',
        value: 500,
        maxDiscount: 500,
        minBookingAmount: 3000,
        validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log('[Seed] Seeded promotional coupons.');

    console.log('\n===============================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('===============================================');
    console.log('Credentials to test:');
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

seedData();
