-- Payments table for Razorpay transactions
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id VARCHAR(255) NOT NULL,
  payment_id VARCHAR(255),
  signature VARCHAR(255),
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(50) DEFAULT 'created',
  notes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(order_id)
);

-- Subscriptions table for premium plans
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  auto_renew BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  link VARCHAR(500),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property analytics table
CREATE TABLE IF NOT EXISTS property_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  leads INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, date)
);

-- Add last_checked_at to saved_searches
ALTER TABLE saved_searches 
ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMP WITH TIME ZONE;

-- Add featured_until to properties
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP WITH TIME ZONE;

-- Add virtual_tour_url to properties
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS virtual_tour_url VARCHAR(500);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_property_analytics_property_id ON property_analytics(property_id);
CREATE INDEX IF NOT EXISTS idx_property_analytics_date ON property_analytics(date);

-- RLS Policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_analytics ENABLE ROW LEVEL SECURITY;

-- Payments policies
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Property analytics policies
CREATE POLICY "Property owners can view analytics"
  ON property_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_analytics.property_id
      AND properties.owner_id = auth.uid()
    )
  );

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type VARCHAR,
  p_title VARCHAR,
  p_message TEXT,
  p_link VARCHAR DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (p_user_id, p_type, p_title, p_message, p_link)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track daily analytics
CREATE OR REPLACE FUNCTION update_property_analytics()
RETURNS void AS $$
BEGIN
  INSERT INTO property_analytics (property_id, date, views, favorites, leads)
  SELECT 
    p.id,
    CURRENT_DATE,
    p.views,
    p.favorites_count,
    (SELECT COUNT(*) FROM leads WHERE property_id = p.id)
  FROM properties p
  WHERE p.status = 'active'
  ON CONFLICT (property_id, date) 
  DO UPDATE SET
    views = EXCLUDED.views,
    favorites = EXCLUDED.favorites,
    leads = EXCLUDED.leads;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to send notification on new lead
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
DECLARE
  v_property RECORD;
BEGIN
  -- Get property details
  SELECT * INTO v_property
  FROM properties
  WHERE id = NEW.property_id;

  -- Create notification for property owner
  PERFORM create_notification(
    v_property.owner_id,
    'new_lead',
    'New Property Inquiry',
    'You have a new inquiry for ' || v_property.title,
    '/dashboard/leads'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_new_lead
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_lead();

-- Trigger to send notification on viewing scheduled
CREATE OR REPLACE FUNCTION notify_viewing_scheduled()
RETURNS TRIGGER AS $$
DECLARE
  v_property RECORD;
BEGIN
  -- Get property details
  SELECT * INTO v_property
  FROM properties
  WHERE id = NEW.property_id;

  -- Create notification for user
  PERFORM create_notification(
    NEW.user_id,
    'viewing_scheduled',
    'Viewing Confirmed',
    'Your viewing for ' || v_property.title || ' is scheduled',
    '/dashboard/viewings'
  );

  -- Create notification for property owner
  PERFORM create_notification(
    v_property.owner_id,
    'viewing_scheduled',
    'New Viewing Scheduled',
    'A viewing has been scheduled for ' || v_property.title,
    '/my-properties'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_viewing_scheduled
  AFTER INSERT ON viewings
  FOR EACH ROW
  EXECUTE FUNCTION notify_viewing_scheduled();