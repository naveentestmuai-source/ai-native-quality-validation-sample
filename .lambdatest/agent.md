# KaneAI Agent Instructions — Airbnb Clone Demo

## App Under Test
Full-stack Airbnb-clone. Frontend: React + TypeScript (HashRouter, URLs use /#/). Backend: Node.js + Express. All passwords: `password123`.

## Base URL
Use the deployed preview URL provided in the PR, or `http://localhost:5174` locally.

## Primary Test Scenarios (generate test cases for ALL of these)

### MODULE 1: Authentication (8 scenarios)
1. Guest login with valid credentials (demo@lambdatest.com / password123) — verify redirect to home
2. Login with wrong password — verify error message appears
3. Login with empty email — verify validation error
4. Login with empty password — verify validation error
5. New user registration with valid data — verify success and redirect
6. Registration with existing email — verify duplicate error
7. Registration with missing required fields — verify validation
8. Logout from authenticated session — verify user is signed out

### MODULE 2: Home Page & Search (7 scenarios)
9. Home page loads with listing cards visible
10. Category filter "Villas" shows only Villa properties
11. Category filter "Cabins" shows only Cabin properties
12. Location search for "Miami" filters results to Miami listings
13. Search with no matching location shows empty/no-results state
14. Listing card displays title, price, rating, and location
15. Clicking listing card navigates to detail page (/listing/:id)

### MODULE 3: Search Results Page (/search) (8 scenarios)
16. Search results page loads with result count heading
17. Filter panel opens when Filters button is clicked
18. Property type filter "Villa" shows only villas
19. Property type filter "Apartment" shows only apartments
20. Min price filter removes listings below the minimum
21. Max price filter removes listings above the maximum
22. Sort by "Price: Low to High" shows cheapest listings first
23. Sort by "Top Rated" shows highest-rated listings first
24. Clear filters button resets all filters
25. No-results state when filters produce zero matches

### MODULE 4: Listing Detail Page (6 scenarios)
26. Listing detail page loads with title, images, and host info
27. Amenities section displays available amenities
28. Reserve button is disabled when no dates selected
29. Price breakdown appears when check-in and check-out dates are selected (shows nightly × nights + service fee + total)
30. Reserve button triggers login redirect when user is not authenticated
31. Booking confirmation navigates to /bookings after successful reserve

### MODULE 5: Reviews Feature (9 scenarios)
32. Reviews section displays average rating and review count on listing detail
33. Individual review cards show reviewer name, star rating, and comment
34. Rating breakdown bars (5★ to 1★) render correctly
35. Unauthenticated user sees "Sign in to leave a review" prompt
36. Authenticated user sees the Leave a Review form
37. Submit review fails with no star rating selected (error shown)
38. Submit review fails with comment under 10 characters (error shown)
39. Submit review succeeds with 5-star rating and valid comment — success banner appears
40. Authenticated user can delete their own review (Delete button visible, confirm dialog shown)

### MODULE 6: Wishlist Feature (6 scenarios)
41. Unauthenticated user visiting /wishlist is redirected to /login
42. Authenticated user with empty wishlist sees "Your wishlist is empty" state
43. Clicking "Explore Properties" from empty wishlist navigates to home
44. Heart button on search results adds listing to wishlist (POST /api/wishlist/:id)
45. Wishlist page shows saved properties with title, price, and remove button
46. Remove button deletes listing from wishlist and shows success banner

### MODULE 7: Profile Page (3 scenarios)
47. Unauthenticated user sees "Please log in" message on /profile
48. Authenticated user profile page shows name, email, and Edit Profile button
49. Edit mode: click Edit Profile, change first name, click Save — changes reflected

### MODULE 8: Bookings Page (2 scenarios)
50. Authenticated user sees their booking history on /bookings
51. Booking cards show property name, dates, total price, and status badge

## Test Generation Notes
- App uses HashRouter so URLs are like `http://base/#/listing/1` — navigate directly to these
- All auth tokens are stored in localStorage under key "token"
- Default demo password for all accounts: `password123`
- The reviews API returns `{ reviews, count, averageRating }` for GET /api/reviews/:listingId
- Wishlist requires Bearer token in Authorization header
- Store extracted values using "store as" pattern for assertions
