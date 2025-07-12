# Shipping Aggregator

A comprehensive shipping aggregation platform that helps users compare shipping rates, delivery times, and services across multiple carriers.

## 🚀 Features

- **Multi-Carrier Rate Comparison**: Compare rates from FedEx, UPS, USPS, DHL, and more
- **Real-Time Quotes**: Get live shipping quotes with delivery estimates
- **Package Tracking**: Unified tracking across all carriers
- **Label Generation**: Create and print shipping labels
- **Address Management**: Store and validate shipping addresses
- **Bulk Shipping**: Process multiple shipments efficiently
- **Analytics**: Track shipping costs and performance metrics

## 🛠️ Tech Stack

- **Backend**: Node.js with Express and TypeScript
- **Database**: PostgreSQL with Redis caching
- **Frontend**: React/Next.js (planned)
- **APIs**: RESTful with proper versioning
- **Authentication**: JWT-based authentication
- **Deployment**: Docker containers

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- Redis 6+
- Carrier API accounts (FedEx, UPS, USPS, DHL)

## 🏗️ Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shippingaggregator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   npm run db:setup
   npm run db:migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Shipping
- `POST /api/quotes` - Get shipping quotes
- `POST /api/shipments` - Create shipment
- `GET /api/shipments/:id` - Get shipment details
- `POST /api/labels` - Generate shipping label

### Tracking
- `GET /api/tracking/:trackingNumber` - Get tracking info
- `POST /api/tracking/webhook` - Tracking updates webhook

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## 📊 Carrier Integration

### Supported Carriers
- **FedEx**: Full API integration with OAuth2
- **UPS**: Rate shopping and tracking
- **USPS**: XML API integration
- **DHL**: REST API integration

### Adding New Carriers
1. Implement carrier service interface
2. Add carrier configuration
3. Create rate mapping logic
4. Implement tracking integration
5. Add comprehensive tests

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run db:migrate` - Run database migrations

### Project Structure
```
src/
├── api/          # API routes and controllers
├── services/     # Business logic
├── models/       # Database models
├── middleware/   # Express middleware
├── utils/        # Utility functions
├── types/        # TypeScript types
└── config/       # Configuration
```

## 🚀 Deployment

### Docker
```bash
# Build image
docker build -t shipping-aggregator .

# Run container
docker run -p 3000:3000 shipping-aggregator
```

### Using Docker Compose
```bash
docker-compose up -d
```

## 📈 Monitoring

- Health checks available at `/health`
- Metrics available at `/metrics`
- API documentation at `/docs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

[License Type] - See LICENSE file for details

## 🆘 Support

For support, email support@shippingaggregator.com or create an issue in this repository.

## 🗺️ Roadmap

- [ ] Mobile application
- [ ] International shipping
- [ ] Customs documentation
- [ ] Advanced analytics
- [ ] API rate optimization
- [ ] Machine learning for route optimization