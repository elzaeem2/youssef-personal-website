// Script to test all pages for responsive design
const https = require('https');

const baseUrl = 'youssef-personal-website.netlify.app';
const pages = [
    { name: 'الصفحة الرئيسية', path: '/' },
    { name: 'السيرة الذاتية', path: '/about.html' },
    { name: 'المشاريع', path: '/projects.html' },
    { name: 'الخدمات', path: '/services.html' },
    { name: 'المنتجات', path: '/products.html' },
    { name: 'التواصل', path: '/contact.html' }
];

console.log('🧪 اختبار جميع صفحات الموقع للتصميم المتجاوب...\n');

function testPage(page) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: baseUrl,
            port: 443,
            path: page.path,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                const result = {
                    name: page.name,
                    path: page.path,
                    status: res.statusCode,
                    hasViewport: data.includes('width=device-width'),
                    hasResponsiveCSS: data.includes('@media'),
                    hasHamburger: data.includes('hamburger'),
                    hasNavMenu: data.includes('nav-menu'),
                    size: data.length
                };
                resolve(result);
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.end();
    });
}

async function testAllPages() {
    console.log('📱 اختبار الصفحات:\n');
    
    for (const page of pages) {
        try {
            const result = await testPage(page);
            
            console.log(`📄 ${result.name} (${result.path})`);
            console.log(`   الحالة: ${result.status === 200 ? '✅ متاحة' : '❌ غير متاحة'}`);
            console.log(`   Viewport Meta: ${result.hasViewport ? '✅ موجود' : '❌ مفقود'}`);
            console.log(`   CSS المتجاوب: ${result.hasResponsiveCSS ? '✅ موجود' : '❌ مفقود'}`);
            console.log(`   قائمة الهامبرغر: ${result.hasHamburger ? '✅ موجودة' : '❌ مفقودة'}`);
            console.log(`   قائمة التنقل: ${result.hasNavMenu ? '✅ موجودة' : '❌ مفقودة'}`);
            console.log(`   حجم الصفحة: ${(result.size / 1024).toFixed(2)} KB\n`);
            
        } catch (error) {
            console.log(`❌ خطأ في اختبار ${page.name}: ${error.message}\n`);
        }
    }
    
    console.log('🎯 نصائح للاختبار اليدوي:');
    console.log('1. افتح الموقع في متصفح الهاتف');
    console.log('2. اختبر القائمة الجانبية (الهامبرغر)');
    console.log('3. تأكد من قابلية قراءة النصوص');
    console.log('4. اختبر الأزرار والروابط');
    console.log('5. تحقق من عدم وجود تمرير أفقي');
    console.log('6. اختبر النماذج في صفحة التواصل');
    
    console.log('\n🔗 روابط الاختبار:');
    pages.forEach(page => {
        console.log(`   https://${baseUrl}${page.path}`);
    });
    
    console.log('\n📊 أحجام الشاشات للاختبار:');
    console.log('   📱 320px - iPhone SE');
    console.log('   📱 375px - iPhone 12/13');
    console.log('   📱 414px - iPhone 12 Pro Max');
    console.log('   📱 768px - iPad');
    console.log('   💻 1024px - Desktop');
}

testAllPages();
