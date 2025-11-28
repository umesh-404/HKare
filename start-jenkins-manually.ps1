# Script to start Jenkins manually (as your user account)
# This ensures Jenkins can access Docker

Write-Host "Starting Jenkins Manually..." -ForegroundColor Green

# Check if Jenkins service is running
$jenkinsService = Get-Service -Name "Jenkins" -ErrorAction SilentlyContinue
if ($jenkinsService -and $jenkinsService.Status -eq "Running") {
    Write-Host "WARNING: Jenkins service is running. Stopping it..." -ForegroundColor Yellow
    Stop-Service -Name "Jenkins" -Force
    Start-Sleep -Seconds 3
    Write-Host "SUCCESS: Jenkins service stopped" -ForegroundColor Green
}

# Check if port 8080 is already in use
$portInUse = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "WARNING: Port 8080 is already in use. Jenkins is already running." -ForegroundColor Yellow
    Write-Host "INFO: We need to stop the existing Jenkins to start it manually." -ForegroundColor Cyan
    Write-Host ""
    
    # Try to stop Jenkins service
    $jenkinsService = Get-Service -Name "Jenkins" -ErrorAction SilentlyContinue
    if ($jenkinsService -and $jenkinsService.Status -eq "Running") {
        Write-Host "Stopping Jenkins service..." -ForegroundColor Yellow
        Stop-Service -Name "Jenkins" -Force
        Start-Sleep -Seconds 5
        Write-Host "SUCCESS: Jenkins service stopped" -ForegroundColor Green
    } else {
        # Find and kill the Java process running Jenkins
        Write-Host "Jenkins service not found. Looking for Jenkins Java process..." -ForegroundColor Yellow
        $jenkinsProcess = Get-Process -Name "java" -ErrorAction SilentlyContinue | Where-Object {
            $_.Path -like "*jenkins*" -or (Get-NetTCPConnection -OwningProcess $_.Id -LocalPort 8080 -ErrorAction SilentlyContinue)
        }
        if ($jenkinsProcess) {
            Write-Host "Stopping Jenkins process (PID: $($jenkinsProcess.Id))..." -ForegroundColor Yellow
            Stop-Process -Id $jenkinsProcess.Id -Force
            Start-Sleep -Seconds 3
            Write-Host "SUCCESS: Jenkins process stopped" -ForegroundColor Green
        } else {
            Write-Host "ERROR: Could not find Jenkins process. Please stop it manually." -ForegroundColor Red
            Write-Host "You can stop it by: Stop-Service -Name Jenkins" -ForegroundColor Yellow
            exit 1
        }
    }
    
    # Wait a bit more and check again
    Start-Sleep -Seconds 2
    $portStillInUse = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
    if ($portStillInUse) {
        Write-Host "WARNING: Port 8080 is still in use. Please stop Jenkins manually and try again." -ForegroundColor Red
        exit 1
    }
}

# Check if Docker is running
try {
    docker version | Out-Null
    Write-Host "SUCCESS: Docker is running" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Find Jenkins installation
$possiblePaths = @(
    "C:\Program Files\Jenkins",
    "C:\Program Files (x86)\Jenkins",
    "$env:ProgramFiles\Jenkins",
    "$env:ProgramFiles(x86)\Jenkins"
)

$jenkinsPath = $null
$jenkinsWar = $null

foreach ($path in $possiblePaths) {
    $warFile = Join-Path $path "jenkins.war"
    if (Test-Path $warFile) {
        $jenkinsPath = $path
        $jenkinsWar = $warFile
        break
    }
}

if (-not $jenkinsWar) {
    Write-Host "ERROR: jenkins.war not found in standard locations." -ForegroundColor Red
    Write-Host "Please specify Jenkins installation path:" -ForegroundColor Yellow
    $customPath = Read-Host "Enter Jenkins path (or press Enter to exit)"
    if ($customPath) {
        $jenkinsWar = Join-Path $customPath "jenkins.war"
        if (-not (Test-Path $jenkinsWar)) {
            Write-Host "ERROR: jenkins.war not found at: $jenkinsWar" -ForegroundColor Red
            exit 1
        }
    } else {
        exit 1
    }
}

Write-Host "Jenkins war file: $jenkinsWar" -ForegroundColor Cyan

# Start Jenkins manually
Write-Host ""
Write-Host "Starting Jenkins on http://localhost:8080..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop Jenkins" -ForegroundColor Yellow
Write-Host ""

# Start Jenkins
Set-Location (Split-Path $jenkinsWar)
java -jar jenkins.war --httpPort=8080
