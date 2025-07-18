// Comprehensive script to diagnose Netlify CMS update issues
const https = require('https');
const fs = require('fs');

console.log('🔍 تشخيص مشاكل تحديث Netlify CMS...\n');
console.log('=' .repeat(60) + '\n');

// Test Netlify Identity status
function testNetlifyIdentity() {
    return new Promise((resolve) => {
        console.log('🔐 فحص حالة Netlify Identity:\n');
        
        const options = {
            hostname: 'youssef-personal-website.netlify.app',
            port: 443,
            path: '/.netlify/identity',
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                const identityWorking = res.statusCode === 200;
                console.log(`   الحالة: ${identityWorking ? '✅ مفعل' : '❌ غير مفعل'}`);
                console.log(`   كود الاستجابة: ${res.statusCode}`);
                console.log(`   حجم البيانات: ${data.length} bytes`);
                
                if (identityWorking) {
                    try {
                        const identityData = JSON.parse(data);
                        console.log(`   الإعدادات: ${JSON.stringify(identityData, null, 2)}`);
                    } catch (e) {
                        console.log(`   البيانات: ${data.substring(0, 200)}...`);
                    }
                }
                
                resolve(identityWorking);
            });
        });

        req.on('error', (e) => {
            console.log(`   ❌ خطأ: ${e.message}`);
            resolve(false);
        });

        req.end();
    });
}

// Test Git Gateway status
function testGitGateway() {
    return new Promise((resolve) => {
        console.log('\n🔗 فحص حالة Git Gateway:\n');
        
        const options = {
            hostname: 'youssef-personal-website.netlify.app',
            port: 443,
            path: '/.netlify/git/github',
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                const gatewayWorking = res.statusCode === 200;
                console.log(`   الحالة: ${gatewayWorking ? '✅ يعمل' : '❌ لا يعمل'}`);
                console.log(`   كود الاستجابة: ${res.statusCode}`);
                console.log(`   حجم البيانات: ${data.length} bytes`);
                
                if (data.length > 0) {
                    console.log(`   البيانات: ${data.substring(0, 200)}...`);
                }
                
                resolve(gatewayWorking);
            });
        });

        req.on('error', (e) => {
            console.log(`   ❌ خطأ: ${e.message}`);
            resolve(false);
        });

        req.end();
    });
}

// Test CMS admin page
function testCMSAdminPage() {
    return new Promise((resolve) => {
        console.log('\n📋 فحص صفحة إدارة CMS:\n');
        
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
                const adminWorking = res.statusCode === 200;
                console.log(`   الحالة: ${adminWorking ? '✅ متاحة' : '❌ غير متاحة'}`);
                console.log(`   كود الاستجابة: ${res.statusCode}`);
                console.log(`   حجم الصفحة: ${(data.length / 1024).toFixed(2)} KB`);
                
                // Check for important CMS components
                const hasNetlifyCMS = data.includes('netlify-cms');
                const hasConfig = data.includes('config.yml');
                const hasIdentityWidget = data.includes('netlify-identity-widget');
                
                console.log(`   يحتوي على Netlify CMS: ${hasNetlifyCMS ? '✅' : '❌'}`);
                console.log(`   يحتوي على Config: ${hasConfig ? '✅' : '❌'}`);
                console.log(`   يحتوي على Identity Widget: ${hasIdentityWidget ? '✅' : '❌'}`);
                
                resolve({
                    working: adminWorking,
                    hasNetlifyCMS,
                    hasConfig,
                    hasIdentityWidget
                });
            });
        });

        req.on('error', (e) => {
            console.log(`   ❌ خطأ: ${e.message}`);
            resolve({ working: false });
        });

        req.end();
    });
}

// Check CMS configuration file
function checkCMSConfig() {
    console.log('\n⚙️ فحص ملف إعدادات CMS:\n');
    
    try {
        const configPath = 'admin/config.yml';
        if (!fs.existsSync(configPath)) {
            console.log('   ❌ ملف config.yml غير موجود');
            return false;
        }
        
        const configContent = fs.readFileSync(configPath, 'utf8');
        console.log(`   ✅ ملف config.yml موجود (${(configContent.length / 1024).toFixed(2)} KB)`);
        
        // Check important configuration elements
        const hasBackend = configContent.includes('backend:');
        const hasGitGateway = configContent.includes('name: git-gateway');
        const hasCollections = configContent.includes('collections:');
        const hasPublishMode = configContent.includes('publish_mode:');
        
        console.log(`   Backend مُعرف: ${hasBackend ? '✅' : '❌'}`);
        console.log(`   Git Gateway مُعرف: ${hasGitGateway ? '✅' : '❌'}`);
        console.log(`   Collections مُعرفة: ${hasCollections ? '✅' : '❌'}`);
        console.log(`   Publish Mode مُعرف: ${hasPublishMode ? '✅' : '❌'}`);
        
        // Check publish mode specifically
        if (hasPublishMode) {
            const publishModeMatch = configContent.match(/publish_mode:\s*(\w+)/);
            if (publishModeMatch) {
                const publishMode = publishModeMatch[1];
                console.log(`   وضع النشر: ${publishMode}`);
                
                if (publishMode === 'editorial_workflow') {
                    console.log('   ⚠️ تحذير: وضع Editorial Workflow مفعل - قد يتطلب موافقة يدوية');
                }
            }
        }
        
        return true;
    } catch (error) {
        console.log(`   ❌ خطأ في قراءة الملف: ${error.message}`);
        return false;
    }
}

// Check recent GitHub commits
function checkRecentCommits() {
    return new Promise((resolve) => {
        console.log('\n📝 فحص آخر التحديثات في GitHub:\n');
        
        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: '/repos/elzaeem2/youssef-personal-website/commits?per_page=5',
            method: 'GET',
            headers: {
                'User-Agent': 'CMS-Diagnostic-Tool'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const commits = JSON.parse(data);
                    console.log(`   آخر ${commits.length} تحديثات:`);
                    
                    commits.forEach((commit, index) => {
                        const date = new Date(commit.commit.author.date);
                        const message = commit.commit.message.split('\n')[0];
                        console.log(`   ${index + 1}. ${date.toLocaleString('ar-EG')} - ${message.substring(0, 60)}...`);
                    });
                    
                    resolve(commits);
                } catch (error) {
                    console.log(`   ❌ خطأ في تحليل البيانات: ${error.message}`);
                    resolve([]);
                }
            });
        });

        req.on('error', (e) => {
            console.log(`   ❌ خطأ في الاتصال: ${e.message}`);
            resolve([]);
        });

        req.end();
    });
}

// Check Netlify deploy status
function checkNetlifyDeploys() {
    return new Promise((resolve) => {
        console.log('\n🚀 فحص حالة النشر في Netlify:\n');
        
        // This would require Netlify API token, so we'll check the site status instead
        const options = {
            hostname: 'youssef-personal-website.netlify.app',
            port: 443,
            path: '/',
            method: 'HEAD'
        };

        const req = https.request(options, (res) => {
            console.log(`   حالة الموقع: ${res.statusCode === 200 ? '✅ متاح' : '❌ غير متاح'}`);
            console.log(`   آخر تعديل: ${res.headers['last-modified'] || 'غير محدد'}`);
            console.log(`   Cache Control: ${res.headers['cache-control'] || 'غير محدد'}`);
            console.log(`   Server: ${res.headers['server'] || 'غير محدد'}`);
            
            resolve(res.statusCode === 200);
        });

        req.on('error', (e) => {
            console.log(`   ❌ خطأ: ${e.message}`);
            resolve(false);
        });

        req.end();
    });
}

// Main diagnostic function
async function runDiagnostics() {
    console.log('🏥 بدء التشخيص الشامل لمشاكل Netlify CMS\n');
    
    // Step 1: Check CMS configuration
    const configValid = checkCMSConfig();
    
    // Step 2: Test Netlify Identity
    const identityWorking = await testNetlifyIdentity();
    
    // Step 3: Test Git Gateway
    const gatewayWorking = await testGitGateway();
    
    // Step 4: Test CMS admin page
    const adminStatus = await testCMSAdminPage();
    
    // Step 5: Check recent commits
    const recentCommits = await checkRecentCommits();
    
    // Step 6: Check Netlify deploy status
    const siteWorking = await checkNetlifyDeploys();
    
    // Generate diagnostic report
    console.log('\n📊 تقرير التشخيص النهائي:');
    console.log('=' .repeat(50));
    
    const issues = [];
    const recommendations = [];
    
    if (!configValid) {
        issues.push('ملف إعدادات CMS غير صحيح أو مفقود');
        recommendations.push('تحقق من وجود ملف admin/config.yml وصحة تنسيقه');
    }
    
    if (!identityWorking) {
        issues.push('Netlify Identity غير مفعل أو لا يعمل بشكل صحيح');
        recommendations.push('فعل Netlify Identity في لوحة تحكم Netlify');
    }
    
    if (!gatewayWorking) {
        issues.push('Git Gateway غير مفعل أو لا يعمل بشكل صحيح');
        recommendations.push('فعل Git Gateway وربطه بـ GitHub في إعدادات Netlify');
    }
    
    if (!adminStatus.working) {
        issues.push('صفحة إدارة CMS غير متاحة');
        recommendations.push('تحقق من نشر ملفات admin/ على الموقع');
    }
    
    if (recentCommits.length === 0) {
        issues.push('لا توجد تحديثات حديثة في GitHub');
        recommendations.push('تحقق من اتصال CMS بـ GitHub');
    }
    
    if (!siteWorking) {
        issues.push('الموقع غير متاح');
        recommendations.push('تحقق من حالة النشر في Netlify');
    }
    
    console.log(`\n🔍 المشاكل المكتشفة (${issues.length}):`);
    issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ❌ ${issue}`);
    });
    
    console.log(`\n💡 التوصيات (${recommendations.length}):`);
    recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. 🔧 ${rec}`);
    });
    
    console.log('\n🎯 الخطوات التالية:');
    if (issues.length === 0) {
        console.log('   ✅ لم يتم اكتشاف مشاكل واضحة');
        console.log('   🔄 قد تكون المشكلة في التوقيت أو Cache');
        console.log('   ⏱️ جرب الانتظار 5-10 دقائق بعد التحديث');
    } else {
        console.log('   🔧 اتبع التوصيات أعلاه لحل المشاكل');
        console.log('   🔄 أعد تشغيل التشخيص بعد تطبيق الحلول');
    }
    
    console.log('\n📞 للمساعدة الإضافية:');
    console.log('   📖 راجع دليل استكشاف الأخطاء');
    console.log('   🌐 تحقق من حالة خدمات Netlify: https://www.netlifystatus.com/');
    
    return {
        configValid,
        identityWorking,
        gatewayWorking,
        adminWorking: adminStatus.working,
        siteWorking,
        issuesCount: issues.length
    };
}

// Run diagnostics
runDiagnostics().then((results) => {
    console.log('\n🏁 انتهى التشخيص');
    process.exit(results.issuesCount > 0 ? 1 : 0);
});
