# 🛒 StockPro - Inventory Manager

A comprehensive inventory management system designed for supermarkets to track products, manage suppliers, monitor stock levels, and record transactions. Built with modern technologies and containerized MongoDB for easy deployment.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

## 🚀 Quick Start

### Prerequisites
- Windows 10/11 with PowerShell
- Docker Desktop
- Java 17+ (JDK)
- Node.js 16+

### One-Command Setup & Run

```powershell
# Start everything (MongoDB, Backend, Frontend)
.\RUN.ps1 -Action start

# Populate with sample data (after services are running)
.\RUN.ps1 -Action populate

# Check status
.\RUN.ps1 -Action status

# Stop everything
.\RUN.ps1 -Action stop
```

### MongoDB Setup
The database is automatically initialized with:
- Database: `supermarket_stock`
- User: `stockapp` with password `stockpass123`
- Collections: categories, suppliers, products, transactions
- Initialization script: `mongo-init.js` (runs automatically on first container start)

## 📋 Features

### Core Functionality
- **Product Management**: Track inventory with barcode, pricing, and stock levels
- **Category Organization**: Group products by categories (Beverages, Dairy, etc.)
- **Supplier Management**: Maintain supplier information and relationships
- **Transaction Recording**: Log all purchases, sales, and stock adjustments
- **Low Stock Alerts**: Real-time dashboard alerts for products below minimum levels
- **Multi-Unit Support**: Handle different units (kg, pieces, liters, etc.)

### Business Features
- Automatic stock updates on transactions
- Purchase and selling price tracking with profit margins
- Transaction history with reference numbers
- Indian Rupee (₹) currency support

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Frontend (Angular)                         │
│                                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │  Dashboard  │  │   Products   │  │ Categories  │  │Suppliers │ │
│  └─────────────┘  └──────────────┘  └─────────────┘  └──────────┘ │
│                                                                      │
│  ┌──────────────────────────┐  ┌─────────────────────────────────┐ │
│  │    Transaction List      │  │      Navigation Component       │ │
│  └──────────────────────────┘  └─────────────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ HTTP/REST
                                 │
┌────────────────────────────────┴────────────────────────────────────┐
│                      Backend (Spring Boot)                          │
│                                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐               │
│  │ Controllers │  │   Services   │  │Repositories │               │
│  └──────┬──────┘  └──────┬───────┘  └──────┬──────┘               │
│         │                 │                  │                       │
│  ┌──────┴──────────────────┴─────────────────┴──────┐              │
│  │              Spring Data MongoDB                  │              │
│  └───────────────────────┬──────────────────────────┘              │
└──────────────────────────┼──────────────────────────────────────────┘
                           │
                           │ MongoDB Protocol
                           │
                    ┌──────┴──────┐
                    │   MongoDB   │
                    │  (Docker)   │
                    └─────────────┘
```

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.1.5
- **Language**: Java 17
- **Database**: MongoDB (via Spring Data MongoDB)
- **Build Tool**: Maven (with Maven Wrapper)
- **API**: RESTful Web Services

### Frontend
- **Framework**: Angular 16.2.0
- **UI Components**: Modus Web Components
- **Language**: TypeScript
- **Styling**: CSS with custom components
- **HTTP Client**: Angular HttpClient

### Infrastructure
- **Database**: MongoDB (Dockerized)
- **Container**: Docker & Docker Compose
- **Ports**:
  - Frontend: 4200
  - Backend: 8080
  - MongoDB: 27017

## 📁 Project Structure

```
stockmanagement/
├── backend/                    # Spring Boot Application
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/supermarket/stockmanagement/
│   │       │       ├── controller/     # REST Controllers
│   │       │       ├── model/          # Data Models
│   │       │       ├── repository/     # MongoDB Repositories
│   │       │       ├── service/        # Business Logic
│   │       │       └── config/         # Configuration
│   │       └── resources/
│   │           └── application.properties
│   ├── mvnw.cmd               # Maven Wrapper
│   └── pom.xml                # Maven Configuration
│
├── frontend/                   # Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # UI Components
│   │   │   ├── models/        # TypeScript Models
│   │   │   ├── services/      # API Services
│   │   │   └── app.module.ts  # App Module
│   │   ├── index.html
│   │   └── styles.css         # Global Styles
│   ├── angular.json           # Angular Configuration
│   └── package.json           # NPM Dependencies
│
├── docker-compose.yml         # MongoDB Container Config
├── mongo-init.js             # Database Initialization
├── populate-sample-data.ps1  # Sample Data Script
└── RUN.ps1                   # Master Run Script
```

## 📊 Data Models

### Product
```java
{
  id: String,
  name: String,
  description: String,
  barcode: String,
  categoryId: String,
  supplierId: String,
  purchasePrice: Double,    // in INR
  sellingPrice: Double,     // in INR
  currentStock: Integer,
  minStockLevel: Integer,
  unit: String,
  createdAt: LocalDateTime,
  updatedAt: LocalDateTime
}
```

### Transaction
```java
{
  id: String,
  productId: String,
  type: TransactionType,    // PURCHASE, SALE, ADJUSTMENT
  quantity: Integer,
  unitPrice: Double,
  totalAmount: Double,
  reference: String,
  notes: String,
  transactionDate: LocalDateTime
}
```

## 🔧 API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `GET /api/products/low-stock` - Get low stock products
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Suppliers
- `GET /api/suppliers` - List all suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/{id}` - Update supplier
- `DELETE /api/suppliers/{id}` - Delete supplier

### Transactions
- `GET /api/transactions` - List all transactions
- `GET /api/transactions/type/{type}` - Filter by type
- `POST /api/transactions` - Create transaction (updates stock)

## 💾 MongoDB Configuration

### Connection Details
- **Host**: localhost
- **Port**: 27017
- **Database**: supermarket_stock
- **Username**: stockapp
- **Password**: stockpass123

### Docker Setup
The application uses Docker Compose to run MongoDB:
```yaml
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
```

## 🎯 Sample Data

The system includes a script to populate realistic supermarket data:
- 10 Categories (Beverages, Dairy, Bakery, etc.)
- 5 Suppliers with contact information
- 26 Products with Indian Rupee pricing
- 30 Transactions showing purchase and sale history

## 🤝 Contributing

This is a college project demonstrating full-stack development with modern technologies. Feel free to fork and enhance!

## 📝 License

This project is open source and available for educational purposes.

---

**Developed as a college project to demonstrate modern full-stack development with Spring Boot, Angular, and MongoDB.**