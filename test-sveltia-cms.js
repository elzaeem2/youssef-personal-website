// Comprehensive test for Sveltia CMS implementation
const https = require('https');

console.log('🚀 Testing Sveltia CMS Implementation...\n');

async function testEndpoint(url, description) {
    return new Promise((resolve) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname,
            method: 'GET',
            timeout: 15000
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

async function checkSveltiaCMSLoading(url, description) {
    return new Promise((resolve) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname,
            method: 'GET',
            timeout: 15000
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                const success = res.statusCode === 200;
                const hasSveltia = data.includes('sveltia-cms.js');
                const hasNetlify = data.includes('netlify-cms.js');
                
                console.log(`${description}: ${success ? '✅ Accessible' : '❌ Failed'} (${res.statusCode})`);
                if (success) {
                    console.log(`  - Sveltia CMS Script: ${hasSveltia ? '✅ Found' : '❌ Missing'}`);
                    console.log(`  - Old Netlify CMS: ${hasNetlify ? '⚠️ Still Present' : '✅ Removed'}`);
                }
                resolve({ success, statusCode: res.statusCode, hasSveltia, hasNetlify, data });
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

async function runSveltiaCMSTest() {
    console.log('🔍 Testing Sveltia CMS Implementation:\n');
    
    // Test main site
    const siteResult = await testEndpoint('https://youssef-personal-website.netlify.app/', 'Main Website');
    
    // Test admin panel with Sveltia CMS check
    const adminResult = await checkSveltiaCMSLoading('https://youssef-personal-website.netlify.app/admin/', 'Admin Panel (Sveltia CMS)');
    
    // Test config file
    const configResult = await testEndpoint('https://youssef-personal-website.netlify.app/admin/config.yml', 'Config File');
    
    // Test Sveltia CMS CDN
    const sveltiaCDNResult = await testEndpoint('https://unpkg.com/@sveltia/cms@latest/dist/sveltia-cms.js', 'Sveltia CMS CDN');
    
    console.log('\n📊 Test Results:');
    console.log('================');
    
    const coreWorking = siteResult.success && adminResult.success && configResult.success;
    const sveltiaCMSProperlyLoaded = adminResult.hasSveltia && !adminResult.hasNetlify;
    const cdnWorking = sveltiaCDNResult.success;
    
    if (coreWorking && sveltiaCMSProperlyLoaded && cdnWorking) {
        console.log('🎉 Sveltia CMS implementation is SUCCESSFUL!');
        console.log('\n✅ All Systems Working:');
        console.log('  • Main website is accessible');
        console.log('  • Admin panel loads correctly');
        console.log('  • Sveltia CMS script is properly loaded');
        console.log('  • Old Netlify CMS has been removed');
        console.log('  • Configuration file is accessible');
        console.log('  • Sveltia CMS CDN is working');
        
        console.log('\n🎯 Ready for Testing:');
        console.log('1. Go to: https://youssef-personal-website.netlify.app/admin');
        console.log('2. Login with Netlify Identity');
        console.log('3. You should see the modern Sveltia CMS interface');
        console.log('4. Try editing Site Settings');
        console.log('5. Change phone number to test functionality');
        console.log('6. Save and check GitHub for commits');
        
        console.log('\n🌟 Expected Improvements:');
        console.log('  • Modern, clean interface with dark mode');
        console.log('  • Faster loading and better performance');
        console.log('  • Mobile and tablet support');
        console.log('  • Better reliability and fewer errors');
        console.log('  • Enhanced user experience');
        
    } else {
        console.log('❌ Issues found with Sveltia CMS implementation');
        console.log('\n🔧 Problems detected:');
        if (!siteResult.success) console.log('  • Main website is not accessible');
        if (!adminResult.success) console.log('  • Admin panel is not accessible');
        if (!adminResult.hasSveltia) console.log('  • Sveltia CMS script is not loaded');
        if (adminResult.hasNetlify) console.log('  • Old Netlify CMS script is still present');
        if (!configResult.success) console.log('  • Config file is not accessible');
        if (!cdnWorking) console.log('  • Sveltia CMS CDN is not working');
    }
    
    console.log('\n🔗 Important Links:');
    console.log('• Sveltia CMS Admin: https://youssef-personal-website.netlify.app/admin');
    console.log('• GitHub Repository: https://github.com/elzaeem2/youssef-personal-website');
    console.log('• GitHub Commits: https://github.com/elzaeem2/youssef-personal-website/commits');
    console.log('• Netlify Deploys: https://app.netlify.com/projects/youssef-personal-website/deploys');
    console.log('• Sveltia CMS Docs: https://github.com/sveltia/sveltia-cms');
    
    return coreWorking && sveltiaCMSProperlyLoaded && cdnWorking;
}

runSveltiaCMSTest().then((success) => {
    console.log(`\n🏁 Sveltia CMS Test: ${success ? '✅ PASSED' : '❌ FAILED'}`);
    if (success) {
        console.log('🎊 Sveltia CMS is ready! Enjoy the modern CMS experience!');
    } else {
        console.log('🔧 Please check the issues above and retry.');
    }
});
