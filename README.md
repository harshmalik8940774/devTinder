# 🚀 DevTinder Backend

### Scalable Developer Networking Platform with Real-Time Chat & Payment Integration

DevTinder Backend is a production-ready backend application powering a
developer networking platform where users can connect, communicate in
real time, and upgrade to premium membership.

This project demonstrates strong backend engineering fundamentals
including authentication, authorization, real-time systems, secure
payment workflows, database modeling, and cloud deployment.

------------------------------------------------------------------------

## 📌 Project Overview

DevTinder enables developers to:

-   Create and manage profiles
-   Send and receive connection requests
-   Accept or reject requests
-   View a personalized developer feed
-   Chat in real time
-   Upgrade to premium membership via online payment

The backend is responsible for handling authentication, business logic,
real-time communication, payment verification, and secure data
persistence.

------------------------------------------------------------------------

## ✨ Core Features

### 🔐 1. Authentication & Authorization

-   User Signup & Login
-   Password hashing using bcrypt
-   JWT-based authentication
-   Protected REST APIs using middleware
-   Token validation for WebSocket connections

------------------------------------------------------------------------

### 👤 2. Profile Management

-   View user profile
-   Edit profile details
-   Update password
-   Secure access to user-specific data

------------------------------------------------------------------------

### 🤝 3. Connection System

-   Send connection request
-   Accept / Reject request
-   Maintain connection relationships
-   Feed filtering to exclude existing connections
-   Duplicate request prevention logic

------------------------------------------------------------------------

### 💬 4. Real-Time Chat System

-   Authenticated WebSocket connections
-   Private one-to-one chat rooms
-   Deterministic room generation using SHA-256 hashing
-   Friend validation before allowing messaging
-   Persistent message storage in MongoDB
-   Chat history retrieval API

------------------------------------------------------------------------

### 💳 5. Membership & Payment Integration

-   Dynamic order creation
-   Secure webhook endpoint
-   Webhook signature verification
-   Payment status tracking in database
-   Automatic premium upgrade on successful payment
-   Premium membership verification API

------------------------------------------------------------------------

### ☁️ 6. Deployment & Production Setup

-   Hosted on AWS EC2
-   Nginx reverse proxy configuration
-   Environment variable management
-   Secure key handling
-   Production-ready server configuration

------------------------------------------------------------------------

## 🛠 Tech Stack

### Backend

-   Node.js
-   Express.js

### Database

-   MongoDB
-   Mongoose

### Authentication & Security

-   JWT (JSON Web Token)
-   bcrypt
-   Custom middleware validation

### Real-Time Communication

-   Socket.IO

### Payments

-   Razorpay

### Deployment

-   AWS EC2
-   Nginx

------------------------------------------------------------------------

## 🏗 System Architecture

### REST Layer

Client → Express Server → MongoDB

### Real-Time Layer

Client ↔ WebSocket Server ↔ MongoDB

### Payment Flow

Client → Backend (Create Order) → Payment Gateway → Webhook → Backend →
Database Update

------------------------------------------------------------------------

## 📡 API Overview

### Auth Routes

-   POST /signup
-   POST /login
-   POST /logout

### Profile Routes

-   GET /profile/view
-   PATCH /profile/edit
-   PATCH /profile/password

### Connection Routes

-   POST /request/send/:status/:userId
-   POST /request/review/:status/:requestId

Status values: - interested - ignored - accepted - rejected

### User Routes

-   GET /user/requests/received
-   GET /user/connections
-   GET /user/feed

------------------------------------------------------------------------

## 📊 Engineering Skills Demonstrated

-   RESTful API Design
-   JWT Authentication & Authorization
-   Middleware Architecture
-   MongoDB Schema Design
-   Real-Time Systems Implementation
-   Secure Webhook Handling
-   Payment Workflow Integration
-   Cloud Deployment
-   Production Debugging & Error Handling

------------------------------------------------------------------------

## 👨‍💻 Author

Harsh Malik\
Engineering Student \| Backend Developer\
Interested in scalable backend systems, real-time architectures, and
distributed applications.
