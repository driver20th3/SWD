# Deploy script for Vercel with archive mode
# This reduces the number of files uploaded by creating a tar.gz archive first

Write-Host "Deploying to Vercel with archive mode (tgz)..." -ForegroundColor Green
Write-Host "This will reduce upload time and avoid the 5000 file limit." -ForegroundColor Yellow

vercel --prod --yes --archive=tgz
