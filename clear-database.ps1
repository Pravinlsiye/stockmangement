# Clear Database Script
# This script clears all data from the MongoDB collections

$baseUrl = "http://localhost:8080/api"

Write-Host "========================================" -ForegroundColor Red
Write-Host "Clearing All Database Data" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

# Test connection
try {
    $testResponse = Invoke-RestMethod -Uri "$baseUrl/products" -Method GET -ErrorAction Stop
    Write-Host "Backend is accessible" -ForegroundColor Green
} catch {
    Write-Host "Error: Backend is not accessible at $baseUrl" -ForegroundColor Red
    Write-Host "Make sure the backend is running (npm run start)" -ForegroundColor Yellow
    exit 1
}

# Function to delete all items from a collection
function Clear-Collection {
    param(
        [string]$collectionName,
        [string]$endpoint
    )
    
    Write-Host "Clearing $collectionName..." -ForegroundColor Yellow
    
    try {
        # Get all items
        $items = Invoke-RestMethod -Uri "$baseUrl/$endpoint" -Method GET
        $count = 0
        
        # Delete each item
        foreach ($item in $items) {
            try {
                $null = Invoke-RestMethod -Uri "$baseUrl/$endpoint/$($item.id)" -Method DELETE
                $count++
            } catch {
                Write-Host "  Failed to delete $collectionName item: $($item.id)" -ForegroundColor Red
            }
        }
        
        Write-Host "  Deleted $count $collectionName" -ForegroundColor Green
    } catch {
        Write-Host "  Error accessing $collectionName" -ForegroundColor Red
    }
}

# Clear all collections in reverse order of dependencies
Clear-Collection -collectionName "Transactions" -endpoint "transactions"
Clear-Collection -collectionName "Products" -endpoint "products"
Clear-Collection -collectionName "Suppliers" -endpoint "suppliers"
Clear-Collection -collectionName "Categories" -endpoint "categories"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Database Cleared Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "You can now run populate-sample-data.ps1 to insert fresh data" -ForegroundColor Cyan
