# Phase 1: Ideation Phase
## Brainstorm & Idea Prioritization Template

| Metadata | Details |
|---|---|
| **Date** | 20 October 2026 |
| **Team ID** | HP-TEAM-2026 |
| **Project Name** | HotelPro — Hotel Booking and Management Platform with AI Assistant |
| **Maximum Marks** | 4 Marks |

---

### Step 1: Team Gathering, Collaboration and Selection of Problem Statement

#### 1.1 Team Context & Methodology
During the ideation session, the team gathered to analyze the core failures of modern online hotel booking systems and independent hotel operations in India. Using the insights gathered from the Empathy Map Canvas and Customer Problem Statements, the team prioritized high-impact problem areas where software architecture can completely eliminate friction.

#### 1.2 Selected Primary Problem Statement
> **Core Challenge**: How might we design a hotel booking and inventory platform that **guarantees zero overbooking** under high concurrent traffic, provides **transparent upfront pricing**, and integrates a **grounded AI concierge** that answers travellers' questions using live hotel catalog data?

---

### Step 2: Brainstorm, Idea Listing and Grouping

The team generated and categorized creative, architectural, and operational ideas into five functional clusters:

#### Group A: Core Booking Engine & Overbooking Prevention
1. **Atomic Room Holds**: When a guest initiates checkout, lock the requested room for exactly 10 minutes with an active hold window.
2. **Live Date Overlap Algorithm**: Real-time availability calculation where a room is unavailable if existing check-in is before new check-out AND existing check-out is after new check-in.
3. **Automated Hold Expiry**: Background cron/interval worker that automatically re-releases rooms to the public pool if payment is not completed within 600 seconds.
4. **Anti-Hoarding Limits**: Restrict any single user account from holding more than 3 unpaid pending bookings at any given time.

#### Group B: Pricing, Coupons & Payment Integrity
5. **Server-Decided Billing**: Prevent browser-side price manipulation by calculating night counts, 12% statutory GST, and coupon discounts entirely on the Node.js backend.
6. **Razorpay Sandbox Integration**: Seamless checkout support for UPI, Credit/Debit cards, and Net Banking in test mode with automated signature verification.
7. **Tiered Flexible Cancellation**: Automated refund calculation: 100% refund if cancelled >48 hours before check-in, 50% refund between 24-48 hours, and 0% within 24 hours.

#### Group C: Artificial Intelligence & Natural Language Discovery
8. **Catalog-Grounded RAG Assistant**: An AI Concierge powered by Google Gemini that answers questions (e.g. "Does the Goa resort have a pool and allow pets?") strictly using real hotel records.
9. **Natural Language Search Parser**: Convert human phrases like *"quiet beach hotel in Goa under 5000 for two"* directly into structured search filter parameters.
10. **AI Review Synthesizer**: Automatically summarize dozens of guest reviews into a balanced summary highlighting top pros and potential cons.

#### Group D: Hotelier & Staff Empowerment
11. **Lightweight Front-Desk Dashboard**: A clean, single-screen management portal allowing staff to view arrivals, departures, and change room status with 1-click Check-in / Check-out.
12. **Direct Manager Review Replies**: Enable hotel managers to respond publicly to verified guest reviews to build trust.
13. **Flexible Room Inventory Manager**: Staff can adjust prices, total room inventory, and blackout specific maintenance dates.

#### Group E: Security, Usability & Account Lifecycle
14. **Dual-Token Authentication**: Secure 15-minute access token in memory paired with an encrypted 7-day httpOnly refresh token cookie for silent session renewal.
15. **Brute-Force Account Lockout**: Automatically lock accounts for 15 minutes after 5 consecutive failed login attempts.
16. **Verified Guest Reviews Only**: Restrict review submissions exclusively to guests with a confirmed, completed booking.

---

### Step 3: Idea Prioritization (Value vs. Effort Matrix)

To ensure the project is delivered on schedule with high architectural rigor, ideas were mapped across an Impact vs. Complexity matrix:

```
HIGH VALUE
    |
    |  [ QUICK WINS ]                        [ STRATEGIC DIFFERENTIATORS ]
    |  - 10-Minute Hold Window (BR-03)       - Zero-Overbooking Concurrency Lock (BR-01)
    |  - Server-Side 12% GST Calculation      - RAG AI Concierge with Gemini API (AI-02)
    |  - Dual-Token httpOnly Auth (AUTH-04)   - Automated 48h/24h Refund Engine (BR-05)
    |  - 5-Attempt Account Lockout (AUTH-13)  - Front-Desk Check-in/Check-out Manager (STF-03)
    |  - Verified Post-Stay Reviews (REV-01)  - Natural Language Search Parser (SRC-12)
    |
    |---------------------------------------------------------------------------------
    |
    |  [ NICE TO HAVE ]                      [ DEFERRED / VERSION 2 ]
    |  - Dark Mode Toggle                     - Native iOS / Android Mobile App
    |  - Add Stay to Calendar (.ics)          - Multi-Currency International Settlement
    |  - Urgency & Badging Labels             - Dynamic AI Surge Pricing Algorithm
    |  - Coupon Codes (WELCOME10, PRO500)     - Direct Real-Time Chat with Front Desk
    |
LOW VALUE ------------------------------------------------------------------> HIGH EFFORT
```

#### MoSCoW Prioritization Summary

| Priority | Selected Features | Justification |
|---|---|---|
| **Must Have (MVP)** | • Zero-overbooking database transaction engine<br>• 10-minute room hold with live countdown timer<br>• Dual-token secure authentication (15m access + 7d httpOnly cookie)<br>• Razorpay test mode payment with signature verification<br>• Filtered hotel search & dynamic date availability<br>• My Bookings dashboard with cancellation engine | Fundamental platform requirements without which commercial hotel booking cannot function safely. |
| **Should Have** | • Grounded RAG AI Concierge with hotel catalog awareness<br>• Staff portal for front-desk Check-in / Check-out<br>• Admin revenue & occupancy analytics charts<br>• Verified review submission after completed stay<br>• Coupon code validation engine (`WELCOME10`) | Important features that elevate the platform above generic student projects and satisfy professional evaluation criteria. |
| **Could Have (Stand-out)** | • Natural language search parsing<br>• AI synthesized review summary (Pros & Cons)<br>• Manager public review reply system<br>• Active device sessions page with 1-click revoke | High-impact differentiators that demonstrate mastery of AI integration and user experience. |
| **Won't Have (v1)** | • Native iOS/Android app<br>• Multi-currency payments<br>• Real-time WebSocket front-desk chat | Explicitly out of scope for Version 1 to guarantee flawless delivery of core systems. |
