// Test CMS update workflow with a simple change
const fs = require('fs');
const https = require('https');

console.log('🧪 اختبار تحديث CMS مع تغيير بسيط...\n');
console.log('=' .repeat(50) + '\n');

// Create a simple test update
function createTestUpdate() {
    console.log('📝 إنشاء تحديث تجريبي:\n');
    
    // Create a simple test file that CMS can modify
    const testContent = {
        title: "اختبار تحديث CMS",
        description: "هذا ملف اختبار لتجربة تحديثات CMS",
        phone: "123-456-7890",
        email: "test@example.com",
        last_updated: new Date().toISOString(),
        test_number: Math.floor(Math.random() * 1000)
    };
    
    // Save to content/settings/test.yml
    const yamlContent = `# ملف اختبار لتحديثات CMS
title: "${testContent.title}"
description: "${testContent.description}"
contact:
  phone: "${testContent.phone}"
  email: "${testContent.email}"
last_updated: "${testContent.last_updated}"
test_number: ${testContent.test_number}

# يمكنك تحديث هذه القيم من لوحة الإدارة
# لاختبار عمل نظام CMS
`;
    
    try {
        fs.writeFileSync('content/settings/test.yml', yamlContent);
        console.log('   ✅ تم إنشاء ملف الاختبار: content/settings/test.yml');
        console.log(`   📞 رقم الهاتف الحالي: ${testContent.phone}`);
        console.log(`   🔢 رقم الاختبار: ${testContent.test_number}`);
        return testContent;
    } catch (error) {
        console.log(`   ❌ خطأ في إنشاء ملف الاختبار: ${error.message}`);
        return null;
    }
}

// Add test collection to CMS config
function addTestCollectionToConfig() {
    console.log('\n⚙️ إضافة مجموعة الاختبار إلى إعدادات CMS:\n');
    
    try {
        let config = fs.readFileSync('admin/config.yml', 'utf8');
        
        // Check if test collection already exists
        if (config.includes('name: "test"')) {
            console.log('   ✅ مجموعة الاختبار موجودة بالفعل');
            return true;
        }
        
        // Add test collection at the end
        const testCollection = `
  # ===== اختبار CMS =====
  - name: "test"
    label: "🧪 اختبار النظام"
    folder: "content/settings"
    create: false
    delete: false
    slug: "test"
    fields:
      - { label: "العنوان", name: "title", widget: "string" }
      - { label: "الوصف", name: "description", widget: "text" }
      - label: "معلومات الاتصال"
        name: "contact"
        widget: "object"
        fields:
          - { label: "رقم الهاتف", name: "phone", widget: "string", hint: "غير هذا الرقم لاختبار CMS" }
          - { label: "البريد الإلكتروني", name: "email", widget: "string" }
      - { label: "آخر تحديث", name: "last_updated", widget: "datetime" }
      - { label: "رقم الاختبار", name: "test_number", widget: "number", hint: "غير هذا الرقم لاختبار التحديث" }
`;
        
        config += testCollection;
        
        fs.writeFileSync('admin/config.yml', config);
        console.log('   ✅ تم إضافة مجموعة الاختبار إلى إعدادات CMS');
        return true;
    } catch (error) {
        console.log(`   ❌ خطأ في تحديث إعدادات CMS: ${error.message}`);
        return false;
    }
}

// Monitor GitHub for new commits
function monitorGitHubCommits() {
    return new Promise((resolve) => {
        console.log('\n👀 مراقبة GitHub للتحديثات الجديدة:\n');
        
        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: '/repos/elzaeem2/youssef-personal-website/commits?per_page=1',
            method: 'GET',
            headers: {
                'User-Agent': 'CMS-Update-Test'
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
                        const message = lastCommit.commit.message;
                        const sha = lastCommit.sha.substring(0, 7);
                        
                        console.log(`   📝 آخر commit:`);
                        console.log(`      SHA: ${sha}`);
                        console.log(`      التاريخ: ${date.toLocaleString('ar-EG')}`);
                        console.log(`      الرسالة: ${message.split('\n')[0]}`);
                        console.log(`      المؤلف: ${lastCommit.commit.author.name}`);
                        
                        // Check if this is a CMS commit
                        const isCMSCommit = message.toLowerCase().includes('cms') || 
                                          message.toLowerCase().includes('update') ||
                                          message.toLowerCase().includes('create') ||
                                          message.toLowerCase().includes('delete');
                        
                        console.log(`      من CMS: ${isCMSCommit ? '✅ محتمل' : '❌ غير محتمل'}`);
                        
                        resolve({
                            success: true,
                            commit: lastCommit,
                            isCMS: isCMSCommit
                        });
                    } else {
                        console.log('   ❌ لا توجد commits');
                        resolve({ success: false });
                    }
                } catch (error) {
                    console.log(`   ❌ خطأ في تحليل البيانات: ${error.message}`);
                    resolve({ success: false });
                }
            });
        });

        req.on('error', (e) => {
            console.log(`   ❌ خطأ في الاتصال: ${e.message}`);
            resolve({ success: false });
        });

        req.end();
    });
}

// Check Netlify deploy status
function checkNetlifyDeploys() {
    return new Promise((resolve) => {
        console.log('\n🚀 فحص حالة النشر في Netlify:\n');
        
        // Since we can't access Netlify API directly, we'll check the site
        const options = {
            hostname: 'youssef-personal-website.netlify.app',
            port: 443,
            path: '/',
            method: 'HEAD'
        };

        const req = https.request(options, (res) => {
            console.log(`   حالة الموقع: ${res.statusCode === 200 ? '✅ متاح' : '❌ غير متاح'}`);
            console.log(`   آخر تعديل: ${res.headers['last-modified'] || 'غير محدد'}`);
            console.log(`   ETag: ${res.headers['etag'] || 'غير محدد'}`);
            console.log(`   Cache Control: ${res.headers['cache-control'] || 'غير محدد'}`);
            
            // Check for Netlify-specific headers
            const netlifyHeaders = Object.keys(res.headers).filter(h => h.startsWith('x-nf-'));
            if (netlifyHeaders.length > 0) {
                console.log(`   رؤوس Netlify: ${netlifyHeaders.length} headers`);
                netlifyHeaders.forEach(header => {
                    console.log(`      ${header}: ${res.headers[header]}`);
                });
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

// Provide step-by-step testing instructions
function provideTestingInstructions(testData) {
    console.log('\n📋 تعليمات الاختبار خطوة بخطوة:\n');
    
    console.log('   🎯 الهدف: اختبار تحديث بسيط من لوحة الإدارة');
    console.log('   ⏱️ الوقت المتوقع: 5-10 دقائق\n');
    
    console.log('   📝 الخطوات:');
    console.log('   1. اذهب إلى: https://youssef-personal-website.netlify.app/admin');
    console.log('   2. سجل دخولك بـ Netlify Identity');
    console.log('   3. ابحث عن قسم "🧪 اختبار النظام"');
    console.log(`   4. غير رقم الهاتف من "${testData?.phone || '123-456-7890'}" إلى "987-654-3210"`);
    console.log(`   5. غير رقم الاختبار من "${testData?.test_number || '123'}" إلى رقم آخر`);
    console.log('   6. اضغط "حفظ" أو "نشر"');
    console.log('   7. انتظر 2-3 دقائق');
    console.log('   8. تحقق من GitHub: https://github.com/elzaeem2/youssef-personal-website/commits');
    console.log('   9. تحقق من ملف content/settings/test.yml في الموقع');
    console.log('   10. إذا ظهر commit جديد، فالنظام يعمل! ✅\n');
    
    console.log('   🔍 علامات النجاح:');
    console.log('   • ظهور commit جديد في GitHub خلال 1-2 دقيقة');
    console.log('   • رسالة الـ commit تحتوي على "Update" أو اسم الملف');
    console.log('   • تحديث ملف content/settings/test.yml بالقيم الجديدة');
    console.log('   • عدم ظهور أخطاء في لوحة الإدارة\n');
    
    console.log('   🚨 إذا لم يظهر commit جديد:');
    console.log('   • تحقق من تسجيل الدخول في لوحة الإدارة');
    console.log('   • تأكد من ظهور رسالة "تم الحفظ بنجاح"');
    console.log('   • راجع سجل النشر في Netlify للأخطاء');
    console.log('   • جرب مسح cache المتصفح');
}

// Main test function
async function runCMSUpdateTest() {
    console.log('🚀 بدء اختبار تحديث CMS\n');
    
    // Step 1: Create test content
    const testData = createTestUpdate();
    
    if (!testData) {
        console.log('❌ فشل في إنشاء محتوى الاختبار');
        return;
    }
    
    // Step 2: Add test collection to CMS config
    const configUpdated = addTestCollectionToConfig();
    
    if (!configUpdated) {
        console.log('❌ فشل في تحديث إعدادات CMS');
        return;
    }
    
    // Step 3: Monitor current state
    const githubStatus = await monitorGitHubCommits();
    const netlifyStatus = await checkNetlifyDeploys();
    
    // Step 4: Provide testing instructions
    provideTestingInstructions(testData);
    
    console.log('\n🎯 ملخص الحالة الحالية:');
    console.log(`   GitHub: ${githubStatus.success ? '✅ متصل' : '❌ غير متصل'}`);
    console.log(`   Netlify: ${netlifyStatus ? '✅ يعمل' : '❌ لا يعمل'}`);
    console.log(`   ملف الاختبار: ✅ تم إنشاؤه`);
    console.log(`   إعدادات CMS: ✅ تم تحديثها`);
    
    console.log('\n🏁 جاهز للاختبار!');
    console.log('اتبع التعليمات أعلاه لاختبار النظام');
}

runCMSUpdateTest();
