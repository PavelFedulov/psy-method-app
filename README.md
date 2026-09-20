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

Recommended setup: one paid Render Node.js web service + Neon Free PostgreSQL. The Blueprint creates only the web service; create the database in Neon and enter its pooled connection URL as the DATABASE_URL secret in Render. See [DEPLOY.md](./DEPLOY.md) for the complete Russian-language guide and [render.yaml](./render.yaml) for the service configuration.

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
CLIENT_URL=https://your-domain.example
COOKIE_SECRET=replace-with-a-long-random-secret
DATABASE_URL=postgresql://USER:PASSWORD@ep-EXAMPLE-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=verify-full
SUPER_ADMIN_USERNAME=admin
SUPER_ADMIN_PASSWORD=replace-with-a-strong-password
```

The server initializes database tables and creates the initial super admin automatically on startup if they do not exist.

Render assigns PORT automatically. `/api/health` checks the web process without querying PostgreSQL so Neon can suspend while idle. Production database connections verify TLS certificates.
