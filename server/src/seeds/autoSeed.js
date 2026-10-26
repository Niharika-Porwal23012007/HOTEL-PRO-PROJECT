import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Hotel } from '../models/Hotel.js';
import { RoomType } from '../models/RoomType.js';
import { Coupon } from '../models/Coupon.js';

export const autoSeedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) return; // Already seeded

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

    const hotels = [
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
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
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
            images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'],
          },
        ],
      },
      {
        name: 'The Skyline Executive Marina',
        city: 'Mumbai',
        area: 'Marine Drive',
        address: 'Netaji Subhash Chandra Bose Road, Churchgate, Mumbai 400020',
        description: 'Iconic modern tower directly facing the Queen’s Necklace with panoramic Arabian Sea views, rooftop lounge, and state-of-the-art business center.',
        starRating: 5,
        avgRating: 4.7,
        reviewCount: 210,
        amenities: ['Sea View', 'Gym', 'Swimming Pool', 'Bar & Lounge', 'Free WiFi', 'Airport Shuttle', 'Valet Parking'],
        images: [
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
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
        ],
      },
    ];

    for (const h of hotels) {
      const { rooms, ...hotelInfo } = h;
      const createdHotel = await Hotel.create(hotelInfo);
      for (const r of rooms) {
        await RoomType.create({ ...r, hotelId: createdHotel._id });
      }
    }

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

    console.log('[AutoSeed] Sample data ready: admin@hotelpro.com, staff@hotelpro.com, guest@hotelpro.com');
  } catch (err) {
    console.error('[AutoSeed Error]:', err.message);
  }
};
