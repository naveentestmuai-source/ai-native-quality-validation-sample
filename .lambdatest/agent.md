<<<<<<< HEAD
# KaneAI Test Generation Instructions

## IMPORTANT: Generate ALL scenarios listed below as individual test cases.
## Do not stop after one scenario. Generate every numbered test case independently.
## App URL: https://naveentestmuai-source.github.io/ai-native-quality-validation-sample/#/
## All passwords: password123  

---

## SCENARIO 1: Guest login with valid credentials redirects to home
Navigate to the app URL, click Login, enter email demo@lambdatest.com and password password123, click Sign In, verify the user is redirected to the home page and listing cards are visible.

## SCENARIO 2: Login with wrong password shows error
Navigate to the app URL, click Login, enter email demo@lambdatest.com and password wrongpassword, click Sign In, verify an error message or toast notification appears.

## SCENARIO 3: Login with empty email shows validation error
Navigate to the app login page, leave email empty, enter any password, click Sign In, verify a validation error appears.

## SCENARIO 4: Login with empty password shows validation error
Navigate to the app login page, enter email demo@lambdatest.com, leave password empty, click Sign In, verify a validation error appears.

## SCENARIO 5: New user registration with valid data succeeds
Navigate to the app register page, enter firstName Test, lastName User, a unique email, password password123, click Create Account, verify successful registration or redirect.

## SCENARIO 6: Registration with missing required fields shows error
Navigate to the app register page, leave all fields empty, click Create Account, verify validation errors appear for required fields.

## SCENARIO 7: Logout from authenticated session signs user out
Navigate to the app, log in as demo@lambdatest.com with password123, find the logout option in the header navigation, click it, verify the user is signed out and returned to home or login page.

## SCENARIO 8: Home page loads with listing cards visible
Navigate to the app home page, verify that property listing cards are displayed on the page with titles and prices visible.

## SCENARIO 9: Category filter Villas shows only Villa properties
Navigate to the app home page, click the Villas category filter button, verify the listing results update to show Villa type properties.

## SCENARIO 10: Category filter Cabins shows only Cabin properties
Navigate to the app home page, click the Cabins category filter button, verify the listing results update to show Cabin type properties.

## SCENARIO 11: Location search for Miami filters results
Navigate to the app home page, find the location search input, type Miami, submit the search, verify the results show properties in Miami.

## SCENARIO 12: Search with no matching location shows empty state
Navigate to the app home page, search for location ZZZNowherePlace999, verify that no results or an empty state message is shown.

## SCENARIO 13: Listing card displays title price and rating
Navigate to the app home page, find the first listing card, verify it shows a property title, a price per night, and a star rating.

## SCENARIO 14: Clicking listing card navigates to detail page
Navigate to the app home page, click on the first listing card, verify the browser navigates to a listing detail page showing the full property information.

## SCENARIO 15: Listing detail page loads with title and images
Navigate directly to the app listing detail page for listing ID 1, verify the page loads with a property title, at least one image, and host information visible.

## SCENARIO 16: Listing detail shows amenities section
Navigate to the app listing detail page, scroll to the amenities section, verify amenities are listed such as WiFi or parking.

## SCENARIO 17: Reserve button is disabled without dates selected
Navigate to the app listing detail page, find the Reserve button in the booking card on the right side, verify the button is disabled or greyed out when no check-in or check-out dates are selected.

## SCENARIO 18: Price breakdown appears after selecting dates
Navigate to the app listing detail page, select a check-in date of next month first and check-out date 5 days later, verify a price breakdown appears showing nightly rate, service fee, and total price.

## SCENARIO 19: Reserve button redirects unauthenticated user to login
Navigate to the app listing detail page without logging in, select check-in and check-out dates, click the Reserve button, verify the user is redirected to the login page.

## SCENARIO 20: Listing detail shows host information
Navigate to the app listing detail page, verify the property type and host name are shown such as Villa hosted by a name.

## SCENARIO 21: Reviews section appears on listing detail page
Navigate to the app listing detail page, scroll down past the amenities, verify a Reviews section is visible showing either review cards or a no reviews message.

## SCENARIO 22: Review cards show reviewer name star rating and comment
Navigate to the app listing detail page for a listing that has reviews, verify each review card shows the reviewer name, star rating icons, and review comment text.

## SCENARIO 23: Rating breakdown bars render on listing with reviews
Navigate to the app listing detail page that has reviews, verify a rating breakdown section shows bars for 5 star through 1 star ratings.

## SCENARIO 24: Unauthenticated user sees sign in prompt in reviews section
Navigate to the app listing detail page without logging in, scroll to the reviews section at the bottom, verify a sign in to leave a review prompt or link is shown instead of the review form.

## SCENARIO 25: Authenticated user sees Leave a Review form
Navigate to the app, log in as demo@lambdatest.com with password123, navigate to a listing detail page, scroll to the reviews section, verify a Leave a Review form is visible with star rating picker and comment textarea.

## SCENARIO 26: Submit review fails with no star rating selected
Navigate to the app, log in as demo@lambdatest.com, go to a listing detail page, scroll to the review form, leave star rating unselected, type a comment of at least 10 characters, click Submit Review, verify an error message appears about rating being required.

## SCENARIO 27: Submit review fails with comment under 10 characters
Navigate to the app, log in as demo@lambdatest.com, go to a listing detail page, scroll to the review form, click the 5 star rating, type only 5 characters in the comment, click Submit Review, verify an error message about minimum comment length appears.

## SCENARIO 28: Submit review succeeds with valid rating and comment
Navigate to the app, log in as testuser@lambdatest.com with password123, navigate to listing detail page ID 2, scroll to the review form, click the 4 star rating, type This is a great property with amazing views in the comment, click Submit Review, verify a success message appears.

## SCENARIO 29: Character counter updates as user types review comment
Navigate to the app, log in as demo@lambdatest.com, go to a listing detail page, scroll to the review form, click in the comment textarea, type some text, verify the character count display updates showing characters typed out of 500.

## SCENARIO 30: Wishlist page redirects unauthenticated user to login
Navigate directly to the app wishlist page URL hash /wishlist without being logged in, verify the user is redirected to the login page.

## SCENARIO 31: Authenticated user with empty wishlist sees empty state
Navigate to the app, log in as testuser@lambdatest.com with password123, navigate to the wishlist page, verify the empty wishlist state is shown with text about no saved properties and an Explore Properties button.

## SCENARIO 32: Explore Properties button from empty wishlist goes to home
Navigate to the app, log in as testuser@lambdatest.com, go to wishlist page, click the Explore Properties button, verify the user is navigated to the home page with listing cards.

## SCENARIO 33: Heart button on listing adds to wishlist
Navigate to the app, log in as demo@lambdatest.com, go to the home page, find a listing card with a heart icon, click the heart icon, verify the heart turns filled or red indicating the listing was added to wishlist.

## SCENARIO 34: Wishlist page shows saved properties
Navigate to the app, log in as demo@lambdatest.com, navigate to the wishlist page, verify that if any properties are saved they appear as cards with title, price, and a remove button.

## SCENARIO 35: Remove button deletes listing from wishlist
Navigate to the app, log in as demo@lambdatest.com with password123, go to the wishlist page, click the remove or trash button on a saved listing, verify the listing is removed from the wishlist and a success message appears.

## SCENARIO 36: Search results page loads with result count
Navigate to the app home page, search for location New York, verify the search results page or updated listing grid shows a count of results found.

## SCENARIO 37: Filters toggle button opens filter panel
Navigate to the app, perform a search for any location, find the Filters button in the results header, click it, verify a filters panel appears with property type options.

## SCENARIO 38: Property type filter Villa shows only villas
Navigate to the app search results, open the filters panel, click the Villa property type filter, click Apply, verify the results show only Villa type properties.

## SCENARIO 39: Sort by price low to high shows cheapest first
Navigate to the app, search for listings, find the sort dropdown, select Price Low to High, verify the listing results are reordered with lower priced properties appearing first.

## SCENARIO 40: Sort by Top Rated shows highest rated first
Navigate to the app, search for listings, find the sort dropdown, select Top Rated, verify listings with highest star ratings appear at the top.

## SCENARIO 41: Min price filter removes cheap listings
Navigate to the app search results, open filters, enter 500 in the min price field, click Apply, verify listings priced below 500 per night are removed from results.

## SCENARIO 42: Clear filters button resets all active filters
Navigate to the app search results, apply a Villa filter and min price filter, then click the Clear button, verify all filters are reset and full results return.

## SCENARIO 43: Profile page requires authentication
Navigate directly to the app profile page hash /profile without logging in, verify a message appears asking the user to log in or the user is redirected.

## SCENARIO 44: Authenticated user profile shows name and email
Navigate to the app, log in as demo@lambdatest.com with password123, navigate to the profile page, verify the user full name Demo User and email are displayed on the page.

## SCENARIO 45: Edit profile mode shows editable fields
Navigate to the app, log in as demo@lambdatest.com, go to the profile page, click the Edit Profile button, verify input fields appear for first name, last name, email, phone, and bio.

## SCENARIO 46: Bookings page shows booking history
Navigate to the app, log in as demo@lambdatest.com with password123, navigate to the bookings page, verify the page loads and shows either booking cards or a message about no bookings.

## SCENARIO 47: Booking card shows property name dates and status
Navigate to the app, log in as demo@lambdatest.com, go to the bookings page, verify that booking cards display the property name, check-in and check-out dates, total price, and a status badge such as confirmed, pending, or completed.

## SCENARIO 48: Header navigation shows correct links when logged in
Navigate to the app, log in as demo@lambdatest.com with password123, verify the header navigation shows links for Wishlist, Profile, Bookings, and a logout option.

## SCENARIO 49: Header navigation shows login and register when logged out
Navigate to the app home page without logging in, verify the header navigation shows Login and Register links or buttons.

## SCENARIO 50: Become a host page loads correctly
Navigate to the app become-host page hash /become-host, verify the page loads with content about becoming a host and relevant information or a call to action.

---

## END OF SCENARIOS
## Total: 50 test cases to generate
## Generate each scenario as a separate automated test case in the project folder.
=======
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
>>>>>>> 6b46226 (feat: add wishlist + search results page, wire reviews, 50 KaneAI test scenarios)
