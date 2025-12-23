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

// DELETE - удалить пользователя
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Проверяем авторизацию
    const { user, error: authError } = await verifyAuth(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Не авторизован', details: authError?.message },
        { status: 401 }
      );
    }

    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'ID пользователя обязателен' },
        { status: 400 }
      );
    }

    // Удаляем пользователя через Admin API
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Ошибка удаления пользователя:', error);
      return NextResponse.json(
        { error: error.message || 'Ошибка при удалении пользователя' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка обработки запроса:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

