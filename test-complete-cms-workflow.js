// Complete CMS workflow testing script
const https = require('https');
const fs = require('fs');

console.log('🔄 اختبار العملية الكاملة لتحديث المحتوى...\n');
console.log('=' .repeat(60) + '\n');

// Test current CMS configuration
function testCurrentConfig() {
    console.log('⚙️ فحص الإعدادات الحالية:\n');
    
    try {
        const config = fs.readFileSync('admin/config.yml', 'utf8');
        
        // Check if editorial workflow is disabled
        const hasEditorialWorkflow = config.includes('publish_mode: editorial_workflow');
        const isEditorialDisabled = config.includes('# publish_mode: editorial_workflow');
        
        console.log(`   Editorial Workflow: ${hasEditorialWorkflow && !isEditorialDisabled ? '❌ مفعل (مشكلة!)' : '✅ معطل'}`);
        console.log(`   Git Gateway: ${config.includes('name: git-gateway') ? '✅ مُعرف' : '❌ غير مُعرف'}`);
        console.log(`   Collections: ${config.includes('collections:') ? '✅ موجودة' : '❌ مفقودة'}`);
        
        return !hasEditorialWorkflow || isEditorialDisabled;
    } catch (error) {
        console.log(`   ❌ خطأ في قراءة الإعدادات: ${error.message}`);
        return false;
    }
}

// Test all CMS services
async function testCMSServices() {
    console.log('\n🔍 فحص خدمات CMS:\n');
    
    const services = [
        { name: 'الموقع الرئيسي', url: 'https://youssef-personal-website.netlify.app/' },
        { name: 'صفحة الإدارة', url: 'https://youssef-personal-website.netlify.app/admin/' },
        { name: 'Netlify Identity', url: 'https://youssef-personal-website.netlify.app/.netlify/identity' },
        { name: 'Git Gateway', url: 'https://youssef-personal-website.netlify.app/.netlify/git/github' }
    ];
    
    const results = {};
    
    for (const service of services) {
        try {
            const result = await testService(service.url);
            results[service.name] = result;
            console.log(`   ${service.name}: ${result ? '✅' : '❌'}`);
        } catch (error) {
            results[service.name] = false;
            console.log(`   ${service.name}: ❌ خطأ`);
        }
    }
    
    return results;
}

function testService(url) {
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
            path: '/repos/elzaeem2/youssef-personal-website/commits?per_page=1',
            method: 'GET',
            headers: {
                'User-Agent': 'CMS-Workflow-Test'
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
                    if (commits.length > 0) {
                        const lastCommit = commits[0];
                        const date = new Date(lastCommit.commit.author.date);
                        const message = lastCommit.commit.message.split('\n')[0];
                        
                        console.log(`   آخر تحديث: ${date.toLocaleString('ar-EG')}`);
                        console.log(`   الرسالة: ${message.substring(0, 60)}...`);
                        console.log(`   SHA: ${lastCommit.sha.substring(0, 7)}`);
                        console.log(`   حالة GitHub: ✅ متصل`);
                        
                        resolve(true);
                    } else {
                        console.log(`   حالة GitHub: ❌ لا توجد تحديثات`);
                        resolve(false);
                    }
                } catch (error) {
                    console.log(`   حالة GitHub: ❌ خطأ في التحليل`);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.log(`   حالة GitHub: ❌ خطأ في الاتصال`);
            resolve(false);
        });

        req.end();
    });
}

// Simulate CMS update workflow
function simulateWorkflow() {
    console.log('\n🎯 محاكاة سير عمل التحديث:\n');
    
    console.log('   1. المستخدم يذهب إلى لوحة الإدارة ✅');
    console.log('   2. المستخدم يسجل دخوله بـ Netlify Identity');
    console.log('   3. المستخدم يحدث المحتوى في أي قسم');
    console.log('   4. المستخدم يضغط "حفظ" أو "نشر"');
    console.log('   5. CMS يرسل التحديث إلى GitHub عبر Git Gateway');
    console.log('   6. GitHub يستقبل التحديث ويحفظه في المستودع');
    console.log('   7. Netlify يستقبل إشعار من GitHub (Webhook)');
    console.log('   8. Netlify يبدأ عملية البناء والنشر التلقائي');
    console.log('   9. الموقع المحدث يصبح متاحاً للزوار');
    
    console.log('\n   ⏱️ الوقت المتوقع للعملية الكاملة: 2-5 دقائق');
}

// Generate comprehensive report
function generateReport(configOK, servicesResults, githubOK) {
    console.log('\n📊 تقرير شامل لحالة النظام:');
    console.log('=' .repeat(50));
    
    const issues = [];
    const solutions = [];
    
    // Check configuration
    if (!configOK) {
        issues.push('إعدادات CMS غير صحيحة');
        solutions.push('تحقق من ملف admin/config.yml وتأكد من تعطيل Editorial Workflow');
    }
    
    // Check services
    Object.entries(servicesResults).forEach(([service, working]) => {
        if (!working) {
            if (service === 'Netlify Identity') {
                issues.push('Netlify Identity غير مفعل');
                solutions.push('فعل Netlify Identity في لوحة تحكم Netlify');
            } else if (service === 'Git Gateway') {
                issues.push('Git Gateway غير مفعل');
                solutions.push('فعل Git Gateway وربطه بـ GitHub في إعدادات Netlify');
            } else {
                issues.push(`${service} غير متاح`);
                solutions.push(`تحقق من حالة ${service}`);
            }
        }
    });
    
    // Check GitHub
    if (!githubOK) {
        issues.push('مشكلة في تكامل GitHub');
        solutions.push('تحقق من إعدادات Repository في Netlify');
    }
    
    console.log(`\n🔍 المشاكل المكتشفة: ${issues.length}`);
    if (issues.length > 0) {
        issues.forEach((issue, index) => {
            console.log(`   ${index + 1}. ❌ ${issue}`);
        });
        
        console.log(`\n🔧 الحلول المقترحة:`);
        solutions.forEach((solution, index) => {
            console.log(`   ${index + 1}. ${solution}`);
        });
    } else {
        console.log('   ✅ لم يتم اكتشاف مشاكل واضحة');
    }
    
    console.log('\n🎯 حالة النظام العامة:');
    if (issues.length === 0) {
        console.log('   ✅ النظام جاهز للاستخدام');
        console.log('   🔄 التحديثات يجب أن تظهر خلال 2-5 دقائق');
        console.log('   💡 إذا لم تظهر التحديثات، امسح cache المتصفح');
    } else if (issues.length <= 2) {
        console.log('   ⚠️ النظام يحتاج إصلاحات بسيطة');
        console.log('   🔧 اتبع الحلول المقترحة أعلاه');
    } else {
        console.log('   ❌ النظام يحتاج إصلاحات شاملة');
        console.log('   📞 قد تحتاج مساعدة تقنية متخصصة');
    }
    
    return issues.length;
}

// Main test function
async function runCompleteTest() {
    console.log('🚀 بدء الاختبار الشامل لسير عمل CMS\n');
    
    // Step 1: Test configuration
    const configOK = testCurrentConfig();
    
    // Step 2: Test all services
    const servicesResults = await testCMSServices();
    
    // Step 3: Test GitHub integration
    const githubOK = await testGitHubIntegration();
    
    // Step 4: Simulate workflow
    simulateWorkflow();
    
    // Step 5: Generate report
    const issuesCount = generateReport(configOK, servicesResults, githubOK);
    
    console.log('\n🔗 روابط مفيدة للإصلاح:');
    console.log('   • لوحة تحكم Netlify: https://app.netlify.com/projects/youssef-personal-website');
    console.log('   • إعدادات Identity: https://app.netlify.com/projects/youssef-personal-website/settings/identity');
    console.log('   • سجل النشر: https://app.netlify.com/projects/youssef-personal-website/deploys');
    console.log('   • لوحة الإدارة: https://youssef-personal-website.netlify.app/admin');
    
    console.log('\n🏁 انتهى الاختبار الشامل');
    return issuesCount === 0;
}

runCompleteTest().then((success) => {
    if (success) {
        console.log('\n🎉 النظام جاهز! يمكنك الآن تحديث المحتوى من لوحة الإدارة');
    } else {
        console.log('\n⚠️ يرجى إصلاح المشاكل المذكورة أعلاه أولاً');
    }
});
