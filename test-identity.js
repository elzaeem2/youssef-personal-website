// Test script to check Netlify Identity status
const https = require('https');

const siteId = '6611010a-f470-4137-958e-8c251f4fcb9b';
const siteUrl = 'https://youssef-personal-website.netlify.app';

// Test if Identity widget loads
function testIdentityWidget() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'youssef-personal-website.netlify.app',
            port: 443,
            path: '/',
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const hasIdentityScript = data.includes('identity.netlify.com');
                console.log('✓ Identity script found in HTML:', hasIdentityScript);
                resolve(hasIdentityScript);
            });
        });

        req.on('error', (e) => {
            console.error('✗ Error testing Identity widget:', e.message);
            reject(e);
        });

        req.end();
    });
}

// Test admin page
function testAdminPage() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'youssef-personal-website.netlify.app',
            port: 443,
            path: '/admin/',
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const hasNetlifyCMS = data.includes('netlify-cms');
                console.log('✓ Admin page accessible:', res.statusCode === 200);
                console.log('✓ Netlify CMS script found:', hasNetlifyCMS);
                resolve(res.statusCode === 200 && hasNetlifyCMS);
            });
        });

        req.on('error', (e) => {
            console.error('✗ Error testing admin page:', e.message);
            reject(e);
        });

        req.end();
    });
}

// Main test function
async function runTests() {
    console.log('🧪 Testing Netlify Identity and CMS setup...\n');
    
    try {
        console.log('1. Testing Identity widget integration...');
        await testIdentityWidget();
        
        console.log('\n2. Testing admin page...');
        await testAdminPage();
        
        console.log('\n✅ All tests completed!');
        console.log('\n📋 Next steps:');
        console.log('1. Enable Identity in Netlify dashboard');
        console.log('2. Enable Git Gateway');
        console.log('3. Invite admin user: yousef.muhamed.eng22@stu.uoninevah.edu.iq');
        console.log('4. Test login at: https://youssef-personal-website.netlify.app/admin');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

runTests();
