#!/bin/bash

# Скрипт для автоматической установки и настройки сервера
# Запустите на сервере: bash setup-server.sh

set -e

echo "🚀 Начинаем установку и настройку сервера..."

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Проверка прав root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Пожалуйста, запустите скрипт от имени root${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Обновление системы...${NC}"
apt update && apt upgrade -y

echo -e "${GREEN}✅ Установка Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
else
    echo "Docker уже установлен"
fi

echo -e "${GREEN}✅ Установка Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    apt install docker-compose -y
else
    echo "Docker Compose уже установлен"
fi

echo -e "${GREEN}✅ Установка Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt install nginx -y
    systemctl enable nginx
    systemctl start nginx
else
    echo "Nginx уже установлен"
fi

echo -e "${GREEN}✅ Установка утилит...${NC}"
apt install -y curl wget git nano ufw

echo -e "${GREEN}✅ Настройка файрвола...${NC}"
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

echo -e "${GREEN}✅ Создание директории проекта...${NC}"
mkdir -p /var/www/derevo
cd /var/www/derevo

echo -e "${YELLOW}⚠️  Следующие шаги:${NC}"
echo "1. Загрузите файлы проекта в /var/www/derevo"
echo "2. Создайте файл .env.production с переменными окружения"
echo "3. Запустите: cd /var/www/derevo && ./deploy.sh"
echo ""
echo -e "${GREEN}✅ Установка завершена!${NC}"


