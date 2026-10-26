# Phase 3: Requirement Analysis Phase
## Technology Stack (Architecture & Stack)

| Metadata | Details |
|---|---|
| **Date** | 20 October 2026 |
| **Team ID** | HP-TEAM-2026 |
| **Project Name** | HotelPro — Hotel Booking and Management Platform with AI Assistant |
| **Maximum Marks** | 4 Marks |

---

### 1. Technical Architecture Overview
The HotelPro platform is engineered as a modern, decoupled **3-tier web architecture** consisting of:
1. **Presentation Layer (Frontend)**: A fast, single-page client built with React 18, Vite, and Tailwind CSS.
2. **Application / Business Logic Layer (Backend API)**: A modular Node.js and Express RESTful service enforcing business rules, session authentication, hold lifecycles, and concurrency locks.
3. **Data & External Services Layer**: MongoDB Atlas database with Mongoose ODM, Razorpay test payment gateway, and Google Gemini AI services.

---

### Table 1: Components & Technologies

| S.No | Component | Description | Technology Selected | Justification |
|---|---|---|---|---|
| **1** | **User Interface (Frontend)** | Responsive single-page web interface for travellers, hotel staff, and administrators. | **React 18, Vite, Tailwind CSS, React Router v7** | Lightning-fast HMR, sub-second build times, utility-first responsive styling, and client-side route caching. |
| **2** | **Icons & UI Primitives** | Visual icons for amenities, ratings, navigation, and badges. | **Lucide React** | Lightweight, accessible, consistent vector icons matching modern travel portals. |
| **3** | **HTTP & API Communication** | Client-to-server data communication with automatic cookie handling. | **Axios with interceptors** | Automatic Bearer token attachment and transparent 401 silent token refresh handling. |
| **4** | **Application Logic (Backend API)** | RESTful API managing authentication, hotel catalog, search, bookings, and operations. | **Node.js, Express.js** | Non-blocking asynchronous I/O, massive community support, and unified JavaScript ecosystem across stack. |
| **5** | **Request Validation** | Strict schema validation on incoming JSON payloads and query strings. | **Zod** | Type-safe runtime input validation preventing SQL/NoSQL injection and malformed parameters. |
| **6** | **Security & Session Layer** | Passwords hashing, JWT issuance, and secure cookie storage. | **bcryptjs, jsonwebtoken, cookie-parser, helmet** | Industry-standard dual-token auth (15m access + 7d httpOnly refresh token) and HTTP security header hardening. |
| **7** | **Database & Persistence** | Document storage for hotels, room types, users, sessions, bookings, and reviews. | **MongoDB Atlas / Mongoose** | Flexible JSON document model, schema validations, indexing support, and atomic transaction capabilities. |
| **8** | **Payment Gateway** | Online payment simulation supporting UPI, Cards, and Net Banking. | **Razorpay Sandbox (Test Mode)** | Leading payment gateway in India with robust test mode, webhooks, and HMAC-SHA256 signature verification. |
| **9** | **Artificial Intelligence (RAG)** | Conversational assistant grounded in live catalog data, search parsing, and review summarization. | **Google Gemini API (`gemini-1.5-flash`)** | High-speed, free-tier access with support for system instructions, catalog grounding, and natural language understanding. |

---

### Table 2: Application Characteristics

| S.No | Characteristic | Architectural Strategy | Implementation Details |
|---|---|---|---|
| **1** | **Open-Source Frameworks** | 100% open-source stack avoiding proprietary platform lock-in. | React, Node.js, Express, Tailwind CSS, Mongoose, Vite. |
| **2** | **Scalability & Concurrency** | Horizontally scalable stateless API with database-level isolation. | Stateless JWT authentication allows multiple Node.js instances behind a load balancer; MongoDB atomic operations protect room inventory. |
| **3** | **Security Hardening** | Defense-in-depth security at HTTP, application, and database layers. | Helmet headers, CORS restrictions, rate-limited login routes, 5-attempt account lockout, and zero plain-text password storage. |
| **4** | **Zero Overbooking Engine** | Strict date overlap verification and automated hold expirations. | Room availability calculated by subtracting confirmed and active pending holds from total inventory for requested date ranges. |
| **5** | **Developer Experience & Testing** | Built-in native automated test suite with zero external testing bloat. | Tested using Node.js native test runner (`node --test tests/**/*.test.js`) achieving sub-second verification. |

---

### Table 3: Database & Cloud Services

| Service | Category | Configuration | Free Tier Compliance |
|---|---|---|---|
| **MongoDB Atlas** | Managed Database | M0 Free Cluster (512MB storage, automated backups) | 100% Free |
| **Vercel** | Frontend Hosting | Automated Git deployments with global CDN edge caching | 100% Free |
| **Render** | Backend Hosting | Web Service running Node.js with automated health-check ping | 100% Free |
| **Razorpay Sandbox** | Payment Processing | Test API keys (`rzp_test_...`) with mock UPI & test card numbers | 100% Free Sandbox |
| **Google Gemini API** | AI / Generative AI | Free tier developer key for `gemini-1.5-flash` model | 100% Free Tier |
