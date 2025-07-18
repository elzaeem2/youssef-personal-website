// Test auto-deploy settings and GitHub integration
const https = require('https');

console.log('🚀 فحص إعدادات النشر التلقائي...\n');

// Test GitHub repository access
function testGitHubRepo() {
    return new Promise((resolve) => {
        console.log('📂 فحص مستودع GitHub:\n');
        
        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: '/repos/elzaeem2/youssef-personal-website',
            method: 'GET',
            headers: {
                'User-Agent': 'Auto-Deploy-Test'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const repo = JSON.parse(data);
                    console.log(`   اسم المستودع: ${repo.name}`);
                    console.log(`   الفرع الافتراضي: ${repo.default_branch}`);
                    console.log(`   آخر تحديث: ${new Date(repo.updated_at).toLocaleString('ar-EG')}`);
                    console.log(`   حالة المستودع: ${repo.private ? 'خاص' : 'عام'}`);
                    console.log(`   عدد التحديثات: ${repo.size} KB`);
                    
                    resolve(true);
                } catch (error) {
                    console.log(`   ❌ خطأ في تحليل البيانات: ${error.message}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.log(`   ❌ خطأ في الاتصال: ${e.message}`);
            resolve(false);
        });

        req.end();
    });
}

// Test recent commits and their deploy status
function testRecentCommits() {
    return new Promise((resolve) => {
        console.log('\n📝 فحص آخر التحديثات:\n');
        
        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: '/repos/elzaeem2/youssef-personal-website/commits?per_page=3',
            method: 'GET',
            headers: {
                'User-Agent': 'Auto-Deploy-Test'
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
                        const sha = commit.sha.substring(0, 7);
                        
                        console.log(`   ${index + 1}. [${sha}] ${date.toLocaleString('ar-EG')}`);
                        console.log(`      ${message.substring(0, 80)}...`);
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

// Test site deployment status
function testSiteDeployment() {
    return new Promise((resolve) => {
        console.log('\n🌐 فحص حالة نشر الموقع:\n');
        
        const options = {
            hostname: 'youssef-personal-website.netlify.app',
            port: 443,
            path: '/',
            method: 'HEAD'
        };

        const req = https.request(options, (res) => {
            console.log(`   حالة الموقع: ${res.statusCode === 200 ? '✅ متاح' : '❌ غير متاح'}`);
            console.log(`   آخر تعديل: ${res.headers['last-modified'] || 'غير محدد'}`);
            console.log(`   نوع المحتوى: ${res.headers['content-type'] || 'غير محدد'}`);
            console.log(`   الخادم: ${res.headers['server'] || 'غير محدد'}`);
            console.log(`   Cache Control: ${res.headers['cache-control'] || 'غير محدد'}`);
            
            // Check for Netlify-specific headers
            const netlifyHeaders = Object.keys(res.headers).filter(h => h.startsWith('x-nf-'));
            if (netlifyHeaders.length > 0) {
                console.log(`   رؤوس Netlify: ${netlifyHeaders.join(', ')}`);
            }
            
            resolve(res.statusCode === 200);
        });

        req.on('error', (e) => {
            console.log(`   ❌ خطأ: ${e.message}`);
            resolve(false);
        });

        req.end();
    });
}

// Test webhook functionality (simulated)
function testWebhookSetup() {
    console.log('\n🔗 فحص إعداد Webhooks:\n');
    
    // Since we can't directly test webhooks without API access,
    // we'll provide guidance on what to check
    console.log('   للتحقق من إعداد Webhooks:');
    console.log('   1. اذهب إلى GitHub → Settings → Webhooks');
    console.log('   2. تأكد من وجود webhook لـ Netlify');
    console.log('   3. تحقق من أن الـ webhook يستهدف events: push, pull_request');
    console.log('   4. تأكد من أن الحالة "Active" ✅');
    
    console.log('\n   أو في Netlify:');
    console.log('   1. اذهب إلى Site Settings → Build & Deploy');
    console.log('   2. تحقق من Repository settings');
    console.log('   3. تأكد من أن Auto-deploy مفعل');
    
    return true;
}

// Main test function
async function runAutoDeployTests() {
    console.log('🔄 بدء فحص إعدادات النشر التلقائي\n');
    console.log('=' .repeat(50) + '\n');
    
    // Test 1: GitHub Repository
    const repoWorking = await testGitHubRepo();
    
    // Test 2: Recent Commits
    const commits = await testRecentCommits();
    
    // Test 3: Site Deployment
    const siteWorking = await testSiteDeployment();
    
    // Test 4: Webhook Setup (guidance)
    const webhookInfo = testWebhookSetup();
    
    // Generate report
    console.log('\n📊 تقرير فحص النشر التلقائي:');
    console.log('=' .repeat(40));
    
    const issues = [];
    const recommendations = [];
    
    if (!repoWorking) {
        issues.push('مشكلة في الوصول إلى مستودع GitHub');
        recommendations.push('تحقق من صحة رابط المستودع في إعدادات Netlify');
    }
    
    if (commits.length === 0) {
        issues.push('لا توجد تحديثات حديثة في GitHub');
        recommendations.push('تأكد من أن التحديثات يتم رفعها إلى الفرع الصحيح');
    }
    
    if (!siteWorking) {
        issues.push('الموقع غير متاح');
        recommendations.push('تحقق من حالة النشر في لوحة تحكم Netlify');
    }
    
    console.log(`\n🔍 المشاكل المكتشفة: ${issues.length}`);
    issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ❌ ${issue}`);
    });
    
    console.log(`\n💡 التوصيات: ${recommendations.length}`);
    recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. 🔧 ${rec}`);
    });
    
    console.log('\n🎯 خطوات التحقق من النشر التلقائي:');
    console.log('   1. تأكد من تفعيل Netlify Identity و Git Gateway');
    console.log('   2. تحقق من إعدادات Repository في Netlify');
    console.log('   3. تأكد من أن Branch to deploy هو "main"');
    console.log('   4. تحقق من Build settings (Build command, Publish directory)');
    console.log('   5. راجع Deploy log في Netlify للأخطاء');
    
    console.log('\n🔗 روابط مفيدة:');
    console.log('   • إعدادات Build: https://app.netlify.com/projects/youssef-personal-website/settings/deploys');
    console.log('   • سجل النشر: https://app.netlify.com/projects/youssef-personal-website/deploys');
    console.log('   • GitHub Webhooks: https://github.com/elzaeem2/youssef-personal-website/settings/hooks');
    
    return {
        repoWorking,
        commitsFound: commits.length > 0,
        siteWorking,
        issuesCount: issues.length
    };
}

runAutoDeployTests().then((results) => {
    console.log('\n🏁 انتهى فحص النشر التلقائي');
    
    if (results.issuesCount === 0) {
        console.log('✅ إعدادات النشر التلقائي تبدو صحيحة');
        console.log('🔄 المشكلة قد تكون في Editorial Workflow أو Identity/Gateway');
    } else {
        console.log(`❌ تم اكتشاف ${results.issuesCount} مشكلة تحتاج إصلاح`);
    }
});
