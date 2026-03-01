# DevTinder Backend

### Scalable Developer Networking Platform with Real-Time Chat

DevTinder Backend is a production-ready server-side application that
powers a developer networking platform where users can connect, send
requests, and communicate in real time.

This project demonstrates strong understanding of backend engineering,
authentication systems, real-time communication, database modeling,
payment workflows, and cloud deployment.

------------------------------------------------------------------------

## Project Overview

DevTinder allows developers to:

-   Create and manage profiles\
-   Send and receive connection requests\
-   Accept or reject requests\
-   View a personalized developer feed\
-   Chat in real time\
-   Upgrade to membership using online payment

The backend handles authentication, business logic, chat system, payment
verification, and secure data storage.

------------------------------------------------------------------------

## Key Features

### 1. Authentication & Authorization

-   User signup and login\
-   Password hashing using bcrypt\
-   JWT-based authentication\
-   Protected routes using middleware\
-   Token validation for both REST APIs and WebSocket connections

------------------------------------------------------------------------

### 2. Profile Management

-   View profile\
-   Edit profile\
-   Secure user-specific data access

------------------------------------------------------------------------

### 3. Connection System

-   Send connection request\
-   Accept or reject request\
-   Maintain connection relationships\
-   Filter feed to exclude existing connections

------------------------------------------------------------------------

### 4. Real-Time Chat (WebSockets)

-   Authenticated WebSocket connection\
-   Bi-directional communication\
-   Instant message delivery\
-   Messages stored in MongoDB\
-   Persistent chat history

Concepts demonstrated:

-   Event-driven architecture\
-   Stateful connections\
-   Real-time communication systems\
-   Scalable backend thinking

------------------------------------------------------------------------

### 5. Membership & Payment Integration

-   Razorpay order creation\
-   Secure webhook endpoint\
-   Signature verification\
-   Membership upgrade logic\
-   Server-side payment validation

------------------------------------------------------------------------

### 6. Deployment & Production Setup

-   Hosted on AWS EC2\
-   Nginx reverse proxy configuration\
-   Environment variable management\
-   Production-ready server configuration

------------------------------------------------------------------------

## Tech Stack

Backend: - Node.js - Express.js

Database: - MongoDB - Mongoose

Authentication: - JWT (JSON Web Token)

Security: - bcrypt - Middleware validation

Real-Time Communication: - WebSockets (ws / socket.io)

Payments: - Razorpay

Deployment: - AWS EC2 - Nginx

------------------------------------------------------------------------

## System Architecture

REST Layer: Client → Express Server → MongoDB

Real-Time Layer: Client ↔ WebSocket Server ↔ MongoDB

-   REST APIs handle authentication, profile management, and connection
    logic.
-   WebSocket server manages real-time chat communication.
-   MongoDB stores users, connections, and chat messages.
-   Razorpay handles membership payments with secure verification.

------------------------------------------------------------------------


## Engineering Skills Demonstrated

-   RESTful API Design\
-   Authentication & Authorization\
-   Middleware Architecture\
-   Database Schema Design\
-   Real-Time Systems Implementation\
-   Secure Payment Integration\
-   Cloud Deployment\
-   Production Debugging

------------------------------------------------------------------------

## Author

Harsh Malik\
Engineering Student \| Backend Developer\
Interested in scalable backend systems and real-time architectures
