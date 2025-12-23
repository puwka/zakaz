// Валидация и форматирование российских телефонных номеров

export const phoneRegex = /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

/**
 * Проверяет, является ли строка валидным российским номером телефона
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // Проверяем, что номер начинается с 7 или 8 и содержит 11 цифр
  if (cleaned.startsWith('7') && cleaned.length === 11) return true;
  if (cleaned.startsWith('8') && cleaned.length === 11) return true;
  // Проверяем, что номер содержит 10 цифр (без кода страны)
  if (cleaned.length === 10) return true;
  return false;
}

/**
 * Форматирует номер телефона в единый формат +7XXXXXXXXXX
 */
export function formatPhoneNumber(phone: string): string {
  const numbers = phone.replace(/\D/g, '');
  
  if (numbers.length === 0) return '';
  
  // Если начинается с 8, заменяем на 7
  if (numbers.startsWith('8')) {
    return '+7' + numbers.slice(1);
  }
  
  // Если начинается с 7, добавляем +
  if (numbers.startsWith('7')) {
    return '+' + numbers;
  }
  
  // Если 10 цифр, добавляем +7
  if (numbers.length === 10) {
    return '+7' + numbers;
  }
  
  // Если меньше 10 цифр, возвращаем как есть (пользователь еще вводит)
  return phone;
}

/**
 * Применяет маску ввода телефона: +7 (XXX) XXX-XX-XX
 * Автоматически форматирует номер при вводе
 */
export function formatPhoneInput(value: string): string {
  // Удаляем все нецифровые символы
  let numbers = value.replace(/\D/g, '');
  
  // Если пусто, возвращаем пустую строку
  if (numbers.length === 0) return '';
  
  // Если начинается с 8, заменяем на 7
  if (numbers.startsWith('8')) {
    numbers = '7' + numbers.slice(1);
  }
  
  // Если не начинается с 7, добавляем 7 в начало
  if (!numbers.startsWith('7')) {
    numbers = '7' + numbers;
  }
  
  // Ограничиваем до 11 цифр (7 + 10 цифр номера)
  numbers = numbers.slice(0, 11);
  
  // Форматируем: +7 (XXX) XXX-XX-XX
  if (numbers.length === 0) return '';
  if (numbers.length === 1) return '+7';
  if (numbers.length <= 4) return `+7 (${numbers.slice(1)}`;
  if (numbers.length <= 7) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4)}`;
  if (numbers.length <= 9) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7)}`;
  return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
}

/**
 * Получает сообщение об ошибке валидации телефона
 */
export function getPhoneErrorMessage(phone: string): string {
  if (!phone.trim()) {
    return 'Телефон обязателен для заполнения';
  }
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length < 10) {
    return 'Номер телефона слишком короткий';
  }
  
  if (cleaned.length > 11) {
    return 'Номер телефона слишком длинный';
  }
  
  if (!isValidPhone(phone)) {
    return 'Введите корректный номер телефона (например: +7 (999) 123-45-67)';
  }
  
  return '';
}

