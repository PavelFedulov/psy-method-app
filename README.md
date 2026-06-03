# Psy Method App

Веб-приложение для компьютеризации психологической методики с 10 последовательными шагами на основе оптических иллюзий.

## Stack

- Client: React + Vite + TypeScript + Tailwind
- Server: Node.js + Express + TypeScript
- Database: SQLite + better-sqlite3

## Run

### client

cd client
npm install
npm run dev

### server

cd server
npm install
npm run dev

## Deploy

Recommended setup: deploy as one Node.js web service with a persistent disk for SQLite data.

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
CORE_DB_PATH=/opt/render/project/src/storage/core.sqlite
ADMIN_DB_DIR=/opt/render/project/src/storage/admin-dbs
SUPER_ADMIN_USERNAME=admin
SUPER_ADMIN_PASSWORD=replace-with-a-strong-password
```

On the first deploy, run the seed command once after the persistent disk is attached:

```sh
npm --prefix server run seed:super-admin
```
