-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- User roles enum
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'agent', 'builder', 'admin');

-- Property types enum
CREATE TYPE property_type AS ENUM ('apartment', 'villa', 'independent_house', 'plot', 'commercial', 'office', 'shop', 'warehouse', 'farmhouse', 'penthouse', 'studio');

-- Property status enum
CREATE TYPE property_status AS ENUM ('active', 'pending', 'sold', 'rented', 'inactive');

-- Listing type enum
CREATE TYPE listing_type AS ENUM ('sale', 'rent', 'lease', 'pg');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role user_role DEFAULT 'buyer',
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agents table
CREATE TABLE public.agents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    agency_name TEXT,
    license_number TEXT UNIQUE,
    experience_years INTEGER,
    specialization TEXT[],
    rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    service_areas TEXT[],
    languages TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties table
CREATE TABLE public.properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    property_type property_type NOT NULL,
    listing_type listing_type NOT NULL,
    status property_status DEFAULT 'active',
    
    -- Pricing
    price DECIMAL(15,2) NOT NULL,
    price_per_sqft DECIMAL(10,2),
    maintenance_cost DECIMAL(10,2),
    security_deposit DECIMAL(15,2),
    
    -- Location
    address TEXT NOT NULL,
    locality TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    location GEOGRAPHY(POINT, 4326),
    
    -- Property details
    bedrooms INTEGER,
    bathrooms INTEGER,
    balconies INTEGER,
    total_floors INTEGER,
    floor_number INTEGER,
    carpet_area DECIMAL(10,2),
    built_up_area DECIMAL(10,2),
    plot_area DECIMAL(10,2),
    
    -- Features
    furnishing TEXT, -- unfurnished, semi-furnished, fully-furnished
    parking INTEGER DEFAULT 0,
    age_of_property INTEGER, -- in years
    facing TEXT, -- north, south, east, west, etc.
    
    -- Ownership & Legal
    owner_id UUID REFERENCES public.profiles(id),
    agent_id UUID REFERENCES public.agents(id),
    rera_id TEXT,
    possession_status TEXT, -- ready-to-move, under-construction
    available_from DATE,
    
    -- Metadata
    views INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Search optimization
    search_vector tsvector
);

-- Property images table
CREATE TABLE public.property_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property amenities table
CREATE TABLE public.amenities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT, -- building, society, nearby
    icon TEXT
);

-- Property amenities junction table
CREATE TABLE public.property_amenities (
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, amenity_id)
);

-- Favorites table
CREATE TABLE public.favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

-- Saved searches table
CREATE TABLE public.saved_searches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    search_criteria JSONB NOT NULL,
    alert_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property viewings table
CREATE TABLE public.viewings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.agents(id),
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    agent_id UUID REFERENCES public.agents(id),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'new', -- new, contacted, qualified, converted, lost
    source TEXT, -- website, phone, referral
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Neighborhoods table
CREATE TABLE public.neighborhoods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    description TEXT,
    avg_price_per_sqft DECIMAL(10,2),
    schools_count INTEGER DEFAULT 0,
    hospitals_count INTEGER DEFAULT 0,
    restaurants_count INTEGER DEFAULT 0,
    transport_score INTEGER, -- 1-10
    safety_score INTEGER, -- 1-10
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_location ON public.properties USING GIST(location);
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_listing_type ON public.properties(listing_type);
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_search ON public.properties USING GIN(search_vector);
CREATE INDEX idx_properties_owner ON public.properties(owner_id);
CREATE INDEX idx_properties_agent ON public.properties(agent_id);
CREATE INDEX idx_favorites_user ON public.favorites(user_id);
CREATE INDEX idx_viewings_user ON public.viewings(user_id);
CREATE INDEX idx_viewings_property ON public.viewings(property_id);
CREATE INDEX idx_leads_agent ON public.leads(agent_id);

-- Create function to update search vector
CREATE OR REPLACE FUNCTION update_property_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.locality, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(NEW.city, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search vector
CREATE TRIGGER property_search_vector_update
    BEFORE INSERT OR UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION update_property_search_vector();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viewings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Properties: Everyone can read active properties, owners/agents can manage their own
CREATE POLICY "Active properties are viewable by everyone" ON public.properties FOR SELECT USING (status = 'active' OR owner_id = auth.uid() OR agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid()));
CREATE POLICY "Owners can insert properties" ON public.properties FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners can update own properties" ON public.properties FOR UPDATE USING (owner_id = auth.uid() OR agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid()));
CREATE POLICY "Owners can delete own properties" ON public.properties FOR DELETE USING (owner_id = auth.uid());

-- Favorites: Users can manage their own favorites
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own favorites" ON public.favorites FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE USING (user_id = auth.uid());

-- Insert default amenities
INSERT INTO public.amenities (name, category, icon) VALUES
    ('Swimming Pool', 'building', 'waves'),
    ('Gym', 'building', 'dumbbell'),
    ('Parking', 'building', 'car'),
    ('Security', 'building', 'shield'),
    ('Power Backup', 'building', 'zap'),
    ('Lift', 'building', 'arrow-up'),
    ('Garden', 'society', 'tree-deciduous'),
    ('Playground', 'society', 'gamepad-2'),
    ('Club House', 'society', 'home'),
    ('School', 'nearby', 'school'),
    ('Hospital', 'nearby', 'hospital'),
    ('Metro Station', 'nearby', 'train'),
    ('Shopping Mall', 'nearby', 'shopping-cart'),
    ('Restaurant', 'nearby', 'utensils');