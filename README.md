# vikna-royal-site

Next.js-вітрина для Royal Technology (Вікна-Роял), Чернівці. Читає дані зі схеми `vikna_royal` у Supabase (через публічні read-only views у схемі `public`).

Дані зібрано з публічної частини [vikna-royal.com.ua](https://vikna-royal.com.ua); сирі дані й методологія збору — у репозиторії [vikna-royal-data](https://github.com/julbly38-a11y/vikna-royal-data).

## Локальний запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Деплой

Проєкт підключено до Vercel; деплой відбувається автоматично при push у `main`.

## Сторінки

- `/` — головна: компанія, контакти, партнери, вибрана продукція
- `/products` — усі категорії продукції
- `/certificates` — сертифікати відповідності зі статусом чинності
