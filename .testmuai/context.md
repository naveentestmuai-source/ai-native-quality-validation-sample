# KaneAI Project Context — Airbnb Clone Demo App

## Application Overview
This is a full-stack Airbnb-clone built with React 18 (Vite + TypeScript) on the frontend
and Node.js + Express on the backend. It uses mock data (no live database required).

## Base URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Preview/CI deployment: use {{base_url}} variable

## Demo Credentials
- Guest user: email = guest@example.com | password = guest123
- Host user:  email = host@example.com  | password = host123

## Key Pages & Routes
| Route              | What it does                                      |
|--------------------|---------------------------------------------------|
| /                  | Home — search bar + listing grid                  |
| /listings/:id      | Listing detail — photos, amenities, booking form  |
| /login             | Login page                                        |
| /register          | Registration page                                 |
| /bookings          | Authenticated user's booking history              |
| /profile           | Authenticated user's profile                      |

## Important UI Patterns
- Search bar at top of home page: location input, check-in date, check-out date, guests
- Listing cards on home page: click to open detail
- Booking form on detail page: select dates, guest count, click "Reserve"
- Login form: email field, password field, "Sign In" button
- Register form: firstName, lastName, email, password, "Create Account" button

## API Endpoints (for API test objectives)
- POST /api/auth/login          — body: { email, password }
- POST /api/auth/register       — body: { firstName, lastName, email, password }
- GET  /api/auth/me             — requires Authorization: Bearer <token>
- GET  /api/listings            — optional query: location, checkIn, checkOut, guests
- GET  /api/listings/:id        — single listing detail
- POST /api/bookings            — requires auth, body: { listingId, checkIn, checkOut, guests }
- GET  /api/bookings            — requires auth, returns user bookings
- DELETE /api/bookings/:id      — requires auth, cancels a booking

## Notes for the Agent
- The app uses JWT tokens stored in localStorage under the key "token"
- Listing cards show price per night, location, rating, and a photo
- The search bar auto-filters the listing grid without page reload
- Date pickers use a calendar popup UI
- All property types: Villa, Apartment, Cabin, House, Loft, Condo, Penthouse
