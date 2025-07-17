# Reusable SaaS Framework Template

## Overview
This document extracts the reusable components from the ShipNode project to create a rapid SaaS deployment framework. The framework includes all essential services, APIs, and patterns needed for a production-ready SaaS application.

## Core Technology Stack

### Frontend
- **Next.js 14** - Full-stack React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form + Zod** - Form handling and validation
- **Sharp** - Image optimization

### Analytics & Monitoring
- **Google Analytics 4** (react-ga4)
- Event tracking patterns
- Conversion tracking
- User property management

### Development Tools
- **ESLint + Prettier** - Code quality and formatting
- **Jest + React Testing Library** - Testing framework
- **TypeScript strict mode** - Enhanced type checking

## Essential Third-Party Services

### 1. **Postmark Email Service**
```env
POSTMARK_API_TOKEN=your_token
POSTMARK_FROM_EMAIL=hello@yourdomain.com
POSTMARK_ACCOUNT_TOKEN=for_domain_management
```

**Features:**
- Transactional email sending
- Newsletter subscriptions
- Unsubscribe management
- Email validation
- DMARC/SPF setup

### 2. **Cloudflare DNS & CDN**
```env
CLOUDFLARE_API_TOKEN=your_token
CLOUDFLARE_ZONE_ID=your_zone_id
CLOUDFLARE_ACCOUNT_ID=your_account_id
```

**Features:**
- DNS management API
- SSL/TLS certificates
- CDN and caching
- DDoS protection
- Edge workers (optional)

### 3. **Google Analytics**
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_SITE_VERIFICATION=verification_code
```

**Features:**
- Page view tracking
- Custom events
- Form submission tracking
- Conversion tracking
- User properties

### 4. **Stripe Payment Processing**
```env
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

**Features:**
- Subscription management
- One-time payments
- Webhook handling
- Customer portal

### 5. **GitHub Integration**
- GitHub Actions for CI/CD
- Automated testing
- Deployment workflows
- PR checks

### 6. **Google Search Console**
- SEO monitoring
- Sitemap submission
- Search performance tracking

## Reusable Code Patterns

### 1. Email Service Pattern
```typescript
// Email service with unsubscribe management
interface EmailService {
  sendTransactional(to: string, subject: string, content: string): Promise<EmailResponse>
  subscribeNewsletter(data: SubscriptionData): Promise<EmailResponse>
  validateEmail(email: string): boolean
  checkUnsubscribed(email: string): Promise<boolean>
  generateFooter(email: string): string
}
```

### 2. API Client Pattern
```typescript
// Reusable third-party API client
class APIClient {
  constructor(private config: APIConfig) {}
  
  async request<T>(endpoint: string, method: string, data?: any): Promise<Response<T>> {
    // Authentication
    // Error handling
    // Rate limiting
    // Retry logic
  }
}
```

### 3. Analytics Pattern
```typescript
// Centralized analytics
const analytics = {
  init(): void
  pageView(path: string): void
  event(category: string, action: string, label?: string): void
  formSubmission(formName: string, data?: any): void
  setUserProperties(properties: Record<string, any>): void
}
```

### 4. Environment Configuration
```typescript
// Structured environment variables
const config = {
  app: {
    url: process.env.NEXT_PUBLIC_SITE_URL,
    env: process.env.NODE_ENV,
    mockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
  },
  email: {
    postmarkToken: process.env.POSTMARK_API_TOKEN,
    fromEmail: process.env.POSTMARK_FROM_EMAIL
  },
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  },
  payment: {
    stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY
  }
}
```

## Project Structure Template

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── lib/                # Core libraries
│   ├── analytics.ts    # Analytics integration
│   ├── email.ts        # Email service
│   ├── api-client.ts   # API client pattern
│   ├── cloudflare.ts   # DNS management
│   └── config.ts       # Configuration
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   └── _app.tsx       # App initialization
├── styles/            # Global styles
├── types/             # TypeScript types
├── utils/             # Utility functions
└── hooks/             # Custom React hooks
```

## Essential API Routes

### 1. Newsletter Subscription
```typescript
// /api/newsletter/subscribe
- Email validation
- Duplicate checking
- Welcome email
- Admin notification
```

### 2. Unsubscribe Management
```typescript
// /api/unsubscribe
- Token generation
- Secure verification
- Email removal
- Confirmation
```

### 3. Analytics Events
```typescript
// /api/analytics/event
- Event validation
- GA4 integration
- Custom metrics
- Error tracking
```

### 4. SEO & Sitemap
```typescript
// /api/seo/submit-sitemap
- Google ping
- Bing ping
- GSC integration
- Indexing status
```

## Deployment Configuration

### Vercel Deployment
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### Environment Variables
```env
# App Configuration
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Email Service
POSTMARK_API_TOKEN=
POSTMARK_FROM_EMAIL=
POSTMARK_ACCOUNT_TOKEN=

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
GOOGLE_SITE_VERIFICATION=

# DNS Management
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ZONE_ID=
CLOUDFLARE_ACCOUNT_ID=

# Payment Processing
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Feature Flags
NEXT_PUBLIC_USE_MOCK_DATA=false
```

## Post-Deployment Scripts

### 1. Sitemap Submission
```javascript
// Automatically submit sitemap to search engines
npm run submit-sitemap
```

### 2. DNS Configuration
```javascript
// Setup DNS records via Cloudflare API
npm run setup-dns
```

### 3. Email Domain Verification
```javascript
// Configure email authentication (SPF, DKIM, DMARC)
npm run verify-email-domain
```

## Security Patterns

### 1. Input Validation
- Zod schemas for all inputs
- SQL injection prevention
- XSS protection
- Rate limiting

### 2. Authentication (Ready to Implement)
- JWT token structure
- Session management
- Protected routes
- Role-based access

### 3. API Security
- CORS configuration
- API key management
- Request validation
- Error sanitization

## Testing Strategy

### 1. Unit Tests
```json
{
  "testMatch": ["**/*.test.{ts,tsx}"],
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

### 2. Integration Tests
- API endpoint testing
- Email service mocking
- External API mocking

### 3. E2E Tests (Ready to Add)
- User flows
- Payment flows
- Form submissions

## Quick Start Checklist

1. **Initial Setup**
   - [ ] Clone framework template
   - [ ] Update package.json metadata
   - [ ] Configure environment variables
   - [ ] Setup Git repository

2. **Domain & Hosting**
   - [ ] Register domain
   - [ ] Setup Cloudflare account
   - [ ] Configure DNS records
   - [ ] Deploy to Vercel

3. **Email Configuration**
   - [ ] Create Postmark account
   - [ ] Verify sender domain
   - [ ] Configure SPF/DKIM/DMARC
   - [ ] Test email delivery

4. **Analytics Setup**
   - [ ] Create GA4 property
   - [ ] Add measurement ID
   - [ ] Configure conversion events
   - [ ] Verify tracking

5. **Payment Integration**
   - [ ] Create Stripe account
   - [ ] Add API keys
   - [ ] Configure webhooks
   - [ ] Test payment flow

6. **SEO Foundation**
   - [ ] Submit to Google Search Console
   - [ ] Submit to Bing Webmaster Tools
   - [ ] Configure sitemap
   - [ ] Setup robots.txt

7. **Security**
   - [ ] Enable HTTPS
   - [ ] Configure CORS
   - [ ] Setup rate limiting
   - [ ] Add security headers

## Customization Points

### 1. Branding
- Update color scheme in tailwind.config.js
- Replace logo and favicon
- Customize email templates
- Update meta descriptions

### 2. Features
- Add authentication system
- Implement user dashboard
- Add payment tiers
- Create admin panel

### 3. Integrations
- Add CRM integration
- Connect analytics tools
- Setup monitoring
- Add chat support

## Monitoring & Maintenance

### 1. Performance
- Core Web Vitals monitoring
- API response times
- Error tracking
- Uptime monitoring

### 2. Analytics
- User acquisition
- Conversion funnels
- Feature usage
- Revenue tracking

### 3. Email Metrics
- Delivery rates
- Open rates
- Click rates
- Unsubscribe rates

## Cost Estimates

### Monthly Costs (Startup Phase)
- Vercel Hosting: $0-20 (free tier available)
- Cloudflare: $0-20 (free tier available)
- Postmark: $10-15 (10k emails)
- Stripe: 2.9% + $0.30 per transaction
- Domain: $1-2/month
- **Total: ~$30-60/month**

### Scaling Costs
- Add CDN bandwidth as needed
- Upgrade email volume tiers
- Add team members to services
- Enhanced analytics tools

## Conclusion

This framework provides everything needed to launch a production-ready SaaS application quickly. The modular architecture allows you to:

1. Start with core features
2. Add components as needed
3. Scale services independently
4. Maintain clean code structure
5. Deploy with confidence

The framework has been battle-tested in production and includes patterns for common SaaS requirements like email management, analytics, payments, and SEO.