# KaneAI Project Context — Airbnb Clone Demo App (TestMu AI)

## Application Overview
Full-stack Airbnb-clone built with React 18 + TypeScript (Vite) on the frontend and Node.js + Express on the backend. Uses in-memory mock data (no live database required for demo).

## Base URLs
- Frontend: http://localhost:5174  (Vite default for this project)
- Backend API: http://localhost:5000
- Preview/CI: use {{base_url}}

## Demo Credentials (all passwords: password123)
| Email | Name | Role |
|-------|------|------|
| demo@lambdatest.com | Demo User | Guest + Host |
| abhishekkumar@lambdatest.com | Abhishek Kumar | Host |
| testuser@lambdatest.com | Test User | Guest only |
| superhost@lambdatest.com | Super Host Elite | Host |
| lambdatestadmin@email.com | LambdaTest Admin | Admin |

## Routing (HashRouter — URLs use #/)
| Route | Page | Auth Required |
|-------|------|---------------|
| / | Home — search bar + listing grid | No |
| /listing/:id | Listing Detail — photos, amenities, booking form, reviews | No |
| /login | Login | No |
| /register | Registration | No |
| /bookings | My Bookings | Yes |
| /profile | User Profile (view + edit) | Yes |
| /wishlist | My Wishlist | Yes |
| /search | Search Results with filters | No |
| /become-host | Become a Host landing | No |
| /favorites | Favorites (legacy) | Yes |

## Key UI Components & Interactions

### Home Page (/)
- Category filter bar at top: All, Beachfront, Cabins, Villas, Apartments, Luxury, Budget, Mountain
- Search bar: location text input, check-in date picker, check-out date picker, guests counter
- Listing cards grid (up to 20 per page) with pagination
- Each listing card: photo, title, location, price/night, star rating, review count
- Clicking a card navigates to /listing/:id

### Search Results Page (/search)
- Triggered when searching from Home; query params: location, checkIn, checkOut, guests
- Results count heading: "X stays in [location]"
- Search params summary (dates + guests)
- Filters toggle button opens a filters panel
- Filters panel: property type buttons (All/Villa/Apartment/Cabin/House/Loft/Condo/Penthouse), min/max price inputs, Apply + Clear buttons
- Sort dropdown: Recommended, Price Low→High, Price High→Low, Top Rated
- Results grid: cards with title, location, type badge, rating, price, heart (wishlist) button
- No results state: "No stays found" message + Clear all filters button

### Listing Detail Page (/listing/:id)
- Photo gallery: main large image + 4 thumbnails
- Title, star rating, review count, location
- Host info section: property type, bedrooms, bathrooms, max guests
- Description section
- Amenities grid
- Booking card (sticky right sidebar):
  - Check-in date picker (label: CHECK-IN)
  - Check-out date picker (label: CHECKOUT)
  - Guests dropdown (1 to maxGuests)
  - Reserve button (disabled if no dates selected)
  - Price breakdown: nightly rate × nights + service fee (14%) + total
- Reviews section (below main content):
  - Reviews heading with average rating + count (e.g. "★ 4.5 · 3 reviews")
  - Rating breakdown bars (5★ down to 1★)
  - Average rating large display
  - Individual review cards (reviewer name, stars, date, comment, Delete button if owner)
  - "No reviews yet" / "Be the first to review" when empty
  - Leave a Review form (authenticated users only) or "Sign in to leave a review" prompt

### Reviews Feature (on Listing Detail)
- Star rating picker: 5 clickable stars, labels: Poor/Fair/Good/Very Good/Excellent
- Comment textarea: min 10 chars, max 500 chars, live character counter
- Submit Review button
- Success banner: "Your review was submitted successfully!"
- Error messages: rating required, comment too short, already reviewed (409), network error
- Delete button visible only on user's own reviews; triggers confirm dialog

### Wishlist Page (/wishlist)
- Requires authentication; redirects to /login if not logged in
- Heading: "My Wishlist"
- Count subtitle: "X saved properties" or "No saved properties yet"
- Empty state: heart icon + "Your wishlist is empty" + "Explore Properties" button
- Wishlist grid: cards with photo, type badge, title, location, price, remove (trash) button
- Remove button triggers DELETE /api/wishlist/:listingId
- Success banner: "Removed from wishlist"

### Login Page (/login)
- Email input (id: email), Password input (id: password)
- Sign In button
- "Don't have an account? Register" link
- Error toast on invalid credentials

### Register Page (/register)
- First name, Last name, Email, Password inputs
- Create Account button
- "Already have an account? Login" link

### Profile Page (/profile)
- Requires auth; shows "Please log in" if not authenticated
- Header: avatar, name, email, Edit Profile button
- Info cards: personal details (name, email, phone, bio)
- Edit mode: input fields for firstName, lastName, email, phone, bio
- Save + Cancel buttons in edit mode

### Bookings Page (/bookings)
- Requires auth
- Lists confirmed, pending, completed, cancelled bookings
- Each card: property image, title, location, dates, guests, total price, status badge
- Status badges: confirmed (green), pending (yellow), completed (blue), cancelled (red)

## API Endpoints

### Auth
- POST /api/auth/login     — body: { email, password } → { token, user }
- POST /api/auth/register  — body: { firstName, lastName, email, password } → { token, user }
- GET  /api/auth/me        — Bearer token → current user

### Listings
- GET /api/listings                   — query: location, checkIn, checkOut, guests, propertyType, minPrice, maxPrice, sortBy, page
- GET /api/listings/:id               — single listing with reviews array

### Bookings (auth required)
- GET    /api/bookings                — user's bookings
- POST   /api/bookings               — body: { listingId, checkIn, checkOut, guests }
- DELETE /api/bookings/:id           — cancel booking

### Reviews (POST/DELETE auth required)
- GET    /api/reviews/:listingId     — all reviews + averageRating + count
- POST   /api/reviews/:listingId     — body: { rating (1-5), comment (10-500 chars) } → 201 | 400 | 409
- DELETE /api/reviews/:reviewId      — delete own review → 200 | 403 | 404

### Wishlist (all auth required)
- GET    /api/wishlist               — user's wishlist items
- POST   /api/wishlist/:listingId   — add to wishlist → 201 | 409
- DELETE /api/wishlist/:listingId   — remove from wishlist → 200 | 404
- GET    /api/wishlist/check/:listingId — { inWishlist: boolean }

## data-testid Reference (for automated test targeting)

### Home
- (listing cards use ListingCard component — no testids, use text/aria selectors)

### Search Results Page
- search-results-page, search-results-heading, search-params-summary
- filters-toggle-btn, filters-panel, sort-select
- filter-type-all, filter-type-villa, filter-type-apartment, filter-type-cabin, filter-type-house, filter-type-loft, filter-type-condo, filter-type-penthouse
- filter-min-price, filter-max-price, apply-filters-btn, clear-filters-btn
- results-grid, result-card, result-title, result-rating, result-price, view-listing-btn
- results-skeleton (loading), no-results (empty state), clear-search-btn
- wishlist-heart-btn (on each result card, auth only)

### Listing Detail
- (standard layout — use heading text, label text, button text)
- Reserve button text: "Reserve" / "Booking..."
- CHECK-IN label, CHECKOUT label, GUESTS label

### Reviews Section
- review-section, reviews-heading, average-rating-display, rating-breakdown
- rating-bar-5, rating-bar-4, rating-bar-3, rating-bar-2, rating-bar-1
- reviews-list, review-card, reviewer-name, review-comment, delete-review-btn
- review-login-prompt, review-form, star-rating-picker
- star-1, star-2, star-3, star-4, star-5, selected-rating-label
- review-comment-input, char-count, review-error, submit-review-btn
- review-success, no-reviews-message, reviews-loading, reviews-error

### Wishlist Page
- wishlist-page, wishlist-heading, wishlist-count, wishlist-loading
- wishlist-empty, explore-properties-btn
- wishlist-grid, wishlist-item, wishlist-item-title, wishlist-item-price
- remove-wishlist-btn, wishlist-success, wishlist-item-missing
