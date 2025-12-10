# 🚀 Quick Start Guide

Get your Realtor India Platform up and running in 10 minutes!

## Prerequisites

- Node.js 18+ installed
- Git installed
- A Supabase account (free tier works)
- A code editor (VS Code recommended)

## Step 1: Clone the Repository

```bash
git clone https://github.com/AnandGandhi03/realtor-india-platform.git
cd realtor-india-platform
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, Tailwind CSS, and more.

## Step 3: Set Up Supabase

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project
   - Choose a name (e.g., "realtor-india")
   - Set a strong database password
   - Select a region (choose closest to your users)
   - Click "Create new project"

### Run Database Schema

1. Wait for your project to finish setting up (~2 minutes)
2. Go to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/schema.sql` from this repository
5. Paste into the SQL editor
6. Click **Run** or press `Ctrl/Cmd + Enter`
7. You should see "Success. No rows returned"

### Get Your API Keys

1. Go to **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 4: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` in your editor

3. Add your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. (Optional) Add Google Maps API key for enhanced maps:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
   ```

## Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the homepage! 🎉

## Step 6: Add Sample Data (Optional)

To see the platform in action with sample properties:

1. Go to Supabase Dashboard → **Table Editor**
2. Select the `properties` table
3. Click **Insert row**
4. Fill in sample data or use the SQL Editor to insert multiple properties:

```sql
-- Insert a sample property
INSERT INTO properties (
  title,
  description,
  property_type,
  listing_type,
  price,
  address,
  locality,
  city,
  state,
  pincode,
  bedrooms,
  bathrooms,
  carpet_area,
  latitude,
  longitude,
  status,
  featured
) VALUES (
  'Luxury 3BHK Apartment in Bandra',
  'Beautiful apartment with sea view',
  'apartment',
  'sale',
  35000000,
  '123 Carter Road',
  'Bandra West',
  'Mumbai',
  'Maharashtra',
  '400050',
  3,
  3,
  1450,
  19.0596,
  72.8295,
  'active',
  true
);
```

## What's Next?

### Explore the Platform

- **Homepage**: Browse featured properties and popular cities
- **Search**: Try the search bar with different filters
- **Properties**: View the property listing page
- **Map View**: Toggle to map view to see properties on a map
- **Property Details**: Click any property to see full details

### Customize Your Platform

1. **Branding**: Update colors in `tailwind.config.ts`
2. **Content**: Modify homepage text in `app/page.tsx`
3. **Cities**: Update popular cities in `components/home/PopularCities.tsx`
4. **Amenities**: Add more amenities in Supabase `amenities` table

### Add Authentication (Coming Soon)

The authentication system is ready in the database schema. To enable:

1. Go to Supabase → **Authentication** → **Providers**
2. Enable Email provider
3. (Optional) Enable Google/Facebook OAuth
4. Implement login/signup pages (see roadmap)

## Common Issues & Solutions

### Port 3000 already in use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Database connection error
- Check your Supabase URL and anon key
- Ensure your Supabase project is active
- Verify `.env.local` has correct values

### Images not loading
- Check image URLs in the database
- Verify `next.config.js` has correct image domains
- For local images, add them to the `public` folder

### Map not showing
- Ensure Leaflet CSS is imported
- Check browser console for errors
- Verify property has latitude/longitude values

## Development Tips

### Hot Reload
Changes to code automatically refresh the browser. No need to restart the server!

### TypeScript Errors
```bash
# Check for type errors
npm run type-check
```

### Linting
```bash
# Check code quality
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

### Build for Production
```bash
# Create production build
npm run build

# Test production build locally
npm run start
```

## Project Structure Quick Reference

```
├── app/                    # Pages and routes
│   ├── page.tsx           # Homepage
│   └── properties/        # Property pages
├── components/            # Reusable components
│   ├── property/         # Property components
│   ├── search/           # Search components
│   └── maps/             # Map components
├── lib/                  # Utilities
│   ├── supabase/        # Database client
│   └── api/             # API functions
├── types/               # TypeScript types
└── supabase/           # Database schema
```

## Need Help?

- **Documentation**: Check [README.md](README.md) for detailed info
- **Architecture**: See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Deployment**: Read [DEPLOYMENT.md](DEPLOYMENT.md)
- **Issues**: Open an issue on GitHub
- **Email**: support@realtorindiaplatform.com

## Next Steps

1. ✅ Platform is running locally
2. 📝 Add your own property listings
3. 🎨 Customize branding and content
4. 🚀 Deploy to Vercel (see [DEPLOYMENT.md](DEPLOYMENT.md))
5. 📱 Share with users and get feedback!

---

**Congratulations! You're ready to build the future of Indian real estate! 🏠**