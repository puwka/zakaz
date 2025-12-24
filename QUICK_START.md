# 🚀 Быстрый старт - Развертывание на VDS

## 📝 Краткая инструкция

### 1. Подключитесь к серверу
```bash
ssh root@193.32.188.93
# Пароль: Zt7Ncu36feJh
```

### 2. Установите необходимое ПО
```bash
# Обновление системы
apt update && apt upgrade -y

# Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

# Docker Compose
apt install docker-compose -y

# Nginx
apt install nginx -y
```

### 3. Загрузите проект на сервер

**С вашего локального компьютера:**
```bash
# Используйте rsync (рекомендуется) или scp
rsync -avz --exclude 'node_modules' --exclude '.next' \
  ./ root@193.32.188.93:/var/www/derevo/
```

**Или на сервере создайте директорию и загрузите файлы:**
```bash
mkdir -p /var/www/derevo
cd /var/www/derevo
# Загрузите файлы проекта сюда
```

### 4. Настройте переменные окружения
```bash
cd /var/www/derevo
nano .env.production
```

Добавьте:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш-anon-key
SUPABASE_SERVICE_ROLE_KEY=ваш-service-role-key
TELEGRAM_BOT_TOKEN=ваш-token
TELEGRAM_CHAT_ID=ваш-chat-id
```

### 5. Запустите приложение
```bash
cd /var/www/derevo
chmod +x deploy.sh
./deploy.sh
```

### 6. Настройте Nginx
```bash
cp /var/www/derevo/nginx.conf /etc/nginx/sites-available/derevo
ln -s /etc/nginx/sites-available/derevo /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

### 7. Настройте SSL (опционально, но рекомендуется)
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d derevo.space -d www.derevo.space
```

## ✅ Готово!

Сайт должен быть доступен по адресу: **http://derevo.space** (или https:// после настройки SSL)

## 📋 Полезные команды

```bash
# Просмотр логов
docker-compose logs -f

# Перезапуск
docker-compose restart

# Остановка
docker-compose down

# Обновление (после изменений в коде)
git pull  # или загрузите новые файлы
./deploy.sh
```

## 📖 Подробная инструкция

См. файл `DEPLOY.md` для детальной инструкции и решения проблем.


