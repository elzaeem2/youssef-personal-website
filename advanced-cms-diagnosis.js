// Advanced CMS diagnosis after Identity/Gateway activation
const https = require('https');
const fs = require('fs');

console.log('🔬 تشخيص متقدم لمشكلة CMS بعد تفعيل Identity و Gateway...\n');
console.log('=' .repeat(70) + '\n');

// Test Identity with different methods
async function testIdentityAdvanced() {
    console.log('🔐 فحص متقدم لـ Netlify Identity:\n');
    
    const endpoints = [
        { name: 'Identity API', path: '/.netlify/identity' },
        { name: 'Identity Settings', path: '/.netlify/identity/settings' },
        { name: 'Identity Users', path: '/.netlify/identity/users' }
    ];
    
    for (const endpoint of endpoints) {
        try {
            const result = await testEndpoint(endpoint.path);
            console.log(`   ${endpoint.name}: ${result.status} (${result.code})`);
            
            if (result.data && result.data.length > 0) {
                try {
                    const parsed = JSON.parse(result.data);
                    console.log(`      البيانات: ${JSON.stringify(parsed, null, 2).substring(0, 200)}...`);
                } catch (e) {
                    console.log(`      البيانات: ${result.data.substring(0, 100)}...`);
                }
            }
        } catch (error) {
            console.log(`   ${endpoint.name}: ❌ خطأ - ${error.message}`);
        }
    }
}

// Test Git Gateway with different methods
async function testGitGatewayAdvanced() {
    console.log('\n🔗 فحص متقدم لـ Git Gateway:\n');
    
    const endpoints = [
        { name: 'Git Gateway API', path: '/.netlify/git/github' },
        { name: 'Git Gateway Info', path: '/.netlify/git/github/info' },
        { name: 'Git Gateway Auth', path: '/.netlify/git/github/auth' }
    ];
    
    for (const endpoint of endpoints) {
        try {
            const result = await testEndpoint(endpoint.path);
            console.log(`   ${endpoint.name}: ${result.status} (${result.code})`);
            
            if (result.data && result.data.length > 0) {
                console.log(`      البيانات: ${result.data.substring(0, 100)}...`);
            }
        } catch (error) {
            console.log(`   ${endpoint.name}: ❌ خطأ - ${error.message}`);
        }
    }
}

function testEndpoint(path) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'youssef-personal-website.netlify.app',
            port: 443,
            path: path,
            method: 'GET',
            timeout: 10000
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    status: res.statusCode === 200 ? '✅ يعمل' : 
                           res.statusCode === 401 ? '🔑 يحتاج مصادقة' :
                           res.statusCode === 404 ? '❌ غير موجود' : 
                           `⚠️ كود ${res.statusCode}`,
                    code: res.statusCode,
                    data: data
                });
            });
        });

        req.on('error', (e) => {
            resolve({
                status: '❌ خطأ',
                code: 0,
                data: e.message
            });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({
                status: '⏱️ انتهت المهلة',
                code: 0,
                data: 'timeout'
            });
        });

        req.end();
    });
}

// Check Netlify build settings
async function checkNetlifyBuildSettings() {
    console.log('\n🏗️ فحص إعدادات البناء والنشر:\n');
    
    // Check if there's a netlify.toml file
    const netlifyTomlExists = fs.existsSync('netlify.toml');
    console.log(`   ملف netlify.toml: ${netlifyTomlExists ? '✅ موجود' : '❌ غير موجود'}`);
    
    if (netlifyTomlExists) {
        try {
            const netlifyToml = fs.readFileSync('netlify.toml', 'utf8');
            console.log(`   محتوى netlify.toml:\n${netlifyToml}`);
        } catch (error) {
            console.log(`   خطأ في قراءة netlify.toml: ${error.message}`);
        }
    }
    
    // Check package.json for build scripts
    const packageJsonExists = fs.existsSync('package.json');
    console.log(`   ملف package.json: ${packageJsonExists ? '✅ موجود' : '❌ غير موجود'}`);
    
    if (packageJsonExists) {
        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            console.log(`   Build scripts: ${JSON.stringify(packageJson.scripts || {}, null, 2)}`);
        } catch (error) {
            console.log(`   خطأ في قراءة package.json: ${error.message}`);
        }
    }
    
    // Check for common static site files
    const staticFiles = ['index.html', '_config.yml', 'config.toml', 'gatsby-config.js'];
    console.log('\n   ملفات الموقع الثابت:');
    staticFiles.forEach(file => {
        const exists = fs.existsSync(file);
        console.log(`      ${file}: ${exists ? '✅' : '❌'}`);
    });
}

// Test CMS admin page in detail
async function testCMSAdminDetailed() {
    console.log('\n📋 فحص مفصل لصفحة إدارة CMS:\n');
    
    try {
        const result = await testEndpoint('/admin/');
        console.log(`   صفحة الإدارة: ${result.status} (${result.code})`);
        
        if (result.code === 200 && result.data) {
            // Check for important CMS components
            const checks = [
                { name: 'Netlify CMS Script', pattern: 'netlify-cms' },
                { name: 'Config File Reference', pattern: 'config.yml' },
                { name: 'Identity Widget', pattern: 'netlify-identity-widget' },
                { name: 'CMS App Mount', pattern: 'nc-root' },
                { name: 'Meta Tags', pattern: '<meta' }
            ];
            
            checks.forEach(check => {
                const found = result.data.includes(check.pattern);
                console.log(`      ${check.name}: ${found ? '✅' : '❌'}`);
            });
            
            // Check for any error messages in the HTML
            const errorPatterns = ['error', 'Error', 'ERROR', 'failed', 'Failed'];
            const hasErrors = errorPatterns.some(pattern => result.data.includes(pattern));
            console.log(`      أخطاء في HTML: ${hasErrors ? '⚠️ موجودة' : '✅ لا توجد'}`);
        }
    } catch (error) {
        console.log(`   ❌ خطأ في فحص صفحة الإدارة: ${error.message}`);
    }
}

// Check recent GitHub activity
async function checkGitHubActivity() {
    console.log('\n📝 فحص النشاط الحديث في GitHub:\n');
    
    try {
        const result = await testGitHubAPI('/repos/elzaeem2/youssef-personal-website/commits?per_page=5');
        
        if (result.success && result.data.length > 0) {
            console.log(`   آخر ${result.data.length} تحديثات:`);
            
            result.data.forEach((commit, index) => {
                const date = new Date(commit.commit.author.date);
                const message = commit.commit.message.split('\n')[0];
                const sha = commit.sha.substring(0, 7);
                const timeDiff = Date.now() - date.getTime();
                const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
                
                console.log(`      ${index + 1}. [${sha}] ${hoursAgo}h ago - ${message.substring(0, 50)}...`);
            });
            
            // Check if there are any CMS-related commits from today
            const today = new Date().toDateString();
            const todayCommits = result.data.filter(commit => 
                new Date(commit.commit.author.date).toDateString() === today
            );
            
            console.log(`\n   تحديثات اليوم: ${todayCommits.length}`);
            
            // Check for any commits that might be from CMS
            const cmsCommits = result.data.filter(commit => 
                commit.commit.message.toLowerCase().includes('cms') ||
                commit.commit.message.toLowerCase().includes('update') ||
                commit.commit.message.toLowerCase().includes('create') ||
                commit.commit.message.toLowerCase().includes('delete')
            );
            
            console.log(`   تحديثات محتملة من CMS: ${cmsCommits.length}`);
        }
    } catch (error) {
        console.log(`   ❌ خطأ في فحص GitHub: ${error.message}`);
    }
}

function testGitHubAPI(path) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: path,
            method: 'GET',
            headers: {
                'User-Agent': 'Advanced-CMS-Diagnosis'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ success: true, data: parsed });
                } catch (error) {
                    resolve({ success: false, error: error.message });
                }
            });
        });

        req.on('error', (e) => {
            resolve({ success: false, error: e.message });
        });

        req.end();
    });
}

// Test actual CMS workflow simulation
async function simulateCMSWorkflow() {
    console.log('\n🔄 محاكاة سير عمل CMS:\n');
    
    console.log('   المراحل المتوقعة:');
    console.log('   1. المستخدم يسجل دخول في /admin ✅');
    console.log('   2. Identity يتحقق من المستخدم');
    console.log('   3. CMS يحمل المحتوى من GitHub');
    console.log('   4. المستخدم يحدث المحتوى');
    console.log('   5. CMS يرسل التحديث عبر Git Gateway');
    console.log('   6. GitHub يستقبل commit جديد');
    console.log('   7. Netlify يستقبل webhook من GitHub');
    console.log('   8. Netlify يبدأ عملية البناء');
    console.log('   9. الموقع المحدث ينشر');
    
    console.log('\n   🔍 نقاط الفشل المحتملة:');
    console.log('   • Identity لا يعمل → لا يمكن تسجيل الدخول');
    console.log('   • Git Gateway لا يعمل → لا يمكن حفظ التحديثات');
    console.log('   • Webhook لا يعمل → لا ينشر التحديث');
    console.log('   • Build يفشل → الموقع لا يتحدث');
    console.log('   • Cache يمنع → التحديث لا يظهر');
}

// Generate advanced recommendations
function generateAdvancedRecommendations() {
    console.log('\n💡 توصيات متقدمة لحل المشكلة:\n');
    
    console.log('   🔧 الحلول المقترحة بالترتيب:');
    console.log('   1. تحقق من Users في Identity - هل المستخدم مدعو ومفعل؟');
    console.log('   2. اختبر تسجيل الدخول في /admin يدوياً');
    console.log('   3. تحقق من Webhook في GitHub Settings');
    console.log('   4. راجع Build Log في Netlify للأخطاء');
    console.log('   5. امسح Cache في Netlify');
    console.log('   6. جرب Force Deploy في Netlify');
    
    console.log('\n   🧪 اختبارات يدوية:');
    console.log('   • اذهب إلى /admin وسجل دخولك');
    console.log('   • حدث رقم الهاتف من 123 إلى 456');
    console.log('   • احفظ التحديث');
    console.log('   • راقب GitHub للـ commit الجديد');
    console.log('   • راقب Netlify للـ deploy الجديد');
    console.log('   • تحقق من الموقع بعد 5 دقائق');
    
    console.log('\n   🚨 إذا لم تنجح الطرق السابقة:');
    console.log('   • أعد إنشاء Identity instance');
    console.log('   • أعد ربط Git Gateway');
    console.log('   • تحقق من Branch settings (يجب أن يكون main)');
    console.log('   • تحقق من Build Command (يجب أن يكون فارغ للمواقع الثابتة)');
}

// Main advanced diagnosis function
async function runAdvancedDiagnosis() {
    console.log('🚀 بدء التشخيص المتقدم\n');
    
    // Step 1: Advanced Identity testing
    await testIdentityAdvanced();
    
    // Step 2: Advanced Git Gateway testing
    await testGitGatewayAdvanced();
    
    // Step 3: Check build settings
    await checkNetlifyBuildSettings();
    
    // Step 4: Detailed CMS admin testing
    await testCMSAdminDetailed();
    
    // Step 5: Check GitHub activity
    await checkGitHubActivity();
    
    // Step 6: Simulate workflow
    simulateCMSWorkflow();
    
    // Step 7: Generate recommendations
    generateAdvancedRecommendations();
    
    console.log('\n🏁 انتهى التشخيص المتقدم');
    console.log('\n🎯 الخطوة التالية: اتبع التوصيات أعلاه بالترتيب');
}

runAdvancedDiagnosis();
