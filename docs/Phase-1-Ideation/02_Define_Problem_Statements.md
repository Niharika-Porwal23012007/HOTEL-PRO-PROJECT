# Phase 1: Ideation Phase
## Define the Problem Statements

| Metadata | Details |
|---|---|
| **Date** | 20 October 2026 |
| **Team ID** | HP-TEAM-2026 |
| **Project Name** | HotelPro — Hotel Booking and Management Platform with AI Assistant |
| **Maximum Marks** | 2 Marks |

---

### Customer Problem Statement Template
The purpose of this document is to define the core challenges experienced by both travellers (guests) and independent hotel operators, establishing clear problem boundaries to guide the design and engineering of the HotelPro platform.

*Reference Framework: Miro Customer Problem Statement Template (I am / I'm trying to / But / Because / Which makes me feel)*

---

### Problem Statements Matrix

| Problem Statement (PS) | I am (Customer) | I’m trying to | But | Because | Which makes me feel |
|---|---|---|---|---|---|
| **PS-1** | A working professional planning a family vacation to Goa. | Secure a guaranteed room reservation online for specific holiday dates. | When I arrive at the hotel lobby after an exhausting journey, the front desk tells me the room was given away or booked twice. | The reservation platform allows concurrent checkouts without database-level concurrency locks or atomic room holds. | Stranded, humiliated, and deeply anxious about finding emergency shelter for my family at midnight. |
| **PS-2** | A budget-conscious young traveller. | Compare hotel prices transparently and confirm pet and amenity policies. | The final checkout amount jumps by 30% to 40% due to surprise taxes, and property details like pool access or pet rules remain ambiguous. | Traditional platforms obscure mandatory fees until the final card swipe and rely on static, unverified text blurbs instead of real-time catalog intelligence. | Cheated, distrustful, and frustrated by having to open 10 tabs and make repeated phone calls to the front desk. |
| **PS-3** | An independent hotel owner managing a 20-room boutique resort. | Keep rooms occupied, manage daily arrivals, and update prices easily. | Rooms frequently get double-booked during holiday rushes, and front-desk staff struggle with clumsy paper registers or bloated enterprise software. | We lack a lightweight, cloud-based management portal with live room status, atomic hold synchronization, and 1-click check-in/out workflows. | Overwhelmed, vulnerable to bad online reviews, and constantly worried about operational chaos damaging our livelihood. |
| **PS-4** | A busy business traveller with tight schedules. | Quickly find a hotel room matching specific natural constraints (e.g., "quiet room near Whitefield Bengaluru under ₹4000 with high-speed WiFi"). | I have to spend 25 minutes fiddling with dozens of nested filter checkboxes and scrolling through irrelevant properties. | Search engines rely on rigid keyword lookups and lack conversational AI grounded in live room availability and verified location data. | Impatient, fatigued, and dissatisfied with the cumbersome booking experience. |

---

### Problem Analysis & Engineering Response

1. **Root Cause for PS-1 & PS-3 (Overbooking Disasters)**:
   - *Technical Cause*: Standard web apps read room inventory, process payment over 2 to 3 minutes, and then write the reservation to the database. If 5 users hit "Pay" simultaneously on the last available room, all 5 payments succeed, but only 1 room exists.
   - *HotelPro Solution*: Implementation of **Business Rule BR-01 & BR-03** — An atomic 10-minute hold window (`Pending` reservation with strict expiration) backed by MongoDB transactions that temporarily decrement availability the millisecond checkout begins.

2. **Root Cause for PS-2 (Pricing Surprise)**:
   - *Technical Cause*: Marketing engines split base tariffs, service fees, and GST across multiple steps to make entry prices appear artificially low.
   - *HotelPro Solution*: Implementation of **Business Rule BR-04 & PAY-02** — Mandatory server-side price computation where nights count, base rates, 12% GST, and promotional coupon discounts are itemized upfront on both the details and checkout screens.

3. **Root Cause for PS-4 (Search Friction)**:
   - *Technical Cause*: Legacy platforms use basic SQL/NoSQL text matching that fails when users write natural, multi-attribute travel sentences.
   - *HotelPro Solution*: Implementation of **AI-01 to AI-04** — An integrated AI Concierge using Retrieval-Augmented Generation (RAG) powered by Google Gemini, capable of parsing natural language sentences into structured filter parameters and validating live room rates directly against the catalog.
