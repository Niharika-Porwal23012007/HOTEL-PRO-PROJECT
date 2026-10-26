# Phase 2: Project Planning Phase
## Project Planning Template (Product Backlog, Sprint Planning, Stories & Story Points)

| Metadata | Details |
|---|---|
| **Date** | 20 October 2026 |
| **Team ID** | HP-TEAM-2026 |
| **Project Name** | HotelPro — Hotel Booking and Management Platform with AI Assistant |
| **Maximum Marks** | 5 Marks |

---

### 1. Project Planning Overview
The HotelPro platform development follows an Agile Scrum framework structured across **four focused 2-week sprints**. Each sprint addresses prioritized epics from the product backlog, ensuring incremental delivery, automated testing, and continuous verification of business rules.

- **Sprint 1**: Foundation, Architecture Setup & Dual-Token Security Engine
- **Sprint 2**: Catalog Discovery, Live Date Filters & Property Detail View
- **Sprint 3**: Overbooking-Proof Hold Engine, Razorpay Payments & My Bookings
- **Sprint 4**: Staff Operations, Admin Analytics & Grounded RAG AI Concierge

---

### 2. Product Backlog, Sprint Schedule & Estimation

| Sprint | Functional Requirement (Epic) | User Story Number | User Story / Task | Story Points | Priority | Responsible Role |
|---|---|---|---|---|---|---|
| **Sprint-1** | User Authentication & Security | **USN-01** | As a new user, I can register with my name, email, and a secure password (with strength validation) so that I have a private account. | 3 | High | Backend / Security |
| **Sprint-1** | User Authentication & Security | **USN-02** | As an existing user, I can log in and receive a short-lived access token and an encrypted httpOnly refresh cookie for silent session renewal. | 3 | High | Full Stack |
| **Sprint-1** | User Authentication & Security | **USN-03** | As a system administrator, I want brute-force protection that automatically locks user accounts for 15 minutes after 5 failed login attempts. | 2 | High | Backend / Auth |
| **Sprint-1** | User Authentication & Security | **USN-04** | As a logged-in user, I can safely log out, invalidating active server refresh tokens and clearing client cookies. | 1 | Medium | Frontend / Auth |
| **Sprint-2** | Hotel Discovery & Catalog Search | **USN-05** | As a traveller, I can search hotels by destination city, check-in date, check-out date, and guest count to view live available rooms. | 3 | High | Full Stack |
| **Sprint-2** | Hotel Discovery & Catalog Search | **USN-06** | As a traveller, I can filter search results by price range, star rating, property type, and amenities (pool, pet-friendly) with dynamic sorting. | 3 | High | Frontend / UI |
| **Sprint-2** | Hotel Details & Room Inventory | **USN-07** | As a traveller, I can open a hotel details page to view high-resolution photo galleries, verified amenities, house policies, and room categories. | 2 | High | Frontend / UI |
| **Sprint-3** | Concurrency-Proof Booking Engine | **USN-08** | As a guest, when I start checkout, the system reserves the room for 10 minutes with a visible countdown timer, preventing double booking. | 5 | Critical | Backend / Core Engine |
| **Sprint-3** | Pricing & Payments | **USN-09** | As a guest, I can view an itemized server-calculated price breakdown (nights, base price, 12% GST, coupon discounts) before paying. | 3 | High | Full Stack |
| **Sprint-3** | Payments & Confirmation | **USN-10** | As a guest, I can pay securely via Razorpay Checkout (test mode) with server-side HMAC-SHA256 signature verification and receive a confirmation voucher. | 5 | Critical | Backend / Payment |
| **Sprint-3** | Booking Management & Cancellations | **USN-11** | As a guest, I can view my bookings (Upcoming, Past, Cancelled) and cancel an upcoming stay to receive an automated refund based on the 48h/24h policy. | 3 | High | Full Stack |
| **Sprint-4** | Hotelier & Staff Portal | **USN-12** | As a hotel manager, I can view all daily guest arrivals, see booking details, and mark guests as Checked-in and Checked-out with one click. | 3 | High | Frontend / Staff |
| **Sprint-4** | Verified Reviews | **USN-13** | As a guest who completed a stay, I can write a 1-to-5 star review, and the hotel manager can publicly reply to it. | 2 | Medium | Full Stack |
| **Sprint-4** | Platform Administration & KPIs | **USN-14** | As a platform administrator, I can view gross revenue, total bookings, occupancy percentages, and manage user roles. | 3 | High | Full Stack / Admin |
| **Sprint-4** | AI Concierge Integration | **USN-15** | As a user, I can chat with an AI Concierge that queries live hotel data to answer specific amenity, location, and availability questions without hallucinations. | 5 | High | AI / Backend |

---

### 3. Sprint Velocity & Resource Allocation Summary

- **Total Story Points**: 43 Story Points across 15 User Stories.
- **Sprint 1 (Week 1–2)**: 9 Story Points — Core architecture, schema models, and secure dual-token authentication.
- **Sprint 2 (Week 3–4)**: 8 Story Points — Catalog seed scripts, multi-attribute search, date overlap queries, and hotel details page.
- **Sprint 3 (Week 5–6)**: 16 Story Points — 10-minute hold engine, concurrency lock test, Razorpay sandbox, and voucher generation.
- **Sprint 4 (Week 7–8)**: 10 Story Points — Staff and admin portals, verified reviews, and RAG AI Concierge with catalog grounding.
