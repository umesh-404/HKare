# HKare API Endpoint Testing Script
# This script tests all the main endpoints of the HKare application

param(
    [string]$BaseUrl = "http://localhost:8082",
    [string]$FrontendUrl = "http://localhost:5173",
    [int]$Timeout = 30
)

Write-Host "🧪 Starting HKare API Endpoint Tests..." -ForegroundColor Green

$TestResults = @()
$PassedTests = 0
$FailedTests = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null,
        [int]$ExpectedStatus = 200
    )
    
    try {
        Write-Host "Testing: $Name" -ForegroundColor Yellow
        
        $params = @{
            Uri = $Url
            Method = $Method
            TimeoutSec = $Timeout
            Headers = $Headers
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "✅ $Name - PASSED" -ForegroundColor Green
            $script:PassedTests++
            $script:TestResults += [PSCustomObject]@{
                Name = $Name
                Status = "PASSED"
                StatusCode = $response.StatusCode
                ResponseTime = $response.Headers.'X-Response-Time'
            }
        } else {
            Write-Host "❌ $Name - FAILED (Expected: $ExpectedStatus, Got: $($response.StatusCode))" -ForegroundColor Red
            $script:FailedTests++
            $script:TestResults += [PSCustomObject]@{
                Name = $Name
                Status = "FAILED"
                StatusCode = $response.StatusCode
                ExpectedStatus = $ExpectedStatus
            }
        }
    } catch {
        Write-Host "❌ $Name - ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $script:FailedTests++
        $script:TestResults += [PSCustomObject]@{
            Name = $Name
            Status = "ERROR"
            Error = $_.Exception.Message
        }
    }
}

# Test basic connectivity
Write-Host "`n🔍 Testing Basic Connectivity..." -ForegroundColor Cyan

Test-Endpoint -Name "Backend Health Check" -Url "$BaseUrl/actuator/health"
Test-Endpoint -Name "Frontend Health Check" -Url "$FrontendUrl"

# Test API endpoints (without authentication)
Write-Host "`n🔍 Testing Public API Endpoints..." -ForegroundColor Cyan

Test-Endpoint -Name "Health Check" -Url "$BaseUrl/api/health"
Test-Endpoint -Name "Departments List" -Url "$BaseUrl/api/departments"

# Test authentication endpoints
Write-Host "`n🔍 Testing Authentication Endpoints..." -ForegroundColor Cyan

# Test patient login (you may need to adjust these based on your actual endpoints)
$loginBody = @{
    username = "test@example.com"
    password = "testpassword"
} | ConvertTo-Json

Test-Endpoint -Name "Patient Login" -Url "$BaseUrl/api/patient/login" -Method "POST" -Body $loginBody -ExpectedStatus 401

# Test CORS
Write-Host "`n🔍 Testing CORS Headers..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/health" -Method "OPTIONS"
    if ($response.Headers.'Access-Control-Allow-Origin') {
        Write-Host "✅ CORS Headers Present" -ForegroundColor Green
        $PassedTests++
    } else {
        Write-Host "❌ CORS Headers Missing" -ForegroundColor Red
        $FailedTests++
    }
} catch {
    Write-Host "❌ CORS Test Failed" -ForegroundColor Red
    $FailedTests++
}

# Test database connectivity (through API)
Write-Host "`n🔍 Testing Database Connectivity..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/departments" -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Database Connection Working" -ForegroundColor Green
        $PassedTests++
    } else {
        Write-Host "❌ Database Connection Failed" -ForegroundColor Red
        $FailedTests++
    }
} catch {
    Write-Host "❌ Database Connection Test Failed" -ForegroundColor Red
    $FailedTests++
}

# Display test results
Write-Host "`n📊 Test Results Summary:" -ForegroundColor Cyan
Write-Host "✅ Passed: $PassedTests" -ForegroundColor Green
Write-Host "❌ Failed: $FailedTests" -ForegroundColor Red
Write-Host "📈 Total: $($PassedTests + $FailedTests)" -ForegroundColor White

if ($FailedTests -eq 0) {
    Write-Host "`n🎉 All tests passed! Your application is working correctly." -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Please check the application logs." -ForegroundColor Yellow
    Write-Host "📝 Check logs with: docker-compose -f docker-compose.prod.yml logs" -ForegroundColor Yellow
}

# Display detailed results
Write-Host "`n📋 Detailed Results:" -ForegroundColor Cyan
$TestResults | Format-Table -AutoSize

# Performance test
Write-Host "`n⚡ Performance Test (10 requests to health endpoint)..." -ForegroundColor Cyan
$performanceResults = @()
for ($i = 1; $i -le 10; $i++) {
    $startTime = Get-Date
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/actuator/health" -TimeoutSec 5
        $endTime = Get-Date
        $responseTime = ($endTime - $startTime).TotalMilliseconds
        $performanceResults += $responseTime
        Write-Host "Request $i`: $([math]::Round($responseTime, 2))ms" -ForegroundColor White
    } catch {
        Write-Host "Request $i`: FAILED" -ForegroundColor Red
    }
}

if ($performanceResults.Count -gt 0) {
    $avgResponseTime = ($performanceResults | Measure-Object -Average).Average
    $maxResponseTime = ($performanceResults | Measure-Object -Maximum).Maximum
    $minResponseTime = ($performanceResults | Measure-Object -Minimum).Minimum
    
    Write-Host "`n📈 Performance Metrics:" -ForegroundColor Cyan
    Write-Host "Average Response Time: $([math]::Round($avgResponseTime, 2))ms" -ForegroundColor White
    Write-Host "Fastest Response: $([math]::Round($minResponseTime, 2))ms" -ForegroundColor Green
    Write-Host "Slowest Response: $([math]::Round($maxResponseTime, 2))ms" -ForegroundColor Yellow
}

Write-Host "`n🏁 Testing completed!" -ForegroundColor Green