# Platform Architecture

## Overview

Realtor India Platform is built using modern web technologies with a focus on performance, scalability, and user experience.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide icons
- **Maps**: Leaflet + React Leaflet
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context + Hooks
- **Animations**: Framer Motion

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Next.js API Routes + Supabase Client

### Deployment
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **Database**: Supabase Cloud

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Next.js    │  │  React       │  │  Tailwind    │  │
│  │   App Router │  │  Components  │  │  CSS         │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   CDN        │  │  Edge        │  │  Analytics   │  │
│  │   Caching    │  │  Functions   │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Next.js Server                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   API        │  │  Server      │  │  Middleware  │  │
│  │   Routes     │  │  Components  │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Supabase Backend                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │  Auth        │  │  Storage     │  │
│  │  Database    │  │  Service     │  │  Buckets     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Database Schema

### Core Tables

#### properties
Main property listings table with full-text search, geospatial indexing, and comprehensive property details.

**Key Features:**
- PostGIS for location-based queries
- Full-text search with tsvector
- Automatic price per sqft calculation
- RERA compliance tracking

#### profiles
User profiles extending Supabase auth.users with role-based access.

**Roles:**
- Buyer
- Seller
- Agent
- Builder
- Admin

#### agents
Agent/broker profiles with ratings, reviews, and service areas.

#### property_images
Image gallery with primary image designation and display ordering.

#### amenities & property_amenities
Flexible amenity system with categorization (building, society, nearby).

#### favorites
User-saved properties with quick access.

#### saved_searches
Saved search criteria with email alerts.

#### viewings
Property viewing scheduling and management.

#### leads
Lead capture and tracking system.

#### reviews
Property and agent reviews with ratings.

### Database Features

1. **Row Level Security (RLS)**
   - Granular access control
   - User-specific data isolation
   - Public property visibility

2. **Triggers & Functions**
   - Auto-update timestamps
   - Search vector maintenance
   - Favorites count tracking

3. **Indexes**
   - GiST index for geospatial queries
   - GIN index for full-text search
   - B-tree indexes for common queries

## API Layer

### Supabase Client
```typescript
// lib/supabase/client.ts
- Centralized Supabase client
- Type-safe database queries
- Authentication helpers
```

### API Functions
```typescript
// lib/api/properties.ts
- getProperties() - Filtered property listing
- getPropertyById() - Single property details
- getFeaturedProperties() - Featured listings
- searchProperties() - Full-text search
- addToFavorites() - Favorite management
- createLead() - Lead generation
- scheduleViewing() - Viewing appointments
```

## Component Architecture

### Page Components
```
app/
├── page.tsx                 # Homepage
├── properties/
│   ├── page.tsx            # Property listing
│   └── [id]/page.tsx       # Property details
├── (auth)/
│   ├── login/
│   └── signup/
└── dashboard/
    ├── favorites/
    ├── searches/
    └── viewings/
```

### Reusable Components
```
components/
├── ui/                     # Base UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
├── property/              # Property components
│   ├── PropertyCard.tsx
│   ├── PropertyFilters.tsx
│   ├── FeaturedProperties.tsx
│   ├── ContactForm.tsx
│   └── MortgageCalculator.tsx
├── search/               # Search components
│   └── SearchBar.tsx
├── maps/                # Map components
│   └── PropertyMap.tsx
└── home/               # Homepage components
    └── PopularCities.tsx
```

## Data Flow

### Property Listing Flow
```
User Input → SearchBar Component
    ↓
URL Parameters Updated
    ↓
Properties Page Fetches Data
    ↓
Supabase Query with Filters
    ↓
PropertyCard Components Render
    ↓
User Interaction (View/Favorite)
```

### Property Details Flow
```
User Clicks Property
    ↓
Navigate to /properties/[id]
    ↓
Fetch Property Details + Images + Amenities
    ↓
Increment View Count
    ↓
Render Property Details Page
    ↓
User Actions (Contact/Schedule/Favorite)
```

## Performance Optimizations

### 1. Image Optimization
- Next.js Image component
- Lazy loading
- Responsive images
- WebP format support

### 2. Code Splitting
- Route-based splitting
- Dynamic imports
- Component lazy loading

### 3. Caching Strategy
- Static page generation
- Incremental Static Regeneration (ISR)
- API response caching
- Browser caching headers

### 4. Database Optimization
- Indexed queries
- Connection pooling
- Query optimization
- Materialized views for analytics

## Security Measures

### 1. Authentication
- JWT-based sessions
- Secure password hashing
- Email verification
- OAuth integration

### 2. Authorization
- Row Level Security (RLS)
- Role-based access control
- API route protection
- Middleware guards

### 3. Data Protection
- Input validation (Zod)
- SQL injection prevention
- XSS protection
- CSRF tokens

### 4. API Security
- Rate limiting
- API key rotation
- CORS configuration
- Request validation

## Scalability Considerations

### Horizontal Scaling
- Stateless architecture
- CDN distribution
- Database read replicas
- Load balancing

### Vertical Scaling
- Database optimization
- Query performance tuning
- Caching layers
- Resource monitoring

### Future Enhancements
- Microservices architecture
- Message queue (Bull/Redis)
- Elasticsearch for search
- GraphQL API layer

## Monitoring & Analytics

### Application Monitoring
- Vercel Analytics
- Error tracking (Sentry)
- Performance metrics
- User behavior analytics

### Database Monitoring
- Query performance
- Connection pool stats
- Storage usage
- Slow query logs

## Development Workflow

### Local Development
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
```

### Testing Strategy
- Unit tests (Jest)
- Integration tests (React Testing Library)
- E2E tests (Playwright)
- API tests (Supertest)

### CI/CD Pipeline
```
Git Push → GitHub Actions
    ↓
Run Tests
    ↓
Build Application
    ↓
Deploy to Vercel (Preview)
    ↓
Manual Approval
    ↓
Deploy to Production
```

## Best Practices

### Code Quality
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Code reviews

### Performance
- Lighthouse scores > 90
- Core Web Vitals optimization
- Bundle size monitoring
- Lazy loading

### Accessibility
- WCAG 2.1 AA compliance
- Semantic HTML
- ARIA labels
- Keyboard navigation

### SEO
- Meta tags optimization
- Structured data (JSON-LD)
- Sitemap generation
- robots.txt configuration

---

For detailed implementation guides, see:
- [Deployment Guide](../DEPLOYMENT.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [API Documentation](./API.md)