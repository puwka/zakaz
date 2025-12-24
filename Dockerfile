# Используем официальный образ Node.js (slim вместо alpine для лучшей совместимости)
FROM node:20-slim AS base

# Устанавливаем зависимости только если они нужны
FROM base AS deps
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json* ./
# Используем npm install для автоматического обновления lock file при необходимости
RUN npm install

# Собираем приложение
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Устанавливаем переменные окружения для сборки
ENV NEXT_TELEMETRY_DISABLED 1

# Собираем приложение
RUN npm run build

# Production образ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

# Копируем необходимые файлы из standalone сборки
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

