# 🛒 StockPro - Inventory Manager

A comprehensive inventory management system designed for supermarkets to track products, manage suppliers, monitor stock levels, handle sales transactions, and generate business analytics. Built with modern technologies and containerized MongoDB for easy deployment.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

## 📹 Demo Video

<div align="center">
  
  ### 🎥 Live Demo (Full Application Walkthrough)
  
  ![StockPro Demo - Complete](demo/stockapp-medium.gif)
  
  > **[📹 Watch MP4 Video (Highest Quality)](demo/stockapp.mp4)**
  
</div>

### Key Features Demonstrated:
- ✅ **Product Management** - Add, edit, and track inventory
- ✅ **Sales Terminal** - Modern POS interface with search
- ✅ **Stock Validation** - Prevents negative inventory
- ✅ **Order Management** - Create and track purchase orders
- ✅ **Analytics Dashboard** - Real-time business insights
- ✅ **Multi-Supplier Support** - Compare prices from different suppliers
- ✅ **Professional Billing** - Generate and print receipts

> **Note**: To embed the video directly in GitHub:
> 1. Go to any GitHub issue in your repository
> 2. Drag and drop the `demo/stockapp.mp4` file into the comment box
> 3. GitHub will upload it and generate a URL
> 4. Replace the video link above with the generated URL

## 📸 Screenshots

<details>
<summary><b>Click to view application screenshots</b></summary>

### Dashboard
- Real-time overview of inventory status
- Low stock alerts and quick actions
- Sales and purchase summaries

### Sales Terminal
- Modern POS interface
- Product search with autocomplete
- Stock validation prevents overselling
- Professional bill generation

### Product Management
- Complete CRUD operations
- Barcode support
- Multi-supplier relationships
- Stock tracking

### Analytics & Reports
- Sales frequency charts
- Top products analysis
- Revenue tracking
- Category performance

</details>

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

# Clear database
.\clear-database.ps1
```

### MongoDB Setup
The database is automatically initialized with:
- Database: `supermarket_stock`
- User: `stockapp` with password `stockpass123`
- Collections: categories, suppliers, products, transactions, product_suppliers, purchase_orders
- Initialization script: `mongo-init.js` (runs automatically on first container start)

## 📋 Features

### Core Functionality
- **Product Management**: Track inventory with barcode, pricing, and stock levels
- **Multi-Supplier Support**: Products can have multiple suppliers with different pricing
- **Category Organization**: Group products by categories (Beverages, Dairy, etc.)
- **Supplier Management**: Full CRUD operations for supplier information
- **Transaction Recording**: Log all purchases, sales, and stock adjustments
- **Low Stock Alerts**: Real-time dashboard alerts for products below minimum levels
- **Multi-Unit Support**: Handle different units (kg, pieces, liters, etc.)

### Sales & POS Features
- **Sales Terminal**: Modern POS-style interface for quick sales
- **Autocomplete Search**: Find products by name or barcode
- **Shopping Cart**: Add multiple items with quantity management
- **Bill Generation**: Professional receipts with print functionality
- **One-Click Checkout**: Streamlined sales workflow

### Order Management
- **Purchase Orders**: Create and track orders from suppliers
- **Order Workflow**: From creation to delivery with status tracking
- **Payment Tracking**: Monitor payment status and methods
- **Automatic Stock Updates**: Stock increases when orders are delivered
- **Expected Delivery Dates**: Track when orders will arrive

### Business Analytics
- **Sales Frequency Charts**: View sales trends over time
- **Product Performance**: Identify top-selling products
- **Category Analysis**: Sales distribution by category
- **Revenue Analytics**: Track daily, weekly, and monthly revenue
- **Purchase Predictions**: AI-suggested reorder points
- **Interactive Charts**: Powered by Chart.js

### UI/UX Enhancements
- **Toast Notifications**: No more alert boxes - beautiful notifications
- **Modal Dialogs**: Clean, professional popups for data entry
- **Responsive Design**: Works on desktop and mobile
- **Font Awesome Icons**: Consistent iconography throughout
- **Print-Friendly**: Optimized bill printing for receipt printers
- **Pagination**: Efficient data browsing for large datasets

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Frontend (Angular)                         │
│                                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │  Dashboard  │  │   Products   │  │ Categories  │  │Suppliers │ │
│  └─────────────┘  └──────────────┘  └─────────────┘  └──────────┘ │
│                                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │Sales Terminal│  │   Reports    │  │   Orders    │  │   Bills  │ │
│  └─────────────┘  └──────────────┘  └─────────────┘  └──────────┘ │
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
- **CORS**: Configured for Angular frontend

### Frontend
- **Framework**: Angular 16.2.0
- **UI Components**: Custom components with Font Awesome icons
- **Charts**: Chart.js with ng2-charts
- **Language**: TypeScript
- **Styling**: CSS with responsive design
- **HTTP Client**: Angular HttpClient
- **Forms**: Template-driven forms

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
│   │       │       ├── dto/            # Data Transfer Objects
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
│   │   │   │   ├── dashboard/
│   │   │   │   ├── product-list/
│   │   │   │   ├── sales/
│   │   │   │   ├── reports/
│   │   │   │   ├── orders-list/
│   │   │   │   └── notification/
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
├── clear-database.ps1        # Database Cleanup Script
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
  supplierId: String,        // Legacy field
  purchasePrice: Double,     // in INR
  sellingPrice: Double,      // in INR
  currentStock: Integer,
  minStockLevel: Integer,
  unit: String,
  createdAt: LocalDateTime,
  updatedAt: LocalDateTime
}
```

### ProductSupplier (New)
```java
{
  id: String,
  productId: String,
  supplierId: String,
  costPerUnit: Double,
  deliveryDays: Integer,
  minimumOrderQuantity: Integer,
  isPreferred: Boolean,
  notes: String
}
```

### PurchaseOrder (New)
```java
{
  id: String,
  orderNumber: String,
  productId: String,
  productName: String,
  supplierId: String,
  supplierName: String,
  quantity: Integer,
  unitPrice: Double,
  totalAmount: Double,
  orderDate: Date,
  expectedDeliveryDate: Date,
  actualDeliveryDate: Date,
  status: OrderStatus,       // PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
  paymentStatus: String,     // PENDING, PARTIAL, PAID
  paymentMethod: String,
  paymentDate: Date,
  notes: String
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

### Product-Suppliers (New)
- `GET /api/product-suppliers` - List all relationships
- `GET /api/product-suppliers/by-product/{productId}` - Get suppliers for a product
- `GET /api/product-suppliers/by-product/{productId}/details` - Get detailed supplier info
- `POST /api/product-suppliers` - Create relationship
- `DELETE /api/product-suppliers/{id}` - Remove relationship

### Purchase Orders (New)
- `GET /api/purchase-orders` - List all orders
- `GET /api/purchase-orders/{id}` - Get order details
- `POST /api/purchase-orders` - Create order
- `PUT /api/purchase-orders/{id}` - Update order
- `PUT /api/purchase-orders/{id}/payment` - Update payment status
- `DELETE /api/purchase-orders/{id}` - Delete order

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
- `GET /api/transactions/{id}` - Get transaction details
- `GET /api/transactions/type/{type}` - Filter by type
- `POST /api/transactions` - Create transaction (updates stock)

### Analytics (New)
- `GET /api/analytics/sales-frequency?days={days}` - Sales frequency data
- `GET /api/analytics/product-trends` - Product sales trends
- `GET /api/analytics/top-products?limit={limit}` - Top selling products
- `GET /api/analytics/revenue?period={period}` - Revenue analytics

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
    container_name: supermarket-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: rootpassword
      MONGO_INITDB_DATABASE: supermarket_stock
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
```

## 🎯 Sample Data

The system includes a script to populate realistic Tamil Nadu-based supermarket data:
- 10 Categories (Beverages, Dairy, Bakery, etc.)
- 10 Local Suppliers from Karur region
- 50+ Products with Indian Rupee pricing
- Product-Supplier relationships with pricing
- 30+ Transactions showing purchase and sale history
- Realistic Indian product names and brands

## 🚦 Usage Guide

### Creating a Sale
1. Navigate to Sales Terminal
2. Search for products by name or barcode
3. Click to add to cart
4. Adjust quantities as needed
5. Complete sale and print bill

### Managing Orders
1. Low stock items show "Order Now" button
2. Select supplier and compare prices
3. Create purchase order
4. Track order status and payment
5. Stock automatically updates on delivery

### Viewing Reports
1. Go to Reports page
2. View sales frequency charts
3. Analyze top products and categories
4. Check revenue trends
5. Export data as needed

## 🤝 Contributing

This is a college project demonstrating full-stack development with modern technologies. Feel free to fork and enhance!

## 📝 License

This project is open source and available for educational purposes.

---

**Developed as a college project to demonstrate modern full-stack development with Spring Boot, Angular, and MongoDB.**