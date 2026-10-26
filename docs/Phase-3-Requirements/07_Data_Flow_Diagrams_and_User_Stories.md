# Phase 3: Requirement Analysis Phase
## Data Flow Diagram (DFD) & User Stories

| Metadata | Details |
|---|---|
| **Date** | 20 October 2026 |
| **Team ID** | HP-TEAM-2026 |
| **Project Name** | HotelPro — Hotel Booking and Management Platform with AI Assistant |
| **Maximum Marks** | 4 Marks |

---

### 1. Data Flow Diagrams (DFD)

A Data Flow Diagram illustrates how information enters, flows through, and is persisted across the HotelPro platform. It captures user interactions, internal processing engines, and persistent data stores.

#### 1.1 DFD Level 0: Context Level Diagram

```mermaid
graph TD
    Guest["Guest / Traveller"]
    Staff["Hotel Staff / Manager"]
    Admin["Platform Administrator"]
    
    System["HotelPro Core System\n(Booking & AI Engine)"]
    
    RP["Razorpay Gateway (Test)"]
    Gemini["Google Gemini AI"]
    
    Guest -->|Search criteria, hold request, payment details| System
    System -->|Available hotels, 10-min hold timer, booking voucher| Guest
    
    Staff -->|Room rates, inventory, check-in status| System
    System -->|Arrival lists, occupancy reports, review replies| Staff
    
    Admin -->|User role updates, platform configurations| System
    System -->|Gross revenue metrics, audit logs| Admin
    
    System -->|Order creation & signature payload| RP
    RP -->|Payment signature & status response| System
    
    System -->|Hotel catalog context & guest queries| Gemini
    Gemini -->|Structured grounded answers & search filters| System
```

#### 1.2 DFD Level 1: Subsystem Breakdown

```mermaid
graph TD
    User["User (Guest / Staff / Admin)"]
    
    P1["1.0 Authentication & Session Manager"]
    P2["2.0 Catalog & Search Engine"]
    P3["3.0 Overbooking-Proof Booking & Hold Engine"]
    P4["4.0 Payment Verification Service"]
    P5["5.0 AI Concierge & NLP Parser"]
    P6["6.0 Staff Operations & Front Desk"]
    
    D1[("Users & Sessions Store")]
    D2[("Hotels & Room Inventory Store")]
    D3[("Bookings & Holds Store")]
    D4[("Payments & Refunds Store")]
    D5[("Reviews Store")]
    
    User -->|Credentials| P1
    P1 -->|Tokens & Cookies| User
    P1 <-->|Read / Write session| D1
    
    User -->|Dates, City, Filters| P2
    P2 <-->|Query availability| D2
    P2 <-->|Check active holds| D3
    P2 -->|Filtered hotels| User
    
    User -->|Reserve room| P3
    P3 <-->|Atomic hold lock| D3
    P3 -->|10-min hold timer| User
    
    User -->|Pay test amount| P4
    P4 <-->|Verify signature| D4
    P4 -->|Mark Confirmed| D3
    P4 -->|Voucher ID| User
    
    User -->|Conversational question| P5
    P5 <-->|Read catalog data| D2
    P5 -->|Grounded response| User
    
    User -->|Check-in / Check-out| P6
    P6 <-->|Update booking status| D3
```

---

### 2. Comprehensive User Story Table

| User Type | Functional Requirement (Epic) | User Story / Task | Acceptance Criteria | Priority | Release |
|---|---|---|---|---|---|
| **Guest** | User Authentication | As a new guest, I want to create an account with my email and password so I can book rooms and view history. | Password meets 8-character rule (Aa1); duplicate email blocked with friendly message; returns JWT and session cookie. | High | Sprint-1 |
| **Guest** | User Authentication | As a guest, I want my active session to refresh automatically without interrupting my booking flow. | Expired 15-minute access token is refreshed silently using httpOnly cookie via Axios interceptor. | High | Sprint-1 |
| **Guest** | Hotel Search | As a traveller, I want to search hotels by destination city, stay dates, and guest count. | Only hotels with real vacant rooms for the selected dates are returned; date validation blocks past dates. | High | Sprint-2 |
| **Guest** | Hotel Search & Filter | As a traveller, I want to filter hotels by maximum price, star rating, and amenities like swimming pool and pet-friendly. | Instant UI filtering; search criteria preserved in URL query parameters so links can be bookmarked or shared. | High | Sprint-2 |
| **Guest** | Hotel Details | As a traveller, I want to view room categories with photos, bed configurations, inclusions, and house policies. | Displays gallery thumbnails, check-in/out hours, verified cancellation policies, and vacant room counts. | High | Sprint-2 |
| **Guest** | Booking & Hold Engine | As a guest, I want my selected room to be held for 10 minutes while I complete payment so nobody else books it. | Room availability immediately decrements; visible countdown timer starts; auto-releases if not paid in 10 minutes. | Critical | Sprint-3 |
| **Guest** | Concurrency Safety | As a guest, I want guaranteed protection against overbooking even if multiple people click "Book" simultaneously. | Under 20 simultaneous requests for the last room, exactly 1 booking succeeds and others receive friendly alert. | Critical | Sprint-3 |
| **Guest** | Transparent Pricing | As a guest, I want an itemized price breakdown showing base tariff, nights count, and 12% GST before paying. | Calculated strictly on server; shows nights × base price + 12% GST - coupon discount; matches final payment. | High | Sprint-3 |
| **Guest** | Payments | As a guest, I want to complete payment using Razorpay in test mode and receive a reference number and voucher. | Test checkout opens with prefilled details; signature verified on server; generates `HP-YYYY-XXXXXX` reference. | Critical | Sprint-3 |
| **Guest** | My Bookings & Cancellation | As a guest, I want to cancel an upcoming booking and receive an automated refund based on the hotel policy. | Cancellation policy enforced: >48h gives 100%, 24-48h gives 50%, <24h gives 0%; status updates to `Cancelled`. | High | Sprint-3 |
| **Guest** | Verified Reviews | As a guest who completed a stay, I want to submit a 1-to-5 star rating and review. | Form is accessible only for bookings with status `Completed`; updates hotel average rating automatically. | Medium | Sprint-4 |
| **Hotel Staff** | Front-Desk Operations | As a hotel manager, I want to view daily guest arrivals and mark guests as Checked-in and Checked-out. | Staff dashboard lists hotel reservations; status transitions `Confirmed` -> `Checked-in` -> `Completed`. | High | Sprint-4 |
| **Hotel Staff** | Review Moderation | As a hotel manager, I want to publicly reply to reviews written by guests who stayed at my property. | Reply appears beneath the verified guest review on the public hotel details page. | Medium | Sprint-4 |
| **Admin** | Platform Governance | As an administrator, I want to monitor gross platform revenue, total bookings count, and manage user roles. | Executive dashboard displays KPI cards, top hotels table, and user role management controls. | High | Sprint-4 |
| **User (All)** | AI Concierge | As a user, I want an AI assistant that answers specific hotel questions using real property catalog records. | Answers questions accurately using RAG on catalog data; provides honest answers about pools, pets, and rates. | High | Sprint-4 |
