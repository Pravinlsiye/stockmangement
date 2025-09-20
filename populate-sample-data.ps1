# Script to populate the database with sample data

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Populating Database with Sample Data" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080/api"

# Check if backend is running
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/categories" -Method Get -ErrorAction Stop
    Write-Host "Backend is accessible" -ForegroundColor Green
} catch {
    Write-Host "Backend is not accessible. Make sure the application is running." -ForegroundColor Red
    exit
}

# Categories data
$categories = @(
    @{name = "Beverages"; description = "Soft drinks, juices, water, tea, coffee"},
    @{name = "Dairy Products"; description = "Milk, cheese, yogurt, butter, eggs"},
    @{name = "Bakery"; description = "Bread, cakes, pastries, cookies"},
    @{name = "Fruits & Vegetables"; description = "Fresh fruits and vegetables"},
    @{name = "Meat & Poultry"; description = "Fresh and frozen meat products"},
    @{name = "Frozen Foods"; description = "Frozen vegetables, ready meals, ice cream"},
    @{name = "Snacks & Confectionery"; description = "Chips, chocolates, candies, nuts"},
    @{name = "Canned & Packaged Foods"; description = "Canned goods, pasta, rice, sauces"},
    @{name = "Personal Care"; description = "Soap, shampoo, toothpaste, cosmetics"},
    @{name = "Household Items"; description = "Cleaning products, kitchen supplies"}
)

# Create categories
Write-Host "Creating categories..." -ForegroundColor Yellow
$createdCategories = @()
foreach ($category in $categories) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/categories" -Method Post -Body ($category | ConvertTo-Json) -ContentType "application/json"
        $createdCategories += $response
        Write-Host "  Created category: $($response.name)" -ForegroundColor Green
    } catch {
        Write-Host "  Failed to create category: $($category.name)" -ForegroundColor Red
    }
}

# Suppliers data 
$suppliers = @(
    @{name = "Karur Fresh Vegetables"; contactPerson = "Kumar Raj"; email = "kumar@karurfresh.com"; phone = "+91-98430-12345"; address = "45, Gandhi Market, Karur - 639001, Tamil Nadu"},
    @{name = "Amaravathi Traders"; contactPerson = "Selvam M"; email = "selvam@amaravathitraders.com"; phone = "+91-94431-67890"; address = "12, Jawahar Bazaar, Karur - 639002, Tamil Nadu"},
    @{name = "Aavin Dairy Distributor"; contactPerson = "Murugan K"; email = "murugan@aavindairy.com"; phone = "+91-98945-23456"; address = "78, Thanthonimalai Road, Karur - 639004, Tamil Nadu"},
    @{name = "Sri Saravana Stores"; contactPerson = "Lakshmi Devi"; email = "lakshmi@saravanastores.com"; phone = "+91-87542-34567"; address = "23, LGB Street, Karur - 639001, Tamil Nadu"},
    @{name = "Tamil Nadu Beverages"; contactPerson = "Ramesh Kumar"; email = "ramesh@tnbeverages.com"; phone = "+91-95663-45678"; address = "56, Railway Station Road, Karur - 639003, Tamil Nadu"},
    @{name = "Kongu Provision Stores"; contactPerson = "Senthil Nathan"; email = "senthil@konguprovisions.com"; phone = "+91-96558-56789"; address = "34, Kovai Road, Karur - 639006, Tamil Nadu"},
    @{name = "Cauvery Wholesale Mart"; contactPerson = "Priya S"; email = "priya@cauverywholesale.com"; phone = "+91-93845-67890"; address = "67, Bus Stand Road, Karur - 639001, Tamil Nadu"}
)

# Create suppliers
Write-Host ""
Write-Host "Creating suppliers..." -ForegroundColor Yellow
$createdSuppliers = @()
foreach ($supplier in $suppliers) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/suppliers" -Method Post -Body ($supplier | ConvertTo-Json) -ContentType "application/json"
        $createdSuppliers += $response
        Write-Host "  Created supplier: $($response.name)" -ForegroundColor Green
    } catch {
        Write-Host "  Failed to create supplier: $($supplier.name)" -ForegroundColor Red
    }
}

# Wait a moment
Start-Sleep -Seconds 2

# Products data (Tamil Nadu supermarket items with Indian brands)
$products = @(
    # Beverages
    @{name = "Thums Up 2L"; description = "Strong carbonated drink"; barcode = "890120345601"; categoryId = $createdCategories[0].id; supplierId = $createdSuppliers[4].id; purchasePrice = 55; sellingPrice = 90; currentStock = 150; minStockLevel = 50; unit = "bottle"},
    @{name = "Frooti Mango 1L"; description = "Mango fruit drink"; barcode = "890120345602"; categoryId = $createdCategories[0].id; supplierId = $createdSuppliers[4].id; purchasePrice = 45; sellingPrice = 70; currentStock = 80; minStockLevel = 30; unit = "bottle"},
    @{name = "Bisleri Water 1L"; description = "Purified drinking water"; barcode = "890120345603"; categoryId = $createdCategories[0].id; supplierId = $createdSuppliers[4].id; purchasePrice = 10; sellingPrice = 20; currentStock = 300; minStockLevel = 100; unit = "bottle"},
    @{name = "Bovonto 250ml"; description = "Tamil Nadu special grape soda"; barcode = "890120345604"; categoryId = $createdCategories[0].id; supplierId = $createdSuppliers[4].id; purchasePrice = 8; sellingPrice = 15; currentStock = 200; minStockLevel = 80; unit = "bottle"},
    @{name = "Filter Coffee Powder 500g"; description = "Fresh ground coffee powder"; barcode = "890120345605"; categoryId = $createdCategories[0].id; supplierId = $createdSuppliers[5].id; purchasePrice = 120; sellingPrice = 180; currentStock = 50; minStockLevel = 20; unit = "pack"},
    
    # Dairy Products
    @{name = "Aavin Milk 500ml"; description = "Tamil Nadu Co-op milk"; barcode = "890120345606"; categoryId = $createdCategories[1].id; supplierId = $createdSuppliers[2].id; purchasePrice = 22; sellingPrice = 28; currentStock = 100; minStockLevel = 50; unit = "packet"},
    @{name = "Aavin Milk 1L"; description = "Tamil Nadu Co-op milk"; barcode = "890120345607"; categoryId = $createdCategories[1].id; supplierId = $createdSuppliers[2].id; purchasePrice = 44; sellingPrice = 56; currentStock = 25; minStockLevel = 40; unit = "packet"},
    @{name = "Amul Butter 100g"; description = "Salted butter"; barcode = "890120345608"; categoryId = $createdCategories[1].id; supplierId = $createdSuppliers[2].id; purchasePrice = 35; sellingPrice = 50; currentStock = 40; minStockLevel = 20; unit = "pack"},
    @{name = "Aavin Curd 500ml"; description = "Fresh curd/yogurt"; barcode = "890120345609"; categoryId = $createdCategories[1].id; supplierId = $createdSuppliers[2].id; purchasePrice = 25; sellingPrice = 35; currentStock = 60; minStockLevel = 30; unit = "cup"},
    @{name = "Milky Mist Paneer 200g"; description = "Fresh cottage cheese"; barcode = "890120345610"; categoryId = $createdCategories[1].id; supplierId = $createdSuppliers[2].id; purchasePrice = 65; sellingPrice = 90; currentStock = 30; minStockLevel = 15; unit = "pack"},
    
    # Bakery
    @{name = "Modern Bread"; description = "Fresh sandwich bread"; barcode = "890120345611"; categoryId = $createdCategories[2].id; supplierId = $createdSuppliers[1].id; purchasePrice = 25; sellingPrice = 40; currentStock = 50; minStockLevel = 20; unit = "loaf"},
    @{name = "Britannia Rusk 200g"; description = "Tea time rusk"; barcode = "890120345612"; categoryId = $createdCategories[2].id; supplierId = $createdSuppliers[1].id; purchasePrice = 20; sellingPrice = 30; currentStock = 40; minStockLevel = 20; unit = "pack"},
    @{name = "Good Day Biscuits"; description = "Cashew cookies"; barcode = "890120345613"; categoryId = $createdCategories[2].id; supplierId = $createdSuppliers[1].id; purchasePrice = 15; sellingPrice = 25; currentStock = 100; minStockLevel = 40; unit = "pack"},
    @{name = "Karur Bakery Bun"; description = "Local fresh bun"; barcode = "890120345614"; categoryId = $createdCategories[2].id; supplierId = $createdSuppliers[1].id; purchasePrice = 8; sellingPrice = 12; currentStock = 80; minStockLevel = 30; unit = "piece"},
    
    # Fruits & Vegetables
    @{name = "Banana Karpooravalli"; description = "Local sweet bananas"; barcode = "890120345615"; categoryId = $createdCategories[3].id; supplierId = $createdSuppliers[0].id; purchasePrice = 25; sellingPrice = 40; currentStock = 100; minStockLevel = 50; unit = "dozen"},
    @{name = "Coconut"; description = "Fresh coconuts"; barcode = "890120345616"; categoryId = $createdCategories[3].id; supplierId = $createdSuppliers[0].id; purchasePrice = 20; sellingPrice = 30; currentStock = 200; minStockLevel = 80; unit = "piece"},
    @{name = "Tomato Local"; description = "Country tomatoes"; barcode = "890120345617"; categoryId = $createdCategories[3].id; supplierId = $createdSuppliers[0].id; purchasePrice = 15; sellingPrice = 30; currentStock = 15; minStockLevel = 30; unit = "kg"},
    @{name = "Onion"; description = "Red onions"; barcode = "890120345618"; categoryId = $createdCategories[3].id; supplierId = $createdSuppliers[0].id; purchasePrice = 20; sellingPrice = 35; currentStock = 150; minStockLevel = 60; unit = "kg"},
    @{name = "Curry Leaves"; description = "Fresh curry leaves"; barcode = "890120345619"; categoryId = $createdCategories[3].id; supplierId = $createdSuppliers[0].id; purchasePrice = 5; sellingPrice = 10; currentStock = 50; minStockLevel = 20; unit = "bunch"},
    @{name = "Coriander Leaves"; description = "Fresh coriander"; barcode = "890120345620"; categoryId = $createdCategories[3].id; supplierId = $createdSuppliers[0].id; purchasePrice = 5; sellingPrice = 10; currentStock = 40; minStockLevel = 20; unit = "bunch"},
    
    # Meat & Poultry  
    @{name = "Country Chicken"; description = "Fresh country chicken"; barcode = "890120345621"; categoryId = $createdCategories[4].id; supplierId = $createdSuppliers[0].id; purchasePrice = 160; sellingPrice = 280; currentStock = 30; minStockLevel = 20; unit = "kg"},
    @{name = "Chicken Curry Cut"; description = "Chicken with bone curry pieces"; barcode = "890120345622"; categoryId = $createdCategories[4].id; supplierId = $createdSuppliers[0].id; purchasePrice = 140; sellingPrice = 240; currentStock = 40; minStockLevel = 25; unit = "kg"},
    @{name = "Mutton Curry Cut"; description = "Fresh goat meat curry cut"; barcode = "890120345623"; categoryId = $createdCategories[4].id; supplierId = $createdSuppliers[0].id; purchasePrice = 450; sellingPrice = 700; currentStock = 20; minStockLevel = 10; unit = "kg"},
    @{name = "Fish Tilapia"; description = "Fresh water fish"; barcode = "890120345624"; categoryId = $createdCategories[4].id; supplierId = $createdSuppliers[0].id; purchasePrice = 120; sellingPrice = 200; currentStock = 25; minStockLevel = 15; unit = "kg"},
    
    # Frozen Foods
    @{name = "McCain French Fries 420g"; description = "Frozen potato fries"; barcode = "890120345625"; categoryId = $createdCategories[5].id; supplierId = $createdSuppliers[1].id; purchasePrice = 80; sellingPrice = 120; currentStock = 40; minStockLevel = 20; unit = "pack"},
    @{name = "Arun Ice Cream 1L"; description = "Tamil Nadu famous ice cream"; barcode = "890120345626"; categoryId = $createdCategories[5].id; supplierId = $createdSuppliers[2].id; purchasePrice = 90; sellingPrice = 150; currentStock = 35; minStockLevel = 20; unit = "tub"},
    @{name = "ITC Frozen Parathas"; description = "Ready to cook parathas"; barcode = "890120345627"; categoryId = $createdCategories[5].id; supplierId = $createdSuppliers[1].id; purchasePrice = 45; sellingPrice = 70; currentStock = 50; minStockLevel = 25; unit = "pack"},
    
    # Snacks & Confectionery
    @{name = "Lays Chips India Magic Masala"; description = "Indian masala flavor chips"; barcode = "890120345628"; categoryId = $createdCategories[6].id; supplierId = $createdSuppliers[3].id; purchasePrice = 15; sellingPrice = 20; currentStock = 10; minStockLevel = 40; unit = "pack"},
    @{name = "Haldiram Mixture 200g"; description = "Traditional namkeen mixture"; barcode = "890120345629"; categoryId = $createdCategories[6].id; supplierId = $createdSuppliers[3].id; purchasePrice = 35; sellingPrice = 50; currentStock = 60; minStockLevel = 30; unit = "pack"},
    @{name = "Dairy Milk Silk"; description = "Cadbury chocolate"; barcode = "890120345630"; categoryId = $createdCategories[6].id; supplierId = $createdSuppliers[3].id; purchasePrice = 60; sellingPrice = 80; currentStock = 100; minStockLevel = 50; unit = "bar"},
    @{name = "Karur Mixture"; description = "Local spicy mixture"; barcode = "890120345631"; categoryId = $createdCategories[6].id; supplierId = $createdSuppliers[3].id; purchasePrice = 20; sellingPrice = 30; currentStock = 80; minStockLevel = 40; unit = "pack"},
    @{name = "Murukku Pack"; description = "Traditional Tamil snack"; barcode = "890120345632"; categoryId = $createdCategories[6].id; supplierId = $createdSuppliers[3].id; purchasePrice = 25; sellingPrice = 40; currentStock = 70; minStockLevel = 30; unit = "pack"},
    
    # Canned & Packaged Foods
    @{name = "MTR Sambar Powder 100g"; description = "Ready sambar masala"; barcode = "890120345633"; categoryId = $createdCategories[7].id; supplierId = $createdSuppliers[5].id; purchasePrice = 25; sellingPrice = 35; currentStock = 80; minStockLevel = 40; unit = "pack"},
    @{name = "Aachi Rasam Powder"; description = "Instant rasam mix"; barcode = "890120345634"; categoryId = $createdCategories[7].id; supplierId = $createdSuppliers[5].id; purchasePrice = 20; sellingPrice = 30; currentStock = 60; minStockLevel = 30; unit = "pack"},
    @{name = "Toor Dal 1kg"; description = "Split pigeon peas"; barcode = "890120345635"; categoryId = $createdCategories[7].id; supplierId = $createdSuppliers[5].id; purchasePrice = 120; sellingPrice = 150; currentStock = 100; minStockLevel = 50; unit = "pack"},
    @{name = "Ponni Rice 5kg"; description = "Tamil Nadu ponni rice"; barcode = "890120345636"; categoryId = $createdCategories[7].id; supplierId = $createdSuppliers[5].id; purchasePrice = 250; sellingPrice = 300; currentStock = 5; minStockLevel = 30; unit = "bag"},
    @{name = "Idli Rice 1kg"; description = "Special rice for idli"; barcode = "890120345637"; categoryId = $createdCategories[7].id; supplierId = $createdSuppliers[5].id; purchasePrice = 45; sellingPrice = 60; currentStock = 50; minStockLevel = 25; unit = "pack"},
    
    # Personal Care
    @{name = "Meera Shampoo 180ml"; description = "Herbal shampoo"; barcode = "890120345638"; categoryId = $createdCategories[8].id; supplierId = $createdSuppliers[6].id; purchasePrice = 60; sellingPrice = 85; currentStock = 40; minStockLevel = 20; unit = "bottle"},
    @{name = "Colgate Toothpaste 100g"; description = "Dental cream"; barcode = "890120345639"; categoryId = $createdCategories[8].id; supplierId = $createdSuppliers[6].id; purchasePrice = 30; sellingPrice = 45; currentStock = 50; minStockLevel = 25; unit = "tube"},
    @{name = "Santoor Soap 100g Pack of 4"; description = "Sandal & turmeric soap"; barcode = "890120345640"; categoryId = $createdCategories[8].id; supplierId = $createdSuppliers[6].id; purchasePrice = 80; sellingPrice = 100; currentStock = 60; minStockLevel = 30; unit = "pack"},
    @{name = "Parachute Coconut Oil 200ml"; description = "Pure coconut oil"; barcode = "890120345641"; categoryId = $createdCategories[8].id; supplierId = $createdSuppliers[6].id; purchasePrice = 50; sellingPrice = 70; currentStock = 80; minStockLevel = 40; unit = "bottle"},
    
    # Household Items
    @{name = "Vim Dishwash Bar"; description = "Lemon dish cleaning bar"; barcode = "890120345642"; categoryId = $createdCategories[9].id; supplierId = $createdSuppliers[6].id; purchasePrice = 8; sellingPrice = 12; currentStock = 100; minStockLevel = 50; unit = "piece"},
    @{name = "Surf Excel 1kg"; description = "Detergent powder"; barcode = "890120345643"; categoryId = $createdCategories[9].id; supplierId = $createdSuppliers[6].id; purchasePrice = 90; sellingPrice = 130; currentStock = 45; minStockLevel = 20; unit = "pack"},
    @{name = "Harpic Toilet Cleaner 500ml"; description = "Disinfectant cleaner"; barcode = "890120345644"; categoryId = $createdCategories[9].id; supplierId = $createdSuppliers[6].id; purchasePrice = 60; sellingPrice = 85; currentStock = 8; minStockLevel = 15; unit = "bottle"},
    @{name = "Mosquito Coil Pack"; description = "Good Knight coils"; barcode = "890120345645"; categoryId = $createdCategories[9].id; supplierId = $createdSuppliers[6].id; purchasePrice = 20; sellingPrice = 30; currentStock = 120; minStockLevel = 60; unit = "pack"},
    @{name = "Broom Stick"; description = "Traditional cleaning broom"; barcode = "890120345646"; categoryId = $createdCategories[9].id; supplierId = $createdSuppliers[6].id; purchasePrice = 30; sellingPrice = 50; currentStock = 40; minStockLevel = 20; unit = "piece"}
)

# Create products
Write-Host ""
Write-Host "Creating products..." -ForegroundColor Yellow
$createdProducts = @()
foreach ($product in $products) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/products" -Method Post -Body ($product | ConvertTo-Json) -ContentType "application/json"
        $createdProducts += $response
        Write-Host "  Created product: $($response.name)" -ForegroundColor Green
    } catch {
        Write-Host "  Failed to create product: $($product.name)" -ForegroundColor Red
    }
}

# Wait a moment
Start-Sleep -Seconds 2

# Create some transactions (purchases and sales)
Write-Host ""
Write-Host "Creating transactions..." -ForegroundColor Yellow

# Helper function to create random transactions
function Create-Transaction {
    param($product, $type, $daysAgo)
    
    $quantity = Get-Random -Minimum 5 -Maximum 50
    if ($type -eq "SALE") {
        $quantity = Get-Random -Minimum 1 -Maximum 10
    }
    
    $unitPrice = if ($type -eq "PURCHASE") { $product.purchasePrice } else { $product.sellingPrice }
    
    $transaction = @{
        productId = $product.id
        type = $type
        quantity = $quantity
        unitPrice = $unitPrice
        reference = if ($type -eq "PURCHASE") { "PO-$(Get-Random -Minimum 1000 -Maximum 9999)" } else { "INV-$(Get-Random -Minimum 1000 -Maximum 9999)" }
        notes = if ($type -eq "PURCHASE") { "Stock replenishment" } else { "Customer sale" }
    }
    
    return $transaction
}

# Create transactions for random products
$transactionCount = 0
for ($i = 0; $i -lt 30; $i++) {
    $randomProduct = $createdProducts | Get-Random
    $transactionType = @("PURCHASE", "SALE", "SALE", "SALE") | Get-Random  # More sales than purchases
    
    $transaction = Create-Transaction -product $randomProduct -type $transactionType -daysAgo (Get-Random -Minimum 0 -Maximum 30)
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/transactions" -Method Post -Body ($transaction | ConvertTo-Json) -ContentType "application/json"
        $transactionCount++
        Write-Host "  Created $($transaction.type) transaction for $($randomProduct.name)" -ForegroundColor Green
    } catch {
        Write-Host "  Failed to create transaction" -ForegroundColor Red
    }
}

# Create Product-Supplier relationships
Write-Host ""
Write-Host "Creating product-supplier relationships..." -ForegroundColor Yellow
$productSupplierCount = 0

# Define product-supplier relationships with realistic delivery times and costs
$productSupplierRelationships = @(
    # Beverages - Multiple suppliers
    @{productName = "Thums Up 2L"; suppliers = @(
        @{supplierName = "Tamil Nadu Beverages"; costPerUnit = 55; deliveryDays = 1; minOrderQty = 24; isPreferred = $true},
        @{supplierName = "Cauvery Wholesale Mart"; costPerUnit = 58; deliveryDays = 2; minOrderQty = 12; isPreferred = $false}
    )},
    @{productName = "Frooti Mango 1L"; suppliers = @(
        @{supplierName = "Tamil Nadu Beverages"; costPerUnit = 30; deliveryDays = 1; minOrderQty = 24; isPreferred = $true},
        @{supplierName = "Kongu Provision Stores"; costPerUnit = 32; deliveryDays = 3; minOrderQty = 20; isPreferred = $false}
    )},
    
    # Dairy Products
    @{productName = "Aavin Milk 500ml"; suppliers = @(
        @{supplierName = "Aavin Dairy Distributor"; costPerUnit = 20; deliveryDays = 1; minOrderQty = 50; isPreferred = $true}
    )},
    @{productName = "Aavin Curd 500g"; suppliers = @(
        @{supplierName = "Aavin Dairy Distributor"; costPerUnit = 18; deliveryDays = 1; minOrderQty = 30; isPreferred = $true}
    )},
    
    # Rice and Grains
    @{productName = "Ponni Rice 5kg"; suppliers = @(
        @{supplierName = "Sri Saravana Stores"; costPerUnit = 180; deliveryDays = 2; minOrderQty = 20; isPreferred = $true},
        @{supplierName = "Amaravathi Traders"; costPerUnit = 185; deliveryDays = 1; minOrderQty = 10; isPreferred = $false}
    )},
    @{productName = "Idly Rice 5kg"; suppliers = @(
        @{supplierName = "Sri Saravana Stores"; costPerUnit = 160; deliveryDays = 2; minOrderQty = 20; isPreferred = $true},
        @{supplierName = "Kongu Provision Stores"; costPerUnit = 165; deliveryDays = 3; minOrderQty = 15; isPreferred = $false}
    )},
    
    # Vegetables
    @{productName = "Tomato (Local)"; suppliers = @(
        @{supplierName = "Karur Fresh Vegetables"; costPerUnit = 18; deliveryDays = 1; minOrderQty = 10; isPreferred = $true}
    )},
    @{productName = "Onion (Small)"; suppliers = @(
        @{supplierName = "Karur Fresh Vegetables"; costPerUnit = 30; deliveryDays = 1; minOrderQty = 10; isPreferred = $true}
    )},
    
    # Spices
    @{productName = "MTR Sambar Powder 100g"; suppliers = @(
        @{supplierName = "Kongu Provision Stores"; costPerUnit = 30; deliveryDays = 2; minOrderQty = 50; isPreferred = $true},
        @{supplierName = "Cauvery Wholesale Mart"; costPerUnit = 32; deliveryDays = 1; minOrderQty = 40; isPreferred = $false}
    )},
    
    # Personal Care
    @{productName = "Hamam Soap 100g"; suppliers = @(
        @{supplierName = "Cauvery Wholesale Mart"; costPerUnit = 28; deliveryDays = 2; minOrderQty = 72; isPreferred = $true},
        @{supplierName = "Sri Saravana Stores"; costPerUnit = 30; deliveryDays = 3; minOrderQty = 60; isPreferred = $false}
    )}
)

# Create relationships
foreach ($relation in $productSupplierRelationships) {
    $product = $createdProducts | Where-Object { $_.name -eq $relation.productName }
    if ($product) {
        foreach ($supplierRel in $relation.suppliers) {
            $supplier = $createdSuppliers | Where-Object { $_.name -eq $supplierRel.supplierName }
            if ($supplier) {
                $productSupplier = @{
                    productId = $product.id
                    supplierId = $supplier.id
                    costPerUnit = $supplierRel.costPerUnit
                    deliveryDays = $supplierRel.deliveryDays
                    minimumOrderQuantity = $supplierRel.minOrderQty
                    isPreferred = $supplierRel.isPreferred
                    notes = "Regular supplier for $($product.name)"
                }
                
                try {
                    $response = Invoke-RestMethod -Uri "$baseUrl/product-suppliers" -Method Post -Body ($productSupplier | ConvertTo-Json) -ContentType "application/json"
                    $productSupplierCount++
                    Write-Host "  Linked: $($product.name) <- $($supplier.name) (₹$($supplierRel.costPerUnit)/unit, $($supplierRel.deliveryDays) days)" -ForegroundColor Green
                } catch {
                    Write-Host "  Failed to link: $($product.name) with $($supplier.name)" -ForegroundColor Red
                }
            }
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Sample Data Population Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Created:" -ForegroundColor Yellow
Write-Host "  - $($createdCategories.Count) Categories" -ForegroundColor White
Write-Host "  - $($createdSuppliers.Count) Suppliers (Tamil Nadu, Karur based)" -ForegroundColor White
Write-Host "  - $($createdProducts.Count) Products (Indian brands & local items)" -ForegroundColor White
Write-Host "  - $transactionCount Transactions" -ForegroundColor White
Write-Host "  - $productSupplierCount Product-Supplier relationships" -ForegroundColor White
Write-Host ""
Write-Host "Note: Some products have low stock levels to demonstrate alerts!" -ForegroundColor Yellow
Write-Host ""
Write-Host "This data represents a real Tamil Nadu, Karur-based supermarket inventory!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now browse the application at http://localhost:4200" -ForegroundColor Cyan
