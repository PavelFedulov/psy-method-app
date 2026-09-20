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
npm run dev

## Deploy

Recommended setup: Render Blueprint with one Node.js web service and managed PostgreSQL. See [DEPLOY.md](./DEPLOY.md) for the complete Russian-language guide. The infrastructure configuration is in [render.yaml](./render.yaml).

Build command:

```sh
npm run deploy:build
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

The server initializes database tables and creates the initial super admin automatically on startup if they do not exist.
