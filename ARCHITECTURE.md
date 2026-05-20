# Architecture Documentations

## Overview

This Airbnb Clone follows a **client-server architecture** with a clear separation between frontend and backend. The application is built with modern web technologies emphasizing type safety, scalability, and developer experience.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (React)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   UI Layer   │  │ State Layer  │  │Service Layer │  │
│  │  (Components)│  │   (Zustand)  │  │   (API)      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTP/REST API
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend (Node.js)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Routes     │  │ Controllers  │  │    Models    │  │
│  │              │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          │ (Optional)
                          ▼
                   ┌──────────────┐
                   │   MongoDB    │
                   │   Database   │
                   └──────────────┘
```

## Frontend Architecture

### Technology Stack
- **React 18**: Component-based UI library
- **TypeScript**: Static type checking
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **React Query**: Server state management
- **Zustand**: Client state management
- **Tailwind CSS**: Utility-first styling

### Directory Structure

```
frontend/src/
├── components/         # Reusable UI components
│   ├── Header.tsx
│   ├── SearchBar.tsx
│   └── ListingCard.tsx
├── pages/             # Page-level components
│   ├── Home.tsx
│   ├── ListingDetail.tsx
│   └── Login.tsx
├── services/          # API communication layer
│   ├── api.ts        # Axios instance
│   ├── authService.ts
│   └── listingService.ts
├── store/             # Global state management
│   ├── authStore.ts   # Auth state (Zustand)
│   └── searchStore.ts # Search filters state
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Root component with routing
└── main.tsx           # Application entry point
```

### Data Flow

1. **User Interaction** → Component
2. Component → **Service Layer** (API call)
3. Service Layer → **Backend API**
4. Backend responds → **React Query** (caching)
5. React Query → **Component** (re-render)

### State Management Strategy

- **Server State**: React Query for caching and synchronization
- **Client State**: Zustand for lightweight global state (auth, UI state)
- **Component State**: React hooks (`useState`, `useReducer`) for local state

### Key Features Implementation

#### Search Functionality
```typescript
// SearchBar component manages UI state
const [location, setLocation] = useState('')
const [checkIn, setCheckIn] = useState<Date | null>(null)
const [checkOut, setCheckOut] = useState<Date | null>(null)

// Parent component (Home) manages filters
const [searchFilters, setSearchFilters] = useState<SearchFilters>({})

// React Query fetches data
const { data } = useQuery({
  queryKey: ['listings', searchFilters],
  queryFn: () => listingService.getAllListings(searchFilters)
})
```

#### Routing Structure
```
/ (Home)                    - Landing page with search and listings
/listings/:id (Detail)      - Individual property details
/login                      - User authentication
/register                   - User registration
/bookings                   - User's booking history
/profile                    - User profile management
```

## Backend Architecture

### Technology Stack
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript**: Type safety
- **MongoDB** (Optional): NoSQL database
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing

### Directory Structure

```
backend/src/
├── config/            # Configuration files
│   ├── database.ts    # MongoDB connection
│   └── env.ts         # Environment variables
├── controllers/       # Request handlers
│   ├── listingController.ts
│   ├── listingController.mock.ts  # Mock data controllers
│   └── authController.ts
├── data/              # Mock data for development
│   └── mockData.ts    # 28 property listings
├── middleware/        # Custom middleware
│   ├── auth.ts        # JWT verification
│   ├── errorHandler.ts
│   └── cors.ts
├── models/            # Database schemas
│   ├── Listing.ts
│   ├── User.ts
│   └── Booking.ts
├── routes/            # API route definitions
│   ├── listings.ts
│   ├── auth.ts
│   └── bookings.ts
├── types/             # TypeScript interfaces
│   └── index.ts
└── index.ts           # Application entry point
```

### API Architecture

#### RESTful Endpoints

```
POST   /api/auth/register      - Create new user account
POST   /api/auth/login         - Authenticate user
GET    /api/auth/me            - Get current user

GET    /api/listings           - Get all listings (with filters)
GET    /api/listings/:id       - Get single listing
POST   /api/listings           - Create listing (auth)
PUT    /api/listings/:id       - Update listing (auth)
DELETE /api/listings/:id       - Delete listing (auth)

GET    /api/bookings           - Get user bookings (auth)
POST   /api/bookings           - Create booking (auth)
DELETE /api/bookings/:id       - Cancel booking (auth)
```

#### Request Flow

```
Client Request
      ↓
Express App
      ↓
CORS Middleware
      ↓
Route Handler
      ↓
Authentication Middleware (if required)
      ↓
Controller
      ↓
Model/Mock Data
      ↓
Response
```

### Mock Data Mode

The application can run without MongoDB using in-memory mock data:

```typescript
// backend/src/data/mockData.ts
export const mockListings = [/* 28 properties */]
export const mockUsers = [/* 5 users */]
export const mockBookings = [/* 3 bookings */]

// Controllers automatically use mock data
if (!mongoose.connection.readyState) {
  // Use mock data
  return mockListings.filter(/* filters */)
}
```

## Data Models

### Listing Model
```typescript
interface Listing {
  _id: string
  title: string
  description: string
  propertyType: 'Villa' | 'Apartment' | 'Cabin' | 'House' | 'Loft' | 'Condo' | 'Penthouse'
  price: number
  location: {
    address: string
    city: string
    state: string
    country: string
    coordinates: { lat: number; lng: number }
  }
  amenities: string[]
  images: string[]
  bedrooms: number
  bathrooms: number
  maxGuests: number
  hostId: string | User
  rating: number
  reviewCount: number
  isAvailable: boolean
}
```

### User Model
```typescript
interface User {
  _id: string
  email: string
  password: string  // Hashed
  firstName: string
  lastName: string
  avatar?: string
  phone?: string
  isHost: boolean
}
```

### Booking Model
```typescript
interface Booking {
  _id: string
  listingId: string
  guestId: string
  hostId: string
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled'
}
```

## Security Architecture

### Authentication Flow

```
1. User registers/logs in
      ↓
2. Backend validates credentials
      ↓
3. Backend generates JWT token
      ↓
4. Frontend stores token (localStorage)
      ↓
5. Frontend includes token in requests
      ↓
6. Backend verifies token (middleware)
      ↓
7. Request proceeds to controller
```

### Security Measures

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure, signed tokens
- **CORS**: Configured for specific origins
- **Input Validation**: Sanitize user inputs
- **Rate Limiting**: Prevent abuse (recommended)
- **HTTPS**: Production deployment (recommended)

## Performance Optimizations

### Frontend
- **Code Splitting**: React.lazy for route-based splitting
- **Image Optimization**: Lazy loading, responsive images
- **Caching**: React Query with staleTime
- **Memoization**: useMemo and useCallback
- **Bundle Size**: Tree shaking with Vite

### Backend
- **Database Indexing**: On frequently queried fields
- **Query Optimization**: Select only needed fields
- **Caching**: Redis for session data (recommended)
- **Compression**: gzip for responses
- **Connection Pooling**: MongoDB connection pool

## Deployment Architecture

### Recommended Setup

```
Frontend (Vercel/Netlify)
      ↓
CDN (CloudFlare)
      ↓
Backend (Heroku/Railway/AWS)
      ↓
Database (MongoDB Atlas)
```

### Environment Configuration

**Development:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Database: Mock data or local MongoDB

**Production:**
- Frontend: https://your-domain.com
- Backend: https://api.your-domain.com
- Database: MongoDB Atlas cluster

## Scalability Considerations

### Current State
- Monolithic backend
- Client-side rendering
- Single server instance

### Future Improvements
- **Microservices**: Split into listing, booking, auth services
- **Load Balancing**: Multiple backend instances
- **CDN**: Static assets delivery
- **Database Sharding**: Horizontal scaling
- **Caching Layer**: Redis for frequently accessed data
- **Server-Side Rendering**: Next.js migration
- **WebSockets**: Real-time notifications

## Testing Strategy

### Frontend Testing
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API mocking with MSW
- **E2E Tests**: Playwright/Cypress
- **Type Checking**: TypeScript compiler

### Backend Testing
- **Unit Tests**: Jest for controllers
- **Integration Tests**: Supertest for API
- **Database Tests**: In-memory MongoDB
- **Load Testing**: Artillery/K6

## Monitoring & Logging

### Recommended Tools
- **Error Tracking**: Sentry
- **Performance**: New Relic / DataDog
- **Logging**: Winston / Pino
- **Analytics**: Google Analytics / Mixpanel

---

**Last Updated**: January 2025
**Maintained By**: LambdaTest Team
