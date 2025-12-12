# API Documentation

## Base URL
```
Production: https://your-domain.com/api
Development: http://localhost:3000/api
```

## Authentication
Authenticated endpoints require Supabase session token:
```
Authorization: Bearer <token>
```

## Endpoints

### Properties
- `GET /api/properties` - List properties
- `POST /api/properties` - Create property (auth)
- `GET /api/properties/[id]` - Get property
- `PUT /api/properties/[id]` - Update property (auth)
- `DELETE /api/properties/[id]` - Delete property (auth)

### Leads
- `POST /api/leads` - Create lead
- `GET /api/leads` - Get leads (auth)

### Favorites
- `POST /api/favorites` - Add favorite (auth)
- `DELETE /api/favorites` - Remove favorite (auth)

### Viewings
- `POST /api/viewings` - Schedule viewing (auth)
- `GET /api/viewings` - Get viewings (auth)

### Search
- `GET /api/search` - Search properties
- `POST /api/search/save` - Save search (auth)

### Analytics
- `GET /api/analytics` - Get analytics (auth)

### Upload
- `POST /api/upload` - Upload image (auth)
- `DELETE /api/upload` - Delete image (auth)

### Payment
- `POST /api/payment/create-order` - Create order (auth)
- `POST /api/payment/verify` - Verify payment (auth)

### Webhooks
- `POST /api/webhooks/razorpay` - Payment webhook

### Cron
- `GET /api/cron/check-alerts` - Check alerts
- `GET /api/cron/expire-featured` - Expire featured

See full documentation in repository.