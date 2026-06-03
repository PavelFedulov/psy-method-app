# Psy Method App

Веб-приложение для компьютеризации психологической методики с 10 последовательными шагами на основе оптических иллюзий.

## Stack

- Client: React + Vite + TypeScript + Tailwind
- Server: Node.js + Express + TypeScript
- Database: PostgreSQL + pg

## Run

### client

cd client
npm install
npm run dev

### server

cd server
npm install
cp .env.example .env
npm run db:init
npm run seed:super-admin
npm run dev

## Deploy

Recommended setup: deploy as one Node.js web service with a managed PostgreSQL database.

Build command:

```sh
npm ci && npm --prefix client ci && npm --prefix server ci && npm run build
```

Start command:

```sh
npm --prefix server run start
```

Production environment variables:

```sh
NODE_ENV=production
PORT=3001
CLIENT_URL=https://your-domain.example
COOKIE_SECRET=replace-with-a-long-random-secret
DATABASE_URL=postgresql://user:password@host:5432/database
SUPER_ADMIN_USERNAME=admin
SUPER_ADMIN_PASSWORD=replace-with-a-strong-password
```

On the first deploy, initialize the database and run the seed command once:

```sh
npm --prefix server run db:init
npm --prefix server run seed:super-admin
```
