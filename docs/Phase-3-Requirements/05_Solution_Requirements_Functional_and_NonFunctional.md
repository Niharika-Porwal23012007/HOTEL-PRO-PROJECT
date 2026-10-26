# Phase 3: Requirement Analysis Phase
## Solution Requirements (Functional & Non-Functional)

| Metadata | Details |
|---|---|
| **Date** | 20 October 2026 |
| **Team ID** | HP-TEAM-2026 |
| **Project Name** | HotelPro — Hotel Booking and Management Platform with AI Assistant |
| **Maximum Marks** | 4 Marks |

---

### 1. Functional Requirements (FR)

The functional requirements describe the precise operations and capabilities that the HotelPro platform delivers to travellers, hotel staff, and administrators.

| FR No. | Functional Requirement (Epic) | Sub-Requirement (Story / Sub-Task) | Detailed Description |
|---|---|---|---|
| **FR-1** | User Authentication & Security | **FR-1.1** User Registration | Sign up with full name, unique email, phone, and password with uppercase, lowercase, and numeric validation. |
| | | **FR-1.2** Dual-Token Session | Issue 15-minute JWT access token paired with an encrypted 7-day httpOnly refresh token cookie for silent background renewal. |
| | | **FR-1.3** Brute-Force Lockout | Automatically freeze login for 15 minutes after 5 consecutive incorrect password submissions (`lockUntil`). |
| | | **FR-1.4** Secure Logout | Invalidate active server session tokens, clear client-side httpOnly cookies, and redirect to home. |
| **FR-2** | Hotel Discovery & Filters | **FR-2.1** Multi-Attribute Search | Search hotels by destination city, check-in date, check-out date (max 30 nights), and guest/room counts. |
| | | **FR-2.2** Live Availability Query | Calculate room availability on the fly using date overlap logic so sold-out properties are excluded. |
| | | **FR-2.3** Dynamic Filtering & Sorting | Filter by star rating (3★, 4★, 5★), max price slider, property type, and amenities (pool, pet-friendly) with price/rating sorting. |
| **FR-3** | Hotel Details & Room Inventory | **FR-3.1** Media Gallery & Policies | Display high-resolution room photos, verified check-in/out hours, pet rules, and cancellation policies. |
| | | **FR-3.2** Room Category Breakdown | List available room categories with capacity, bed configuration, inclusions, and real-time vacant room counts. |
| **FR-4** | Overbooking-Proof Hold Engine | **FR-4.1** 10-Minute Atomic Hold | Temporarily reserve the room for 10 minutes (`Pending` status) with a visible real-time countdown timer. |
| | | **FR-4.2** Concurrency Collision Lock | Use atomic database operations to guarantee that 20 simultaneous users booking the last room results in exactly 1 reservation. |
| | | **FR-4.3** Automated Hold Expiry | Background cron worker checks and transitions uncompleted reservations from `Pending` to `Expired` every 60 seconds. |
| **FR-5** | Server-Calculated Pricing & Payments | **FR-5.1** Authoritative Pricing | Calculate stay nights (checkout day excluded), base price, 12% GST, and coupon discounts entirely on the server. |
| | | **FR-5.2** Razorpay Test Mode | Create Razorpay order, trigger test checkout modal, and verify HMAC-SHA256 signature before marking `Confirmed`. |
| | | **FR-5.3** Printable Voucher | Generate human-readable reference ID (`HP-YYYY-XXXXXX`) and formatted printable booking voucher. |
| **FR-6** | Booking Lifecycle & Cancellation | **FR-6.1** My Bookings Tabs | Categorize user reservations into Upcoming, Past Stays, and Cancelled/Expired tabs. |
| | | **FR-6.2** Tiered Refund Engine | Compute automated refund on cancellation: 100% refund (>48h), 50% refund (24h–48h), and 0% refund (<24h). |
| **FR-7** | Front-Desk Staff Operations | **FR-7.1** Guest Arrival Management | Hotel managers can view arrivals, filter by property, and toggle status between `Checked-in` and `Completed`. |
| | | **FR-7.2** Room Inventory Updates | Staff can modify room inventory, adjust rates per night, and blackout maintenance dates. |
| **FR-8** | Platform Administration | **FR-8.1** Executive Analytics | Admin dashboard displays gross revenue, total bookings, occupancy percentages, and top-performing properties. |
| | | **FR-8.2** Role-Based User Access | Manage platform users, search by email, deactivate fraudulent accounts, and change roles (`guest`, `staff`, `admin`). |
| **FR-9** | AI Concierge (RAG Assistant) | **FR-9.1** Grounded Q&A Assistant | Conversational assistant powered by Google Gemini that answers hotel inquiries strictly using real catalog records. |
| | | **FR-9.2** Natural Language Search | Parse conversational phrases (e.g. "beach hotel in Goa under 5000") directly into structured search filter parameters. |
| | | **FR-9.3** AI Review Synthesizer | Generate a 2-sentence summary with top pros and cons from verified guest reviews. |

---

### 2. Non-Functional Requirements (NFR)

| NFR No. | Non-Functional Requirement | Description & Measurable Target |
|---|---|---|
| **NFR-1** | **Usability & Design** | Mobile-first responsive layout with consistent navigation, accessible color contrast ratios (WCAG AA), friendly form error states, and clear countdown indicators. |
| **NFR-2** | **Concurrency & Reliability** | **Zero Overbooking Guarantee**: Even under extreme concurrency (20 simultaneous requests for the last available room), the platform must guarantee exactly 1 successful reservation with zero race conditions. |
| **NFR-3** | **Security & Data Protection** | Passwords hashed using bcrypt (cost factor 10+); refresh tokens stored in secure httpOnly cookies; all sensitive API routes protected with Bearer JWT tokens and role verification middleware; input validated with Zod. |
| **NFR-4** | **Performance & Latency** | Main hotel search and landing pages must load in under 3 seconds on a standard 4G mobile connection; search and filter API responses must resolve in under 500ms. |
| **NFR-5** | **Availability & Resilience** | Platform operates 24/7 with health-check monitoring endpoint (`/api/health`); automatic fallback in-memory data store ensures the UI remains fully responsive even during database network fluctuations. |
| **NFR-6** | **AI Safety & Guardrails** | AI assistant must never hallucinate rates or room availability; all answers are strictly grounded in HotelPro catalog records; polite deflection for queries unrelated to hospitality or travel. |
