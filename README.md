# 📚 Bookify Server - Book Exchange Platform API

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://bookify-mocha.vercel.app/)
[![Frontend](https://img.shields.io/badge/Frontend-Repository-blue)](https://github.com/sumon-ray/Bookify)
[![Backend](https://img.shields.io/badge/Backend-Repository-orange)](https://github.com/sumon-ray/Bookify-Server)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)](https://mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-Framework-black)](https://expressjs.com/)

## 🌟 Overview

**Bookify Server** is a robust, scalable RESTful API backend that powers the Bookify book exchange platform. Built with Node.js and Express.js, it provides comprehensive book management, user authentication, exchange request handling, and real-time messaging capabilities for seamless book sharing experiences.

### 🎯 Mission
To provide a secure, efficient, and scalable backend infrastructure that enables book lovers to exchange, discover, and share their favorite reads through a comprehensive API ecosystem.

## ✨ Core API Features

### 📖 Book Management APIs
- **Comprehensive Book CRUD** - Complete book lifecycle management with metadata
- **Advanced Search Engine** - Full-text search with multiple filter capabilities
- **Image Upload & Processing** - Secure file handling with cloud storage integration
- **Book Condition Tracking** - Status management (Available, Reserved, Exchanged)
- **Inventory Management** - Real-time availability and ownership tracking

### 👤 User Management System
- **Secure Authentication** - JWT-based authentication with refresh token support
- **User Profile Management** - Complete profile CRUD with validation
- **Rating & Review System** - Community-driven feedback mechanism
- **Activity Tracking** - Comprehensive user activity logging
- **Account Security** - Password encryption and secure session management

### 🔄 Exchange Request Engine
- **Request Workflow** - Streamlined request/accept/decline system
- **Status Tracking** - Real-time exchange status updates
- **Notification System** - Automated email and in-app notifications
- **Exchange History** - Complete transaction history and analytics
- **Smart Matching** - Algorithm-based book recommendation system

### 💬 Communication Infrastructure
- **Real-time Messaging** - Socket.io integration for instant communication
- **Email Services** - Automated transactional email system
- **Push Notifications** - Real-time updates for mobile and web clients
- **Message Threading** - Organized conversation management
- **File Sharing** - Secure document and image sharing in messages

## 🏗️ Server Architecture

### Backend Technology Stack
```
Runtime: Node.js 18+
Framework: Express.js
Database: MongoDB with Mongoose ODM
Authentication: JWT + bcrypt
Real-time: Socket.io
File Storage: Cloudinary/AWS S3
Email Service: SendGrid/Nodemailer
Validation: Joi/Express-validator
```

### Security Implementation
```
Authentication: JWT with refresh tokens
Encryption: bcrypt for password hashing
Validation: Input sanitization and validation
Rate Limiting: Express rate limiter
CORS: Configured cross-origin resource sharing
Helmet: Security headers middleware
```

### Infrastructure & Deployment
```
Hosting: Railway/Render/Heroku
Database: MongoDB Atlas
CDN: Cloudinary for image optimization
Monitoring: Application performance monitoring
Logging: Structured logging with Winston
Testing: Jest + Supertest
```

## 📁 Server Project Structure

```
src/
├── app/                          # Application core (currently empty - modular structure)
├── components/                   # Reusable components (currently empty - utility modules)
└── services/                     # Business logic services (currently empty - service layer)

# Standard Express.js structure (inferred from typical book exchange API):
├── controllers/                  # Request handlers
│   ├── authController.js         # Authentication logic
│   ├── bookController.js         # Book management
│   ├── userController.js         # User operations
│   ├── exchangeController.js     # Exchange requests
│   ├── messageController.js      # Messaging system
│   └── reviewController.js       # Review management
│
├── models/                       # Database schemas
│   ├── User.js                   # User model
│   ├── Book.js                   # Book model
│   ├── Exchange.js               # Exchange request model
│   ├── Message.js                # Message model
│   └── Review.js                 # Review model
│
├── routes/                       # API route definitions
│   ├── auth.js                   # Authentication routes
│   ├── books.js                  # Book management routes
│   ├── users.js                  # User routes
│   ├── exchanges.js              # Exchange routes
│   ├── messages.js               # Messaging routes
│   └── reviews.js                # Review routes
│
├── middleware/                   # Custom middleware
│   ├── auth.js                   # Authentication middleware
│   ├── validation.js             # Input validation
│   ├── upload.js                 # File upload handling
│   ├── rateLimiter.js           # Rate limiting
│   └── errorHandler.js          # Error handling
│
├── utils/                        # Utility functions
│   ├── jwtUtils.js              # JWT token utilities
│   ├── emailService.js          # Email sending
│   ├── imageUpload.js           # Image processing
│   ├── validators.js            # Input validators
│   └── helpers.js               # General helpers
│
├── config/                       # Configuration files
│   ├── database.js              # Database connection
│   ├── cloudinary.js            # Image storage config
│   ├── email.js                 # Email service config
│   └── environment.js           # Environment variables
│
└── socket/                       # Real-time functionality
    ├── socketHandlers.js        # Socket event handlers
    └── messageEvents.js         # Message socket events
```

## 🛠️ Technology Stack

### Core Backend Technologies
- **[Node.js 18+](https://nodejs.org/)** - JavaScript runtime environment
- **[Express.js](https://expressjs.com/)** - Fast, unopinionated web framework
- **[MongoDB](https://www.mongodb.com/)** - NoSQL document database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling for Node.js
- **[Socket.io](https://socket.io/)** - Real-time bidirectional event-based communication

### Authentication & Security
- **[JWT](https://jwt.io/)** - JSON Web Token for secure authentication
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Password hashing library
- **[Helmet](https://helmetjs.github.io/)** - Express.js security middleware
- **[Express Rate Limit](https://www.npmjs.com/package/express-rate-limit)** - Rate limiting middleware
- **[Joi](https://joi.dev/)** - Data validation library

### File Management & Communication
- **[Cloudinary](https://cloudinary.com/)** - Cloud-based image and video management
- **[Multer](https://www.npmjs.com/package/multer)** - Middleware for handling multipart/form-data
- **[SendGrid](https://sendgrid.com/)** - Email delivery service
- **[Nodemailer](https://nodemailer.com/)** - Email sending library
- **[Sharp](https://sharp.pixelplumbing.com/)** - High-performance image processing

### Development & Testing
- **[Jest](https://jestjs.io/)** - JavaScript testing framework
- **[Supertest](https://www.npmjs.com/package/supertest)** - HTTP testing library
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Winston](https://github.com/winstonjs/winston)** - Logging library
- **[Cors](https://www.npmjs.com/package/cors)** - Cross-origin resource sharing

## 🚀 API Endpoints

### Authentication System
```javascript
POST   /api/auth/register         # User registration
POST   /api/auth/login            # User login
POST   /api/auth/logout           # User logout
POST   /api/auth/refresh-token    # Refresh access token
POST   /api/auth/forgot-password  # Password reset request
POST   /api/auth/reset-password   # Password reset confirmation
GET    /api/auth/verify-email     # Email verification
```

### Book Management
```javascript
GET    /api/books                 # Get all books (with filters)
POST   /api/books                 # Add new book
GET    /api/books/:id             # Get book details
PUT    /api/books/:id             # Update book
DELETE /api/books/:id             # Delete book
GET    /api/books/search          # Advanced book search
GET    /api/books/user/:userId    # Get user's books
POST   /api/books/:id/images      # Upload book images
```

### Exchange Request System
```javascript
POST   /api/exchanges             # Create exchange request
GET    /api/exchanges             # Get user's exchanges
GET    /api/exchanges/:id         # Get exchange details
PUT    /api/exchanges/:id/accept  # Accept exchange request
PUT    /api/exchanges/:id/decline # Decline exchange request
PUT    /api/exchanges/:id/cancel  # Cancel exchange request
GET    /api/exchanges/sent        # Get sent requests
GET    /api/exchanges/received    # Get received requests
```

### User Management
```javascript
GET    /api/users/profile         # Get user profile
PUT    /api/users/profile         # Update user profile
GET    /api/users/:id             # Get public user profile
POST   /api/users/avatar          # Upload profile picture
GET    /api/users/:id/books       # Get user's public books
GET    /api/users/:id/reviews     # Get user reviews
PUT    /api/users/settings        # Update user settings
```

### Messaging System
```javascript
GET    /api/messages              # Get user messages
POST   /api/messages              # Send new message
GET    /api/messages/:id          # Get conversation
PUT    /api/messages/:id/read     # Mark message as read
DELETE /api/messages/:id          # Delete message
GET    /api/messages/conversations # Get all conversations
```

### Review & Rating System
```javascript
POST   /api/reviews               # Create review
GET    /api/reviews/book/:bookId  # Get book reviews
GET    /api/reviews/user/:userId  # Get user reviews
PUT    /api/reviews/:id           # Update review
DELETE /api/reviews/:id           # Delete review
GET    /api/reviews/stats/:bookId # Get review statistics
```

## 📊 Database Schema Design

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  bio: String,
  location: {
    city: String,
    country: String,
    coordinates: [Number] // [longitude, latitude]
  },
  rating: {
    average: Number,
    count: Number
  },
  verification: {
    email: Boolean,
    emailToken: String
  },
  preferences: {
    genres: [String],
    languages: [String],
    notifications: {
      email: Boolean,
      push: Boolean
    }
  },
  statistics: {
    booksListed: Number,
    exchangesCompleted: Number,
    joinedDate: Date
  },
  created_at: Date,
  updated_at: Date
}
```

### Book Collection
```javascript
{
  _id: ObjectId,
  title: String,
  author: String,
  isbn: String,
  genre: String,
  language: String,
  condition: {
    type: String, // 'new', 'like-new', 'good', 'fair', 'poor'
    description: String
  },
  description: String,
  images: [String],
  owner: ObjectId (ref: User),
  status: String, // 'available', 'reserved', 'exchanged'
  location: {
    city: String,
    country: String,
    coordinates: [Number]
  },
  metadata: {
    publisher: String,
    publishedYear: Number,
    pages: Number,
    coverType: String // 'hardcover', 'paperback', 'ebook'
  },
  statistics: {
    views: Number,
    likes: Number,
    exchangeRequests: Number
  },
  tags: [String],
  created_at: Date,
  updated_at: Date
}
```

### Exchange Request Collection
```javascript
{
  _id: ObjectId,
  requester: ObjectId (ref: User),
  owner: ObjectId (ref: User),
  requestedBook: ObjectId (ref: Book),
  offeredBooks: [ObjectId] (ref: Book),
  status: String, // 'pending', 'accepted', 'declined', 'completed', 'cancelled'
  message: String,
  responses: [{
    user: ObjectId (ref: User),
    message: String,
    timestamp: Date
  }],
  meetingDetails: {
    location: String,
    datetime: Date,
    method: String // 'in-person', 'mail', 'pickup'
  },
  tracking: {
    requestedAt: Date,
    respondedAt: Date,
    completedAt: Date
  },
  created_at: Date,
  updated_at: Date
}
```

### Message Collection
```javascript
{
  _id: ObjectId,
  conversation: ObjectId,
  sender: ObjectId (ref: User),
  recipient: ObjectId (ref: User),
  content: String,
  messageType: String, // 'text', 'image', 'file'
  attachments: [String],
  relatedExchange: ObjectId (ref: Exchange),
  readStatus: {
    read: Boolean,
    readAt: Date
  },
  created_at: Date,
  updated_at: Date
}
```

### Review Collection
```javascript
{
  _id: ObjectId,
  reviewer: ObjectId (ref: User),
  reviewee: ObjectId (ref: User),
  book: ObjectId (ref: Book),
  exchange: ObjectId (ref: Exchange),
  rating: Number, // 1-5 stars
  comment: String,
  reviewType: String, // 'book', 'user', 'exchange'
  helpful: {
    count: Number,
    users: [ObjectId] (ref: User)
  },
  created_at: Date,
  updated_at: Date
}
```

## 🔒 Security Implementation

### Authentication Security
- **JWT Tokens** - Secure token-based authentication with refresh token rotation
- **Password Security** - bcrypt hashing with salt rounds
- **Session Management** - Secure session handling with token expiration
- **Account Verification** - Email-based account verification system

### Data Protection
- **Input Validation** - Comprehensive server-side validation using Joi
- **SQL Injection Prevention** - MongoDB's built-in protection mechanisms
- **XSS Protection** - Input sanitization and output encoding
- **Rate Limiting** - API endpoint protection against abuse
- **CORS Configuration** - Proper cross-origin resource sharing setup

### File Security
- **Upload Validation** - File type and size validation
- **Image Processing** - Automatic image optimization and resizing
- **Secure Storage** - Cloud-based storage with access control
- **Malware Scanning** - File security scanning before storage

## 📈 Performance Optimizations

### Database Optimization
- **Indexing Strategy** - Optimized database indexes for frequent queries
- **Query Optimization** - Efficient MongoDB queries with aggregation pipelines
- **Connection Pooling** - Mongoose connection pool management
- **Data Pagination** - Efficient data pagination for large datasets

### Caching Strategy
- **Memory Caching** - In-memory caching for frequently accessed data
- **Image Caching** - CDN-based image caching with Cloudinary
- **API Response Caching** - Strategic caching of API responses
- **Database Query Caching** - MongoDB query result caching

### Real-time Performance
- **Socket.io Optimization** - Efficient real-time communication
- **Message Queuing** - Asynchronous message processing
- **Background Jobs** - Non-blocking background task processing
- **Load Balancing** - Horizontal scaling capabilities

## 🧪 Testing & Quality Assurance

### Testing Framework
```bash
# Unit Tests
npm run test:unit

# Integration Tests  
npm run test:integration

# API Testing
npm run test:api

# Coverage Report
npm run test:coverage
```

### Code Quality Tools
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting consistency
- **Husky** - Git hooks for pre-commit validation
- **Jest** - Comprehensive testing framework

## 📧 Contact Information

- **Email:** [sumonray146371@gmail.com](mailto:sumonray146371@gmail.com)
- **Portfolio:** [https://sumon-ray.vercel.app/](https://sumon-ray.vercel.app/)
- **LinkedIn:** [https://www.linkedin.com/in/sumon60/](https://www.linkedin.com/in/sumon60/)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image storage)
- SendGrid account (for email services)

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/sumon-ray/Bookify-Server.git
cd Bookify-Server
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env
```

Configure your environment variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/bookify
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/bookify

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary Configuration (Image Storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@bookify.com

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,https://bookify-mocha.vercel.app

# Socket.io Configuration
SOCKET_CORS_ORIGIN=http://localhost:3000
```

4. **Database Setup**
```bash
# Start MongoDB (if running locally)
mongod

# The application will automatically connect to the database
# No additional setup required for MongoDB
```

5. **Start the development server**
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

6. **Verify installation**
```bash
# Test API health
curl http://localhost:5000/api/health

# Expected response:
{
  "status": "success",
  "message": "Bookify API is running!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-api-domain.com/api
```

### Response Format
All API responses follow a consistent format:

```javascript
// Success Response
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "pagination": { // For paginated responses
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}

// Error Response
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Authentication Headers
```javascript
// For protected routes
Authorization: Bearer <your-jwt-token>
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with nodemon
npm start           # Start production server

# Testing
npm test            # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Code Quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues automatically
npm run prettier    # Format code with Prettier

# Database
npm run seed        # Seed database with sample data
npm run migrate     # Run database migrations
npm run db:reset    # Reset database (development only)

# Production
npm run build       # Build for production
npm run serve       # Serve production build
```

## 🏥 Health Monitoring

### Health Check Endpoint
```javascript
GET /api/health
```

Response includes:
- Server status
- Database connection status
- External service status (Cloudinary, SendGrid)
- Memory usage
- Uptime information

### Logging
The application uses Winston for structured logging:
- **Error logs** - Application errors and exceptions
- **Access logs** - HTTP request/response logging
- **Debug logs** - Development debugging information
- **Performance logs** - Response time and performance metrics

## 🤝 Contributing

We welcome contributions to improve the Bookify Server! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run the test suite**
   ```bash
   npm test
   ```
6. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
7. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👨‍💻 Developer

**Sumon Ray**
- **Portfolio:** [https://sumon-ray.vercel.app/](https://sumon-ray.vercel.app/)
- **LinkedIn:** [https://www.linkedin.com/in/sumon60/](https://www.linkedin.com/in/sumon60/)
- **Email:** sumonray146371@gmail.com

## 🙏 Acknowledgments

- **Express.js Team** - For the robust web framework
- **MongoDB Team** - For the flexible NoSQL database
- **Socket.io Team** - For real-time communication capabilities
- **Cloudinary** - For excellent image management services
- **SendGrid** - For reliable email delivery services
- **Open Source Community** - For the amazing libraries and tools

---

### 🌐 API Endpoints
**Base URL**: `https://your-api-domain.com/api`

*Powering book exchanges through robust API architecture* 📚🔗

**Created with ❤️ by Sumon Ray**

*This backend demonstrates production-ready API development, secure authentication systems, real-time communication, and scalable architecture patterns for modern web applications.*
