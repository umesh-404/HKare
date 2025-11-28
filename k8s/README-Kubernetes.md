# HKare Kubernetes Deployment Guide

Complete guide for deploying HKare Hospital Management System on Kubernetes.

## 📋 Prerequisites

1. **Kubernetes Cluster** (one of the following):
   - Minikube (local development)
   - Docker Desktop Kubernetes
   - Cloud provider (AWS EKS, GKE, Azure AKS)
   - Local cluster (kind, k3s)

2. **kubectl** installed and configured
3. **Docker images** pushed to Docker Hub (`umesh404/hkare-backend` and `umesh404/hkare-frontend`)

## 🚀 Quick Start

### **Step 1: Install kubectl**

**Windows:**
```powershell
# Using Chocolatey
choco install kubernetes-cli

# Or download from:
# https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
```

### **Step 2: Set Up Local Kubernetes (Choose One)**

#### **Option A: Docker Desktop Kubernetes**
1. Open Docker Desktop
2. Go to Settings → Kubernetes
3. Enable Kubernetes
4. Click "Apply & Restart"

#### **Option B: Minikube**
```powershell
# Install Minikube
choco install minikube

# Start Minikube
minikube start

# Enable ingress
minikube addons enable ingress
```

### **Step 3: Deploy HKare**

```powershell
# Run the deployment script
.\k8s\deploy.ps1
```

Or deploy manually:
```powershell
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Create ConfigMap
kubectl apply -f k8s/configmap.yaml

# 3. Create Docker Hub secret
kubectl create secret docker-registry docker-hub-secret \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=umesh404 \
  --docker-password=Umesh@05 \
  --docker-email=umesh404@example.com \
  --namespace=hkare

# 4. Create application secrets
kubectl apply -f k8s/secrets.yaml

# 5. Deploy MySQL
kubectl apply -f k8s/mysql-deployment.yaml

# 6. Wait for MySQL to be ready
kubectl wait --for=condition=ready pod -l app=mysql -n hkare --timeout=300s

# 7. Deploy Backend
kubectl apply -f k8s/backend-deployment.yaml

# 8. Deploy Frontend
kubectl apply -f k8s/frontend-deployment.yaml

# 9. Deploy Ingress (optional)
kubectl apply -f k8s/ingress.yaml
```

## 📁 Kubernetes Files Structure

```
k8s/
├── namespace.yaml          # Namespace definition
├── configmap.yaml          # Non-sensitive configuration
├── secrets.yaml            # Sensitive data (passwords, keys)
├── docker-secret.yaml      # Docker Hub credentials
├── mysql-deployment.yaml   # MySQL database deployment
├── backend-deployment.yaml # Backend API deployment
├── frontend-deployment.yaml # Frontend deployment
├── ingress.yaml            # Ingress for external access
└── README-Kubernetes.md    # This file
```

## 🔍 Verify Deployment

### **Check Pod Status**
```powershell
kubectl get pods -n hkare
```

Expected output:
```
NAME                       READY   STATUS    RESTARTS   AGE
backend-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
frontend-xxxxxxxxxx-xxxxx  1/1     Running   0          2m
mysql-xxxxxxxxxx-xxxxx     1/1     Running   0          5m
```

### **Check Services**
```powershell
kubectl get services -n hkare
```

### **Check Logs**
```powershell
# Backend logs
kubectl logs -f deployment/backend -n hkare

# Frontend logs
kubectl logs -f deployment/frontend -n hkare

# MySQL logs
kubectl logs -f deployment/mysql -n hkare
```

## 🌐 Accessing the Application

### **Method 1: Port Forwarding (Development)**
```powershell
# Frontend
kubectl port-forward svc/frontend 5173:80 -n hkare

# Backend
kubectl port-forward svc/backend 8082:8082 -n hkare
```

Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:8082

### **Method 2: LoadBalancer (Cloud)**
```powershell
# Get external IP
kubectl get svc frontend -n hkare
```

### **Method 3: Ingress (Production)**
If using Ingress:
```powershell
# Get ingress IP
kubectl get ingress -n hkare

# Add to hosts file (Windows)
# C:\Windows\System32\drivers\etc\hosts
# <INGRESS_IP> hkare.local
```

Access:
- Frontend: http://hkare.local
- Backend: http://hkare.local/api

## 🔧 Configuration

### **Update Environment Variables**
Edit `k8s/configmap.yaml` and apply:
```powershell
kubectl apply -f k8s/configmap.yaml
kubectl rollout restart deployment/backend -n hkare
```

### **Update Secrets**
Edit `k8s/secrets.yaml` and apply:
```powershell
kubectl apply -f k8s/secrets.yaml
kubectl rollout restart deployment/backend -n hkare
kubectl rollout restart deployment/mysql -n hkare
```

### **Scale Deployments**
```powershell
# Scale backend to 3 replicas
kubectl scale deployment backend --replicas=3 -n hkare

# Scale frontend to 3 replicas
kubectl scale deployment frontend --replicas=3 -n hkare
```

## 🗑️ Cleanup

### **Delete All Resources**
```powershell
kubectl delete namespace hkare
```

### **Delete Individual Resources**
```powershell
kubectl delete -f k8s/frontend-deployment.yaml
kubectl delete -f k8s/backend-deployment.yaml
kubectl delete -f k8s/mysql-deployment.yaml
```

## 🐛 Troubleshooting

### **Pods Not Starting**
```powershell
# Check pod status
kubectl describe pod <pod-name> -n hkare

# Check events
kubectl get events -n hkare --sort-by='.lastTimestamp'
```

### **Image Pull Errors**
```powershell
# Verify Docker Hub secret
kubectl get secret docker-hub-secret -n hkare

# Test image pull
kubectl run test-pod --image=umesh404/hkare-backend:latest --rm -it --restart=Never -n hkare
```

### **Database Connection Issues**
```powershell
# Check MySQL pod
kubectl logs deployment/mysql -n hkare

# Test connection from backend pod
kubectl exec -it deployment/backend -n hkare -- sh
# Inside pod: ping mysql
```

### **Service Not Accessible**
```powershell
# Check service endpoints
kubectl get endpoints -n hkare

# Check service details
kubectl describe svc frontend -n hkare
```

## 📊 Monitoring

### **Resource Usage**
```powershell
kubectl top pods -n hkare
kubectl top nodes
```

### **Pod Details**
```powershell
kubectl describe pod <pod-name> -n hkare
```

## 🔄 Rolling Updates

### **Update Backend Image**
```powershell
kubectl set image deployment/backend backend=umesh404/hkare-backend:new-tag -n hkare
kubectl rollout status deployment/backend -n hkare
```

### **Rollback**
```powershell
kubectl rollout undo deployment/backend -n hkare
```

## 📝 Production Considerations

1. **Use Persistent Volumes** for MySQL data (already configured)
2. **Set Resource Limits** (already configured)
3. **Enable Health Checks** (already configured)
4. **Use Secrets Management** (consider external secret managers)
5. **Enable TLS/SSL** for Ingress
6. **Set up Monitoring** (Prometheus, Grafana)
7. **Configure Auto-scaling** (HPA - Horizontal Pod Autoscaler)
8. **Backup Strategy** for MySQL data

## 🎯 Next Steps

1. Set up CI/CD to automatically deploy to Kubernetes
2. Configure monitoring and alerting
3. Set up backup strategy for database
4. Configure auto-scaling based on load
5. Set up staging and production environments

---

**Your HKare application is now running on Kubernetes!** 🎉

