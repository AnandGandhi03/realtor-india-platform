#!/bin/bash

# Realtor India Platform - Setup Script
# This script helps you set up the platform quickly

echo "🏠 Realtor India Platform - Setup Script"
echo "=========================================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18 or higher is required"
    echo "Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env.local and add your credentials:"
    echo "   - Supabase URL and keys"
    echo "   - Razorpay keys"
    echo "   - Email service API key"
    echo ""
else
    echo "✅ .env.local already exists"
    echo ""
fi

# Check if Supabase is configured
echo "🔍 Checking Supabase configuration..."
if grep -q "your_supabase_url" .env.local; then
    echo "⚠️  Supabase not configured yet"
    echo "   Please update NEXT_PUBLIC_SUPABASE_URL in .env.local"
    echo ""
else
    echo "✅ Supabase appears to be configured"
    echo ""
fi

# Offer to run dev server
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your credentials"
echo "2. Set up Supabase database (run supabase/schema.sql)"
echo "3. Run 'npm run dev' to start development server"
echo ""

read -p "Would you like to start the development server now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting development server..."
    npm run dev
fi