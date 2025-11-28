# Script to build and push Docker images to Docker Hub
# Run this BEFORE deploying to Kubernetes

Write-Host "Building and pushing Docker images to Docker Hub..." -ForegroundColor Green

# Login to Docker Hub
Write-Host "Logging in to Docker Hub..." -ForegroundColor Yellow
docker login -u umesh404

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker Hub login failed" -ForegroundColor Red
    exit 1
}

# Build and push backend
Write-Host "Building backend image..." -ForegroundColor Yellow
docker build -t umesh404/hkare-backend:latest ./backend
docker tag umesh404/hkare-backend:latest umesh404/hkare-backend:latest

Write-Host "Pushing backend image..." -ForegroundColor Yellow
docker push umesh404/hkare-backend:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to push backend image" -ForegroundColor Red
    exit 1
}

# Build and push frontend
Write-Host "Building frontend image..." -ForegroundColor Yellow
docker build -t umesh404/hkare-frontend:latest ./frontend
docker tag umesh404/hkare-frontend:latest umesh404/hkare-frontend:latest

Write-Host "Pushing frontend image..." -ForegroundColor Yellow
docker push umesh404/hkare-frontend:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to push frontend image" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "SUCCESS: All images pushed to Docker Hub!" -ForegroundColor Green
Write-Host "You can now deploy to Kubernetes" -ForegroundColor Cyan

