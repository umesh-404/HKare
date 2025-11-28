# Ansible Deployment Script for HKare
# This script deploys HKare using Ansible

param(
    [string]$Environment = "local",
    [string]$Inventory = "inventory.ini",
    [switch]$Check = $false,
    [switch]$Verbose = $false
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HKare Ansible Deployment" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Ansible is installed
try {
    $ansibleVersion = ansible --version 2>&1 | Select-String "ansible"
    Write-Host "SUCCESS: Ansible is installed" -ForegroundColor Green
    Write-Host $ansibleVersion -ForegroundColor White
} catch {
    Write-Host "ERROR: Ansible is not installed" -ForegroundColor Red
    Write-Host "Please install Ansible:" -ForegroundColor Yellow
    Write-Host "  pip install ansible" -ForegroundColor White
    Write-Host "  Or: pip3 install ansible" -ForegroundColor White
    exit 1
}

Write-Host ""

# Check if inventory file exists
if (-not (Test-Path "ansible\$Inventory")) {
    Write-Host "ERROR: Inventory file not found: ansible\$Inventory" -ForegroundColor Red
    exit 1
}

# Build Ansible command
$ansibleCommand = "ansible-playbook"
$ansibleArgs = @(
    "-i", "ansible\$Inventory"
    "ansible\playbook.yml"
    "--limit", $Environment
)

if ($Check) {
    $ansibleArgs += "--check"
    Write-Host "Running in CHECK mode (dry-run)" -ForegroundColor Yellow
}

if ($Verbose) {
    $ansibleArgs += "-vvv"
}

Write-Host "Deploying to environment: $Environment" -ForegroundColor Cyan
Write-Host ""

# Run Ansible playbook
& $ansibleCommand $ansibleArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: Deployment completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To verify deployment:" -ForegroundColor Cyan
    Write-Host "  ansible $Environment -i ansible\$Inventory -m shell -a 'docker ps'" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "ERROR: Deployment failed!" -ForegroundColor Red
    exit 1
}

