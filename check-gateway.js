// Script to check Git Gateway status
const https = require('https');

const siteId = '6611010a-f470-4137-958e-8c251f4fcb9b';
const siteName = 'youssef-personal-website';

console.log('🔍 Checking Git Gateway status...\n');

// Test Git Gateway endpoint
function testGitGateway() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: siteName + '.netlify.app',
            port: 443,
            path: '/.netlify/git/github',
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            console.log('Git Gateway Status:', res.statusCode);
            if (res.statusCode === 200) {
                console.log('✅ Git Gateway is working correctly');
                resolve(true);
            } else if (res.statusCode === 404) {
                console.log('❌ Git Gateway not enabled');
                resolve(false);
            } else {
                console.log('⚠️ Git Gateway status unclear:', res.statusCode);
                resolve(false);
            }
        });

        req.on('error', (e) => {
            console.log('❌ Error testing Git Gateway:', e.message);
            resolve(false);
        });

        req.end();
    });
}

// Test Identity endpoint
function testIdentity() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: siteName + '.netlify.app',
            port: 443,
            path: '/.netlify/identity',
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            console.log('Identity Status:', res.statusCode);
            if (res.statusCode === 200) {
                console.log('✅ Netlify Identity is enabled');
                resolve(true);
            } else {
                console.log('❌ Netlify Identity not enabled');
                resolve(false);
            }
        });

        req.on('error', (e) => {
            console.log('❌ Error testing Identity:', e.message);
            resolve(false);
        });

        req.end();
    });
}

// Main check function
async function checkStatus() {
    console.log('Site:', `https://${siteName}.netlify.app`);
    console.log('Admin:', `https://${siteName}.netlify.app/admin`);
    console.log('');

    const identityWorking = await testIdentity();
    const gatewayWorking = await testGitGateway();

    console.log('\n📋 Summary:');
    console.log('Identity:', identityWorking ? '✅ Enabled' : '❌ Not enabled');
    console.log('Git Gateway:', gatewayWorking ? '✅ Working' : '❌ Not working');

    if (!identityWorking) {
        console.log('\n🔧 To fix:');
        console.log('1. Go to: https://app.netlify.com/projects/' + siteName + '/settings/identity');
        console.log('2. Click "Enable Identity"');
    }

    if (!gatewayWorking) {
        console.log('\n🔧 To fix Git Gateway:');
        console.log('1. Go to: https://app.netlify.com/projects/' + siteName + '/settings/identity#services');
        console.log('2. Click "Enable Git Gateway"');
        console.log('3. Authorize GitHub connection');
    }

    if (identityWorking && gatewayWorking) {
        console.log('\n🎉 Everything is working! You can now use the admin panel.');
        console.log('Admin URL: https://' + siteName + '.netlify.app/admin');
    }
}

checkStatus();
