# Jenkins Pipeline Setup Checklist

## ✅ Files Updated and Verified

### 1. **Jenkinsfile** ✅
- Docker Hub username: `umesh404` ✓
- All stages configured correctly ✓
- Windows batch commands (bat) ✓
- Error handling included ✓

### 2. **docker-compose.prod.yml** ✅
- Docker Hub username default: `umesh404` ✓
- Removed non-existent `init.sql` reference ✓
- Removed non-existent `ssl` directory reference ✓
- Healthchecks updated to use available tools ✓
- Backend healthcheck: Uses `/api/health` endpoint ✓
- Frontend healthcheck: Uses `wget` (available in nginx:alpine) ✓
- Nginx healthcheck: Uses `wget` ✓

### 3. **backend/Dockerfile** ✅
- Added `curl` installation for healthchecks ✓
- Multi-stage build configured correctly ✓
- Exposes port 8082 ✓

### 4. **frontend/Dockerfile** ✅
- Multi-stage build configured correctly ✓
- Nginx serving static files ✓
- Exposes port 80 ✓

### 5. **.gitignore** ✅
- Added `.env` to prevent committing secrets ✓
- Added Jenkins workspace directories ✓
- Added build artifacts ✓

### 6. **env.prod.example** ✅
- Docker Hub username: `umesh404` ✓
- All required variables documented ✓

### 7. **deploy.ps1** ✅
- Docker Hub username default: `umesh404` ✓
- Health checks configured ✓

### 8. **docker-compose.yml** (Development) ✅
- Uses local MySQL (host.docker.internal) ✓
- No changes needed ✓

## 🔧 Jenkins Configuration Required

### Step 1: Jenkins Environment Variables
Go to **Manage Jenkins → Configure System → Global Properties → Environment Variables**:
- `DOCKER_HOST`: `npipe:////./pipe/docker_engine`
- `DOCKER_TLS_VERIFY`: `0`

### Step 2: Docker Hub Credentials
Go to **Manage Jenkins → Manage Credentials → Add Credentials**:
- **Kind**: Secret text
- **ID**: `dockerhub-password` (must match exactly)
- **Secret**: Your Docker Hub password for `umesh404`

### Step 3: Pipeline Job Configuration
- **Name**: `hkare-pipeline`
- **Type**: Pipeline
- **SCM**: Git
- **Repository**: `https://github.com/umesh-404/HKare`
- **Branch**: `*/main`
- **Script Path**: `Jenkinsfile`
- **Poll SCM**: `H/5 * * * *` (every 5 minutes)

## 🚀 Build Process

1. **Checkout**: Pulls code from GitHub
2. **Build Backend**: Creates `umesh404/hkare-backend:latest` and `umesh404/hkare-backend:{BUILD_NUMBER}`
3. **Build Frontend**: Creates `umesh404/hkare-frontend:latest` and `umesh404/hkare-frontend:{BUILD_NUMBER}`
4. **Login**: Authenticates to Docker Hub
5. **Push**: Pushes all images to Docker Hub
6. **Cleanup**: Removes local images
7. **Deploy**: (Only on main branch) Deploys using `docker-compose.prod.yml`

## 📋 Pre-Deployment Checklist

- [ ] Jenkins running manually (not as service)
- [ ] Docker Desktop running
- [ ] Docker Hub credentials configured
- [ ] Environment variables set in Jenkins
- [ ] Pipeline job created
- [ ] `.env` file created (copy from `env.prod.example`)
- [ ] Docker Hub username `umesh404` has push permissions
- [ ] GitHub repository is accessible

## 🔍 Verification Commands

```powershell
# Test Docker access
docker version
docker ps

# Test Docker Hub login
docker login -u umesh404

# Test build locally
docker build -t test-backend ./backend
docker build -t test-frontend ./frontend

# Check Jenkins environment
# Go to: Manage Jenkins → System Information
# Look for DOCKER_HOST variable
```

## 🎯 Expected Results

After successful build:
- Images pushed to Docker Hub:
  - `umesh404/hkare-backend:latest`
  - `umesh404/hkare-backend:{BUILD_NUMBER}`
  - `umesh404/hkare-frontend:latest`
  - `umesh404/hkare-frontend:{BUILD_NUMBER}`

## 🐛 Common Issues Fixed

1. ✅ Docker certificate path issues → Fixed by running Jenkins manually
2. ✅ Missing curl in backend → Added to Dockerfile
3. ✅ Non-existent files referenced → Removed from docker-compose.prod.yml
4. ✅ Docker Hub username inconsistencies → Updated to `umesh404` everywhere
5. ✅ Healthcheck tools unavailable → Updated to use available tools

## 📝 Notes

- Jenkins should run manually (not as service) to avoid Docker certificate issues
- All Docker Hub references use `umesh404` as username
- Production deployment only runs on `main` branch
- Healthchecks use appropriate tools for each service

---

**All files are now correctly configured for Jenkins CI/CD pipeline!** 🎉
