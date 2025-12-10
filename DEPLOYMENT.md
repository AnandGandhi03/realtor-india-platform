# Deployment Guide

## Prerequisites

1. **Supabase Account**
   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase/schema.sql` in the SQL Editor
   - Get your project URL and anon key from Settings > API

2. **Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub repository

3. **Google Maps API Key**
   - Create a project in [Google Cloud Console](https://console.cloud.google.com)
   - Enable Maps JavaScript API and Places API
   - Create an API key with appropriate restrictions

## Environment Variables

Set these in Vercel or your `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional: Payment Gateway (Razorpay)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Optional: File Upload (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Deployment Steps

### 1. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

Or use the Vercel Dashboard:
1. Import your GitHub repository
2. Configure environment variables
3. Deploy

### 2. Configure Supabase

1. **Run Database Migrations**
   - Go to Supabase Dashboard > SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the SQL

2. **Enable Row Level Security**
   - Already configured in the schema
   - Verify policies are active in Authentication > Policies

3. **Configure Storage (Optional)**
   - Create a bucket named `property-images`
   - Set appropriate access policies

4. **Set up Authentication**
   - Enable Email/Password authentication
   - Configure OAuth providers (Google, Facebook) if needed
   - Set redirect URLs to your Vercel domain

### 3. Configure Google Maps

1. **Enable Required APIs**
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Directions API

2. **Set API Restrictions**
   - Application restrictions: HTTP referrers
   - Add your domain: `your-domain.com/*`
   - Add localhost for development: `localhost:3000/*`

### 4. Post-Deployment

1. **Verify Database Connection**
   - Test property listing page
   - Check if data loads correctly

2. **Test Authentication**
   - Sign up a test user
   - Verify email confirmation
   - Test login/logout

3. **Test Core Features**
   - Property search
   - Map view
   - Property details
   - Contact forms
   - Favorites

4. **Performance Optimization**
   - Enable Vercel Analytics
   - Configure caching headers
   - Optimize images with Next.js Image component

## Monitoring

### Vercel Analytics
- Enable in Vercel Dashboard > Analytics
- Monitor page views, performance, and errors

### Supabase Monitoring
- Check Database > Logs for query performance
- Monitor API usage in Settings > Usage

### Error Tracking (Optional)
- Integrate Sentry for error tracking
- Set up alerts for critical errors

## Scaling Considerations

### Database
- Monitor Supabase usage limits
- Upgrade plan as needed
- Consider read replicas for high traffic

### CDN & Caching
- Vercel Edge Network handles CDN
- Configure ISR for property listings
- Cache static assets aggressively

### Search Optimization
- Consider Algolia or Meilisearch for advanced search
- Implement full-text search with PostgreSQL
- Add search analytics

## Security Checklist

- [ ] Environment variables are secure
- [ ] Row Level Security is enabled
- [ ] API keys have proper restrictions
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] SQL injection prevention
- [ ] XSS protection enabled

## Backup Strategy

### Database Backups
- Supabase provides automatic daily backups
- Download manual backups weekly
- Store in separate cloud storage

### Code Backups
- GitHub repository (primary)
- Regular commits and tags
- Protected main branch

## Support & Maintenance

### Regular Tasks
- Monitor error logs weekly
- Update dependencies monthly
- Review and optimize database queries
- Check and renew SSL certificates
- Update content and property listings

### Emergency Contacts
- Vercel Support: support@vercel.com
- Supabase Support: support@supabase.io

---

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)