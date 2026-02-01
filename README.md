#  ShippmentApp – Courier Management System (Backend)

ShippmentApp is a **secure, scalable, and production-ready Courier Management System** built using **Spring Boot**, **MongoDB**, and **Kafka**.  
It is designed to handle real-world logistics operations such as shipment creation, tracking, pricing, authentication, and notifications.

---

## 🌟 Main Features

### 👤 User & Security Management

- **JWT-based Authentication** for secure login and registration
- **Role-Based Access Control (RBAC)** for Admin, Courier, and Customer roles
- **Request Validation** using Jakarta Validation to ensure clean and safe inputs

---

### 📦 Shipment & Logistics APIs

- **Complete CRUD Operations** for managing shipments
- **Dynamic Pricing System** based on package weight and service type  
  (Normal, Speed, Express, Overnight)
- **OTP-Protected Delivery** using a secure 6-digit OTP for delivery confirmation
- **Real-Time Package Tracking** with full shipment history

---

### 🚀 Advanced Backend Capabilities

- **Advanced Search & Filtering**  
  Filter shipments by status, weight range, or user
- **Pagination & Sorting** for optimized API performance
- **Rate Limiting** using Bucket4j to prevent abuse and brute-force attacks
- **Caching** for faster analytics and frequently accessed data
- **File Upload Support** for shipment-related documents or images
- **Global Exception Handling** for consistent and clean error responses

---

### 🔗 Integrations & Modern Tech

- **Apache Kafka** for event-driven notifications and shipment updates
- **Email Service (SMTP)** for booking confirmations and OTP delivery
- **Swagger / OpenAPI Documentation** for easy API testing and integration
- **Docker & Docker Compose** for smooth deployment and environment setup

---

## 🛠️ Tech Stack

| Layer                  | Technology            |
|------------------------|-----------------------|
| Backend Framework      | Spring Boot 3.2.2     |
| Database               | MongoDB               |
| Messaging System       | Apache Kafka          |
| Security               | Spring Security + JWT |
| API Documentation      | Swagger / OpenAPI 3   |
| Build Tool             | Maven                 |
| Containerization       | Docker & Docker Compose |

---

## 🏗️ Project Architecture

The project follows a **clean and modular MVC architecture**:

```text
src/main/java/com/shippmentapp/
├── config/       # Security, caching, rate limiting configurations
├── controller/   # REST APIs (no business logic)
├── service/      # Core business logic
├── repository/   # MongoDB repositories
├── model/        # Database entities
├── dto/          # Request & response DTOs
├── exception/    # Custom exceptions & global handler
└── util/         # Utility and helper classes
```
---

## Getting Started

### Prerequisites

- Java 17+
- Docker & Docker Compose
- Maven (optional, if running locally)

### Quick Start with Docker

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project root
cd CourierManagement

# Start all services (App, MongoDB, Kafka, Zookeeper)
docker-compose up -d
```

### Running Locally

1. Configure your `.env` or update `application.yaml` with your MongoDB and Mail credentials.
2. Run the application:
   ```bash
   mvn spring-boot:run
   ```

---

## 📖 API Documentation

Once the application is running, you can access the interactive Swagger documentation at:
🔗 **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

---

##  Unique Features

- **Kafka-based Notifications**: Even if the mail server is slow, the application remains responsive as emails are processed asynchronously.
- **OTP-Secured Deliveries**: Prevents fraudulent deliveries by requiring a system-generated OTP verified at the point of delivery.
- **Actuator Health Monitoring**: Integrated Spring Boot Actuator for real-time health checks and performance monitoring.
- **Dynamic Dashboard**: Real-time analytics for admins to track system-wide logistics performance.

---


