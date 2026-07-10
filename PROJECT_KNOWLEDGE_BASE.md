# Inventory Management System - Project Knowledge Base

**Purpose:** Complete reference for interview preparation and project refresh  
**Last Updated:** July 7, 2026  
**Project Type:** Full-stack E-commerce Inventory Management System

---

## Project Overview

### What is this project?
A full-stack inventory management system with e-commerce capabilities, allowing administrators to manage inventory items and customers to browse, add to cart, and purchase items using Stripe payment integration.

### Tech Stack

#### Backend
- **Framework:** Spring Boot 3.5.9
- **Language:** Java 21
- **Database:** MySQL
- **ORM:** Spring Data JPA (Hibernate)
- **Security:** Spring Security with BCrypt password encryption
- **Payment:** Stripe Java SDK 25.1.0
- **Build Tool:** Maven
- **Validation:** Jakarta Bean Validation

#### Frontend
- **Framework:** React 19.2.3
- **Language:** JavaScript
- **HTTP Client:** Axios
- **Routing:** React Router DOM 7.12.0
- **PDF Generation:** jsPDF, jsPDF-autotable
- **Build Tool:** Create React App (react-scripts 5.0.1)

#### Architecture
- **Pattern:** MVC (Model-View-Controller)
- **API Style:** RESTful
- **Database Schema:** Relational (MySQL)
- **Deployment:** Local development (localhost:8080 backend, localhost:3000 frontend)

---

## System Architecture

### Backend Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Spring Boot Application              │
├─────────────────────────────────────────────────────────┤
│  Controllers Layer                                      │
│  ├─ UserController (User management)                     │
│  ├─ InventoryController (Inventory CRUD)               │
│  └─ CartController (Cart & Payment operations)          │
├─────────────────────────────────────────────────────────┤
│  Service Layer                                          │
│  ├─ StripeService (Payment processing)                  │
│  └─ (Future: OrderService, EmailService)                │
├─────────────────────────────────────────────────────────┤
│  Repository Layer (Spring Data JPA)                     │
│  ├─ UserRepository                                      │
│  ├─ InventoryRepository                                 │
│  └─ CartRepository                                      │
├─────────────────────────────────────────────────────────┤
│  Model Layer (JPA Entities)                            │
│  ├─ UserModel (Users with roles)                        │
│  ├─ InventoryModel (Products)                            │
│  ├─ CartModel (Shopping cart items)                     │
│  └─ Role (User roles: ADMIN, USER)                      │
├─────────────────────────────────────────────────────────┤
│  Exception Handling                                     │
│  ├─ UserNotFoundException                                │
│  ├─ InventoryNotFoundException                           │
│  └─ CartNotFoundException                               │
├─────────────────────────────────────────────────────────┤
│  Security Configuration                                 │
│  └─ SecurityConfig (CORS, authentication)               │
└─────────────────────────────────────────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Application                    │
├─────────────────────────────────────────────────────────┤
│  Pages (Components)                                    │
│  ├─ Auth Pages (Login, Register)                        │
│  ├─ Admin Pages (AdminDashboard)                        │
│  ├─ Inventory Pages (AddItem, UpdateItem, DisplayItem)  │
│  ├─ Shop Pages (Shop - product browsing)                │
│  ├─ Cart Pages (Cart - shopping cart)                   │
│  └─ Checkout Pages (Checkout - payment)                │
├─────────────────────────────────────────────────────────┤
│  API Layer                                              │
│  ├─ httpClient (Axios instance)                         │
│  ├─ authApi (Authentication endpoints)                   │
│  ├─ inventoryApi (Inventory endpoints)                   │
│  └─ cartApi (Cart & Payment endpoints)                  │
├─────────────────────────────────────────────────────────┤
│  Shared Utilities                                       │
│  ├─ formatters (Data formatting)                        │
│  └─ apiConfig (API configuration)                       │
├─────────────────────────────────────────────────────────┤
│  Routing                                                │
│  └─ AppRoutes (Route configuration)                     │
└─────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Tables

#### 1. user_model
```sql
CREATE TABLE user_model (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),  -- BCrypt hashed
    phone VARCHAR(255),
    role ENUM('ROLE_ADMIN', 'ROLE_USER')
);
```

**Purpose:** Store user information with role-based access control  
**Key Features:** BCrypt password encryption, role-based permissions

#### 2. inventory_model
```sql
CREATE TABLE inventory_model (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id VARCHAR(255),
    item_image VARCHAR(255),
    item_name VARCHAR(255),
    item_category VARCHAR(255),
    item_qty VARCHAR(255),  -- Available quantity
    item_details TEXT
);
```

**Purpose:** Store product/inventory information  
**Key Features:** Image storage (filename), category classification

#### 3. cart_items
```sql
CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    inventory_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_model(id),
    FOREIGN KEY (inventory_id) REFERENCES inventory_model(id),
    CONSTRAINT chk_quantity_positive CHECK (quantity >= 1)
);
```

**Purpose:** Store shopping cart items with user-product relationships  
**Key Features:** Many-to-one relationships, quantity validation

---

## API Endpoints

### Authentication Endpoints

#### POST /user
- **Purpose:** Register new user
- **Request Body:** `{ userName, email, password, phone }`
- **Response:** UserModel with encrypted password
- **Default Role:** ROLE_USER
- **Password:** BCrypt encrypted

#### POST /login
- **Purpose:** User authentication
- **Request Body:** `{ email, password }`
- **Response:** `{ message, id, role }`
- **Validation:** BCrypt password verification

#### GET /users
- **Purpose:** Get all users (Admin only)
- **Response:** List of UserModel

#### GET /user/{id}
- **Purpose:** Get user by ID
- **Response:** UserModel

#### PUT /user/{id}
- **Purpose:** Update user information
- **Request Body:** Updated UserModel fields
- **Response:** Updated UserModel

#### DELETE /user/{id}
- **Purpose:** Delete user
- **Response:** Success message

---

### Inventory Endpoints

#### POST /inventory
- **Purpose:** Add new inventory item
- **Request Body:** InventoryModel (without image)
- **Response:** Created InventoryModel

#### POST /inventory/itemImg
- **Purpose:** Upload item image
- **Request:** MultipartFile
- **Response:** Image filename
- **Storage:** `src/main/uploads/`

#### GET /inventory
- **Purpose:** Get all inventory items
- **Response:** List of InventoryModel

#### GET /inventory/{id}
- **Purpose:** Get specific inventory item
- **Response:** InventoryModel

#### PUT /inventory/{id}
- **Purpose:** Update inventory item
- **Request:** Multipart (InventoryModel + optional file)
- **Response:** Updated InventoryModel

#### DELETE /inventory/{id}
- **Purpose:** Delete inventory item
- **Response:** Success message

#### GET /uploads/{filename}
- **Purpose:** Serve uploaded images
- **Response:** Image file

---

### Cart Endpoints

#### POST /cart/add
- **Purpose:** Add item to cart
- **Request Body:** `{ userId, inventoryId, quantity }`
- **Validation:** 
  - Stock availability check
  - Quantity validation (min 1)
  - Duplicate item handling (increment quantity)
- **Response:** `{ message, cartItem }`

#### GET /cart/user/{userId}
- **Purpose:** Get user's cart
- **Response:** `{ cartItems, totalItems, total }`

#### PUT /cart/update/{cartItemId}
- **Purpose:** Update cart item quantity
- **Request Body:** `{ quantity }`
- **Validation:** Stock availability, quantity >= 1
- **Response:** `{ message, cartItem }`

#### DELETE /cart/remove/{cartItemId}
- **Purpose:** Remove item from cart
- **Response:** Success message

#### DELETE /cart/clear/{userId}
- **Purpose:** Clear entire cart
- **Response:** Success message

#### GET /cart/count/{userId}
- **Purpose:** Get total item count in cart
- **Response:** `{ count }`

---

### Payment Endpoints

#### POST /cart/create-payment-intent
- **Purpose:** Create Stripe payment intent
- **Request Body:** `{ userId, currency }`
- **Validation:** Cart not empty, amount > 0
- **Response:** `{ clientSecret, paymentIntentId, amount, currency }`
- **Note:** Amount calculated from cart items (needs price field)

#### POST /cart/confirm-payment
- **Purpose:** Confirm and process payment
- **Request Body:** `{ paymentIntentId, userId }`
- **Process:** 
  - Verify payment status
  - Clear cart on success
  - (Future: Create order record)
- **Response:** `{ message, paymentIntentId, status }`

---

## Key Features & Implementation Details

### 1. Role-Based Access Control (RBAC)

**Implementation:**
- Spring Security with custom configuration
- Two roles: ROLE_ADMIN, ROLE_USER
- BCrypt password encryption
- CORS configuration for frontend communication

**SecurityConfig Features:**
- CORS enabled for localhost:3000
- Password encoding with BCrypt
- (Future: Add endpoint authorization rules)

### 2. File Upload System

**Implementation:**
- MultipartFile handling in Spring Boot
- Local file storage in `src/main/uploads/`
- Image serving via dedicated endpoint
- File size limit: 10MB

**Flow:**
1. Frontend sends file via FormData
2. Backend saves to uploads directory
3. Returns filename for database storage
4. Images served via `/uploads/{filename}` endpoint

### 3. Cart System with Stock Validation

**Implementation:**
- Real-time stock validation on cart operations
- Quantity validation (minimum 1)
- Duplicate item handling (increment quantity)
- Stock availability checks before adding/updating

**Validation Logic:**
```java
// Check if requested quantity exceeds available stock
if (requestedQty > availableQty) {
    return error response;
}

// For existing items, check total quantity
if (existingQuantity + requestedQty > availableQty) {
    return error response;
}
```

### 4. Stripe Payment Integration

**Implementation:**
- Stripe Java SDK for backend processing
- Payment Intent API for secure payments
- Client secret for frontend integration
- Automatic payment confirmation

**Payment Flow:**
1. Frontend requests payment intent with cart details
2. Backend creates Stripe PaymentIntent
3. Backend returns client secret
4. Frontend uses Stripe.js to process payment
5. Backend confirms payment and clears cart

**Security:**
- Secret key stored in application.properties
- Never expose secret key to frontend
- Payment amount validated on server
- Webhook verification (future implementation)

### 5. Exception Handling

**Implementation:**
- Custom exceptions for each entity
- Global exception advice with @ControllerAdvice
- Proper HTTP status codes
- User-friendly error messages

**Exception Types:**
- UserNotFoundException (404)
- InventoryNotFoundException (404)
- CartNotFoundException (404)

### 6. Validation

**Implementation:**
- Jakarta Bean Validation annotations
- Server-side validation on all endpoints
- Custom validation messages
- Field-level constraints

**Validation Annotations Used:**
- `@NotNull` - Required fields
- `@Min(value = 1)` - Minimum quantity
- `@Valid` - Request body validation

---

## Code Organization

### Backend Package Structure

```
backend/
├── src/main/java/backend/
│   ├── BackendApplication.java          # Main application
│   ├── config/
│   │   └── SecurityConfig.java          # Security configuration
│   ├── controller/
│   │   ├── UserController.java          # User endpoints
│   │   ├── InventoryController.java    # Inventory endpoints
│   │   └── CartController.java          # Cart & payment endpoints
│   ├── model/
│   │   ├── UserModel.java               # User entity
│   │   ├── InventoryModel.java         # Inventory entity
│   │   ├── CartModel.java               # Cart entity
│   │   └── Role.java                    # Role enum
│   ├── repository/
│   │   ├── UserRepository.java          # User repository
│   │   ├── InventoryRepository.java    # Inventory repository
│   │   └── CartRepository.java          # Cart repository
│   ├── service/
│   │   └── StripeService.java           # Payment service
│   └── exception/
│       ├── UserNotFoundException.java
│       ├── UserNotFoundAdvice.java
│       ├── InventoryNotFoundException.java
│       ├── InventoryNotFoundAdvice.java
│       ├── CartNotFoundException.java
│       └── CartNotFoundAdvice.java
└── src/main/resources/
    └── application.properties           # Configuration
```

### Frontend Directory Structure

```
frontend/src/
├── api/
│   ├── httpClient.js                    # Axios configuration
│   ├── authApi.js                       # Auth endpoints
│   ├── inventoryApi.js                  # Inventory endpoints
│   └── cartApi.js                       # Cart & payment endpoints
├── pages/
│   ├── auth/
│   │   ├── Login.js
│   │   └── Register.js
│   ├── admin/
│   │   └── AdminDashboard.js
│   ├── inventory/
│   │   ├── AddItem.js
│   │   ├── UpdateItem.js
│   │   └── DisplayItem.js
│   ├── shop/
│   │   └── Shop.js
│   ├── cart/
│   │   ├── Cart.js
│   │   └── Cart.css
│   └── checkout/
│       ├── Checkout.js
│       └── Checkout.css
├── shared/
│   ├── constants/
│   │   └── apiConfig.js
│   └── utils/
│       └── formatters.js
├── app/
│   └── AppRoutes.js                     # Route configuration
├── App.js                               # Main component
└── index.js                             # Entry point
```

---

## Development Workflow

### Setting Up the Project

#### Backend Setup
```bash
cd backend
# Ensure MySQL is running with database 'spring'
# Update application.properties with your MySQL credentials
mvn clean install
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

### Database Setup
```sql
CREATE DATABASE spring;
-- JPA will auto-create tables with ddl-auto=update
```

### Stripe Setup
1. Create Stripe account at stripe.com
2. Get API keys from Stripe Dashboard
3. Update `application.properties`:
   - `stripe.secret.key=sk_test_...`
4. Update frontend Checkout.js:
   - `const stripePromise = loadStripe('pk_test_...');`

---

## Testing Strategy

### Backend Testing

#### Unit Tests (Recommended)
- Controller tests: Mock repositories, test endpoints
- Service tests: Test StripeService with mocked Stripe API
- Repository tests: Test custom query methods
- Validation tests: Test validation annotations

#### Integration Tests (Recommended)
- Test full cart flow: add → update → remove
- Test payment flow: create intent → confirm payment
- Test stock validation scenarios
- Test authentication flow

### Frontend Testing

#### Component Tests (Recommended)
- Cart component: test quantity updates, item removal
- Checkout component: test payment flow
- Shop component: test add to cart
- Auth components: test login/register

#### Integration Tests (Recommended)
- Test API client methods
- Test error handling
- Test loading states

### End-to-End Testing (Recommended)
- Complete purchase flow: browse → add to cart → checkout → pay
- Admin flow: login → add item → update → delete
- Stock validation: attempt to add more than available

---

## Common Issues & Solutions

### Issue: CORS Errors
**Symptom:** Frontend cannot connect to backend  
**Solution:** Ensure SecurityConfig has `@CrossOrigin(origins = "http://localhost:3000")`

### Issue: File Upload Fails
**Symptom:** Image upload returns error  
**Solution:** Check uploads directory permissions, ensure file size < 10MB

### Issue: Cart Stock Validation
**Symptom:** Cannot add items despite stock availability  
**Solution:** Ensure `itemQty` in InventoryModel is numeric string, check database values

### Issue: Stripe Payment Fails
**Symptom:** Payment intent creation fails  
**Solution:** Verify Stripe keys are correct, ensure Stripe account is active

### Issue: Database Connection
**Symptom:** Application fails to start  
**Solution:** Check MySQL is running, verify credentials in application.properties

---

## Performance Optimizations

### Implemented
- Lazy loading for JPA relationships (`FetchType.LAZY`)
- Efficient cart queries with custom repository methods
- Image serving via dedicated endpoint

### Recommended Future Optimizations
- Add database indexes on frequently queried fields
- Implement caching for inventory data
- Add pagination for large inventory lists
- Optimize bundle size (code splitting)
- Implement CDN for image serving

---

## Security Best Practices Implemented

1. **Password Security**
   - BCrypt encryption for all passwords
   - Never store plain text passwords

2. **API Security**
   - CORS configuration for trusted origins
   - Input validation on all endpoints
   - SQL injection prevention via JPA

3. **Payment Security**
   - Stripe handles sensitive card data
   - Server-side amount validation
   - Secret key never exposed to frontend

4. **File Upload Security**
   - File size limits (10MB)
   - Local file storage (not public access)
   - Filename validation

---

## Scalability Considerations

### Current Limitations
- Single server deployment
- Local file storage (not cloud)
- No load balancing
- No distributed caching

### Future Scalability Improvements
- Move to cloud deployment (AWS/Azure)
- Implement cloud storage (S3 for images)
- Add Redis caching layer
- Implement load balancing
- Add database read replicas
- Implement message queue for order processing

---

## Interview Talking Points

### Technical Challenges Faced
1. **Stock Management in Cart**
   - Challenge: Prevent overselling when multiple users add same item
   - Solution: Real-time stock validation on every cart operation
   - Future: Implement database row locking or optimistic concurrency

2. **Payment Integration**
   - Challenge: Secure payment processing without storing card data
   - Solution: Stripe Payment Intent API with client-side processing
   - Benefit: PCI compliance simplified, better security

3. **File Upload Handling**
   - Challenge: Efficient image storage and serving
   - Solution: Local file storage with dedicated serving endpoint
   - Future: Move to cloud storage for scalability

### Design Decisions
1. **Spring Boot over Node.js**
   - Reason: Strong typing, enterprise features, better for complex business logic
   - Benefit: Type safety, extensive ecosystem, good for interviews

2. **JPA over JDBC**
   - Reason: Object-relational mapping reduces boilerplate
   - Benefit: Faster development, type-safe queries, automatic schema management

3. **React over Angular**
   - Reason: Simpler learning curve, larger community, flexible
   - Benefit: Easy to add features, good performance, modern ecosystem

### What I Would Improve
1. Add comprehensive unit and integration tests
2. Implement proper order management system
3. Add email notifications for orders
4. Implement proper logging (SLF4J + Logback)
5. Add API documentation (Swagger/OpenAPI)
6. Implement Docker containerization
7. Add CI/CD pipeline

---

## Metrics & Analytics (Future)

### Recommended Metrics to Track
- User registration rate
- Cart abandonment rate
- Average order value
- Payment success rate
- Inventory turnover rate
- Most popular products
- User session duration

### Implementation
- Add analytics tracking (Google Analytics, Mixpanel)
- Implement database queries for business metrics
- Create admin dashboard with analytics

---

## Deployment Checklist

### Pre-Deployment
- [ ] Update Stripe keys to production
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Remove debug logging
- [ ] Set up SSL/HTTPS
- [ ] Configure CORS for production domain
- [ ] Test payment flow in test mode
- [ ] Set up monitoring and logging

### Post-Deployment
- [ ] Monitor error rates
- [ ] Check payment success rates
- [ ] Verify database performance
- [ ] Set up backups
- [ ] Configure CDN for images
- [ ] Set up load testing

---

## Learning Resources Used

### Spring Boot
- Spring Boot Documentation
- Baeldung Spring Boot Tutorials
- Spring Data JPA Reference

### React
- React Documentation
- React Router Documentation
- Axios Documentation

### Stripe
- Stripe API Documentation
- Stripe Payment Intents Guide
- Stripe Best Practices

### Database
- MySQL Documentation
- JPA/Hibernate Tutorial
- Database Design Best Practices

---

## Project Statistics

- **Total Backend Files:** 15 Java files
- **Total Frontend Files:** 20+ components
- **API Endpoints:** 18 endpoints
- **Database Tables:** 3 tables
- **Lines of Code (Backend):** ~1,500
- **Lines of Code (Frontend):** ~2,000
- **Development Time:** Ongoing project

---

## Key Takeaways for Interviews

### Technical Skills Demonstrated
- Full-stack development (Java + React)
- RESTful API design
- Database design and ORM
- Third-party API integration (Stripe)
- Security implementation (Spring Security, BCrypt)
- File upload handling
- State management in React
- Error handling and validation

### Soft Skills Demonstrated
- Problem-solving (stock management, payment security)
- Attention to detail (validation, error handling)
- Documentation skills (changelog, knowledge base)
- Code organization and maintainability
- Understanding of best practices

### Industry Practices
- Separation of concerns (MVC architecture)
- Dependency injection (Spring)
- RESTful API design
- Security best practices
- Version control (Git)
- Testing strategy planning

---

## Quick Reference Commands

### Backend
```bash
# Build
mvn clean install

# Run
mvn spring-boot:run

# Test
mvn test

# Package
mvn package
```

### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Database
```bash
# Connect to MySQL
mysql -u root -p

# Use database
USE spring;

# View tables
SHOW TABLES;

# View cart items
SELECT * FROM cart_items;
```

---

## Future Enhancements Roadmap

### Phase 1: Core Features (Current)
- [x] User authentication
- [x] Inventory management
- [x] Cart system
- [x] Stripe payment integration

### Phase 2: Order Management (Next)
- [ ] Order entity and repository
- [ ] Order history page
- [ ] Order status tracking
- [ ] Email notifications

### Phase 3: Advanced Features
- [ ] Discount/coupon system
- [ ] Shipping options
- [ ] User reviews/ratings
- [ ] Wishlist functionality

### Phase 4: Analytics & Reporting
- [ ] Sales reports
- [ ] Inventory analytics
- [ ] User behavior tracking
- [ ] Admin dashboard enhancements

### Phase 5: Performance & Scalability
- [ ] Caching implementation
- [ ] Database optimization
- [ ] Cloud deployment
- [ ] Load balancing

---

## Contact & Support

For project-related questions or issues:
- Review this knowledge base first
- Check CHANGELOG.md for recent changes
- Review code comments for implementation details
- Refer to official documentation for frameworks used

---

**Document Version:** 1.0  
**Last Updated:** July 7, 2026  
**Maintained By:** Project Developer
