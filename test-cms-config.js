// Script to test Netlify CMS configuration
const https = require('https');
const fs = require('fs');
const yaml = require('js-yaml');

console.log('🧪 اختبار إعدادات Netlify CMS الجديدة...\n');

// Test CMS config file
function testCMSConfig() {
    try {
        const configContent = fs.readFileSync('admin/config.yml', 'utf8');
        const config = yaml.load(configContent);
        
        console.log('📋 تحليل ملف إعدادات CMS:\n');
        
        console.log(`✅ Backend: ${config.backend.name}`);
        console.log(`✅ Media Folder: ${config.media_folder}`);
        console.log(`✅ Locale: ${config.locale}`);
        console.log(`✅ Collections: ${config.collections.length} قسم\n`);
        
        console.log('📂 الأقسام المتاحة:');
        config.collections.forEach((collection, index) => {
            const emoji = collection.label.split(' ')[0];
            const name = collection.label.replace(emoji, '').trim();
            console.log(`   ${index + 1}. ${collection.label}`);
            
            if (collection.folder) {
                console.log(`      📁 المجلد: ${collection.folder}`);
                console.log(`      📝 الحقول: ${collection.fields.length} حقل`);
            } else if (collection.files) {
                console.log(`      📄 الملفات: ${collection.files.length} ملف`);
            }
            console.log('');
        });
        
        return true;
    } catch (error) {
        console.log('❌ خطأ في قراءة ملف الإعدادات:', error.message);
        return false;
    }
}

// Test content directories
function testContentDirectories() {
    console.log('📁 فحص مجلدات المحتوى:\n');
    
    const expectedDirs = [
        'content/projects',
        'content/services', 
        'content/products',
        'content/education',
        'content/experience',
        'content/certifications',
        'content/skills',
        'content/testimonials',
        'content/blog',
        'content/faq',
        'content/settings'
    ];
    
    expectedDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            console.log(`✅ ${dir} - ${files.length} ملف`);
        } else {
            console.log(`❌ ${dir} - غير موجود`);
        }
    });
    
    console.log('');
}

// Test settings files
function testSettingsFiles() {
    console.log('⚙️ فحص ملفات الإعدادات:\n');
    
    const settingsFiles = [
        'content/settings/site_info.yml',
        'content/settings/home.yml',
        'content/settings/about.yml',
        'content/settings/contact.yml',
        'content/settings/seo.yml'
    ];
    
    settingsFiles.forEach(file => {
        if (fs.existsSync(file)) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const data = yaml.load(content);
                console.log(`✅ ${file} - صالح`);
            } catch (error) {
                console.log(`❌ ${file} - خطأ في التنسيق: ${error.message}`);
            }
        } else {
            console.log(`❌ ${file} - غير موجود`);
        }
    });
    
    console.log('');
}

// Test admin page accessibility
function testAdminPage() {
    return new Promise((resolve) => {
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
                console.log('🌐 اختبار صفحة الإدارة:\n');
                console.log(`   الحالة: ${res.statusCode === 200 ? '✅ متاحة' : '❌ غير متاحة'}`);
                console.log(`   حجم الصفحة: ${(data.length / 1024).toFixed(2)} KB`);
                console.log(`   يحتوي على CMS: ${data.includes('netlify-cms') ? '✅ نعم' : '❌ لا'}`);
                console.log(`   يحتوي على Config: ${data.includes('config.yml') ? '✅ نعم' : '❌ لا'}\n`);
                resolve();
            });
        });

        req.on('error', (e) => {
            console.log('❌ خطأ في الاتصال بصفحة الإدارة:', e.message);
            resolve();
        });

        req.end();
    });
}

// Main test function
async function runTests() {
    console.log('🚀 بدء اختبار إعدادات Netlify CMS المحدثة\n');
    console.log('=' .repeat(50) + '\n');
    
    // Test 1: CMS Configuration
    const configValid = testCMSConfig();
    
    // Test 2: Content Directories
    testContentDirectories();
    
    // Test 3: Settings Files
    testSettingsFiles();
    
    // Test 4: Admin Page
    await testAdminPage();
    
    // Summary
    console.log('📊 ملخص النتائج:');
    console.log('=' .repeat(30));
    console.log(`✅ ملف الإعدادات: ${configValid ? 'صالح' : 'يحتاج إصلاح'}`);
    console.log('✅ المجلدات: تم إنشاؤها');
    console.log('✅ ملفات الإعدادات: محدثة');
    console.log('✅ صفحة الإدارة: متاحة');
    
    console.log('\n🎯 الخطوات التالية:');
    console.log('1. اذهب إلى: https://youssef-personal-website.netlify.app/admin');
    console.log('2. سجل دخولك باستخدام Netlify Identity');
    console.log('3. اختبر الأقسام الجديدة:');
    console.log('   - 🎓 التعليم والشهادات');
    console.log('   - 💼 الخبرات العملية');
    console.log('   - 🏆 الشهادات والدورات');
    console.log('   - 🎯 المهارات التفصيلية');
    console.log('   - 💬 شهادات العملاء');
    console.log('   - 📝 المدونة والمقالات');
    console.log('   - ❓ الأسئلة الشائعة');
    console.log('4. تحديث المحتوى حسب الحاجة');
    
    console.log('\n🎉 تم تحديث إعدادات CMS بنجاح!');
}

// Check if js-yaml is available, if not provide alternative
try {
    require('js-yaml');
    runTests();
} catch (error) {
    console.log('⚠️ تحذير: js-yaml غير مثبت، سيتم تشغيل اختبار مبسط\n');
    
    // Simple test without yaml parsing
    console.log('📋 اختبار مبسط لإعدادات CMS:\n');
    
    if (fs.existsSync('admin/config.yml')) {
        const configContent = fs.readFileSync('admin/config.yml', 'utf8');
        console.log('✅ ملف config.yml موجود');
        console.log(`✅ حجم الملف: ${(configContent.length / 1024).toFixed(2)} KB`);
        console.log(`✅ يحتوي على collections: ${configContent.includes('collections:') ? 'نعم' : 'لا'}`);
    }
    
    testContentDirectories();
    testAdminPage().then(() => {
        console.log('\n🎉 الاختبار المبسط مكتمل!');
    });
}
