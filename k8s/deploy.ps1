# Kubernetes Deployment Script for HKare
# This script deploys the entire HKare application to Kubernetes

param(
    [string]$Namespace = "hkare",
    [switch]$SkipSecrets = $false
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HKare Kubernetes Deployment" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if kubectl is available
try {
    $kubectlVersion = kubectl version --client --short
    Write-Host "SUCCESS: kubectl is available" -ForegroundColor Green
} catch {
    Write-Host "ERROR: kubectl is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install kubectl: https://kubernetes.io/docs/tasks/tools/" -ForegroundColor Yellow
    exit 1
}

# Check if cluster is accessible
try {
    kubectl cluster-info | Out-Null
    Write-Host "SUCCESS: Kubernetes cluster is accessible" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Cannot connect to Kubernetes cluster" -ForegroundColor Red
    Write-Host "Please configure kubectl to connect to your cluster" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 1: Create namespace
Write-Host "Step 1: Creating namespace..." -ForegroundColor Yellow
kubectl apply -f k8s/namespace.yaml
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to create namespace" -ForegroundColor Red
    exit 1
}
Write-Host "SUCCESS: Namespace created" -ForegroundColor Green
Write-Host ""

# Step 2: Create ConfigMap
Write-Host "Step 2: Creating ConfigMap..." -ForegroundColor Yellow
kubectl apply -f k8s/configmap.yaml
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to create ConfigMap" -ForegroundColor Red
    exit 1
}
Write-Host "SUCCESS: ConfigMap created" -ForegroundColor Green
Write-Host ""

# Step 3: Create Secrets
if (-not $SkipSecrets) {
    Write-Host "Step 3: Creating Docker Hub secret..." -ForegroundColor Yellow
    kubectl create secret docker-registry docker-hub-secret `
        --docker-server=https://index.docker.io/v1/ `
        --docker-username=umesh404 `
        --docker-password=Umesh@05 `
        --docker-email=umesh404@example.com `
        --namespace=$Namespace `
        --dry-run=client -o yaml | kubectl apply -f -
    
    Write-Host "Step 3b: Creating application secrets..." -ForegroundColor Yellow
    kubectl apply -f k8s/secrets.yaml
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to create secrets" -ForegroundColor Red
        exit 1
    }
    Write-Host "SUCCESS: Secrets created" -ForegroundColor Green
} else {
    Write-Host "Step 3: Skipping secrets creation (using existing)" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Deploy MySQL
Write-Host "Step 4: Deploying MySQL..." -ForegroundColor Yellow
kubectl apply -f k8s/mysql-deployment.yaml
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to deploy MySQL" -ForegroundColor Red
    exit 1
}
Write-Host "SUCCESS: MySQL deployment started" -ForegroundColor Green
Write-Host "Waiting for MySQL to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=mysql -n $Namespace --timeout=300s
Write-Host ""

# Step 5: Deploy Backend
Write-Host "Step 5: Deploying Backend..." -ForegroundColor Yellow
kubectl apply -f k8s/backend-deployment.yaml
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to deploy backend" -ForegroundColor Red
    exit 1
}
Write-Host "SUCCESS: Backend deployment started" -ForegroundColor Green
Write-Host ""

# Step 6: Deploy Frontend
Write-Host "Step 6: Deploying Frontend..." -ForegroundColor Yellow
kubectl apply -f k8s/frontend-deployment.yaml
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to deploy frontend" -ForegroundColor Red
    exit 1
}
Write-Host "SUCCESS: Frontend deployment started" -ForegroundColor Green
Write-Host ""

# Step 7: Deploy Ingress (optional)
Write-Host "Step 7: Deploying Ingress..." -ForegroundColor Yellow
kubectl apply -f k8s/ingress.yaml
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Ingress deployment failed (may not be needed)" -ForegroundColor Yellow
} else {
    Write-Host "SUCCESS: Ingress deployed" -ForegroundColor Green
}
Write-Host ""

# Display status
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Status" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
kubectl get pods -n $Namespace
Write-Host ""
kubectl get services -n $Namespace
Write-Host ""

# Get service URLs
Write-Host "Service URLs:" -ForegroundColor Cyan
$frontendService = kubectl get svc frontend -n $Namespace -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null
if ($frontendService) {
    Write-Host "Frontend: http://$frontendService" -ForegroundColor White
} else {
    Write-Host "Frontend: Use 'kubectl port-forward svc/frontend 80:80 -n $Namespace' to access" -ForegroundColor White
}

Write-Host ""
Write-Host "To view logs:" -ForegroundColor Cyan
Write-Host "  kubectl logs -f deployment/backend -n $Namespace" -ForegroundColor White
Write-Host "  kubectl logs -f deployment/frontend -n $Namespace" -ForegroundColor White
Write-Host ""
Write-Host "To check pod status:" -ForegroundColor Cyan
Write-Host "  kubectl get pods -n $Namespace" -ForegroundColor White
Write-Host ""
Write-Host "SUCCESS: Deployment completed!" -ForegroundColor Green

