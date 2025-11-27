# HKare Production Deployment Script
# Run this script on your production server

param(
    [string]$Environment = "prod",
    [switch]$SkipTests = $false,
    [switch]$Force = $false
)

Write-Host "🚀 Starting HKare Production Deployment..." -ForegroundColor Green

# Check if Docker is running
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is available
try {
    docker-compose version | Out-Null
    Write-Host "✅ Docker Compose is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not available. Please install Docker Compose." -ForegroundColor Red
    exit 1
}

# Load environment variables
if (Test-Path ".env") {
    Write-Host "📄 Loading environment variables from .env file..." -ForegroundColor Yellow
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
} else {
    Write-Host "⚠️  No .env file found. Using default values." -ForegroundColor Yellow
}

# Set default values if not provided
$DOCKER_HUB_USERNAME = if ($env:DOCKER_HUB_USERNAME) { $env:DOCKER_HUB_USERNAME } else { "umesh404" }

Write-Host "🐳 Docker Hub Username: $DOCKER_HUB_USERNAME" -ForegroundColor Cyan

# Stop existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml down

# Pull latest images
Write-Host "📥 Pulling latest images..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml pull

# Start services
Write-Host "🚀 Starting services..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check service health
Write-Host "🔍 Checking service health..." -ForegroundColor Yellow

# Check database
try {
    $dbHealth = docker-compose -f docker-compose.prod.yml exec -T db mysqladmin ping -h localhost
    if ($dbHealth -match "alive") {
        Write-Host "✅ Database is healthy" -ForegroundColor Green
    } else {
        Write-Host "❌ Database health check failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Database health check failed" -ForegroundColor Red
}

# Check backend
try {
    $backendHealth = Invoke-WebRequest -Uri "http://localhost:8082/actuator/health" -TimeoutSec 10
    if ($backendHealth.StatusCode -eq 200) {
        Write-Host "✅ Backend is healthy" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend health check failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Backend health check failed" -ForegroundColor Red
}

# Check frontend
try {
    $frontendHealth = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 10
    if ($frontendHealth.StatusCode -eq 200) {
        Write-Host "✅ Frontend is healthy" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend health check failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Frontend health check failed" -ForegroundColor Red
}

# Display service information
Write-Host "`n📊 Service Information:" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "🔧 Backend API: http://localhost:8082" -ForegroundColor White
Write-Host "🗄️  Database: localhost:3306" -ForegroundColor White

# Show running containers
Write-Host "`n📋 Running Containers:" -ForegroundColor Cyan
docker-compose -f docker-compose.prod.yml ps

Write-Host "`n🎉 Deployment completed!" -ForegroundColor Green
Write-Host "📝 Check the logs with: docker-compose -f docker-compose.prod.yml logs -f" -ForegroundColor Yellow