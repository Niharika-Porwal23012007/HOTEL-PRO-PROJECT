# HotelPro 🏨✨

**Commercial-Grade Hotel Booking and Management Platform with AI Assistant**

HotelPro is a full-stack MERN application built according to the comprehensive specifications outlined in [PRD.md](file:///Users/niharikaporwal/Desktop/Hotel%20pro%20Project%20/PRD.md). It features an overbooking-proof reservation engine, a 10-minute hold window, Razorpay test payment integration, verified post-stay reviews, dedicated staff & admin dashboards, and an integrated RAG AI Concierge.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v7, Lucide Icons, Axios.
- **Backend API**: Node.js, Express, Mongoose, JWT Dual-Token Auth (15m access token + 7d httpOnly refresh cookie), Helmet, Zod.
- **Database**: MongoDB Atlas / Mongoose.
- **Payments**: Razorpay Gateway (Test Mode) with server-side HMAC-SHA256 signature verification.
- **AI Concierge**: Google Gemini API (`gemini-1.5-flash`) with catalog-grounded RAG and rule-based fallback.

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js v18+ (tested on Node v24)
- A free MongoDB Atlas URI or local MongoDB (`mongodb://127.0.0.1:27017/hotelpro`)

### 2. Configure Environment Variables
Copy `server/.env.example` to `server/.env`:
```bash
cd server
cp .env.example .env
```
Ensure your `MONGODB_URI` is set (e.g. your free MongoDB Atlas connection string).

### 3. Seed Database
Populate realistic hotels across Goa, Mumbai, Jaipur, Delhi, and Bengaluru, along with room categories, promotional coupons, and demo users:
```bash
npm run seed
```

### 4. Start the Application
Run both backend (port 5001) and frontend (port 5173) concurrently:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🔑 Pre-Seeded Demo Accounts

For instant evaluation, you can use the 1-click login buttons on `/login` or enter credentials manually:

| Role | Email | Password | Access |
|---|---|---|---|
| **Platform Admin** | `admin@hotelpro.com` | `Admin@123` | Executive analytics, revenue charts, user roles |
| **Hotel Staff / Manager** | `staff@hotelpro.com` | `Staff@123` | Operations, check-ins, check-outs, room types |
| **Verified Guest** | `guest@hotelpro.com` | `Guest@123` | Search, hold rooms, Razorpay checkout, cancellations |

---

## 🧪 Automated Testing

Run the automated business rule test suite (tests night calculation, 48h/24h refund policy tiers, reference ID formatting):
```bash
npm test
```

---

## 📋 Features & Business Rules Implemented

- [x] **Zero Overbooking Engine (BR-01, BKG-04)**: Real-time overlap calculation ensures rooms cannot be double-booked under concurrent requests.
- [x] **10-Minute Hold Window (BR-03, BKG-03)**: Real-time countdown timer locks room availability during checkout and auto-expires.
- [x] **Flexible Cancellation Policy (BR-05, BKG-07)**:
  - `> 48 hours`: 100% full refund.
  - `24 - 48 hours`: 50% refund.
  - `< 24 hours`: Non-refundable.
- [x] **Dual-Token Auth & Lockout (AUTH-01 to AUTH-14)**: Short-lived access token, httpOnly refresh cookie, and 15-minute lockout after 5 failed password attempts.
- [x] **Razorpay Test Integration (PAY-01 to PAY-04)**: Server-side order creation, HMAC signature verification, and test payment simulator.
- [x] **RAG AI Concierge (AI-01 to AI-03)**: Contextually grounded in real hotel catalog data with live availability inquiries.
- [x] **Staff & Admin Dashboards (STF-01 - ADM-03)**: Guest arrival tracking, front-desk check-in/out, and platform revenue analytics.
