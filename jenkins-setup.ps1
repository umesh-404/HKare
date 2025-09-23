# Jenkins Setup Script for Windows
# This script helps set up Jenkins for the HKare project

Write-Host "🔧 Jenkins Setup Script for HKare Project" -ForegroundColor Green

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "⚠️  This script should be run as Administrator for best results." -ForegroundColor Yellow
}

# Check if Java is installed
Write-Host "`n☕ Checking Java installation..." -ForegroundColor Cyan
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✅ Java is installed: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java is not installed. Please install Java 11 or higher." -ForegroundColor Red
    Write-Host "📥 Download from: https://adoptium.net/" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is installed
Write-Host "`n🐳 Checking Docker installation..." -ForegroundColor Cyan
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop." -ForegroundColor Red
    Write-Host "📥 Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if Git is installed
Write-Host "`n📁 Checking Git installation..." -ForegroundColor Cyan
try {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git." -ForegroundColor Red
    Write-Host "📥 Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Download and install Jenkins
Write-Host "`n📥 Setting up Jenkins..." -ForegroundColor Cyan

$jenkinsUrl = "https://get.jenkins.io/war-stable/latest/jenkins.war"
$jenkinsPath = "$env:ProgramFiles\Jenkins"
$jenkinsWar = "$jenkinsPath\jenkins.war"

# Create Jenkins directory
if (-not (Test-Path $jenkinsPath)) {
    New-Item -ItemType Directory -Path $jenkinsPath -Force
    Write-Host "✅ Created Jenkins directory: $jenkinsPath" -ForegroundColor Green
}

# Download Jenkins if not exists
if (-not (Test-Path $jenkinsWar)) {
    Write-Host "📥 Downloading Jenkins..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $jenkinsUrl -OutFile $jenkinsWar
        Write-Host "✅ Jenkins downloaded successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to download Jenkins: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Jenkins already downloaded" -ForegroundColor Green
}

# Create Jenkins service
Write-Host "`n🔧 Creating Jenkins Windows Service..." -ForegroundColor Cyan

$serviceName = "Jenkins"
$serviceExists = Get-Service -Name $serviceName -ErrorAction SilentlyContinue

if (-not $serviceExists) {
    try {
        # Create service using sc command
        $scCommand = "sc create `"$serviceName`" binPath= `"java -jar $jenkinsWar`" start= auto"
        Invoke-Expression $scCommand
        Write-Host "✅ Jenkins service created" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to create Jenkins service: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "💡 You may need to run this script as Administrator" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ Jenkins service already exists" -ForegroundColor Green
}

# Start Jenkins service
Write-Host "`n🚀 Starting Jenkins service..." -ForegroundColor Cyan
try {
    Start-Service -Name $serviceName
    Write-Host "✅ Jenkins service started" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to start Jenkins service: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Try running: Start-Service -Name Jenkins" -ForegroundColor Yellow
}

# Wait for Jenkins to start
Write-Host "⏳ Waiting for Jenkins to start (this may take a few minutes)..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0

do {
    Start-Sleep -Seconds 10
    $attempt++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Jenkins is running!" -ForegroundColor Green
            break
        }
    } catch {
        Write-Host "⏳ Attempt $attempt/$maxAttempts - Jenkins not ready yet..." -ForegroundColor Yellow
    }
} while ($attempt -lt $maxAttempts)

if ($attempt -eq $maxAttempts) {
    Write-Host "❌ Jenkins failed to start within expected time" -ForegroundColor Red
    Write-Host "💡 Check Jenkins logs or try starting manually" -ForegroundColor Yellow
} else {
    Write-Host "`n🎉 Jenkins Setup Complete!" -ForegroundColor Green
    Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Open your browser and go to: http://localhost:8080" -ForegroundColor White
    Write-Host "2. Get the initial admin password from: $env:ProgramFiles\Jenkins\secrets\initialAdminPassword" -ForegroundColor White
    Write-Host "3. Install suggested plugins" -ForegroundColor White
    Write-Host "4. Create an admin user" -ForegroundColor White
    Write-Host "5. Configure Docker Hub credentials" -ForegroundColor White
    Write-Host "6. Create a new pipeline job" -ForegroundColor White
}

# Display useful commands
Write-Host "`n🛠️  Useful Commands:" -ForegroundColor Cyan
Write-Host "Start Jenkins: Start-Service -Name Jenkins" -ForegroundColor White
Write-Host "Stop Jenkins: Stop-Service -Name Jenkins" -ForegroundColor White
Write-Host "Restart Jenkins: Restart-Service -Name Jenkins" -ForegroundColor White
Write-Host "Check Jenkins Status: Get-Service -Name Jenkins" -ForegroundColor White
Write-Host "Jenkins Logs: Get-Content `"$env:ProgramFiles\Jenkins\jenkins.log`"" -ForegroundColor White

Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
Write-Host "Jenkins Documentation: https://www.jenkins.io/doc/" -ForegroundColor White
Write-Host "Docker Pipeline Plugin: https://plugins.jenkins.io/docker-workflow/" -ForegroundColor White