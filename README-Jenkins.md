# Jenkins CI/CD Pipeline Setup for HKare

This guide provides complete instructions for setting up Jenkins CI/CD pipeline for the HKare Hospital Management System.

## 📋 Prerequisites

- Windows 10/11
- Java 11 or higher
- Docker Desktop
- Git
- PowerShell (Administrator access recommended)

## 🚀 Quick Setup

### 1. Install Jenkins

Run the automated setup script:

```powershell
# Run as Administrator
.\jenkins-setup.ps1
```

Or install manually:

1. Download Jenkins LTS from https://www.jenkins.io/download/
2. Install Java 11+ from https://adoptium.net/
3. Run Jenkins as a Windows service

### 2. Initial Jenkins Configuration

1. Open http://localhost:8080 in your browser
2. Get admin password from: `%ProgramFiles%\Jenkins\secrets\initialAdminPassword`
3. Install suggested plugins
4. Create admin user
5. Configure system

### 3. Install Required Plugins

Go to **Manage Jenkins > Manage Plugins** and install:

- Docker Pipeline
- Git
- Pipeline
- Credentials Binding
- Blue Ocean (optional)

### 4. Configure Docker Hub Credentials

1. Go to **Manage Jenkins > Manage Credentials**
2. Click **Add Credentials**
3. Set:
   - Kind: Secret text
   - ID: `dockerhub-password`
   - Secret: [Your Docker Hub password]

## 🔧 Project Configuration

### 1. Update Jenkinsfile

Edit the `Jenkinsfile` and replace:
- `your-dockerhub-username` with your actual Docker Hub username

### 2. Create Environment File

Copy `env.prod.example` to `.env` and update:

```bash
# Copy the example file
copy env.prod.example .env

# Edit with your values
notepad .env
```

Update these values:
- `DOCKER_HUB_USERNAME=your-actual-username`
- `MYSQL_ROOT_PASSWORD=secure-password`
- `MYSQL_PASSWORD=secure-db-password`

## 🏗️ Create Jenkins Pipeline

### 1. Create New Pipeline Job

1. Go to **New Item**
2. Enter name: `hkare-pipeline`
3. Select **Pipeline**
4. Click **OK**

### 2. Configure Pipeline

In the pipeline configuration:

**General:**
- ✅ GitHub project
- Project url: `https://github.com/yourusername/hkare`

**Pipeline:**
- Definition: Pipeline script from SCM
- SCM: Git
- Repository URL: `https://github.com/yourusername/hkare.git`
- Credentials: (if private repo)
- Branch: `*/main`
- Script Path: `Jenkinsfile`

**Build Triggers:**
- ✅ Poll SCM
- Schedule: `H/5 * * * *` (every 5 minutes)

### 3. Save and Run

Click **Save** and then **Build Now**

## 🚀 Deployment

### 1. Deploy to Production

```powershell
# Deploy using the deployment script
.\deploy.ps1

# Or manually
docker-compose -f docker-compose.prod.yml up -d
```

### 2. Test the Application

```powershell
# Run endpoint tests
.\test-endpoints.ps1

# Check service health
docker-compose -f docker-compose.prod.yml ps
```

### 3. View Logs

```powershell
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Jenkins Won't Start
```powershell
# Check service status
Get-Service -Name Jenkins

# Start service
Start-Service -Name Jenkins

# Check logs
Get-Content "$env:ProgramFiles\Jenkins\jenkins.log"
```

#### 2. Docker Build Fails
```powershell
# Check Docker is running
docker version

# Check disk space
Get-WmiObject -Class Win32_LogicalDisk | Select-Object DeviceID, @{Name="Size(GB)";Expression={[math]::Round($_.Size/1GB,2)}}, @{Name="FreeSpace(GB)";Expression={[math]::Round($_.FreeSpace/1GB,2)}}
```

#### 3. Database Connection Issues
```powershell
# Check database container
docker-compose -f docker-compose.prod.yml logs db

# Test database connection
docker-compose -f docker-compose.prod.yml exec db mysql -u root -p
```

#### 4. Port Conflicts
```powershell
# Check what's using ports
netstat -ano | findstr :8080
netstat -ano | findstr :8082
netstat -ano | findstr :5173

# Kill process if needed
taskkill /PID [PID_NUMBER] /F
```

### Service URLs

After successful deployment:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8082
- **Database**: localhost:3306
- **Jenkins**: http://localhost:8080

### Health Checks

```powershell
# Backend health
Invoke-WebRequest -Uri "http://localhost:8082/actuator/health"

# Frontend health
Invoke-WebRequest -Uri "http://localhost:5173"

# Database health
docker-compose -f docker-compose.prod.yml exec db mysqladmin ping -h localhost
```

## 📊 Monitoring

### Jenkins Dashboard
- View build history
- Monitor pipeline progress
- Check build logs

### Application Monitoring
```powershell
# Monitor resource usage
docker stats

# Check container health
docker-compose -f docker-compose.prod.yml ps

# View application logs
docker-compose -f docker-compose.prod.yml logs -f --tail=100
```

## 🔄 CI/CD Workflow

1. **Code Push**: Developer pushes to GitHub
2. **Jenkins Poll**: Jenkins detects changes (every 5 minutes)
3. **Build**: Jenkins builds Docker images
4. **Test**: Runs automated tests
5. **Push**: Pushes images to Docker Hub
6. **Deploy**: Deploys to production (if on main branch)
7. **Notify**: Sends notifications on success/failure

## 📝 Environment Variables

### Required Environment Variables

```bash
# Docker Hub
DOCKER_HUB_USERNAME=your-username

# Database
MYSQL_ROOT_PASSWORD=secure-password
MYSQL_DATABASE=hkare
MYSQL_USER=hkare_user
MYSQL_PASSWORD=secure-password

# Application
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=your-jwt-secret
```

## 🛡️ Security Considerations

1. **Use strong passwords** for database and JWT secrets
2. **Enable HTTPS** in production
3. **Restrict Jenkins access** to authorized users only
4. **Use Docker secrets** for sensitive data
5. **Regular security updates** for all components

## 📚 Additional Resources

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)

## 🆘 Support

If you encounter issues:

1. Check the logs: `docker-compose -f docker-compose.prod.yml logs`
2. Verify all services are running: `docker-compose -f docker-compose.prod.yml ps`
3. Test individual components: `.\test-endpoints.ps1`
4. Check Jenkins build logs in the Jenkins dashboard

---

**Happy Deploying! 🚀**