# Supermarket Stock Management System - Master Run Script
# This single script handles everything: Docker MongoDB, Backend, Frontend

param(
    [string]$Action = "start"  # start, stop, status, populate
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Supermarket Stock Management System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set Java Home if possible
$javaPath = "C:\Program Files\Java\jdk-22"
if (Test-Path $javaPath) {
    $env:JAVA_HOME = $javaPath
}

function Start-Application {
    Write-Host "Starting Application..." -ForegroundColor Yellow
    
    # Check Docker
    $dockerRunning = docker version 2>&1 | Select-String "Server:"
    if (-not $dockerRunning) {
        Write-Host "Docker Desktop is not running!" -ForegroundColor Red
        Write-Host "Please start Docker Desktop first." -ForegroundColor Yellow
        return
    }
    
    # Start MongoDB in Docker
    Write-Host "Starting MongoDB in Docker..." -ForegroundColor Yellow
    $mongoContainer = docker ps -a --filter "name=supermarket-mongodb" --format "{{.Names}}"
    
    if ($mongoContainer) {
        $mongoRunning = docker ps --filter "name=supermarket-mongodb" --format "{{.Names}}"
        if (-not $mongoRunning) {
            docker start supermarket-mongodb
        }
        Write-Host "MongoDB is running" -ForegroundColor Green
    } else {
        docker-compose up -d mongodb
        Start-Sleep -Seconds 5
        Write-Host "MongoDB started" -ForegroundColor Green
    }
    
    # Build backend if needed
    if (-not (Test-Path "backend/target")) {
        Write-Host "Building backend (first time setup)..." -ForegroundColor Yellow
        Set-Location backend
        & .\mvnw.cmd clean install -DskipTests
        Set-Location ..
    }
    
    # Install frontend dependencies if needed
    if (-not (Test-Path "frontend/node_modules")) {
        Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
        Set-Location frontend
        & npm install --silent
        Set-Location ..
    }
    
    # Start Backend
    Write-Host "Starting Backend Server..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location backend; `$env:JAVA_HOME='$javaPath'; .\mvnw.cmd spring-boot:run"
    
    # Start Frontend
    Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location frontend; npm start"
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Application Started Successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Frontend: http://localhost:4200" -ForegroundColor Cyan
    Write-Host "Backend API: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "MongoDB: localhost:27017" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Opening browser in 15 seconds..." -ForegroundColor Yellow
    
    Start-Sleep -Seconds 15
    Start-Process "http://localhost:4200"
}

function Stop-Application {
    Write-Host "Stopping Application..." -ForegroundColor Yellow
    
    # Stop Backend
    $backendProcess = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($backendProcess) {
        Stop-Process -Id $backendProcess -Force
        Write-Host "Backend stopped" -ForegroundColor Green
    }
    
    # Stop Frontend
    $frontendProcess = Get-NetTCPConnection -LocalPort 4200 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($frontendProcess) {
        Stop-Process -Id $frontendProcess -Force
        Write-Host "Frontend stopped" -ForegroundColor Green
    }
    
    # Stop MongoDB
    $mongoRunning = docker ps --filter "name=supermarket-mongodb" --format "{{.Names}}"
    if ($mongoRunning) {
        docker stop supermarket-mongodb
        Write-Host "MongoDB stopped" -ForegroundColor Green
    }
}

function Show-Status {
    Write-Host "Checking Application Status..." -ForegroundColor Yellow
    
    # Check MongoDB
    $mongoRunning = docker ps --filter "name=supermarket-mongodb" --format "{{.Names}}"
    if ($mongoRunning) {
        Write-Host "MongoDB: Running" -ForegroundColor Green
    } else {
        Write-Host "MongoDB: Not running" -ForegroundColor Red
    }
    
    # Check Backend
    $backendRunning = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
    if ($backendRunning) {
        Write-Host "Backend: Running on port 8080" -ForegroundColor Green
    } else {
        Write-Host "Backend: Not running" -ForegroundColor Red
    }
    
    # Check Frontend
    $frontendRunning = Get-NetTCPConnection -LocalPort 4200 -State Listen -ErrorAction SilentlyContinue
    if ($frontendRunning) {
        Write-Host "Frontend: Running on port 4200" -ForegroundColor Green
    } else {
        Write-Host "Frontend: Not running" -ForegroundColor Red
    }
}

function Populate-Data {
    Write-Host "Populating sample data..." -ForegroundColor Yellow
    
    # Check if backend is running
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/api/categories" -Method Get -ErrorAction Stop
        
        # Run the populate script
        & powershell.exe -ExecutionPolicy Bypass -File ".\populate-sample-data.ps1"
    } catch {
        Write-Host "Backend is not running. Please start the application first." -ForegroundColor Red
    }
}

# Main execution
switch ($Action.ToLower()) {
    "start" { Start-Application }
    "stop" { Stop-Application }
    "status" { Show-Status }
    "populate" { Populate-Data }
    default {
        Write-Host "Invalid action. Use: start, stop, status, or populate" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
