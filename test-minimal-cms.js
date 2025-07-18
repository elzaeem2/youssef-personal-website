// Simple test for minimal CMS functionality
const https = require('https');

console.log('🧪 Testing Minimal Netlify CMS Setup...\n');

async function testEndpoint(url, description) {
    return new Promise((resolve) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname,
            method: 'GET',
            timeout: 10000
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                const success = res.statusCode === 200;
                console.log(`${description}: ${success ? '✅ Working' : '❌ Failed'} (${res.statusCode})`);
                resolve({ success, statusCode: res.statusCode, data });
            });
        });

        req.on('error', (e) => {
            console.log(`${description}: ❌ Error - ${e.message}`);
            resolve({ success: false, error: e.message });
        });

        req.on('timeout', () => {
            req.destroy();
            console.log(`${description}: ❌ Timeout`);
            resolve({ success: false, error: 'timeout' });
        });

        req.end();
    });
}

async function runMinimalTest() {
    console.log('🔍 Testing Core Components:\n');
    
    // Test main site
    const siteResult = await testEndpoint('https://youssef-personal-website.netlify.app/', 'Main Website');
    
    // Test admin panel
    const adminResult = await testEndpoint('https://youssef-personal-website.netlify.app/admin/', 'Admin Panel');
    
    // Test config file accessibility
    const configResult = await testEndpoint('https://youssef-personal-website.netlify.app/admin/config.yml', 'Config File');
    
    console.log('\n📊 Test Results:');
    console.log('================');
    
    const allWorking = siteResult.success && adminResult.success && configResult.success;
    
    if (allWorking) {
        console.log('✅ All core components are working!');
        console.log('\n🎯 Next Steps:');
        console.log('1. Go to: https://youssef-personal-website.netlify.app/admin');
        console.log('2. Login with Netlify Identity');
        console.log('3. Try editing the Site Settings');
        console.log('4. Change the phone number from "+964 123 456 7890" to "+964 987 654 3210"');
        console.log('5. Save the changes');
        console.log('6. Check GitHub for a new commit within 2 minutes');
        console.log('7. If commit appears, the CMS is working! 🎉');
    } else {
        console.log('❌ Some components are not working properly');
        console.log('\n🔧 Issues found:');
        if (!siteResult.success) console.log('- Main website is not accessible');
        if (!adminResult.success) console.log('- Admin panel is not accessible');
        if (!configResult.success) console.log('- Config file is not accessible');
    }
    
    console.log('\n🔗 Important Links:');
    console.log('• Admin Panel: https://youssef-personal-website.netlify.app/admin');
    console.log('• GitHub Commits: https://github.com/elzaeem2/youssef-personal-website/commits');
    console.log('• Netlify Deploys: https://app.netlify.com/projects/youssef-personal-website/deploys');
    
    return allWorking;
}

runMinimalTest().then((success) => {
    console.log(`\n🏁 Test Complete: ${success ? 'PASSED' : 'FAILED'}`);
    if (success) {
        console.log('🎊 Minimal CMS is ready for testing!');
    }
});
