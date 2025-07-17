# PowerShell script to complete Netlify Identity setup
# This script provides instructions and automates what's possible

Write-Host "🚀 Netlify Identity Setup Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

$siteId = "6611010a-f470-4137-958e-8c251f4fcb9b"
$siteName = "youssef-personal-website"
$adminEmail = "yousef.muhamed.eng22@stu.uoninevah.edu.iq"

Write-Host "📋 Site Information:" -ForegroundColor Yellow
Write-Host "Site ID: $siteId"
Write-Host "Site Name: $siteName"
Write-Host "Admin Email: $adminEmail"
Write-Host ""

Write-Host "🔧 Required Manual Steps:" -ForegroundColor Cyan
Write-Host "1. Enable Netlify Identity"
Write-Host "2. Enable Git Gateway"
Write-Host "3. Invite admin user"
Write-Host ""

# Step 1: Open Identity settings
Write-Host "Step 1: Opening Identity settings..." -ForegroundColor Green
$identityUrl = "https://app.netlify.com/projects/$siteName/settings/identity"
Write-Host "Opening: $identityUrl"
Start-Process $identityUrl

Write-Host ""
Write-Host "⏳ Please complete the following in the opened browser tab:" -ForegroundColor Yellow
Write-Host "1. Click 'Enable Identity'"
Write-Host "2. Set Registration to 'Invite only'"
Write-Host "3. Go to Services tab and click 'Enable Git Gateway'"
Write-Host "4. Authorize GitHub connection"
Write-Host ""

# Wait for user confirmation
Read-Host "Press Enter after completing Identity and Git Gateway setup..."

Write-Host ""
Write-Host "Step 2: Testing Identity setup..." -ForegroundColor Green

# Test if Identity is enabled
try {
    $response = Invoke-WebRequest -Uri "https://$siteName.netlify.app/.netlify/identity" -Method GET -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Identity endpoint is accessible" -ForegroundColor Green
    } else {
        Write-Host "❌ Identity endpoint not accessible" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Identity not enabled yet" -ForegroundColor Red
}

Write-Host ""
Write-Host "Step 3: Opening admin page for testing..." -ForegroundColor Green
$adminUrl = "https://$siteName.netlify.app/admin"
Write-Host "Opening: $adminUrl"
Start-Process $adminUrl

Write-Host ""
Write-Host "📧 Don't forget to invite the admin user:" -ForegroundColor Yellow
Write-Host "1. Go to Identity tab in Netlify dashboard"
Write-Host "2. Click 'Invite users'"
Write-Host "3. Enter: $adminEmail"
Write-Host "4. Click 'Send invite'"
Write-Host ""

Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "Your website is ready at: https://$siteName.netlify.app"
Write-Host "Admin panel: https://$siteName.netlify.app/admin"
Write-Host ""
Write-Host "📚 Check the CMS_USER_GUIDE.md file for detailed usage instructions."
