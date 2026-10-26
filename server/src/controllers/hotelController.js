import mongoose from 'mongoose';
import { Hotel } from '../models/Hotel.js';
import { RoomType } from '../models/RoomType.js';
import { BookingService } from '../services/bookingService.js';
import { mockHotels, mockRoomTypes } from '../config/mockData.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { sanitizeHotel, sanitizeImageUrl } from '../utils/images.js';

export class HotelController {
  /**
   * Search hotels with live filters, sorting, date availability & pagination (SRC-01 - SRC-07)
   */
  static async getHotels(req, res, next) {
    try {
      const {
        city,
        checkIn,
        checkOut,
        guests = 1,
        rooms = 1,
        minPrice,
        maxPrice,
        starRating,
        minRating,
        amenities,
        propertyType,
        sort = 'recommended',
        page = 1,
        limit = 10,
      } = req.query;

      // In-Memory Fallback if MongoDB is not connected
      if (mongoose.connection.readyState !== 1) {
        let list = [...mockHotels];

        if (city && city.trim() !== '') {
          const c = city.trim().toLowerCase();
          list = list.filter(
            (h) =>
              h.city.toLowerCase().includes(c) ||
              h.name.toLowerCase().includes(c) ||
              (h.area && h.area.toLowerCase().includes(c))
          );
        }

        if (propertyType) {
          list = list.filter((h) => h.propertyType === propertyType);
        }

        if (starRating) {
          const stars = Array.isArray(starRating) ? starRating.map(Number) : starRating.split(',').map(Number);
          list = list.filter((h) => stars.includes(h.starRating));
        }

        if (maxPrice) {
          list = list.filter((h) => h.startingPrice <= Number(maxPrice));
        }

        if (amenities) {
          const reqAmenities = Array.isArray(amenities) ? amenities : amenities.split(',');
          list = list.filter((h) => reqAmenities.every((a) => h.amenities.includes(a)));
        }

        if (sort === 'price_asc') {
          list.sort((a, b) => a.startingPrice - b.startingPrice);
        } else if (sort === 'price_desc') {
          list.sort((a, b) => b.startingPrice - a.startingPrice);
        } else if (sort === 'rating_desc') {
          list.sort((a, b) => b.avgRating - a.avgRating);
        }

        return sendSuccess(res, 200, 'Hotels retrieved (in-memory mode)', list.map(sanitizeHotel), {
          total: list.length,
          page: 1,
          limit: 10,
          totalPages: 1,
        });
      }

      // MongoDB Active Mode
      const filter = { status: 'active' };

      if (city && city.trim() !== '') {
        filter.$or = [
          { city: { $regex: city.trim(), $options: 'i' } },
          { name: { $regex: city.trim(), $options: 'i' } },
          { area: { $regex: city.trim(), $options: 'i' } },
        ];
      }

      if (propertyType) filter.propertyType = propertyType;
      if (starRating) {
        const stars = Array.isArray(starRating) ? starRating : starRating.split(',').map(Number);
        filter.starRating = { $in: stars };
      }
      if (minRating) filter.avgRating = { $gte: Number(minRating) };
      if (amenities) {
        const amenitiesList = Array.isArray(amenities) ? amenities : amenities.split(',');
        filter.amenities = { $all: amenitiesList };
      }

      let hotels = await Hotel.find(filter).lean();

      const enhancedHotels = await Promise.all(
        hotels.map(async (hotel) => {
          let roomQuery = { hotelId: hotel._id, isActive: true };
          const roomTypes = await RoomType.find(roomQuery).lean();
          if (roomTypes.length === 0) return null;

          const minRoomPrice = Math.min(...roomTypes.map((r) => r.pricePerNight));

          if (checkIn && checkOut) {
            let hasAvailableRoom = false;
            for (const room of roomTypes) {
              const availableCount = await BookingService.getAvailableRoomCount(
                room._id,
                checkIn,
                checkOut
              );
              if (availableCount >= Number(rooms)) {
                hasAvailableRoom = true;
                break;
              }
            }
            if (!hasAvailableRoom) return null;
          }

          if (minPrice && minRoomPrice < Number(minPrice)) return null;
          if (maxPrice && minRoomPrice > Number(maxPrice)) return null;

          return {
            ...sanitizeHotel(hotel),
            startingPrice: minRoomPrice,
            roomTypesCount: roomTypes.length,
          };
        })
      );

      const validHotels = enhancedHotels.filter(Boolean);

      if (sort === 'price_asc') {
        validHotels.sort((a, b) => a.startingPrice - b.startingPrice);
      } else if (sort === 'price_desc') {
        validHotels.sort((a, b) => b.startingPrice - a.startingPrice);
      } else if (sort === 'rating_desc') {
        validHotels.sort((a, b) => b.avgRating - a.avgRating);
      } else {
        validHotels.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.reviewCount - a.reviewCount);
      }

      const totalResults = validHotels.length;
      const startIndex = (Number(page) - 1) * Number(limit);
      const paginated = validHotels.slice(startIndex, startIndex + Number(limit));

      return sendSuccess(res, 200, 'Hotels retrieved', paginated, {
        total: totalResults,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalResults / Number(limit)),
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get single hotel details by ID with room types (HOT-01 - HOT-04)
   */
  static async getHotelById(req, res, next) {
    try {
      const { id } = req.params;
      const { checkIn, checkOut } = req.query;

      if (mongoose.connection.readyState !== 1) {
        const hotel = mockHotels.find((h) => h._id === id) || mockHotels[0];
        const rooms = mockRoomTypes.filter((r) => r.hotelId === hotel._id);
        return sendSuccess(res, 200, 'Hotel details retrieved (in-memory mode)', {
          hotel: sanitizeHotel(hotel),
          roomTypes: rooms.length > 0 ? rooms : [mockRoomTypes[0]],
        });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendError(res, 404, 'Hotel not found');
      }

      const hotel = await Hotel.findById(id).lean();
      if (!hotel) {
        return sendError(res, 404, 'Hotel not found');
      }

      const roomTypes = await RoomType.find({ hotelId: id, isActive: true }).lean();

      const enrichedRooms = await Promise.all(
        roomTypes.map(async (room) => {
          let availableCount = room.totalRooms;
          if (checkIn && checkOut) {
            availableCount = await BookingService.getAvailableRoomCount(room._id, checkIn, checkOut);
          }
          return {
            ...room,
            availableRooms: availableCount,
          };
        })
      );

      return sendSuccess(res, 200, 'Hotel details retrieved', {
        hotel: sanitizeHotel(hotel),
        roomTypes: enrichedRooms,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Featured & Popular Hotels for Home page (SRC-10)
   */
  static async getFeatured(req, res, next) {
    try {
      const destinations = [
        { city: 'Goa', count: 18, image: sanitizeImageUrl('https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80') },
        { city: 'Mumbai', count: 24, image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80' },
        { city: 'Jaipur', count: 15, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80' },
        { city: 'Delhi', count: 30, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80' },
        { city: 'Bengaluru', count: 20, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80' },
      ];

      if (mongoose.connection.readyState !== 1) {
        return sendSuccess(res, 200, 'Featured hotels & destinations (in-memory mode)', {
          featured: mockHotels.slice(0, 4).map(sanitizeHotel),
          destinations,
        });
      }

      const featured = await Hotel.find({ status: 'active', featured: true }).limit(6).lean();
      const featuredList = (featured.length > 0 ? featured : mockHotels.slice(0, 4)).map(sanitizeHotel);

      return sendSuccess(res, 200, 'Featured hotels & destinations', {
        featured: featuredList,
        destinations,
      });
    } catch (err) {
      next(err);
    }
  }

  static async createHotel(req, res, next) {
    try {
      const hotel = new Hotel({ ...req.body, managerIds: [req.user._id] });
      await hotel.save();
      return sendSuccess(res, 201, 'Hotel created successfully', { hotel });
    } catch (err) {
      next(err);
    }
  }

  static async updateHotel(req, res, next) {
    try {
      const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!hotel) return sendError(res, 404, 'Hotel not found');
      return sendSuccess(res, 200, 'Hotel updated successfully', { hotel });
    } catch (err) {
      next(err);
    }
  }
}
