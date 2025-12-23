import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, message } = body;

    // Валидация
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    // Получаем токен бота из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    // Получаем chat ID из базы данных или переменных окружения
    let chatId = process.env.TELEGRAM_CHAT_ID;
    
    try {
      const supabase = await createClient();
      const { data: contactsContent } = await supabase
        .from('contacts_content')
        .select('telegram_chat_id')
        .eq('id', '00000000-0000-0000-0000-000000000004')
        .single();
      
      // Если chat ID указан в базе данных, используем его
      if (contactsContent?.telegram_chat_id) {
        chatId = contactsContent.telegram_chat_id;
      }
    } catch (error) {
      // Если не удалось получить из базы, используем значение из env
      console.log('Используется TELEGRAM_CHAT_ID из переменных окружения');
    }

    // Детальная проверка переменных окружения
    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN не настроен в переменных окружения');
      return NextResponse.json(
        { 
          error: 'Telegram бот не настроен. Проверьте файл .env.local и убедитесь, что TELEGRAM_BOT_TOKEN указан.',
          details: 'Отсутствует TELEGRAM_BOT_TOKEN'
        },
        { status: 500 }
      );
    }

    if (!chatId) {
      console.error('TELEGRAM_CHAT_ID не настроен ни в базе данных, ни в переменных окружения');
      return NextResponse.json(
        { 
          error: 'Telegram Chat ID не настроен. Укажите его в админ-панели (Контакты) или в переменных окружения (TELEGRAM_CHAT_ID).',
          details: 'Отсутствует TELEGRAM_CHAT_ID'
        },
        { status: 500 }
      );
    }

    // Формируем сообщение
    const telegramMessage = `
🔔 <b>Новая заявка с сайта</b>

👤 <b>Имя:</b> ${name}
📞 <b>Телефон:</b> ${phone}
💬 <b>Сообщение:</b>
${message}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU', {
      timeZone: 'Europe/Moscow',
      dateStyle: 'full',
      timeStyle: 'short',
    })}
    `.trim();

    // Отправляем сообщение в Telegram
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Ошибка Telegram API:', errorData);
      
      // Более детальное сообщение об ошибке
      let errorMessage = 'Ошибка при отправке сообщения в Telegram';
      if (errorData.description) {
        if (errorData.description.includes('chat not found')) {
          errorMessage = 'Чат не найден. Проверьте правильность TELEGRAM_CHAT_ID. Убедитесь, что бот добавлен в чат/группу.';
        } else if (errorData.description.includes('Unauthorized')) {
          errorMessage = 'Неверный токен бота. Проверьте правильность TELEGRAM_BOT_TOKEN.';
        } else {
          errorMessage = `Ошибка Telegram: ${errorData.description}`;
        }
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorData.description || 'Неизвестная ошибка Telegram API'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Сообщение успешно отправлено' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка обработки запроса:', error);
    
    // Более детальное сообщение об ошибке
    let errorMessage = 'Внутренняя ошибка сервера';
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Детали ошибки:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
}

