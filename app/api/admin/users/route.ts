import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Функция для создания admin клиента
function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY не настроен в переменных окружения');
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// Функция для проверки авторизации через токен из заголовка
async function verifyAuth(request: NextRequest): Promise<{ user: any; error: any }> {
  // Получаем токен из заголовка Authorization
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: { message: 'Токен не предоставлен' } };
  }
  
  const token = authHeader.substring(7);
  
  // Создаем клиент для проверки токена
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  return { user, error };
}

// GET - получить список всех пользователей
export async function GET(request: NextRequest) {
  try {
    // Проверяем авторизацию
    const { user, error: authError } = await verifyAuth(request);

    if (authError || !user) {
      console.error('Auth error:', authError?.message);
      return NextResponse.json(
        { error: 'Не авторизован', details: authError?.message },
        { status: 401 }
      );
    }

    // Получаем список пользователей через Admin API
    const supabaseAdmin = getSupabaseAdmin();
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error('Ошибка получения пользователей:', error);
      return NextResponse.json(
        { error: 'Ошибка при получении списка пользователей' },
        { status: 500 }
      );
    }

    // Форматируем данные
    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error('Ошибка обработки запроса:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// POST - создать нового администратора
export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию
    const { user, error: authError } = await verifyAuth(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Не авторизован', details: authError?.message },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен содержать минимум 6 символов' },
        { status: 400 }
      );
    }

    // Создаем пользователя через Admin API
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Автоматически подтверждаем email
    });

    if (error) {
      console.error('Ошибка создания пользователя:', error);
      return NextResponse.json(
        { error: error.message || 'Ошибка при создании пользователя' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    console.error('Ошибка обработки запроса:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

