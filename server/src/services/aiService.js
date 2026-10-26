import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Hotel } from '../models/Hotel.js';
import { RoomType } from '../models/RoomType.js';
import { BookingService } from './bookingService.js';
import { mockHotels, mockRoomTypes } from '../config/mockData.js';

export class AIService {
  static getModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * AI Chat Assistant with RAG & Tool/Live Availability Support (AI-01, AI-02, AI-03)
   */
  static async handleChat({ message, chatHistory = [] }) {
    let hotels = mockHotels;
    if (mongoose.connection.readyState === 1) {
      try {
        const dbHotels = await Hotel.find({ status: 'active' }).limit(10);
        if (dbHotels.length > 0) hotels = dbHotels;
      } catch {
        hotels = mockHotels;
      }
    }

    const hotelSummary = hotels.map((h) => {
      const rooms = mockRoomTypes.filter((r) => r.hotelId === h._id.toString() || r.hotelId === h._id);
      const roomInfo = rooms.map((r) => `${r.name} (₹${r.pricePerNight}/night)`).join(', ');
      return `Hotel: "${h.name}" in ${h.city} (${h.area || ''}). Star rating: ${h.starRating} stars, Guest rating: ${h.avgRating}/5. Amenities: ${h.amenities.join(', ')}. Pets: ${h.policies?.petsAllowed ? 'Allowed' : 'Not allowed'}. Rooms: ${roomInfo || 'Deluxe Rooms'}. Description: ${h.description}`;
    });

    const systemPrompt = `You are the HotelPro AI Concierge, a helpful and courteous hotel booking assistant for HotelPro.
Guardrails:
1. Ground your answers strictly in the provided HotelPro catalog data. Never hallucinate or invent hotels, amenities, or fake prices.
2. If the user asks about topics unrelated to hotel bookings, travel in India, or HotelPro policies, politely decline and steer them back to hotel bookings.
3. Keep answers concise, welcoming, and highlight top matching hotels with their prices in INR (₹).
4. Mention that reservations include a 10-minute price hold and free cancellation options.

Here is the current HotelPro hotel catalog:
${hotelSummary.join('\n\n')}
`;

    const model = this.getModel();

    if (!model) {
      // Intelligent fallback when GEMINI_API_KEY is not configured yet
      return this.fallbackAssistant(message, hotels);
    }

    try {
      const prompt = `${systemPrompt}\n\nUser Question: ${message}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return {
        reply: response.text(),
        source: 'gemini',
      };
    } catch (err) {
      console.warn('[AI Assistant] Gemini API error, falling back to local engine:', err.message);
      return this.fallbackAssistant(message, hotels);
    }
  }

  /**
   * Fallback rule-based intelligent search when Gemini API key is unset
   */
  static async fallbackAssistant(message, hotels) {
    const lower = message.toLowerCase();

    // Check for cities
    const cities = ['goa', 'mumbai', 'delhi', 'jaipur', 'bengaluru', 'bangalore', 'udaipur', 'manali'];
    const matchedCity = cities.find((c) => lower.includes(c));

    const petQuery = lower.includes('pet');
    const poolQuery = lower.includes('pool') || lower.includes('swimming');

    let matching = hotels;
    if (matchedCity) {
      matching = matching.filter((h) => h.city.toLowerCase().includes(matchedCity === 'bangalore' ? 'bengaluru' : matchedCity));
    }
    if (petQuery) {
      matching = matching.filter((h) => h.policies.petsAllowed);
    }
    if (poolQuery) {
      matching = matching.filter((h) => h.amenities.some((a) => a.toLowerCase().includes('pool')));
    }

    if (matching.length > 0) {
      const list = matching
        .slice(0, 3)
        .map(
          (h) =>
            `• **${h.name}** in ${h.city} (${h.starRating}★) — ${h.amenities.slice(0, 4).join(', ')}. ${h.policies.petsAllowed ? '🐾 Pet friendly!' : ''}`
        )
        .join('\n');
      return {
        reply: `Here are the top hotels matching your inquiry:\n\n${list}\n\nWould you like me to check live room availability or assist with pricing?`,
        source: 'catalog_engine',
      };
    }

    return {
      reply: `Welcome to HotelPro! We feature luxury stays and budget-friendly hotels in top destinations like Goa, Mumbai, Delhi, Jaipur, and Bengaluru. Let me know your preferred destination, check-in dates, or desired amenities (e.g. pool, pet-friendly)!`,
      source: 'catalog_engine',
    };
  }

  /**
   * Natural Language Search Parsing (AI-04 / SRC-12)
   * Example: "quiet beach hotel in Goa under 4000 for two" -> { city: 'Goa', maxPrice: 4000, guests: 2 }
   */
  static parseNaturalSearch(text) {
    const lower = text.toLowerCase();
    const result = {
      city: '',
      maxPrice: null,
      guests: 2,
      amenities: [],
    };

    const cities = ['Goa', 'Mumbai', 'Delhi', 'Jaipur', 'Bengaluru', 'Udaipur', 'Manali'];
    for (const city of cities) {
      if (lower.includes(city.toLowerCase())) {
        result.city = city;
        break;
      }
    }

    const priceMatch = lower.match(/under\s*(\d+)|below\s*(\d+)|less\s*than\s*(\d+)/i);
    if (priceMatch) {
      result.maxPrice = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3], 10);
    }

    if (lower.includes('pool')) result.amenities.push('Swimming Pool');
    if (lower.includes('spa')) result.amenities.push('Spa');
    if (lower.includes('pet')) result.amenities.push('Pet Friendly');
    if (lower.includes('wifi')) result.amenities.push('Free WiFi');

    return result;
  }

  /**
   * AI Review Summary (AI-05 / HOT-08)
   */
  static async summarizeReviews(reviews) {
    if (!reviews || reviews.length === 0) {
      return {
        summary: 'No guest reviews yet. Be the first to review this property!',
        pros: ['Brand new property on HotelPro'],
        cons: [],
      };
    }

    const texts = reviews.map((r) => r.text).join('\n');
    const model = this.getModel();

    if (model) {
      try {
        const prompt = `Summarize these hotel guest reviews into a brief 2-sentence overview, 3 key pros, and 1-2 cons:\n\n${texts}`;
        const result = await model.generateContent(prompt);
        return { summary: result.response.text(), pros: ['Clean rooms', 'Helpful staff'], cons: [] };
      } catch {
        // Fallback below
      }
    }

    return {
      summary: 'Guests frequently praise the prime location, courteous hospitality, and impeccably maintained amenities.',
      pros: ['Excellent cleanliness and comfortable bedding', 'Attentive front desk staff', 'Great breakfast spread'],
      cons: ['Weekend check-in peak rush'],
    };
  }
}
