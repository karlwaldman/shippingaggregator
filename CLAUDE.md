# Claude Code Context & Commands

## Project: Shipping Aggregator

### Project Overview
A comprehensive shipping aggregation platform that allows users to compare shipping rates, delivery times, and services across multiple carriers (FedEx, UPS, USPS, DHL, etc.).

### Key Features
- Multi-carrier rate comparison
- Real-time shipping quotes
- Package tracking integration
- Shipping label generation
- User account management
- Delivery notifications
- Analytics and reporting

### Architecture Goals
- Microservices architecture for scalability
- RESTful APIs with proper versioning
- Real-time updates via WebSockets
- Caching layer for performance
- Comprehensive error handling and logging

### Development Commands
When working on this project, use these commands:

#### Setup & Installation
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Database setup
npm run db:setup
npm run db:migrate

# Run development server
npm run dev

# Run tests
npm run test
npm run test:watch
npm run test:coverage

# Linting and formatting
npm run lint
npm run lint:fix
npm run format
```

#### Building & Deployment
```bash
# Build for production
npm run build

# Start production server
npm start

# Docker commands
docker-compose up -d
docker-compose down
```

### Project Structure Preferences
```
src/
├── api/                 # API routes and controllers
├── services/           # Business logic and external integrations
├── models/             # Data models and database schemas
├── utils/              # Utility functions and helpers
├── middleware/         # Express middleware
├── types/              # TypeScript type definitions
├── config/             # Configuration files
├── tests/              # Test files
└── scripts/            # Build and deployment scripts
```

### Carrier Integration Notes
- **FedEx**: Uses REST API, requires OAuth2 authentication
- **UPS**: REST API with API key authentication
- **USPS**: XML-based API, requires special handling
- **DHL**: REST API with client credentials flow

### Database Schema Priorities
1. Users and authentication
2. Shipping addresses and contacts
3. Carrier configurations
4. Rate quotes and comparisons
5. Tracking data and updates
6. Audit logs and analytics

### Performance Considerations
- Cache frequently requested rates (5-minute TTL)
- Implement request rate limiting per carrier
- Use connection pooling for database
- Implement circuit breaker pattern for carrier APIs
- Queue heavy operations (label generation, tracking updates)

### Security Requirements
- Encrypt sensitive carrier credentials
- Validate all input data
- Implement proper CORS policies
- Use HTTPS for all communications
- Audit log all financial transactions

### Testing Strategy
- Unit tests for business logic
- Integration tests for carrier APIs
- End-to-end tests for critical workflows
- Load testing for rate comparison endpoints
- Mock carrier responses for development

### Common Development Patterns
- Use dependency injection for services
- Implement repository pattern for data access
- Use factory pattern for carrier service creation
- Apply strategy pattern for different shipping calculations
- Implement observer pattern for tracking updates

### Error Handling
- Graceful degradation when carriers are unavailable
- Retry logic with exponential backoff
- User-friendly error messages
- Comprehensive logging for debugging
- Health checks for all external dependencies

### AI Assistant Guidelines
When working with Claude Code on this project:
1. Always check carrier API documentation for latest changes
2. Consider rate limiting when implementing new features
3. Validate shipping addresses using appropriate services
4. Implement proper error handling for external API failures
5. Consider caching strategies for performance optimization
6. Follow the established patterns for new carrier integrations
7. Update tests when adding new functionality
8. Document any new environment variables in .env.example

### Launch & Growth Integration
This project follows Kevin Lenway's AI-optimized development methodology:

**Phase 1: Idea to Code-Ready Tasks** ✅
- Detailed BRD/PRD with strategic analysis in docs/
- 200+ one-story-point tasks in MVP-TaskList.md
- AI-guidance files (.cursorrules, .cursor-template.xml, .cursor-tasks.md)

**Phase 2: Design Iteration with Storybook & Rubrics** ✅
- Storybook configured for frontend-first development
- A-grade design rubrics in design-rubrics.md
- Atomic design component architecture planned

**Phase 3: Backend & Data Model Generation** (Next)
- Generate data models from completed UI components
- Create API layer based on frontend requirements

**Phase 4: SEO-Driven Launch Strategy** ✅
- Psychology-driven growth framework in docs/Launch-Growth-Strategy.md
- Content marketing strategy using Cialdini's persuasion principles
- Community engagement and authority building roadmap

### Development Commands for Launch Phase
```bash
# Content creation and SEO
npm run content:generate    # Generate shipping-focused content
npm run seo:audit          # SEO performance analysis
npm run content:optimize   # Optimize content for target keywords

# Launch preparation
npm run launch:checklist   # Pre-launch verification
npm run analytics:setup    # Configure tracking and metrics
npm run content:calendar   # Generate content calendar
```

### Content Strategy Integration
- All development should consider SEO and content marketing implications
- Component design should support content creation (calculators, tools)
- API design should enable content generation and lead magnets
- Analytics implementation should track content performance and user journey