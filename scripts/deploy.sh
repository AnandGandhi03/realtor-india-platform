#!/bin/bash

# Realtor India Platform - Deployment Script
# Automates deployment to Vercel

echo "🚀 Realtor India Platform - Deployment Script"
echo "=============================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI not found. Installing..."
    npm i -g vercel
    echo "✅ Vercel CLI installed"
    echo ""
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "⚠️  You have uncommitted changes:"
    git status -s
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_message
        git add .
        git commit -m "$commit_message"
        git push
        echo "✅ Changes committed and pushed"
        echo ""
    fi
fi

# Run type check
echo "🔍 Running type check..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ Type check failed. Please fix errors before deploying."
    exit 1
fi
echo "✅ Type check passed"
echo ""

# Run linter
echo "🔍 Running linter..."
npm run lint
if [ $? -ne 0 ]; then
    echo "⚠️  Linting issues found. Continue anyway? (y/n)"
    read -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
echo "✅ Linting complete"
echo ""

# Build check
echo "🏗️  Running production build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi
echo "✅ Build successful"
echo ""

# Deploy
echo "🚀 Deploying to Vercel..."
echo ""
read -p "Deploy to production? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    vercel --prod
    echo ""
    echo "🎉 Deployment complete!"
    echo ""
    echo "Next steps:"
    echo "1. Verify deployment at your Vercel URL"
    echo "2. Test all features"
    echo "3. Monitor logs for errors"
    echo "4. Set up custom domain (if not done)"
    echo ""
else
    vercel
    echo ""
    echo "📝 Preview deployment complete!"
    echo "Test your changes before deploying to production."
    echo ""
fi