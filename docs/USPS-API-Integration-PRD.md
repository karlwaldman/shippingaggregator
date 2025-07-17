# USPS API Integration - Product Requirements Document

## Executive Summary

This PRD outlines the technical requirements for integrating USPS APIs into our business systems. The integration will enable real-time address validation, shipping rate calculation, package tracking, and label generation capabilities.

**Bottom Line**: Implement USPS API integration to automate shipping operations, improve address data quality, and enhance customer experience through real-time tracking and accurate shipping costs.

## Business Objectives

### Primary Goals
- **Address Data Quality**: Validate and standardize addresses for marketing campaigns and order processing
- **Shipping Automation**: Calculate accurate shipping rates and generate shipping labels programmatically
- **Customer Experience**: Provide real-time package tracking and delivery estimates
- **Operational Efficiency**: Reduce manual shipping processes and errors

### Success Metrics
- 95%+ address validation accuracy
- Sub-2 second API response times for rate calculations
- Zero manual label generation for standard shipments
- Real-time tracking updates for customer-facing systems

## Technical Requirements

### 1. Authentication & Credentials Setup

#### Required Credentials (4 total)
- **CLIENT_ID**: Consumer Key from USPS Developer Portal app
- **CLIENT_SECRET**: Consumer Secret from USPS Developer Portal app  
- **CUSTOMER_REGISTRATION_ID (CRID)**: From USPS Business Gateway account
- **MAILER_ID (MID)**: From USPS Business Gateway account

#### OAuth 2.0 Implementation
```bash
# Token endpoint for authentication
POST https://apis.usps.com/oauth2/v3/token
Content-Type: application/json

{
  "client_id": "{{CLIENT_ID}}",
  "client_secret": "{{CLIENT_SECRET}}",
  "grant_type": "client_credentials"
}
```

**Token Management Requirements**:
- Implement token refresh logic (tokens expire)
- Store tokens securely (encrypted at rest)
- Handle token expiration gracefully
- Implement retry logic for authentication failures

### 2. Environment Configuration

#### Production Environment
- Base URL: `https://apis.usps.com`
- Rate Limits: 60 calls/hour for default tier
- Target availability: High uptime expected

#### Testing Environment  
- Base URL: `https://apis-tem.usps.com`
- Use production credentials
- Full API feature parity

### 3. Core API Integrations

#### 3.1 Address Validation API
**Business Use Case**: Validate addresses for order processing and marketing campaigns

**Technical Specification**:
```bash
GET https://apis.usps.com/addresses/v3/address
?streetAddress={address}
&city={city}
&state={state}
&ZIPCode={zip}
```

**Implementation Requirements**:
- Real-time validation during address entry
- Batch processing for existing address databases
- Store validation results with confidence scores
- Handle partial matches and suggestions

**Expected Response Structure**:
```json
{
  "address": {
    "streetAddress": "123 MAIN ST",
    "city": "ANYTOWN", 
    "state": "NY",
    "ZIPCode": "12345",
    "ZIPPlus4": "6789"
  },
  "addressAdditionalInfo": {
    "deliveryPoint": "23",
    "DPVConfirmation": "Y",
    "business": "N"
  }
}
```

#### 3.2 Pricing/Rates API
**Business Use Case**: Calculate shipping costs for e-commerce checkout and logistics planning

**Technical Specification**:
```bash
POST https://apis.usps.com/prices/v3/base-rates/search
Content-Type: application/json

{
  "originZIPCode": "12345",
  "destinationZIPCode": "67890", 
  "weight": 5,
  "length": 10,
  "width": 8,
  "height": 6,
  "mailClass": "PRIORITY_MAIL",
  "priceType": "COMMERCIAL"
}
```

**Implementation Requirements**:
- Cache rates for common routes (24-hour TTL)
- Support multiple shipping options in single request
- Include extra services (insurance, tracking, etc.)
- Handle dimensional weight calculations

#### 3.3 Tracking API
**Business Use Case**: Provide customers with real-time shipment status

**Technical Specification**:
```bash
GET https://apis.usps.com/tracking/v3/tracking/{tracking_number}
?expand=DETAIL
```

**Implementation Requirements**:
- Webhook integration for status updates (if available)
- Batch tracking updates for multiple packages
- Store tracking history for reporting
- Customer notification triggers

#### 3.4 Label Generation API
**Business Use Case**: Generate shipping labels programmatically

**Technical Specification**:
```bash
POST https://apis.usps.com/labels/v3/label
X-Payment-Authorization-Token: {payment_token}
Content-Type: application/json
```

**Implementation Requirements**:
- Payment authorization token management
- Multiple label formats (PDF, PNG, ZPL)
- Label storage and retrieval system
- Integration with shipping workflow

### 4. Application Creation Configuration

#### Developer Portal App Settings
- **App Name**: "Business Shipping Integration"
- **Description**: "API integration for address validation, shipping rates, tracking, and label generation"
- **Callback URL**: `https://yourdomain.com/usps/callback` (placeholder)
- **APIs Required**: 
  - ✅ Public Access I (default APIs included)
  - Request additional APIs as needed

#### Default API Access Included
- OAuth
- Addresses  
- Domestic Pricing
- International Pricing
- Locations
- Service Standards
- Service Standards Files
- Shipping Options
- **Rate Limit**: 60 calls/hour each

## Implementation Architecture

### 5. System Integration Points

#### 5.1 Ruby on Rails Integration
```ruby
# Recommended gem structure
class USPSService
  BASE_URL = Rails.env.production? ? 
    'https://apis.usps.com' : 
    'https://apis-tem.usps.com'
    
  def initialize
    @client_id = Rails.application.credentials.usps[:client_id]
    @client_secret = Rails.application.credentials.usps[:client_secret]
    @access_token = get_access_token
  end
  
  def validate_address(address_params)
    # Implementation
  end
  
  def calculate_rates(shipment_params)
    # Implementation  
  end
  
  def track_package(tracking_number)
    # Implementation
  end
end
```

#### 5.2 Database Schema Requirements
```sql
-- API credentials storage (encrypted)
CREATE TABLE usps_credentials (
  id SERIAL PRIMARY KEY,
  client_id_encrypted TEXT,
  client_secret_encrypted TEXT,
  crid_encrypted TEXT,
  mid_encrypted TEXT,
  access_token_encrypted TEXT,
  token_expires_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Address validation cache
CREATE TABLE address_validations (
  id SERIAL PRIMARY KEY,
  input_address_hash VARCHAR(64) UNIQUE,
  validated_address JSONB,
  confidence_score DECIMAL(3,2),
  validation_date TIMESTAMP,
  created_at TIMESTAMP
);

-- Rate calculation cache  
CREATE TABLE shipping_rates (
  id SERIAL PRIMARY KEY,
  route_hash VARCHAR(64),
  package_hash VARCHAR(64), 
  rates JSONB,
  cached_until TIMESTAMP,
  created_at TIMESTAMP
);

-- Tracking data
CREATE TABLE package_tracking (
  id SERIAL PRIMARY KEY,
  tracking_number VARCHAR(50) UNIQUE,
  current_status VARCHAR(100),
  tracking_events JSONB,
  last_updated TIMESTAMP,
  created_at TIMESTAMP
);
```

### 6. Error Handling & Resilience

#### 6.1 Rate Limiting Strategy
- Implement exponential backoff for rate limit errors
- Queue non-urgent requests for off-peak processing
- Monitor API usage against quotas
- Implement circuit breaker pattern

#### 6.2 Error Response Handling
```ruby
class USPSAPIError < StandardError
  attr_reader :error_code, :error_message, :retry_after
  
  def initialize(response)
    @error_code = response.dig('errors', 0, 'code')
    @error_message = response.dig('errors', 0, 'detail')
    @retry_after = response.headers['Retry-After']
    super(@error_message)
  end
end
```

#### 6.3 Fallback Strategies
- Cached rate tables for critical shipping calculations
- Manual address validation workflows for API failures
- Third-party tracking services as backup
- Graceful degradation of features

## Security Requirements

### 7. Data Protection

#### 7.1 Credential Management
- Store all API credentials in encrypted format
- Use Rails credentials or secure environment variables
- Rotate credentials regularly
- Implement credential monitoring and alerting

#### 7.2 Data Privacy
- Encrypt address data at rest
- Implement data retention policies
- Log API calls without sensitive data
- Comply with data protection regulations

#### 7.3 API Security
- Validate all input parameters
- Sanitize address data before API calls
- Implement request signing (if required)
- Monitor for suspicious API usage patterns

## Testing Strategy

### 8. Testing Requirements

#### 8.1 Unit Tests
- Test API client methods with mocked responses
- Validate error handling scenarios  
- Test credential management functions
- Verify data transformation logic

#### 8.2 Integration Tests
- Test against USPS testing environment
- Validate end-to-end workflows
- Test rate limiting behavior
- Verify webhook processing (if implemented)

#### 8.3 Performance Tests
- Load test API client under normal traffic
- Test timeout and retry logic
- Validate caching effectiveness
- Monitor memory usage with large datasets

## Deployment & Monitoring

### 9. Operational Requirements

#### 9.1 Monitoring & Alerting
- Track API response times and error rates
- Monitor quota usage and warn at 80% threshold
- Alert on authentication failures
- Log all API interactions for debugging

#### 9.2 Performance Metrics
- API response time percentiles (p50, p95, p99)
- Success/error rates by API endpoint
- Cache hit rates for addresses and rates
- Customer satisfaction scores for shipping accuracy

#### 9.3 Logging Strategy
```ruby
# Structured logging example
Rails.logger.info({
  event: 'usps_api_call',
  endpoint: '/addresses/v3/address',
  response_time_ms: 245,
  status: 'success',
  cached: false,
  user_id: current_user.id
})
```

## Implementation Timeline

### Phase 1: Foundation (Week 1-2)
- [ ] Complete USPS Developer Portal app creation
- [ ] Obtain all required credentials (CLIENT_ID, CLIENT_SECRET, CRID, MID)
- [ ] Set up OAuth 2.0 authentication
- [ ] Create basic API client structure
- [ ] Implement address validation API

### Phase 2: Core Features (Week 3-4)
- [ ] Implement pricing/rates API
- [ ] Add tracking API integration
- [ ] Create database schema and caching layer
- [ ] Build error handling and retry logic
- [ ] Add comprehensive test suite

### Phase 3: Advanced Features (Week 5-6)
- [ ] Implement label generation API
- [ ] Add batch processing capabilities
- [ ] Create monitoring and alerting
- [ ] Performance optimization
- [ ] Production deployment

### Phase 4: Enhancement (Week 7-8)
- [ ] Customer-facing tracking interface
- [ ] Shipping cost calculator integration
- [ ] Automated address cleanup workflows
- [ ] Analytics and reporting dashboard

## Risk Mitigation

### 10. Identified Risks & Solutions

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| API rate limiting | High | Medium | Implement caching, queue non-urgent requests |
| Service downtime | High | Low | Fallback to cached data, manual processes |
| Credential exposure | High | Low | Encrypted storage, regular rotation |
| Integration complexity | Medium | Medium | Phased implementation, thorough testing |
| Cost overruns | Medium | Low | Monitor usage, implement cost alerts |

## Success Criteria

### 11. Definition of Done

#### Technical Acceptance Criteria
- [ ] All APIs integrated and functional
- [ ] 95%+ address validation accuracy achieved
- [ ] Sub-2 second response times maintained
- [ ] Zero production errors for 7 consecutive days
- [ ] Comprehensive test coverage (>90%)

#### Business Acceptance Criteria  
- [ ] Shipping cost calculation accuracy within 1%
- [ ] Customer tracking satisfaction >4.5/5
- [ ] 50% reduction in manual shipping processes
- [ ] Zero shipping label generation errors

## Appendix

### A. USPS API Endpoints Reference

| API | Purpose | Rate Limit | Documentation |
|-----|---------|------------|---------------|
| Addresses | Address validation & standardization | 60/hour | [Link](https://developer.usps.com/apis) |
| Prices | Domestic shipping rate calculation | 60/hour | [Link](https://developer.usps.com/apis) |
| International Prices | International shipping rates | 60/hour | [Link](https://developer.usps.com/apis) |
| Tracking | Package tracking status | 60/hour | [Link](https://developer.usps.com/apis) |
| Labels | Shipping label generation | 60/hour | [Link](https://developer.usps.com/apis) |
| Service Standards | Delivery time estimates | 60/hour | [Link](https://developer.usps.com/apis) |

### B. Required Business Gateway Information

Contact your USPS Business Customer Gateway Business System Administrator (BSA) to obtain:
- Customer Registration ID (CRID)
- Mailer ID (MID)
- Enterprise Payment Account details (for label generation)

### C. Useful Resources

- [USPS Developer Portal](https://developers.usps.com)
- [Official GitHub Examples](https://github.com/USPS/api-examples)
- [Business Customer Gateway](https://gateway.usps.com/eAdmin/view/signin)
- [Postman Collection](https://github.com/USPS/api-examples/blob/main/Example-Postman.postman_collection.json)

---

**Document Version**: 1.0  
**Last Updated**: July 12, 2025  
**Prepared By**: Business Strategy Team  
**Review Required**: Technical Lead, Product Manager