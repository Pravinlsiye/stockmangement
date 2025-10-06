# Supermarket Stock Management System - Master Run Script
# This single script handles everything: Docker MongoDB, Backend, Frontend

param(
    [string]$Action = "start",  # start, stop, status, populate
    [string]$DbMode = "local"   # local or cloud
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Supermarket Stock Management System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database Mode: $DbMode" -ForegroundColor Yellow
Write-Host ""

# ============================================
# DEPENDENCY INSTALLATION FUNCTIONS
# ============================================

function Test-JavaInstalled {
    try {
        $javaVersion = & java -version 2>&1 | Select-String "version"
        if ($javaVersion) {
            Write-Host "Java is already installed: $javaVersion" -ForegroundColor Green
            return $true
        }
    } catch {
        return $false
    }
    return $false
}

function Test-NodeInstalled {
    try {
        $nodeVersion = & node --version 2>&1
        if ($nodeVersion) {
            Write-Host "Node.js is already installed: $nodeVersion" -ForegroundColor Green
            return $true
        }
    } catch {
        return $false
    }
    return $false
}

function Install-Java {
    Write-Host "Installing Java Development Kit (JDK)..." -ForegroundColor Yellow
    
    # Check if winget is available
    $wingetAvailable = Get-Command winget -ErrorAction SilentlyContinue
    
    if ($wingetAvailable) {
        Write-Host "Using winget to install JDK 17 (required by project)..." -ForegroundColor Cyan
        try {
            # Install OpenJDK 17 (LTS) - Required by Spring Boot 3.1.5
            winget install --id Microsoft.OpenJDK.17 --accept-package-agreements --accept-source-agreements --silent
            
            # Refresh environment variables
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
            
            Write-Host "Java 17 installed successfully!" -ForegroundColor Green
            
            # Find and set JAVA_HOME
            $possibleJavaPaths = @(
                "C:\Program Files\Microsoft\jdk-17*",
                "C:\Program Files\Eclipse Adoptium\jdk-17*",
                "C:\Program Files\Java\jdk-17*"
            )
            
            foreach ($pattern in $possibleJavaPaths) {
                $javaDir = Get-ChildItem -Path (Split-Path $pattern) -Directory -Filter (Split-Path $pattern -Leaf) -ErrorAction SilentlyContinue | Select-Object -First 1
                if ($javaDir) {
                    $script:javaPath = $javaDir.FullName
                    [System.Environment]::SetEnvironmentVariable("JAVA_HOME", $script:javaPath, "Machine")
                    Write-Host "JAVA_HOME set to: $script:javaPath" -ForegroundColor Green
                    break
                }
            }
            
            return $true
        } catch {
            Write-Host "Failed to install Java using winget: $_" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "Winget not available. Please install Java manually:" -ForegroundColor Yellow
        Write-Host "1. Download from: https://www.microsoft.com/openjdk" -ForegroundColor Cyan
        Write-Host "2. Or install winget first and run this script again" -ForegroundColor Cyan
        return $false
    }
}

function Install-NodeJS {
    Write-Host "Installing Node.js..." -ForegroundColor Yellow
    
    # Check if winget is available
    $wingetAvailable = Get-Command winget -ErrorAction SilentlyContinue
    
    if ($wingetAvailable) {
        Write-Host "Using winget to install Node.js LTS..." -ForegroundColor Cyan
        try {
            # Install Node.js LTS
            winget install --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements --silent
            
            # Refresh environment variables
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
            
            Write-Host "Node.js installed successfully!" -ForegroundColor Green
            return $true
        } catch {
            Write-Host "Failed to install Node.js using winget: $_" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "Winget not available. Please install Node.js manually:" -ForegroundColor Yellow
        Write-Host "1. Download from: https://nodejs.org/" -ForegroundColor Cyan
        Write-Host "2. Or install winget first and run this script again" -ForegroundColor Cyan
        return $false
    }
}

function Initialize-Dependencies {
    Write-Host "Checking dependencies..." -ForegroundColor Cyan
    Write-Host ""
    
    # Check and install Java
    if (-not (Test-JavaInstalled)) {
        Write-Host "Java is not installed." -ForegroundColor Yellow
        $installJava = Read-Host "Would you like to install Java now? (Y/N)"
        if ($installJava -eq 'Y' -or $installJava -eq 'y') {
            $javaInstalled = Install-Java
            if (-not $javaInstalled) {
                Write-Host "Java installation failed. Please install it manually and restart the script." -ForegroundColor Red
                exit 1
            }
            Write-Host "Please close this window and restart the script for PATH changes to take effect." -ForegroundColor Yellow
            exit 0
        } else {
            Write-Host "Java is required to run the backend. Exiting." -ForegroundColor Red
            exit 1
        }
    }
    
    # Check and install Node.js
    if (-not (Test-NodeInstalled)) {
        Write-Host "Node.js is not installed." -ForegroundColor Yellow
        $installNode = Read-Host "Would you like to install Node.js now? (Y/N)"
        if ($installNode -eq 'Y' -or $installNode -eq 'y') {
            $nodeInstalled = Install-NodeJS
            if (-not $nodeInstalled) {
                Write-Host "Node.js installation failed. Please install it manually and restart the script." -ForegroundColor Red
                exit 1
            }
            Write-Host "Please close this window and restart the script for PATH changes to take effect." -ForegroundColor Yellow
            exit 0
        } else {
            Write-Host "Node.js is required to run the frontend. Exiting." -ForegroundColor Red
            exit 1
        }
    }
    
    Write-Host ""
    Write-Host "All dependencies are installed!" -ForegroundColor Green
    Write-Host ""
}

# ============================================
# RUN DEPENDENCY CHECK
# ============================================
if ($Action.ToLower() -eq "start") {
    Initialize-Dependencies
}

# ============================================
# SET JAVA HOME
# ============================================
$script:javaPath = $env:JAVA_HOME
if (-not $script:javaPath) {
    # Try to find Java installation (prefer Java 17 as required by project)
    $possibleJavaPaths = @(
        "C:\Program Files\Microsoft\jdk-17*",
        "C:\Program Files\Eclipse Adoptium\jdk-17*",
        "C:\Program Files\Java\jdk-17*",
        "C:\Program Files\Microsoft\jdk-*",
        "C:\Program Files\Eclipse Adoptium\jdk-*",
        "C:\Program Files\Java\jdk-*"
    )
    
    foreach ($pattern in $possibleJavaPaths) {
        $parentPath = Split-Path $pattern
        $filter = Split-Path $pattern -Leaf
        if (Test-Path $parentPath) {
            $javaDir = Get-ChildItem -Path $parentPath -Directory -Filter $filter -ErrorAction SilentlyContinue | Select-Object -First 1
            if ($javaDir) {
                $script:javaPath = $javaDir.FullName
                $env:JAVA_HOME = $script:javaPath
                Write-Host "Found Java at: $script:javaPath" -ForegroundColor Green
                break
            }
        }
    }
}

function Start-Application {
    Write-Host "Starting Application..." -ForegroundColor Yellow
    
    # Check Docker (if local mode)
    if ($DbMode -eq "local") {
        $dockerRunning = docker version 2>&1 | Select-String "Server:"
        if (-not $dockerRunning) {
            Write-Host "Docker Desktop is not running!" -ForegroundColor Red
            Write-Host "Please start Docker Desktop first." -ForegroundColor Yellow
            return
        }
    }
    
    # Start MongoDB (if local mode)
    if ($DbMode -eq "local") {
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
        Write-Host "Installing frontend dependencies (this may take a few minutes)..." -ForegroundColor Yellow
        Write-Host "Dependencies are properly configured for Angular 16 compatibility" -ForegroundColor Gray
        Set-Location frontend
        & npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Frontend dependency installation failed!" -ForegroundColor Red
            Write-Host "Please check the error above and ensure Node.js is properly installed." -ForegroundColor Yellow
            Set-Location ..
            return
        }
        Write-Host "Frontend dependencies installed successfully!" -ForegroundColor Green
        Set-Location ..
    }
    
    # Start Backend
    Write-Host "Starting Backend Server..." -ForegroundColor Yellow
    if ($DbMode -eq "cloud") {
        Write-Host "Using Cloud MongoDB (MongoDB Atlas)" -ForegroundColor Cyan
        
        # Check for saved MongoDB URI or prompt for it
        $mongoUri = ""
        $envFile = ".env.local"
        
        if (Test-Path $envFile) {
            $content = Get-Content $envFile | Where-Object { $_ -match "^MONGODB_URI=" }
            if ($content) {
                $mongoUri = $content -replace "^MONGODB_URI=", ""
                Write-Host "Using saved MongoDB connection string" -ForegroundColor Green
            }
        }
        
        if (-not $mongoUri) {
            Write-Host ""
            Write-Host "Enter your MongoDB Atlas connection string:" -ForegroundColor Yellow
            Write-Host "(Format: mongodb+srv://username:password@cluster.xxxxx.mongodb.net/database?retryWrites=true&w=majority)" -ForegroundColor Gray
            $mongoUri = Read-Host "MongoDB URI"
            
            # Offer to save for future use
            Write-Host ""
            $save = Read-Host "Save this connection string for future use? (Y/N)"
            if ($save -eq 'Y' -or $save -eq 'y') {
                "MONGODB_URI=$mongoUri" | Out-File -FilePath $envFile -Encoding utf8
                Write-Host "Connection string saved to $envFile" -ForegroundColor Green
                Write-Host "(This file is git-ignored)" -ForegroundColor Gray
            }
        }
        
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location backend; `$env:JAVA_HOME='$javaPath'; `$env:SPRING_PROFILES_ACTIVE='cloud'; `$env:MONGODB_URI='$mongoUri'; .\mvnw.cmd spring-boot:run"
    } else {
        Write-Host "Using Local MongoDB (Docker)" -ForegroundColor Cyan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location backend; `$env:JAVA_HOME='$javaPath'; .\mvnw.cmd spring-boot:run"
    }
    
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
    if ($DbMode -eq "cloud") {
        Write-Host "MongoDB: Cloud (MongoDB Atlas)" -ForegroundColor Cyan
    } else {
        Write-Host "MongoDB: localhost:27017" -ForegroundColor Cyan
    }
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
        Write-Host ""
        Write-Host "Usage:" -ForegroundColor Yellow
        Write-Host "  .\RUN.ps1 -Action start            # Start with local MongoDB" -ForegroundColor Gray
        Write-Host "  .\RUN.ps1 -Action start -DbMode cloud  # Start with cloud MongoDB" -ForegroundColor Gray
        Write-Host "  .\RUN.ps1 -Action stop             # Stop all services" -ForegroundColor Gray
        Write-Host "  .\RUN.ps1 -Action status           # Check service status" -ForegroundColor Gray
        Write-Host "  .\RUN.ps1 -Action populate         # Populate sample data" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
