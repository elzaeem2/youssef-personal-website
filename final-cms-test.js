// Final CMS system test after fixes
const https = require('https');
const fs = require('fs');

console.log('🎯 الاختبار النهائي لنظام CMS بعد الإصلاحات...\n');
console.log('=' .repeat(60) + '\n');

// Test configuration fixes
function testConfigurationFixes() {
    console.log('⚙️ فحص الإصلاحات المطبقة:\n');
    
    try {
        const config = fs.readFileSync('admin/config.yml', 'utf8');
        
        // Check if editorial workflow is properly disabled
        const hasEditorialWorkflow = config.includes('publish_mode: editorial_workflow');
        const isEditorialDisabled = config.includes('# publish_mode: editorial_workflow');
        
        console.log('   📋 إعدادات CMS:');
        console.log(`      Editorial Workflow: ${!hasEditorialWorkflow || isEditorialDisabled ? '✅ معطل (صحيح)' : '❌ مفعل (مشكلة!)'}`);
        console.log(`      Git Gateway: ${config.includes('name: git-gateway') ? '✅ مُعرف' : '❌ غير مُعرف'}`);
        console.log(`      Backend: ${config.includes('backend:') ? '✅ مُعرف' : '❌ غير مُعرف'}`);
        
        return !hasEditorialWorkflow || isEditorialDisabled;
    } catch (error) {
        console.log(`   ❌ خطأ في قراءة الإعدادات: ${error.message}`);
        return false;
    }
}

// Test service availability
async function testServiceAvailability() {
    console.log('\n🌐 فحص توفر الخدمات:\n');
    
    const services = [
        { name: 'الموقع الرئيسي', url: 'https://youssef-personal-website.netlify.app/', critical: true },
        { name: 'صفحة الإدارة', url: 'https://youssef-personal-website.netlify.app/admin/', critical: true },
        { name: 'Netlify Identity', url: 'https://youssef-personal-website.netlify.app/.netlify/identity', critical: false },
        { name: 'Git Gateway', url: 'https://youssef-personal-website.netlify.app/.netlify/git/github', critical: false }
    ];
    
    const results = {};
    
    for (const service of services) {
        try {
            const available = await testServiceEndpoint(service.url);
            results[service.name] = available;
            
            const status = available ? '✅ متاح' : (service.critical ? '❌ غير متاح (حرج!)' : '⚠️ غير متاح (يحتاج تفعيل)');
            console.log(`   ${service.name}: ${status}`);
        } catch (error) {
            results[service.name] = false;
            console.log(`   ${service.name}: ❌ خطأ في الاتصال`);
        }
    }
    
    return results;
}

function testServiceEndpoint(url) {
    return new Promise((resolve) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname,
            method: 'GET',
            timeout: 8000
        };

        const req = https.request(options, (res) => {
            resolve(res.statusCode === 200);
        });

        req.on('error', () => resolve(false));
        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

// Test GitHub integration
function testGitHubIntegration() {
    return new Promise((resolve) => {
        console.log('\n📂 فحص تكامل GitHub:\n');
        
        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: '/repos/elzaeem2/youssef-personal-website/commits?per_page=3',
            method: 'GET',
            headers: {
                'User-Agent': 'Final-CMS-Test'
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
                    console.log(`   📝 آخر ${commits.length} تحديثات:`);
                    
                    commits.forEach((commit, index) => {
                        const date = new Date(commit.commit.author.date);
                        const message = commit.commit.message.split('\n')[0];
                        const sha = commit.sha.substring(0, 7);
                        
                        console.log(`      ${index + 1}. [${sha}] ${date.toLocaleString('ar-EG')}`);
                        console.log(`         ${message.substring(0, 70)}...`);
                    });
                    
                    // Check if recent commits include CMS fixes
                    const recentMessages = commits.map(c => c.commit.message.toLowerCase());
                    const hasCMSFixes = recentMessages.some(msg => 
                        msg.includes('cms') || 
                        msg.includes('editorial') || 
                        msg.includes('workflow') ||
                        msg.includes('fix')
                    );
                    
                    console.log(`\n   🔧 تحديثات CMS حديثة: ${hasCMSFixes ? '✅ موجودة' : '⚠️ غير موجودة'}`);
                    
                    resolve({ working: true, hasRecentFixes: hasCMSFixes });
                } catch (error) {
                    console.log(`   ❌ خطأ في تحليل البيانات: ${error.message}`);
                    resolve({ working: false, hasRecentFixes: false });
                }
            });
        });

        req.on('error', (e) => {
            console.log(`   ❌ خطأ في الاتصال: ${e.message}`);
            resolve({ working: false, hasRecentFixes: false });
        });

        req.end();
    });
}

// Generate final assessment
function generateFinalAssessment(configFixed, servicesResults, githubResults) {
    console.log('\n📊 التقييم النهائي لحالة النظام:');
    console.log('=' .repeat(50));
    
    const criticalIssues = [];
    const minorIssues = [];
    const recommendations = [];
    
    // Check configuration
    if (!configFixed) {
        criticalIssues.push('إعدادات CMS لا تزال تحتاج إصلاح');
        recommendations.push('تأكد من تعطيل Editorial Workflow في admin/config.yml');
    }
    
    // Check critical services
    if (!servicesResults['الموقع الرئيسي']) {
        criticalIssues.push('الموقع الرئيسي غير متاح');
        recommendations.push('تحقق من حالة النشر في Netlify');
    }
    
    if (!servicesResults['صفحة الإدارة']) {
        criticalIssues.push('صفحة الإدارة غير متاحة');
        recommendations.push('تحقق من نشر ملفات admin/ على الموقع');
    }
    
    // Check optional services
    if (!servicesResults['Netlify Identity']) {
        minorIssues.push('Netlify Identity غير مفعل');
        recommendations.push('فعل Netlify Identity في لوحة تحكم Netlify');
    }
    
    if (!servicesResults['Git Gateway']) {
        minorIssues.push('Git Gateway غير مفعل');
        recommendations.push('فعل Git Gateway وربطه بـ GitHub');
    }
    
    // Check GitHub
    if (!githubResults.working) {
        criticalIssues.push('مشكلة في تكامل GitHub');
        recommendations.push('تحقق من إعدادات Repository في Netlify');
    }
    
    // Display results
    console.log(`\n🚨 المشاكل الحرجة: ${criticalIssues.length}`);
    criticalIssues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ❌ ${issue}`);
    });
    
    console.log(`\n⚠️ المشاكل الثانوية: ${minorIssues.length}`);
    minorIssues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ⚠️ ${issue}`);
    });
    
    if (recommendations.length > 0) {
        console.log(`\n🔧 التوصيات:`);
        recommendations.forEach((rec, index) => {
            console.log(`   ${index + 1}. ${rec}`);
        });
    }
    
    // Overall status
    console.log('\n🎯 الحالة العامة للنظام:');
    
    if (criticalIssues.length === 0 && minorIssues.length === 0) {
        console.log('   🎉 النظام يعمل بشكل مثالي!');
        console.log('   ✅ جميع الخدمات متاحة ومفعلة');
        console.log('   🚀 يمكنك الآن استخدام CMS بدون مشاكل');
        return 'perfect';
    } else if (criticalIssues.length === 0) {
        console.log('   ✅ النظام يعمل بشكل أساسي');
        console.log('   ⚠️ بعض الخدمات تحتاج تفعيل للوظائف الكاملة');
        console.log('   🔄 التحديثات قد تحتاج تفعيل Identity و Gateway');
        return 'functional';
    } else {
        console.log('   ❌ النظام يحتاج إصلاحات حرجة');
        console.log('   🔧 اتبع التوصيات أعلاه قبل الاستخدام');
        return 'needs_fixes';
    }
}

// Main test function
async function runFinalTest() {
    console.log('🚀 بدء الاختبار النهائي لنظام CMS\n');
    
    // Step 1: Test configuration fixes
    const configFixed = testConfigurationFixes();
    
    // Step 2: Test service availability
    const servicesResults = await testServiceAvailability();
    
    // Step 3: Test GitHub integration
    const githubResults = await testGitHubIntegration();
    
    // Step 4: Generate final assessment
    const status = generateFinalAssessment(configFixed, servicesResults, githubResults);
    
    // Step 5: Provide next steps
    console.log('\n🎯 الخطوات التالية:');
    
    if (status === 'perfect') {
        console.log('   1. اذهب إلى لوحة الإدارة وجرب تحديث أي محتوى');
        console.log('   2. انتظر 2-5 دقائق وتحقق من ظهور التحديث على الموقع');
        console.log('   3. إذا ظهر التحديث، فالنظام يعمل بشكل مثالي!');
    } else if (status === 'functional') {
        console.log('   1. فعل Netlify Identity و Git Gateway أولاً');
        console.log('   2. أعد تشغيل هذا الاختبار للتأكد');
        console.log('   3. جرب تحديث المحتوى بعد التفعيل');
    } else {
        console.log('   1. اتبع التوصيات المذكورة أعلاه');
        console.log('   2. أعد تشغيل الاختبار بعد الإصلاحات');
        console.log('   3. راجع دليل استكشاف الأخطاء للمساعدة');
    }
    
    console.log('\n🔗 روابط سريعة:');
    console.log('   • لوحة الإدارة: https://youssef-personal-website.netlify.app/admin');
    console.log('   • إعدادات Identity: https://app.netlify.com/projects/youssef-personal-website/settings/identity');
    console.log('   • دليل استكشاف الأخطاء: CMS_TROUBLESHOOTING_GUIDE.md');
    
    console.log('\n🏁 انتهى الاختبار النهائي');
    return status;
}

runFinalTest().then((status) => {
    console.log(`\n📋 النتيجة النهائية: ${status.toUpperCase()}`);
    
    if (status === 'perfect') {
        console.log('🎊 تهانينا! نظام CMS جاهز للاستخدام بالكامل');
    } else {
        console.log('🔧 يرجى إكمال الإصلاحات المطلوبة');
    }
});
