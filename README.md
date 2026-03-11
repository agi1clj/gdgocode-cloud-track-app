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

`npm run dev` runs:

```bash
docker compose --env-file frontend/.env up --build
```

Open:

- frontend: `http://localhost:3000`
- backend root: `http://localhost:3001/`
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

## Recommended tutorial path

Follow the docs in this order:

1. start here in `README.md`
2. run the app locally and confirm the AQI dashboard works
3. push the app code to GitHub
4. continue with [docs/cloud-deploy-walkthrough.md](docs/cloud-deploy-walkthrough.md)
5. let GitHub Actions publish the Docker images
6. apply the infra from the infra repo

Use this split on purpose:

- `README.md`: local setup, project structure, and app sanity checks
- `docs/cloud-deploy-walkthrough.md`: tutorial for GitHub push, image publishing, infra apply, and cloud verification
- `docs/schema-migration-guide.md`: workflow for database or API shape changes

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

- `setup`: creates local `.env` files if missing and does not overwrite existing ones
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

- Docker Compose reads frontend variables from `frontend/.env`
- the backend container reads backend variables from `backend/.env`
- backend DB host is `postgres` for Docker Compose
- frontend API base URL is `http://localhost:3001`
- backend runs migrations automatically on startup
- `BACKEND_READ_ONLY` defaults to safe read-only behavior when unset
- local `backend/.env.example` sets `BACKEND_READ_ONLY=false` so the demo load/clear actions work out of the box

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

- `GET /`
- `GET /api/health`
- `GET /api/readings`
- `POST /api/readings/seed`
- `DELETE /api/readings`

Docs endpoints:

- `/docs`
- `/openapi.json`

## Cloud deployment

After the local app works, continue with:

- [docs/cloud-deploy-walkthrough.md](docs/cloud-deploy-walkthrough.md)

That guide covers:

1. local sanity checks
2. pushing code to GitHub
3. GitHub Actions image publishing
4. OpenTofu configuration in the infra repo
5. Cloud Run + Cloud SQL deployment
6. post-deploy verification
7. cleanup

Important detail:

- the infra repo expects full image references:
  - `frontend_image`
  - `backend_image`
- the preferred image publishing path is:
  - push code to `main`
  - wait for `Publish Docker Images`
  - copy the exact image refs into `terraform.tfvars`
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
