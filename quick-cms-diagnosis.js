// Quick CMS diagnosis script
const https = require('https');
const fs = require('fs');

console.log('🔍 تشخيص سريع لمشاكل Netlify CMS...\n');

async function quickTest(url, description) {
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
                console.log(`${description}: ${res.statusCode === 200 ? '✅' : '❌'} (${res.statusCode})`);
                resolve(res.statusCode === 200);
            });
        });

        req.on('error', (e) => {
            console.log(`${description}: ❌ خطأ - ${e.message}`);
            resolve(false);
        });

        req.on('timeout', () => {
            console.log(`${description}: ❌ انتهت مهلة الاتصال`);
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

async function runQuickDiagnosis() {
    console.log('📋 فحص الخدمات الأساسية:\n');
    
    // Test basic services
    const siteWorking = await quickTest('https://youssef-personal-website.netlify.app/', 'الموقع الرئيسي');
    const adminWorking = await quickTest('https://youssef-personal-website.netlify.app/admin/', 'صفحة الإدارة');
    const identityWorking = await quickTest('https://youssef-personal-website.netlify.app/.netlify/identity', 'Netlify Identity');
    const gatewayWorking = await quickTest('https://youssef-personal-website.netlify.app/.netlify/git/github', 'Git Gateway');
    
    console.log('\n⚙️ فحص ملف الإعدادات:');
    
    // Check config file
    let configValid = false;
    let publishMode = 'unknown';
    
    try {
        if (fs.existsSync('admin/config.yml')) {
            const config = fs.readFileSync('admin/config.yml', 'utf8');
            configValid = config.includes('backend:') && config.includes('git-gateway');
            
            const publishModeMatch = config.match(/publish_mode:\s*(\w+)/);
            if (publishModeMatch) {
                publishMode = publishModeMatch[1];
            }
            
            console.log(`ملف config.yml: ✅ موجود وصحيح`);
            console.log(`وضع النشر: ${publishMode}`);
        } else {
            console.log(`ملف config.yml: ❌ غير موجود`);
        }
    } catch (error) {
        console.log(`ملف config.yml: ❌ خطأ - ${error.message}`);
    }
    
    console.log('\n📊 ملخص التشخيص:');
    console.log('=' .repeat(40));
    
    const issues = [];
    
    if (!siteWorking) issues.push('الموقع الرئيسي غير متاح');
    if (!adminWorking) issues.push('صفحة الإدارة غير متاحة');
    if (!identityWorking) issues.push('Netlify Identity غير مفعل');
    if (!gatewayWorking) issues.push('Git Gateway غير مفعل');
    if (!configValid) issues.push('ملف الإعدادات غير صحيح');
    
    if (issues.length === 0) {
        console.log('✅ جميع الخدمات تعمل بشكل صحيح');
        
        if (publishMode === 'editorial_workflow') {
            console.log('\n⚠️ تحذير مهم:');
            console.log('وضع Editorial Workflow مفعل - هذا قد يكون سبب المشكلة!');
            console.log('التحديثات تحتاج موافقة يدوية قبل النشر.');
            console.log('\n🔧 الحل:');
            console.log('1. اذهب إلى لوحة الإدارة');
            console.log('2. ابحث عن تبويب "Workflow" أو "Editorial Workflow"');
            console.log('3. اعتمد التحديثات المعلقة');
            console.log('أو قم بتغيير publish_mode إلى simple في config.yml');
        } else {
            console.log('\n🤔 المشكلة قد تكون:');
            console.log('1. التوقيت - انتظر 5-10 دقائق بعد التحديث');
            console.log('2. Cache المتصفح - امسح الكاش أو استخدم Ctrl+F5');
            console.log('3. مشكلة مؤقتة في Netlify');
        }
    } else {
        console.log(`❌ تم اكتشاف ${issues.length} مشكلة:`);
        issues.forEach((issue, index) => {
            console.log(`   ${index + 1}. ${issue}`);
        });
        
        console.log('\n🔧 الحلول المقترحة:');
        if (!identityWorking) {
            console.log('• فعل Netlify Identity في لوحة تحكم Netlify');
        }
        if (!gatewayWorking) {
            console.log('• فعل Git Gateway وربطه بـ GitHub');
        }
        if (!configValid) {
            console.log('• تحقق من ملف admin/config.yml');
        }
    }
    
    console.log('\n🔗 روابط مفيدة:');
    console.log('• لوحة تحكم Netlify: https://app.netlify.com/projects/youssef-personal-website');
    console.log('• إعدادات Identity: https://app.netlify.com/projects/youssef-personal-website/settings/identity');
    console.log('• حالة خدمات Netlify: https://www.netlifystatus.com/');
    
    return {
        allWorking: issues.length === 0,
        publishMode,
        issues
    };
}

runQuickDiagnosis().then((result) => {
    console.log('\n🏁 انتهى التشخيص السريع');
    if (result.publishMode === 'editorial_workflow') {
        console.log('\n🎯 السبب المحتمل: Editorial Workflow مفعل');
        console.log('راجع التحديثات المعلقة في لوحة الإدارة');
    }
});
