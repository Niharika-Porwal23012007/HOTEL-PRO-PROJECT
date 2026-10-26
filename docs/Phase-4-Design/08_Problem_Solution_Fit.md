# Phase 4: Project Design Phase
## Problem – Solution Fit Template

| Metadata | Details |
|---|---|
| **Date** | 20 October 2026 |
| **Team ID** | HP-TEAM-2026 |
| **Project Name** | HotelPro — Hotel Booking and Management Platform with AI Assistant |
| **Maximum Marks** | 2 Marks |

---

### Problem – Solution Fit Overview
The Problem–Solution Fit ensures that the HotelPro platform directly addresses major systemic gaps in the Indian hospitality booking ecosystem before scaling operations. It establishes how each technical capability maps directly to real user and business problems.

---

### Parameter Analysis Table

| S. No. | Parameter | Comprehensive Description |
|---|---|---|
| **1** | **Problem Statement (Problem to be Solved)** | Travellers frequently face humiliating overbooking incidents upon arrival, misleading prices where unexpected taxes are tacked on at checkout, and slow customer support when seeking basic property information. Simultaneously, independent hoteliers running boutique properties struggle with operational chaos, double-entry in manual registers, and high commission rates (20–25%) demanded by dominant aggregators. |
| **2** | **Idea / Solution Description** | HotelPro is an end-to-end, commercial-grade hotel booking and property management web platform built on the MERN stack (React 18 + Node.js + MongoDB) with an integrated Google Gemini AI assistant. It provides travellers with guaranteed reservations backed by an atomic 10-minute hold window, upfront server-calculated pricing, and an AI Concierge. It provides hoteliers with a simple, lightweight operational portal for 1-click guest check-in/out and room inventory management. |
| **3** | **Novelty / Uniqueness** | • **Zero Overbooking Engine**: High-concurrency room holds using atomic database operations that temporarily decrement availability the millisecond checkout begins.<br>• **Grounded RAG AI Concierge**: An integrated AI assistant grounded strictly in HotelPro hotel catalog data, answering questions about amenities, pet policies, and live rates without hallucinations.<br>• **Transparent Server-Side Billing**: 100% upfront calculation of nights, base tariffs, and 12% GST.<br>• **Automated Tiered Cancellation**: Built-in 48h/24h refund calculation engine with Razorpay test integration.<br>• **Verified Guest Review Guard**: Only guests who have completed a stay can review a property. |
| **4** | **Social Impact / Customer Satisfaction** | • **Restores Traveller Trust**: Eliminates the travel anxiety of being stranded late at night due to overbooking.<br>• **Empowers Independent Hoteliers**: Provides boutique hotels with free, professional-grade management tools to compete on equal footing with major chains.<br>• **Transparent Commerce**: Clear pricing protects budget-conscious travellers from deceptive drip-pricing practices.<br>• **Reduced Friction**: Instant AI answers save travellers from making long-distance telephone inquiries. |
| **5** | **Business Model (Revenue Model)** | • **Transparent Low-Commission Model**: Charges hoteliers a modest 5% to 8% platform fee (significantly lower than the 20% to 25% charged by market oligopolies).<br>• **Featured Property Placement**: Optional paid promotion for hotels seeking higher visibility on the home search page.<br>• **Enterprise / Chain Licensing**: Subscription tier for boutique hotel chains managing multiple properties across different cities with central reporting. |
| **6** | **Scalability of the Solution** | • **Stateless Microservice Readiness**: Decoupled RESTful API architecture allows easy containerization (Docker) and horizontal autoscaling behind reverse proxies.<br>• **Cloud Native DB**: MongoDB Atlas document store easily shards across geographic regions as booking volumes scale.<br>• **Modular Expansion**: Architecture is pre-configured to easily adopt WebSockets for real-time room push notifications, multi-currency conversion, and native mobile apps. |
