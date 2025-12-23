-- ============================================
-- ДОБАВЛЕНИЕ ПОЛЯ TELEGRAM_CHAT_ID В ТАБЛИЦУ CONTACTS_CONTENT
-- ============================================

-- Добавляем поле telegram_chat_id в таблицу contacts_content
ALTER TABLE contacts_content 
ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;

-- Комментарий к полю
COMMENT ON COLUMN contacts_content.telegram_chat_id IS 'ID чата Telegram для отправки заявок с формы обратной связи';

