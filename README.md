# GDGoCode Cloud Track App

Cluj-Napoca AQI dashboard starter for the GDGoCode 2026 Cloud Track.

This repo contains the application code. Cloud infrastructure lives in the companion repo [gdgocode-cloud-track-infra](https://github.com/agi1clj/gdgocode-cloud-track-infra).

## What this repo contains

- `frontend/`: React + Vite + TypeScript + Material UI dashboard
- `backend/`: Node.js + Express + TypeScript API
- `docker-compose.yml`: local frontend + backend + PostgreSQL stack
- `docs/schema-migration-guide.md`: database/API change workflow
- `docs/cloud-deploy-walkthrough.md`: step-by-step cloud deployment guide

## Quick start

From the repo root:

```bash
npm install
npm run setup
npm run dev
```

Open:

- frontend: `http://localhost:3000`
- backend health: `http://localhost:3001/api/health`
- Swagger UI: `http://localhost:3001/docs`

Suggested local check:

1. Open the dashboard.
2. Click `Load`.
3. Click `Refresh`.
4. Confirm the cards, charts, and AQI table update.

Stop the stack:

```bash
docker compose down
```

## Core commands

From the repo root:

```bash
npm run setup
npm run dev
npm run db:migrate
npm run format:check
npm run check
npm run build
```

What they do:

- `setup`: creates local `.env` files if missing
- `dev`: starts the local Docker Compose stack
- `db:migrate`: runs backend SQL migrations manually
- `format:check`: checks formatting with Prettier
- `check`: runs TypeScript checks for frontend and backend
- `build`: builds frontend and backend

## Local configuration

Backend template:

- [backend/.env.example](backend/.env.example)

Frontend template:

- [frontend/.env.example](frontend/.env.example)

Important defaults:

- backend DB host is `postgres` for Docker Compose
- frontend API base URL is `http://localhost:3001`
- backend runs migrations automatically on startup

## App structure

Backend:

- [app.ts](backend/src/app.ts)
- [index.ts](backend/src/index.ts)
- [routes/readings.ts](backend/src/routes/readings.ts)
- [services/readings.ts](backend/src/services/readings.ts)
- [migrations.ts](backend/src/migrations.ts)

Frontend:

- [App.tsx](frontend/src/App.tsx)
- [DashboardHero.tsx](frontend/src/components/DashboardHero.tsx)
- [DashboardControls.tsx](frontend/src/components/DashboardControls.tsx)
- [ReadingsSection.tsx](frontend/src/components/ReadingsSection.tsx)
- [config.ts](frontend/src/config.ts)

## API overview

Main endpoints:

- `GET /api/health`
- `GET /api/readings`
- `POST /api/readings/seed`
- `DELETE /api/readings`

Docs endpoints:

- `/docs`
- `/openapi.json`

## Cloud deployment

Use the walkthrough:

- [docs/cloud-deploy-walkthrough.md](docs/cloud-deploy-walkthrough.md)

That guide covers:

1. local sanity checks
2. Docker image build and push
3. OpenTofu configuration in the infra repo
4. Cloud Run + Cloud SQL deployment
5. post-deploy verification
6. cleanup

Important detail:

- the infra repo expects Docker Hub images named:
  - `<dockerhub_username>/<frontend_image_repository>:<tag>`
  - `<dockerhub_username>/<backend_image_repository>:<tag>`
- `db_password` is optional in infra; if omitted, OpenTofu generates it and stores it in Secret Manager

## Schema changes

If you change the database structure or API response shape, use:

- [docs/schema-migration-guide.md](docs/schema-migration-guide.md)

## Repo quality status

Current baseline checks for this repo:

- `npm run check`
- `npm run build`
- `npm audit --audit-level=high` in `frontend/`
- `npm audit --audit-level=high` in `backend/`

## Companion docs

- [MENTOR_GUIDE.md](MENTOR_GUIDE.md)
- [SECURITY.md](SECURITY.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [gdgocode-cloud-track-infra](https://github.com/agi1clj/gdgocode-cloud-track-infra)
