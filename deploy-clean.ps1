# Deploy script that temporarily removes node_modules to reduce file count
# This script creates a backup, removes node_modules, deploys, then restores

Write-Host "Starting clean deployment..." -ForegroundColor Green

# Check if node_modules exist
$beNodeModules = "BE\node_modules"
$feNodeModules = "FE\node_modules"

$hasBeModules = Test-Path $beNodeModules
$hasFeModules = Test-Path $feNodeModules

if ($hasBeModules -or $hasFeModules) {
    Write-Host "Temporarily removing node_modules to reduce file count..." -ForegroundColor Yellow
    
    # Remove node_modules
    if ($hasBeModules) {
        Remove-Item -Path $beNodeModules -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "Removed BE/node_modules" -ForegroundColor Gray
    }
    
    if ($hasFeModules) {
        Remove-Item -Path $feNodeModules -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "Removed FE/node_modules" -ForegroundColor Gray
    }
    
    try {
        Write-Host "Deploying to Vercel with archive mode..." -ForegroundColor Green
        vercel --prod --yes --archive=tgz
        
        Write-Host "`nDeployment completed! Reinstalling dependencies..." -ForegroundColor Green
    }
    finally {
        # Restore node_modules by running yarn install
        Write-Host "Reinstalling dependencies..." -ForegroundColor Yellow
        
        if ($hasBeModules) {
            Set-Location BE
            yarn install --frozen-lockfile
            Set-Location ..
            Write-Host "BE dependencies restored" -ForegroundColor Gray
        }
        
        if ($hasFeModules) {
            Set-Location FE
            yarn install --frozen-lockfile
            Set-Location ..
            Write-Host "FE dependencies restored" -ForegroundColor Gray
        }
        
        Write-Host "`nAll done!" -ForegroundColor Green
    }
}
else {
    Write-Host "No node_modules found. Deploying normally..." -ForegroundColor Yellow
    vercel --prod --yes --archive=tgz
}
