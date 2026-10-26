# HotelPro

**Product Requirements Document (PRD)**

**Hotel Booking and Management Platform with AI Assistant**

| Item | Details |
| --- | --- |
| Product name | HotelPro |
| Document version | 1.0 (first complete draft) |
| Date | October 20, 2026 |
| Prepared by | Niharika |
| Project type | Full Stack Capstone Project (MERN stack with AI features) |
| Status | Draft for review and development start |

## Table of Contents

- [1. Introduction](#1-introduction)
- [2. Problem Statement, Goals and Success Measures](#2-problem-statement-goals-and-success-measures)
- [3. Target Users and Personas](#3-target-users-and-personas)
- [4. Product Overview](#4-product-overview)
- [5. Feature Overview and Priorities](#5-feature-overview-and-priorities)
- [6. Functional Requirements](#6-functional-requirements)
- [7. Key Flows and Acceptance Criteria](#7-key-flows-and-acceptance-criteria)
- [8. Business Rules](#8-business-rules)
- [9. Data Requirements](#9-data-requirements)
- [10. Screens and Pages](#10-screens-and-pages)
- [11. Technical Overview](#11-technical-overview)
- [12. Non-Functional Requirements](#12-non-functional-requirements)
- [13. Integrations](#13-integrations)
- [14. Release Plan](#14-release-plan)
- [15. Testing and Acceptance Plan](#15-testing-and-acceptance-plan)
- [16. Risks and Mitigation](#16-risks-and-mitigation)
- [17. Future Enhancements (After Version 1)](#17-future-enhancements-after-version-1)
- [Appendix A: Feature Checklist](#appendix-a-feature-checklist)
- [Appendix B: Document Approval](#appendix-b-document-approval)

## 1. Introduction

### 1.1 Purpose of this document

This document describes what HotelPro is, who it is for, and exactly what it must do. It lists every feature in plain language, says which features are most important, and explains the rules the system must follow. It is written so that a student, a teacher, or a developer can read it and understand the whole project without extra explanation. It is the single source of truth while building.

### 1.2 Product summary

HotelPro is a website where travellers can search for hotels, check live room availability, book a room, pay online, and manage their bookings. Hotel staff use it to manage their rooms, prices and bookings. An admin uses it to oversee the whole platform. HotelPro also includes an AI assistant that answers questions about hotels and checks room availability in real time, which makes it stand out from a standard booking project.

### 1.3 Scope

**In scope:** user accounts with secure login and logout, hotel search and filters, hotel pages, room booking with an overbooking-proof engine, online payment in test mode, booking management, reviews, email notifications, staff and admin dashboards, analytics, and AI features.

**Out of scope (for version 1):** flights, trains or cab booking, real money payments, a native mobile app, multi-currency settlement, and integration with real hotel management systems.

### 1.4 Inspiration (reference products)

The feature ideas below are inspired by popular travel websites. HotelPro does not copy their design or content; it borrows well-known good ideas and keeps them simple.

| Reference | Good ideas borrowed |
| --- | --- |
| Booking.com | Strong filters, clear price breakdown, review summaries, free-cancellation labels |
| MakeMyTrip | Coupon codes, simple booking steps, price per night with taxes shown clearly |
| OYO | Very simple search, room-focused layout, quick checkout |
| Airbnb | Wishlist hearts, map view, big photos, review categories |

### 1.5 Definitions

| Term | Meaning |
| --- | --- |
| Guest | A traveller who searches and books hotels |
| Staff / Hotel Manager | A person who manages one hotel's rooms, prices and bookings |
| Admin | The platform owner who manages all hotels, users and reports |
| Room type | A category of room in a hotel, e.g. Deluxe Double, with a price and number of rooms |
| Hold | A 10-minute reservation of a room while the guest completes payment |
| Overbooking | Selling more rooms than a hotel actually has for the same dates |
| RAG | Retrieval-Augmented Generation: the AI answers using HotelPro's own hotel data |
| MVP | Minimum Viable Product: the smallest working version with all Must features |

## 2. Problem Statement, Goals and Success Measures

### 2.1 Problems we are solving

- Travellers waste time comparing hotels across many websites and cannot trust availability shown.
- Hotels lose money and trust when the same room is sold twice (overbooking).
- Small hotels lack a simple tool to manage rooms, prices and bookings online.
- Travellers have questions ("Is there a pool? Is it pet friendly? Is a room free on these dates?") and must read long pages to find answers.

### 2.2 Product goals

| # | Goal | How we know it is met |
| --- | --- | --- |
| G1 | Make hotel search and booking fast and easy | A new user can find and book a hotel in under 3 minutes |
| G2 | Never allow overbooking | A test with 20 simultaneous requests for the last room results in exactly one booking |
| G3 | Keep accounts secure with a proper login and logout system | Passwords hashed, httpOnly cookie sessions, rate-limited login, working logout everywhere |
| G4 | Give hotel staff and admins simple control | Staff can add rooms and see bookings; admin sees revenue and occupancy charts |
| G5 | Stand out with useful AI | AI assistant answers hotel questions from real data and checks live availability |
| G6 | Be fully deployed and demo-ready | Live public link, working demo accounts, README and demo video |

### 2.3 Success metrics

| Metric | Target |
| --- | --- |
| All Must features working end to end on the live site | 100 percent |
| Double bookings in the concurrency test | 0 |
| Page load on a normal 4G connection | Under 3 seconds for main pages |
| Lighthouse performance and accessibility scores | At least 80 each |
| Automated test coverage on booking and payment services | At least 80 percent |
| Critical security issues found in final review | 0 |

## 3. Target Users and Personas

| Persona | Who they are | What they want | What frustrates them |
| --- | --- | --- | --- |
| Guest (Aarav, 24) | Student or young professional planning a trip | Quick search, honest prices, easy booking, easy cancellation, answers to questions | Hidden charges, unclear availability, slow checkout, hard-to-find policies |
| Family traveller (Meera, 38) | Books rooms for 3 to 5 people | Filters for family rooms and amenities, multiple rooms in one booking, reviews | Not knowing room capacity, losing a booking after a failed payment |
| Hotel Manager (Rakesh, 45) | Runs a small hotel with 20 rooms | Update rooms and prices, see who is arriving, avoid double bookings, reply to reviews | Complicated software, manual registers, last-minute cancellations |
| Admin (Platform owner) | Controls the whole platform | See revenue and occupancy, approve hotels, remove abusive users or reviews | No overview, no records of who changed what |

## 4. Product Overview

### 4.1 Main user journey (Guest)

**1. Search > 2. Choose hotel > 3. Pick room > 4. Guest details > 5. Pay > 6. Confirmed > 7. Stay and review**

The guest can browse and search without an account. An account is needed to book, pay, review, save favourites and see past bookings. If a guest tries to book without logging in, HotelPro sends them to the login page and brings them back to the same booking afterwards.

### 4.2 Roles and access

| Capability | Visitor | Guest | Staff | Admin |
| --- | --- | --- | --- | --- |
| Search and view hotels | Yes | Yes | Yes | Yes |
| Use AI assistant (read-only answers) | Yes | Yes | Yes | Yes |
| Book, pay, cancel own bookings | No | Yes | No | No |
| Write reviews (after completed stay) | No | Yes | No | No |
| Manage own hotel, rooms and prices | No | No | Yes | Yes |
| See bookings of own hotel | No | No | Yes | Yes |
| Manage all hotels, users, coupons | No | No | No | Yes |
| View platform analytics | No | No | Hotel only | All |

### 4.3 Assumptions and constraints

- The project uses only free tools and free hosting tiers (MongoDB Atlas, Render, Vercel, Cloudinary, Razorpay test mode, free AI API tier).
- Payments run in Razorpay test mode only; no real money moves.
- Prices are in Indian Rupees (INR). Dates and times use Indian Standard Time.
- Free hosting may be slow on the first request after inactivity; a monitoring ping reduces this.
- Sample hotel data is created with a seed script; real hotels are not required.
- The first release is a responsive website, not a native app.

## 5. Feature Overview and Priorities

Each feature has a priority. **Must** means the project is incomplete without it. **Should** means it is important and expected in a good project. **Stand-out** means an extra that makes the project memorable on a resume. Build all Must items first, then Should, then pick two or three Stand-out items.

| Module | Must | Should | Stand-out |
| --- | --- | --- | --- |
| Authentication and account | 9 | 5 | 2 |
| Profile | 0 | 2 | 1 |
| Search and discovery | 7 | 3 | 3 |
| Hotel details | 5 | 2 | 2 |
| Booking | 7 | 3 | 2 |
| Payments | 5 | 2 | 0 |
| My bookings | 2 | 0 | 1 |
| Reviews | 2 | 3 | 2 |
| Notifications | 1 | 1 | 1 |
| Staff dashboard | 3 | 1 | 3 |
| Admin dashboard | 3 | 2 | 1 |
| AI features | 1 | 0 | 5 |
| General and quality | 2 | 3 | 3 |

## 6. Functional Requirements

### 6.1 Authentication and Account (Login and Logout System)

This is the security core of HotelPro. It must be reliable, simple to use and safe.

| ID | Requirement | Priority |
| --- | --- | --- |
| AUTH-01 | Register with name, email and password (phone optional). Email must be unique. | **Must** |
| AUTH-02 | Password rules: at least 8 characters with upper case, lower case and a number. Show a password strength bar and a show/hide eye icon. | **Must** |
| AUTH-03 | Login with email and password. Show a clear error for wrong details without revealing whether the email exists. | **Must** |
| AUTH-04 | Secure session: a short-lived access token (15 minutes) plus a refresh token (7 days) stored in an httpOnly secure cookie. The app refreshes the session silently without asking the user to log in again. | **Must** |
| AUTH-05 | Logout: ends the session on this device, clears cookies, invalidates the refresh token on the server, and returns to the home page. | **Must** |
| AUTH-06 | Forgot password: user enters email and receives a reset link that expires in 15 minutes and works only once. | **Must** |
| AUTH-07 | Reset password page that validates the token and lets the user set a new password. All old sessions are logged out after a reset. | **Must** |
| AUTH-08 | Role-based access (guest, staff, admin) enforced on the server for every protected route and also in the interface menus. | **Must** |
| AUTH-09 | Protected pages redirect to login, then return the user to the page they wanted after login. | **Must** |
| AUTH-10 | Email verification: a link is emailed after sign-up. Unverified users can browse but cannot book. | **Should** |
| AUTH-11 | Logout from all devices (invalidates every refresh token for that user). | **Should** |
| AUTH-12 | Change password from the profile page; requires the current password. | **Should** |
| AUTH-13 | Brute-force protection: rate-limit login attempts and temporarily lock the account for 15 minutes after 5 wrong passwords. | **Should** |
| AUTH-14 | Remember me: extends the refresh token to 30 days when ticked. | **Should** |
| AUTH-15 | Sign in with Google (OAuth). | **Stand-out** |
| AUTH-16 | Active sessions page listing devices and last-used time with a Revoke button for each. | **Stand-out** |

### 6.2 Profile

| ID | Requirement | Priority |
| --- | --- | --- |
| PRO-01 | View and edit name, phone number and profile photo (stored in Cloudinary). | **Should** |
| PRO-02 | Save guest details so checkout forms are pre-filled next time. | **Should** |
| PRO-03 | Preferences such as language (English or Hindi) and preferred currency display. | **Stand-out** |

### 6.3 Search and Discovery

| ID | Requirement | Priority |
| --- | --- | --- |
| SRC-01 | Home page search bar: destination city, check-in date, check-out date, number of guests and rooms. | **Must** |
| SRC-02 | Validate dates: no past dates, check-out after check-in, maximum stay 30 nights. | **Must** |
| SRC-03 | Results page lists hotels with photo, name, area, star rating, guest rating, starting price per night and top amenities. | **Must** |
| SRC-04 | Filters: price range, star rating, guest rating, amenities, property type. | **Must** |
| SRC-05 | Sorting: price low to high, price high to low, best rated, most popular. | **Must** |
| SRC-06 | Pagination (or Load more) with total result count. | **Must** |
| SRC-07 | Results show only hotels that have rooms available for the chosen dates and guests. | **Must** |
| SRC-08 | Destination suggestions while typing (autocomplete). | **Should** |
| SRC-09 | Search and filters are kept in the page link so results can be shared or bookmarked. | **Should** |
| SRC-10 | Home page shows popular destinations and featured hotels. | **Should** |
| SRC-11 | Map view with hotel pins (OpenStreetMap with Leaflet) and a Near me option. | **Stand-out** |
| SRC-12 | Natural-language search: the user types a sentence such as 'quiet beach hotel under 4000 for two' and HotelPro turns it into filters. | **Stand-out** |
| SRC-13 | Show a Free cancellation badge and Only few rooms left urgency label. | **Stand-out** |

### 6.4 Hotel Details Page

| ID | Requirement | Priority |
| --- | --- | --- |
| HOT-01 | Photo gallery with a large image and thumbnails. | **Must** |
| HOT-02 | Description, address, amenities with icons, and policies (check-in and check-out time, cancellation, pets, ID requirements). | **Must** |
| HOT-03 | List of room types with photo, capacity, amenities, price per night and rooms left. | **Must** |
| HOT-04 | Availability and total price update for the chosen dates. | **Must** |
| HOT-05 | Guest rating summary and list of reviews with pagination. | **Must** |
| HOT-06 | Location map and nearby landmarks. | **Should** |
| HOT-07 | Wishlist heart to save the hotel to favourites (login required). | **Should** |
| HOT-08 | AI review summary showing a short summary with pros and cons. | **Stand-out** |
| HOT-09 | Similar hotels section using AI similarity. | **Stand-out** |

### 6.5 Booking

| ID | Requirement | Priority |
| --- | --- | --- |
| BKG-01 | Choose room type and number of rooms and see a price breakdown: nights multiplied by price, taxes, discount and total. | **Must** |
| BKG-02 | Guest details form: primary guest name, email, phone and special requests. | **Must** |
| BKG-03 | Room is held for 10 minutes while the guest pays; a visible countdown timer is shown. Expired holds release the room automatically. | **Must** |
| BKG-04 | Overbooking is impossible, even when many users book the last room at the same moment (database transactions). | **Must** |
| BKG-05 | Every booking gets a readable reference such as HP-2026-000123. | **Must** |
| BKG-06 | Confirmation page and confirmation email after successful payment. | **Must** |
| BKG-07 | Cancel a booking with refund based on the cancellation policy (section 8). | **Must** |
| BKG-08 | Downloadable PDF booking voucher or invoice. | **Should** |
| BKG-09 | Coupon or promo code field with validation and discount shown in the breakdown. | **Should** |
| BKG-10 | Book more than one room in a single booking. | **Should** |
| BKG-11 | Add booking to calendar (.ics file). | **Stand-out** |
| BKG-12 | Modify booking dates, with availability re-checked and price difference shown. | **Stand-out** |

### 6.6 Payments

| ID | Requirement | Priority |
| --- | --- | --- |
| PAY-01 | Pay through Razorpay Checkout in test mode (UPI, cards, net banking, wallets). | **Must** |
| PAY-02 | The payable amount is always calculated on the server, never trusted from the browser. | **Must** |
| PAY-03 | Payment signature is verified on the server before a booking is marked confirmed. | **Must** |
| PAY-04 | Webhook handling for payment success and failure, safe to receive twice (idempotent), so a booking is confirmed even if the user closes the browser. | **Must** |
| PAY-05 | Failed payment keeps the hold until it expires and allows the guest to retry. | **Must** |
| PAY-06 | Refund on cancellation using the Razorpay refund API (test mode) and a refund status shown to the user. | **Should** |
| PAY-07 | Payment history list in the profile. | **Should** |

### 6.7 My Bookings

| ID | Requirement | Priority |
| --- | --- | --- |
| MYB-01 | Tabs for Upcoming, Past and Cancelled bookings with status badges. | **Must** |
| MYB-02 | Open booking details, download voucher, and cancel upcoming bookings after a confirmation prompt. | **Must** |
| MYB-03 | Book again button on past bookings. | **Stand-out** |

### 6.8 Reviews and Ratings

| ID | Requirement | Priority |
| --- | --- | --- |
| REV-01 | Only guests with a completed stay can write a review. | **Must** |
| REV-02 | Review contains a star rating from 1 to 5 and text. | **Must** |
| REV-03 | One review per booking; can be edited for 7 days. | **Should** |
| REV-04 | Optional photo upload with a review. | **Should** |
| REV-05 | Admin can hide or delete reviews that break the rules. | **Should** |
| REV-06 | Hotel manager can reply publicly to a review. | **Stand-out** |
| REV-07 | Each review gets an automatic sentiment tag (positive, neutral, negative) by AI. | **Stand-out** |

### 6.9 Notifications

| ID | Requirement | Priority |
| --- | --- | --- |
| NOT-01 | Emails for: welcome, booking confirmation, cancellation and refund. | **Must** |
| NOT-02 | Reminder email one day before check-in. | **Should** |
| NOT-03 | In-app notification bell showing recent updates. | **Stand-out** |

### 6.10 Staff (Hotel Manager) Dashboard

| ID | Requirement | Priority |
| --- | --- | --- |
| STF-01 | Edit own hotel details, amenities, policies and photos. | **Must** |
| STF-02 | Add, edit and remove room types, set price and number of rooms. | **Must** |
| STF-03 | See and filter bookings of the hotel; mark Checked-in and Checked-out. | **Must** |
| STF-04 | Block dates for a room type (maintenance or private use). | **Should** |
| STF-05 | Calendar view of occupancy per day. | **Stand-out** |
| STF-06 | Reply to reviews. | **Stand-out** |
| STF-07 | AI pricing suggestions based on demand, which the manager can accept or reject. | **Stand-out** |

### 6.11 Admin Dashboard

| ID | Requirement | Priority |
| --- | --- | --- |
| ADM-01 | Manage users: search, view, deactivate or reactivate, change role. | **Must** |
| ADM-02 | Add, approve, edit or disable hotels and assign staff to hotels. | **Must** |
| ADM-03 | Analytics: revenue over time, bookings per day, occupancy rate and top hotels, shown as charts. | **Must** |
| ADM-04 | Create and manage coupon codes. | **Should** |
| ADM-05 | Moderate reviews. | **Should** |
| ADM-06 | Audit log of important actions (who did what and when). | **Stand-out** |

### 6.12 AI Features

| ID | Requirement | Priority |
| --- | --- | --- |
| AI-01 | Guardrails for all AI features: answers only from HotelPro data, refuse unrelated questions, never invent prices or availability, rate-limit requests, hide API keys on the server. | **Must** |
| AI-02 | Booking assistant chatbot that answers questions such as 'Which Goa hotel has a pool and allows pets?' using RAG on hotel data. | **Stand-out** |
| AI-03 | The assistant can check live availability and prices by calling HotelPro's own booking service. | **Stand-out** |
| AI-04 | Natural-language search (see SRC-12). | **Stand-out** |
| AI-05 | AI review summary (see HOT-08). | **Stand-out** |
| AI-06 | AI pricing suggestions for managers (see STF-07). | **Stand-out** |

### 6.13 General and Quality Features

| ID | Requirement | Priority |
| --- | --- | --- |
| GEN-01 | Fully responsive design for phone, tablet and desktop. | **Must** |
| GEN-02 | Loading skeletons, friendly error messages, empty states and a 404 page. | **Must** |
| GEN-03 | Help or FAQ page, Contact page, About, Terms and Privacy pages. | **Should** |
| GEN-04 | Basic SEO: page titles and descriptions. | **Should** |
| GEN-05 | Accessible forms: labels, keyboard use and sufficient colour contrast. | **Should** |
| GEN-06 | Dark mode toggle. | **Stand-out** |
| GEN-07 | Installable web app (PWA). | **Stand-out** |
| GEN-08 | Hindi and English interface. | **Stand-out** |

## 7. Key Flows and Acceptance Criteria

A feature is done only when the matching acceptance criteria pass on the live site.

| Flow | Given / When | Then (expected result) |
| --- | --- | --- |
| Register | A new visitor enters valid details and submits | Account is created, password is stored hashed, user is logged in (or asked to verify email), welcome email is sent |
| Register (error) | Email already exists, or password is weak | A clear message is shown and no account is created |
| Login | A user enters the correct email and password | Session starts, user lands on the page they wanted or the home page, navbar shows their name |
| Login (error) | Wrong password entered 5 times | Account is locked for 15 minutes and the user is told when to try again |
| Silent refresh | The access token expires while the user is active | The app gets a new token automatically and the user is not interrupted |
| Logout | A logged-in user clicks Logout | Cookies are cleared, the refresh token is invalidated, protected pages now redirect to login, and the Back button does not show private data |
| Logout everywhere | User chooses Logout from all devices | Every other device is logged out on its next request |
| Forgot password | User submits their email | A reset link is emailed (same message shown whether or not the email exists); link expires in 15 minutes and works once |
| Search | Guest enters city, dates and guests | Only hotels with availability are listed; filters and sorting work; results link can be shared |
| Book | Guest selects a room and starts checkout | Room is held for 10 minutes with a countdown; price breakdown matches the server calculation |
| Last room | 20 users try to book the last room at the same time | Exactly one booking succeeds; the others see a friendly 'No longer available' message |
| Pay | Guest completes a test payment | Signature verified, booking becomes Confirmed, email is sent, reference ID is shown |
| Pay (fail) | Payment fails or is cancelled | Booking stays Pending until the hold expires; guest can retry within the hold time |
| Cancel | Guest cancels an upcoming booking | Status becomes Cancelled, refund follows policy, room becomes available again, email is sent |
| Review | Guest with a completed stay opens review form | Review is saved once, hotel rating average updates |
| Role protection | A guest opens an admin link directly | Server returns Forbidden and the interface shows an access-denied page |

## 8. Business Rules

| # | Rule |
| --- | --- |
| BR-01 | Room availability for a date range = total rooms of the type minus rooms in Confirmed bookings or unexpired Pending holds that overlap the range. Two ranges overlap when existing check-in is before new check-out AND existing check-out is after new check-in. |
| BR-02 | Check-out day is not counted as a night: a stay from 10 to 12 December is 2 nights. |
| BR-03 | A hold lasts 10 minutes. After that the booking becomes Expired and the room is available again. |
| BR-04 | Total price = nights x price per night x rooms, plus tax (configurable percentage, sample value 12 percent), minus any valid coupon discount. |
| BR-05 | Cancellation refund: more than 48 hours before check-in = full refund; between 24 and 48 hours = 50 percent; less than 24 hours = no refund. |
| BR-06 | Standard check-in time is 12:00 and check-out time is 11:00 unless the hotel sets different times. |
| BR-07 | A booking can have at most 4 rooms and 30 nights. Guests per room cannot exceed the room capacity. |
| BR-08 | A user may hold at most 3 unpaid Pending bookings at a time. |
| BR-09 | A coupon has a code, discount type (percentage or fixed), maximum discount, validity dates and usage limit. |
| BR-10 | Only users with a Completed booking at a hotel can review it, once per booking. |
| BR-11 | Staff can manage only the hotel(s) assigned to them; admin can manage all. |
| BR-12 | Prices, totals and user roles are always decided on the server, never taken from the browser. |

### 8.1 Booking status lifecycle

| Status | Meaning | Can move to |
| --- | --- | --- |
| Pending | Room is held, payment not completed | Confirmed, Expired, Cancelled |
| Confirmed | Payment verified, room reserved | Checked-in, Cancelled |
| Checked-in | Guest has arrived (marked by staff) | Completed |
| Completed | Guest has checked out; review allowed | (final) |
| Cancelled | Cancelled by guest, staff or admin | (final) |
| Expired | Hold time ran out without payment | (final) |

## 9. Data Requirements

These are the main data collections in MongoDB. Field names may be refined during development.

| Collection | Main fields |
| --- | --- |
| User | name, email (unique), phone, passwordHash, role (guest/staff/admin), isVerified, isActive, failedLoginCount, lockUntil, avatarUrl, createdAt |
| Session | userId, refreshTokenHash, device, ipAddress, lastUsedAt, expiresAt, revoked |
| PasswordReset / EmailToken | userId, tokenHash, type (verify/reset), expiresAt, used |
| Hotel | name, city, address, description, location (latitude, longitude), starRating, avgRating, reviewCount, amenities, images, policies, checkInTime, checkOutTime, managerIds, status |
| RoomType | hotelId, name, capacity, pricePerNight, totalRooms, amenities, images, isActive |
| BlockedDate | roomTypeId, fromDate, toDate, reason |
| Booking | reference, userId, hotelId, roomTypeId, rooms, checkIn, checkOut, guests, guestDetails, priceBreakdown, couponCode, status, holdExpiresAt, cancelledAt, refundAmount, paymentId |
| Payment | bookingId, razorpayOrderId, razorpayPaymentId, amount, status, refundId, refundStatus, createdAt |
| Review | userId, hotelId, bookingId, rating, text, photos, sentiment, managerReply, status, createdAt |
| Wishlist | userId, hotelId |
| Coupon | code, type, value, maxDiscount, validFrom, validTo, usageLimit, usedCount |
| Notification | userId, type, message, isRead, createdAt |
| AuditLog | actorId, action, targetType, targetId, details, createdAt |
| HotelChunk (AI) | hotelId, text, embedding (vector), source |

## 10. Screens and Pages

| Page | Who can open | Main content |
| --- | --- | --- |
| Home | Everyone | Search bar, popular destinations, featured hotels, why choose us, AI assistant button |
| Hotels (results) | Everyone | Filters, sorting, hotel cards, map toggle, pagination |
| Hotel details | Everyone | Gallery, info, rooms, reviews, map, booking summary card |
| Checkout | Guest | Guest details, price breakdown, hold timer, Razorpay payment |
| Booking confirmation | Guest | Reference ID, summary, download voucher, add to calendar |
| My Bookings | Guest | Upcoming, Past and Cancelled tabs |
| Wishlist | Guest | Saved hotels |
| Profile and security | Logged in | Edit details, change password, active sessions, logout everywhere |
| Login / Register | Visitor | Forms with validation, Google sign-in (optional), forgot password link |
| Forgot / Reset password | Visitor | Email form and new-password form |
| Verify email | Visitor | Result of email verification link |
| Staff dashboard | Staff, Admin | Hotel details, rooms and prices, bookings, calendar, reviews, AI price tips |
| Admin dashboard | Admin | Analytics charts, users, hotels, coupons, reviews, audit log |
| Help, About, Contact, Terms, Privacy | Everyone | Static information pages |
| 404 and Access denied | Everyone | Friendly error pages |

## 11. Technical Overview

### 11.1 Architecture

- **Frontend** - React, Vite, Tailwind CSS, React Router, TanStack Query (hosted on Vercel)
- **Backend API** - Node.js, Express (layers: routes, controllers, services, models) (hosted on Render)
- **Database** - MongoDB Atlas with Mongoose, transactions and vector search
- **Services** - Razorpay (payments), Cloudinary (images), Email service, Gemini AI API, optional Redis for holds and rate limits

### 11.2 Technology choices

| Area | Choice | Why |
| --- | --- | --- |
| Frontend | React with Vite and Tailwind CSS | Industry standard, fast, easy to style |
| Backend | Node.js with Express | Same language as frontend, large community |
| Database | MongoDB Atlas (free M0) | Part of MERN, supports transactions and vector search |
| Auth | JWT access token plus refresh token cookie, bcrypt | Secure and widely used |
| Validation | Zod (or Joi) | Checks every request before it reaches business logic |
| Payments | Razorpay test mode | Works in India, free sandbox |
| Images | Cloudinary | Free tier, easy upload |
| AI | Google Gemini API free tier with Atlas Vector Search | Free to start, supports embeddings and tool calling |
| Hosting | Vercel (frontend), Render (backend) | Free tiers, deploy from GitHub |
| Quality | Jest or Vitest with Supertest, GitHub Actions, Docker, Sentry | Tests, automatic checks, monitoring |

### 11.3 Main API endpoints

| Area | Endpoints |
| --- | --- |
| Auth | POST /auth/register, /auth/login, /auth/logout, /auth/logout-all, /auth/refresh, /auth/forgot-password, /auth/reset-password, /auth/verify-email; GET /auth/me, /auth/sessions; PATCH /auth/change-password |
| Hotels | GET /hotels (search), GET /hotels/:id, POST/PUT/DELETE /hotels (staff, admin) |
| Rooms | GET /hotels/:id/rooms, GET /rooms/:id/availability, POST/PUT/DELETE /rooms (staff, admin) |
| Bookings | POST /bookings, GET /bookings/mine, GET /bookings/:id, PATCH /bookings/:id/cancel |
| Payments | POST /payments/create-order, /payments/verify, /payments/webhook |
| Reviews | GET/POST /hotels/:id/reviews, PATCH /reviews/:id, POST /reviews/:id/reply |
| Wishlist and profile | GET/POST/DELETE /wishlist, GET/PATCH /users/me |
| Coupons | POST /coupons/validate; admin: CRUD /coupons |
| Admin and staff | GET /admin/analytics, /admin/users, /admin/audit-log; GET /staff/bookings |
| AI | POST /ai/chat, POST /ai/search, GET /hotels/:id/review-summary, GET /staff/price-suggestions |

## 12. Non-Functional Requirements

| Area | Requirement |
| --- | --- |
| Security | Passwords hashed with bcrypt; tokens in httpOnly secure cookies; HTTPS only; all input validated; protection against common attacks (injection, XSS, CSRF); rate limiting on login, search and AI routes; secrets only in environment variables; roles checked on the server. |
| Privacy | Only the data needed is collected; users can edit their profile and request account deletion; passwords and tokens are never logged. |
| Performance | Main pages load in under 3 seconds on 4G; search results in under 1 second after the first request; database indexes on city, price, rating and booking dates. |
| Reliability | No overbooking under any load; payment webhooks are idempotent; expired holds are cleaned automatically; friendly error messages instead of crashes. |
| Availability | Live 24/7 on free hosting with a monitoring ping to reduce sleep delays. |
| Usability | Booking in at most 5 clear steps; consistent design; clear labels; mobile-first layout. |
| Accessibility | Keyboard navigation, form labels, alt text for images and good colour contrast. |
| Compatibility | Latest versions of Chrome, Edge, Firefox and Safari; phone, tablet and desktop. |
| Maintainability | Layered code structure, meaningful names, README, API documentation (Swagger), and automated tests. |
| Observability | Error tracking with Sentry and request logging. |

## 13. Integrations

| Service | Used for | Notes |
| --- | --- | --- |
| Razorpay | Online payments and refunds | Test mode keys; webhooks must be verified |
| Cloudinary | Hotel, room and profile images | Free tier; upload through the server |
| Email (Resend or Nodemailer) | Verification, reset, confirmation and reminder emails | Free tier limits apply |
| Google Gemini API | Chat assistant, search understanding, summaries, embeddings | Free tier limits; server-side only |
| MongoDB Atlas Vector Search | Finding relevant hotel information for the assistant | Index on the HotelChunk collection |
| Leaflet and OpenStreetMap | Map view | Free, no API key |
| Google OAuth (optional) | Sign in with Google | Needs a Google Cloud project |

## 14. Release Plan

| Phase | Weeks | What is delivered | Features covered |
| --- | --- | --- | --- |
| Phase 0 | 1 | Planning documents, repo, live skeleton on Vercel and Render with Atlas | Setup |
| MVP part 1 | 2 to 3 | Complete login and logout system, profile basics, hotels and search with seed data | AUTH Must, SRC Must, HOT Must |
| MVP part 2 | 4 to 5 | Booking engine with holds and transactions, checkout, Razorpay payments, emails, My Bookings | BKG Must, PAY Must, MYB, NOT-01 |
| MVP part 3 | 6 | Reviews, staff dashboard, admin dashboard with analytics | REV, STF Must, ADM Must |
| Version 1 | 7 | Should features: email verification, logout everywhere, coupons, vouchers, wishlist, block dates | All Should items |
| Stand-out | 8 to 9 | AI assistant, natural-language search, review summaries, plus 1 or 2 more extras | AI items and chosen extras |
| Launch | 10 | Tests, CI, security review, README, demo video, UAT document, final deployment | Quality and documentation |

> Order inside each phase: build the backend endpoint, test it, build the page, connect them, commit, deploy and check the live site. Always keep a working live version.

## 15. Testing and Acceptance Plan

- **Unit tests:** availability calculation, price and tax calculation, cancellation refund, coupon validation, token handling.
- **API tests:** register, login, refresh, logout, protected routes, booking creation, payment verification and webhook.
- **Concurrency test:** 20 simultaneous booking requests for the last room must produce exactly one booking.
- **End-to-end checks:** sign up, search, book, pay with test card, cancel, and review.
- **Security checks:** try opening admin pages as a guest, reuse an old refresh token after logout, reuse a reset link, send invalid input.
- **User Acceptance Testing (UAT):** run the flows in section 7 on the live site and record results in the UAT template.

## 16. Risks and Mitigation

| Risk | Impact | How we reduce it |
| --- | --- | --- |
| Too many features, project not finished | High | Build all Must items first; pick only 2 or 3 Stand-out items; keep a live version at all times |
| Free hosting sleeps or is slow | Medium | Monitoring ping; loading states in the interface |
| Cookie problems between Vercel and Render domains | Medium | Use secure and SameSite=None cookies in production; test login on the live site early |
| Payment or webhook bugs | High | Server-side verification, idempotent webhook, tests, Razorpay test mode only |
| AI gives wrong or invented answers | Medium | Answer only from retrieved hotel data; tool calls for live availability; guardrails and rate limits |
| Free AI or email limits are reached | Low | Cache AI results; limit emails; fall back to simple answers |
| Exposed secrets | High | .env files ignored by Git; keys only in hosting dashboards; never paste keys into AI chats |

## 17. Future Enhancements (After Version 1)

- Native mobile app and push notifications.
- Real-time room updates using WebSockets.
- Loyalty points and membership levels.
- Hotel-to-hotel price comparison and dynamic pricing automation.
- Support for more countries, currencies and languages.
- Chat between guest and hotel.
- Group bookings and corporate accounts.

## Appendix A: Feature Checklist

Tick each item when it works on the live site. Build in order: Must, then Should, then Stand-out.

| Priority | Features to complete |
| --- | --- |
| Must | Register, login, logout, forgot and reset password, role-based access, protected routes, silent token refresh; search, filters, sorting, pagination; hotel page, gallery, rooms, availability, reviews; booking with 10-minute hold, overbooking protection, reference ID, confirmation; Razorpay payment with verification and webhook; cancel with refund policy; My Bookings; reviews after stay; confirmation emails; staff hotel and room management and booking list; admin users, hotels and analytics; responsive design; loading, error and 404 pages; AI guardrails. |
| Should | Email verification, logout from all devices, change password, login lockout, remember me, profile edit, saved guest details, autocomplete, shareable search links, home page highlights, map location, wishlist, voucher PDF, coupons, multiple rooms, refund status, payment history, review editing and photos, review moderation, reminder emails, block dates, coupon management, help and legal pages, SEO, accessibility. |
| Stand-out | Google sign-in, active sessions page, map search, natural-language search, urgency labels, AI review summary, similar hotels, AI booking assistant with live availability, AI pricing suggestions, review sentiment, manager replies, calendar view, modify booking, add to calendar, audit log, in-app notifications, dark mode, PWA, Hindi and English. |

## Appendix B: Document Approval

| Role | Name | Signature | Date |
| --- | --- | --- | --- |
| Author | Niharika |  |  |
| Reviewer / Mentor |  |  |  |
| Approver |  |  |  |
