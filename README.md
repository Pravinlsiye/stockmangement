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
- ✅ **Sales Terminal** - Modern POS interface with smart search and stock validation
- ✅ **Customer Bills** - Grouped bills with multiple items per customer
- ✅ **Bill Themes** - Multiple receipt styles (Traditional, Classic, Modern, Elegant)
- ✅ **Order Management** - Create and track purchase orders
- ✅ **Analytics Dashboard** - Real-time business insights with historical trends
- ✅ **Multi-Supplier Support** - Compare prices from different suppliers
- ✅ **Professional Billing** - Generate and print receipts


## 📸 Screenshots



## 🚀 Quick Start

### Prerequisites
- Windows 10/11 with PowerShell
- Docker Desktop (only for local mode)
- Java 17+ (JDK)
- Node.js 16+

### One-Command Setup & Run

```powershell
# Start with local MongoDB (Docker)
.\RUN.ps1 -Action start

# Start with cloud MongoDB (MongoDB Atlas)
.\RUN.ps1 -Action start -DbMode cloud

# Populate with sample data (after services are running)
.\RUN.ps1 -Action populate

# Check status
.\RUN.ps1 -Action status

# Stop everything
.\RUN.ps1 -Action stop

# Clear database
.\clear-database.ps1
```

### Script Options

The `RUN.ps1` script supports different database modes:

#### Local Mode (Default)
Uses Docker MongoDB container locally:
```powershell
.\RUN.ps1 start  # or explicitly: .\RUN.ps1 start -DbMode local
```

#### Cloud Mode
Uses MongoDB Atlas cloud database:
```powershell
.\RUN.ps1 start -DbMode cloud
```
- You'll be prompted for your MongoDB connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/database`
- Option to save credentials locally in `.env.local` (git-ignored)
- Saved credentials are used automatically on subsequent runs

### MongoDB Setup

#### Local Mode (Default)
The database is automatically initialized with:
- Database: `supermarket_stock`
- User: `stockapp` with password `stockpass123`
- Collections: categories, suppliers, products, transactions, product_suppliers, purchase_orders
- Initialization script: `mongo-init.js` (runs automatically on first container start)

#### Cloud Mode
- Uses MongoDB Atlas cloud database
- No Docker required for database
- When running with `-DbMode cloud`, you'll be prompted for your MongoDB connection string
- Connection string format: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/database?retryWrites=true&w=majority`
- The connection string can be saved locally (in `.env.local`) for convenience
- Saved credentials are git-ignored and never committed to the repository

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
- **Smart Product Search**: Real-time autocomplete with stock availability
- **Shopping Cart**: Add multiple items with quantity management
- **Grouped Customer Bills**: Multiple items per bill, just like real shops
- **Bill Generation**: Automatic bill creation with unique IDs
- **Stock Validation**: Prevents overselling with detailed error messages
- **One-Click Checkout**: Streamlined sales workflow

### Billing System
- **Customer Bills Page**: View all grouped customer purchases
- **Pagination Support**: Browse through bills efficiently (5/10/20/50 per page)
- **Multiple Bill Themes**: 
  - Traditional Receipt (Default) - Optimized for 80mm thermal printers
  - Classic Receipt - Simple monospace style
  - Modern Invoice - Professional business format
  - Elegant Style - Premium look with enhanced spacing
- **Print Optimization**: All themes work perfectly with receipt printers
- **Theme Persistence**: Your theme choice is remembered

### Order Management
- **Purchase Orders**: Create and track orders from suppliers
- **Order Workflow**: From creation to delivery with status tracking
- **Payment Tracking**: Monitor payment status and methods
- **Automatic Stock Updates**: Stock increases when orders are delivered
- **Expected Delivery Dates**: Track when orders will arrive

### Business Analytics
- **Sales Frequency Charts**: View sales trends over time (7/30/90 days)
- **Product Performance**: Identify top-selling products with quantity metrics
- **Category Analysis**: Sales distribution by category (doughnut chart)
- **Revenue vs Profit Trend**: Compare revenue and profit across time periods
- **Purchase Predictions**: Smart reorder suggestions based on sales velocity
- **Stock Status Indicators**: Visual alerts for urgent orders
- **Interactive Charts**: Powered by Chart.js with real historical data
- **Paginated Product Trends**: Browse through all products with stock predictions

### UI/UX Enhancements
- **Toast Notifications**: Beautiful notifications for success/error messages
- **Stock Error Modal**: Detailed stock validation with auto-adjust options
- **Modal Dialogs**: Clean, professional popups for data entry
- **Responsive Design**: Works on desktop and mobile devices
- **Font Awesome Icons**: Consistent iconography throughout
- **Print-Friendly**: Optimized bill printing for 80mm thermal printers
- **Smart Pagination**: Customer bills and analytics with flexible page sizes
- **Real-time Search**: Product search with dropdown positioning
- **Clean Bill Format**: No divider lines, just clean professional receipts

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Frontend (Angular)                        │
│                                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌──────────┐   │
│  │  Dashboard  │  │   Products   │  │ Categories  │  │Suppliers │   │
│  └─────────────┘  └──────────────┘  └─────────────┘  └──────────┘   │
│                                                                     │
│  ┌────────────────┐ ┌──────────────┐ ┌─────────────┐  ┌──────────┐  │
│  │ Sales Terminal │ │   Reports    │ │   Orders    │  │   Bills  │  │
│  └────────────────┘ └──────────────┘ └─────────────┘  └──────────┘  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ HTTP/REST
                                 │
┌────────────────────────────────┴────────────────────────────────────┐
│                      Backend (Spring Boot)                          │
│                                                                     │
│      ┌─────────────┐   ┌──────────────┐   ┌─────────────┐           │
│      │ Controllers │   │   Services   │   │Repositories │           │
│      └──────┬──────┘   └──────┬───────┘   └──────┬──────┘           │
│             │                 │                  │                  │
│      ┌──────┴─────────────────┴──────────────────┴──────┐           │
│      │                Spring Data MongoDB               │           │
│      └───────────────────────┬──────────────────────────┘           │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
                               │ MongoDB Protocol
                        ┌──────┴──────┐ 
                        │   MongoDB   │
                        │   (cloud)   │ 
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
│   │   │   │   ├── bills-list/
│   │   │   │   ├── bill-details/
│   │   │   │   ├── bill/
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
  billId: String,          // Groups SALE transactions into customer bills
  notes: String,
  transactionDate: LocalDateTime
}
```

### Bill (DTO)
```java
{
  billId: String,
  billDate: LocalDateTime,
  totalAmount: Double,
  totalItems: Integer,
  items: List<BillItem>
}
```

### BillItem (DTO)
```java
{
  productId: String,
  productName: String,
  productCode: String,
  quantity: Integer,
  unitPrice: Double,
  totalPrice: Double
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
- `GET /api/analytics/revenue` - Revenue and profit analytics

### Bills
- `GET /api/bills` - List all grouped customer bills
- `GET /api/bills/{billId}` - Get detailed bill with items
- `GET /api/bills/generate-id` - Generate a new unique bill ID

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
- 7 Local Suppliers from Karur region
- 68 Products with Indian Rupee pricing (including local favorites)
- 113 Product-Supplier relationships with multiple suppliers per product
- 600+ Transactions with 7 days of historical data
- 150 Grouped Customer Bills (multiple items per bill)
- Realistic time-based sales patterns (morning, afternoon, evening)
- Tamil Nadu products: Aavin Milk, Filter Coffee, Murukku, etc.

## 🚦 Usage Guide

### Creating a Sale
1. Navigate to Sales Terminal
2. Search for products by name (no barcode needed)
3. Click products to add to cart (out-of-stock items are marked)
4. Adjust quantities as needed
5. Click "Generate Bill" to complete the sale
6. System automatically creates a grouped bill with unique ID
7. Navigate to Customer Bills to view/print the receipt

### Viewing Customer Bills
1. Go to Customer Bills from navigation menu
2. Browse through all bills with pagination (10/20/50 per page)
3. Click "View" to see bill details
4. Choose your preferred theme (Traditional/Classic/Modern/Elegant)
5. Click "Print" for thermal printer-optimized output

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