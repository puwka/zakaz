/**
 * Скрипт для создания первого администратора
 * 
 * Использование:
 * 1. Убедитесь, что в .env.local есть SUPABASE_SERVICE_ROLE_KEY
 * 2. Запустите: node scripts/create-admin.js <email> <password>
 * 
 * Пример:
 * node scripts/create-admin.js admin@example.com mypassword123
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('❌ Ошибка: Укажите email и пароль');
  console.log('\nИспользование:');
  console.log('  node scripts/create-admin.js <email> <password>');
  console.log('\nПример:');
  console.log('  node scripts/create-admin.js admin@example.com mypassword123');
  process.exit(1);
}

if (password.length < 6) {
  console.error('❌ Ошибка: Пароль должен содержать минимум 6 символов');
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Ошибка: Переменные окружения не настроены');
  console.log('\nУбедитесь, что в .env.local есть:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL=...');
  console.log('  SUPABASE_SERVICE_ROLE_KEY=...');
  process.exit(1);
}

async function createAdmin() {
  try {
    console.log('🔧 Создание администратора...');
    console.log(`   Email: ${email}`);
    
    // Создаем клиент с Service Role Key
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Создаем пользователя
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Автоматически подтверждаем email
    });

    if (error) {
      console.error('❌ Ошибка создания администратора:', error.message);
      
      if (error.message.includes('already registered')) {
        console.log('\n💡 Пользователь с таким email уже существует.');
        console.log('   Попробуйте использовать другой email или сбросить пароль в Supabase Dashboard.');
      }
      
      process.exit(1);
    }

    console.log('✅ Администратор успешно создан!');
    console.log(`\n📧 Email: ${data.user.email}`);
    console.log(`🆔 ID: ${data.user.id}`);
    console.log('\nТеперь вы можете войти в админ-панель:');
    console.log('  http://localhost:3000/admin/login');
    console.log(`\n  Email: ${email}`);
    console.log(`  Пароль: ${password}`);
    
  } catch (err) {
    console.error('❌ Неожиданная ошибка:', err.message);
    process.exit(1);
  }
}

createAdmin();

