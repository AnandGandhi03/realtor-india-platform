# 🏠 Realtor India Platform

A modern, comprehensive property listing platform for the Indian real estate market, inspired by Realtor.ca. Built to modernize the MLS (Multiple Listing Service) system with cutting-edge technology.

## ✨ Features

### Core Functionality
- 🔍 **Advanced Property Search** - Filter by location, price, type, amenities, and more
- 🗺️ **Interactive Map View** - Explore properties on an interactive map with clustering
- 📸 **Rich Media Galleries** - High-quality images, virtual tours, and 360° views
- 💰 **Smart Pricing Tools** - Mortgage calculator, price trends, and market insights
- 🏘️ **Neighborhood Insights** - Schools, hospitals, transport, and local amenities
- 📊 **Property Comparison** - Compare up to 4 properties side-by-side
- 🔔 **Saved Searches & Alerts** - Get notified when new properties match your criteria
- 📱 **Responsive Design** - Seamless experience across desktop, tablet, and mobile

### For Property Seekers
- Browse residential and commercial properties
- Save favorite listings
- Schedule property viewings
- Contact agents directly
- Track property price history
- Get personalized recommendations

### For Agents & Brokers
- List and manage properties
- Lead management dashboard
- Performance analytics
- Client relationship management
- Automated follow-ups
- Commission tracking

### For Developers & Builders
- Showcase projects
- Manage inventory
- Track sales pipeline
- Marketing analytics
- Bulk property uploads

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Maps**: Leaflet, React Leaflet
- **Forms**: React Hook Form, Zod
- **Charts**: Recharts
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Maps API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/AnandGandhi03/realtor-india-platform.git
cd realtor-india-platform
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` with your credentials

4. Run database migrations
```bash
npm run db:migrate
```

5. Start development server
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
realtor-india-platform/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── property/         # Property-related components
│   ├── search/           # Search components
│   └── maps/             # Map components
├── lib/                  # Utility functions
│   ├── supabase/        # Supabase client & helpers
│   ├── utils/           # General utilities
│   └── validations/     # Zod schemas
├── types/               # TypeScript type definitions
├── hooks/               # Custom React hooks
├── public/              # Static assets
└── supabase/           # Database schema & migrations
```

## 🗄️ Database Schema

### Core Tables
- `properties` - Property listings
- `users` - User accounts (buyers, sellers, agents)
- `agents` - Agent/broker profiles
- `favorites` - Saved properties
- `searches` - Saved search criteria
- `viewings` - Scheduled property viewings
- `leads` - Lead management
- `neighborhoods` - Area information
- `amenities` - Property amenities
- `property_images` - Media gallery

## 🔐 Authentication & Authorization

- Email/password authentication
- Social login (Google, Facebook)
- Role-based access control (Buyer, Seller, Agent, Admin)
- JWT-based sessions
- Secure API routes

## 🌍 Indian Market Features

- **Multi-city Support** - Major metros and tier-2/3 cities
- **Local Payment Integration** - Razorpay, UPI, Net Banking
- **Indian Property Types** - Apartments, Villas, Plots, Commercial
- **Legal Documentation** - RERA compliance, property documents
- **Regional Language Support** - Hindi, Tamil, Telugu, etc.
- **Indian Currency** - ₹ (INR) with Lakh/Crore formatting

## 📈 Roadmap

- [ ] Mobile apps (iOS & Android)
- [ ] AI-powered property recommendations
- [ ] Virtual reality property tours
- [ ] Blockchain-based property verification
- [ ] Rental management system
- [ ] Property valuation API
- [ ] Integration with government databases

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For support, email support@realtorindiaplatform.com

---

Built with ❤️ for the Indian real estate market