# 🚀 DevTinder Backend

### Scalable Developer Networking Platform with Real-Time Chat & Payment Integration

DevTinder Backend is a production-ready backend application powering a
developer networking platform where users can connect, communicate in
real time, and upgrade to premium membership.

This project demonstrates strong backend engineering fundamentals
including authentication, authorization, real-time systems, secure
payment workflows, database modeling, and cloud deployment.

---

## 📌 Project Overview

DevTinder enables developers to:

- Create and manage profiles
- Send and receive connection requests
- Accept or reject requests
- View a personalized developer feed
- Chat in real time
- Upgrade to premium membership via online payment

The backend is responsible for handling authentication, business logic,
real-time communication, payment verification, and secure data
persistence.

---

## 🏁 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- MongoDB instance (local or cloud)
- Razorpay account (for payments)
- AWS account (for SES email, if you use it in production)

### Installation

```bash
git clone https://github.com/harshmalik8940774/devTinder.git
cd devTinderBack
npm install
```

### Environment Variables

Create a `.env` file in the project root and configure:

```bash
PORT=7777
DB_CONNECTION_SECRET=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

### Run the Server

```bash
npm run dev
# or
npm start
```

---

## ✨ Core Features

### 🔐 1. Authentication & Authorization

- User Signup & Login
- Password hashing using bcrypt
- JWT-based authentication
- JWT sent back and stored in cookies for authenticated requests (HTTP-only for login)
- Protected REST APIs using middleware
- Token validation for WebSocket connections

---

### 👤 2. Profile Management

- View user profile
- Edit profile details
- Update password
- Secure access to user-specific data

---

### 🤝 3. Connection System

- Send connection request
- Accept / Reject request
- Maintain connection relationships
- Feed filtering to exclude existing connections
- Duplicate request prevention logic

---

### 💬 4. Real-Time Chat System

- Authenticated WebSocket connections
- Private one-to-one chat rooms
- Deterministic room generation using SHA-256 hashing
- Friend validation before allowing messaging
- Persistent message storage in MongoDB
- Chat history retrieval API

---

### 💳 5. Membership & Payment Integration

- Dynamic order creation
- Secure webhook endpoint
- Webhook signature verification
- Payment status tracking in database
- Automatic premium upgrade on successful payment
- Premium membership verification API

---

### ☁️ 6. Deployment & Production Setup

- Hosted on AWS EC2
- Nginx reverse proxy configuration
- Environment variable management
- Secure key handling
- Production-ready server configuration

---

## 🛠 Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication & Security

- JWT (JSON Web Token)
- bcrypt
- Custom middleware validation

### Real-Time Communication

- Socket.IO

### Payments

- Razorpay

### Deployment

- AWS EC2
- Nginx

---

## 🏗 Architecture

`src/app.js` is the main server composition layer: it configures Express middleware, mounts REST routers, starts Socket.IO on the same HTTP server, initializes Redis caching, and starts listening after MongoDB connects (`src/config/database.js`).

### Architecture diagram

```text
┌───────────┐  HTTP (cookies + JWT)  ┌────────────────────────┐  Mongo queries  ┌───────────┐
│  Client   │ ─────────────────────► │ Express (REST routes)  │ ──────────────► │  MongoDB  │
│  UI/Web   │                          │ middlewares/auth +     │                  │ Mongoose  │
└───────────┘                          │ errorHandler + routes  │                  └───────────┘
        ▲                               └───────────┬────────────┘
        │ Redis cache hit                             │
        │                                               ▼
        │                                   ┌────────────────────────┐
        │                                   │ Redis (feed/profile)   │
        │                                   └────────────────────────┘
        │
        │  Socket.IO connect (token)        ┌────────────────────────┐   read/write   ┌───────────┐
        └────────────────────────────────► │ Socket.IO + socketAuth│ ─────────────►│  MongoDB  │
                                           │ joinChat (SHA-256 room)│                 │  Chat +   │
                                           └───────────┬────────────┘                 │ Connection│
                                                       │ sendMessage (friend check)
                                                       ▼
                                           ┌────────────────────────┐
                                           │ Chat room (roomId)    │
                                           └───────────┬────────────┘
                                                       │ emits messageReceived
                                                       ▼
                                             ┌─────────────────────┐
                                             │ Connected clients   │
                                             └─────────────────────┘

Payment (Razorpay + webhook):
┌───────────┐  POST /payment/create   ┌────────────────────────┐  create order  ┌───────────┐
│  Client   │ ───────────────────────► │ Express (payment route)│ ─────────────►│ Razorpay  │
└───────────┘                            └───────────┬────────────┘                 └─────┬─────┘
                                                       │ save Payment (orderId + notes)
                                                       ▼
                                                ┌───────────┐
                                                │  MongoDB   │
                                                └─────┬─────┘
                                                      │ POST /payment/webhook (signed)
                                                      ▼
                                             ┌────────────────────────┐  verify signature
                                             │ Express /payment/webhook│◄────────────────── Razorpay
                                             └───────────┬────────────┘
                                                         │ update Payment + User.isPremium
                                                         ▼
                                                ┌───────────┐
                                                │  MongoDB   │
                                                └───────────┘
```

### High-level component responsibilities
- `src/routes/*`: HTTP endpoints for auth, profile, connection requests, feed/connections, payments, and chat history.
- `src/middlewares/*`: JWT auth for REST (`src/middlewares/auth.js`), JWT auth for Socket.IO (`src/middlewares/socketAuth.js`), request logging, and global error handling.
- `src/utils/socket.js`: real-time chat (room generation, friendship validation, message persistence + broadcast).
- `src/utils/razorpay.js`: Razorpay client configuration.
- `src/models/*`: MongoDB schemas (User, ConnectionRequest, Chat, Payment).
- Redis: short-lived caching for feed and profile.

### REST request flow (HTTP)
Client → Express middleware (CORS, JSON parsing, cookie parsing, logger, rate-limit)
→ route handler in `src/routes/*`
→ optional auth middleware (`req.user` attached)
→ MongoDB reads/writes via `src/models/*`
→ optional Redis caching (`req.app.locals.redisClient`)
→ JSON response (or error via `src/middlewares/errorHandler.js`)

### Real-time flow (Socket.IO chat)
Client connects to Socket.IO
→ `socketAuth` validates JWT (`socket.handshake.auth.token`) and attaches `socket.user`
→ `joinChat` derives a deterministic room id (SHA-256 of sorted user ids) and joins
→ `sendMessage` checks friendship via `ConnectionRequest` (status `accepted`)
→ saves message into the pair’s `Chat` document in MongoDB
→ emits `messageReceived` to everyone in that room

### Redis caching (performance)
- Feed: `GET /feed` caches results by `user + page + limit` with a short TTL.
- Profile: `GET /profile/view` caches the logged-in user; `PATCH /profile/edit` invalidates `profile:*` and related `feed:*` caches.

### Payment workflow (Razorpay)
- `POST /payment/create`: creates a Razorpay order and stores payment metadata in MongoDB.
- `POST /payment/webhook`: verifies webhook signature, updates payment status by `orderId`, and upgrades the user to premium.
- `GET /premium/verify`: checks whether the authenticated user is premium.

### Data persistence (MongoDB)
MongoDB collections are modeled with Mongoose in `src/models`:
`User`, `ConnectionRequest`, `Chat`, and `Payment`.

---

## 📡 API Overview

### Auth Routes

- POST `/signup`
- POST `/login`
- POST `/logout`

### Profile Routes

- GET `/profile/view`
- PATCH `/profile/edit`
- PATCH `/profile/password`

### Connection Routes

- POST `/request/send/:status/:userId`
- POST `/request/review/:status/:requestId`

Status values:

- `interested`
- `ignored`
- `accepted`
- `rejected`

### User Routes

- GET `/user/requests/received`
- GET `/user/connections`
- GET `/feed`

---

## 📊 Engineering Skills Demonstrated

- RESTful API Design
- JWT Authentication & Authorization
- Middleware Architecture
- MongoDB Schema Design
- Real-Time Systems Implementation
- Secure Webhook Handling
- Payment Workflow Integration
- Cloud Deployment
- Production Debugging & Error Handling

devTinderBack/
│
├─ apiList.md               # API route list/notes
├─ .env                     # Environment variables
├─ package.json
├─ README.md
└─ src/
   ├─ app.js                # Express app bootstrap
   ├─ config/
   │  └─ database.js        # MongoDB connection setup
   ├─ middlewares/
   │  ├─ auth.js            # JWT authentication (REST)
   │  ├─ socketAuth.js      # JWT authentication (Socket.IO)
   │  ├─ errorHandler.js    # Global error handler
   │  └─ logger.js          # API request logger
   ├─ models/
   │  ├─ user.js           # User schema
   │  ├─ connectionRequest.js # Connection request schema
   │  ├─ chat.js           # Chat schema
   │  └─ payment.js        # Payment schema
   ├─ routes/
   │  ├─ auth.js           # Signup/Login/Logout
   │  ├─ profile.js        # Profile view/edit/password
   │  ├─ request.js        # Send/Review connection requests
   │  ├─ user.js           # Feed & connections APIs
   │  ├─ chat.js           # Real-time chat history APIs
   │  └─ payment.js        # Razorpay integration
   └─ utils/
      ├─ socket.js         # Socket.IO initialization + chat handlers
      ├─ validation.js     # Request validation helpers
      └─ razorpay.js       # Razorpay client wrapper

---

## 👨‍💻 Author

Harsh Malik\
Engineering Student \| Backend Developer\
Interested in scalable backend systems, real-time architectures, and
distributed applications. -->




 


