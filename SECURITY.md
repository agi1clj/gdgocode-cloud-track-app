# Security Policy

## Supported use

This repository is a public workshop project.

It is designed for:

- education
- demos
- hackathons

It is not a production-ready security baseline.

## Current security model

- frontend is public
- backend is public
- no authentication is enabled
- database credentials are expected to be provided through environment variables or cloud-managed configuration
- local development uses Docker Compose and local PostgreSQL

## Important limitations

- Anyone can call the public backend endpoints in deployed workshop environments.
- Public mutation routes should stay disabled unless a demo explicitly needs them. Use `BACKEND_READ_ONLY=true` to keep the backend public but read-only.
- The sample API is intentionally simple and should not be used as-is for sensitive workloads.
- This repo is intentionally a workshop-public baseline and should not be treated as a production-ready deployment without authentication and tighter access controls.
- Students should not commit secrets or `.env` files.
- Cloud SQL access should stay behind the backend app path and not be opened broadly for direct internet access.

## Reporting a vulnerability

If you find a security issue in this repository:

1. do not open a public issue with exploit details
2. contact the maintainers privately first
3. include clear reproduction steps and impact

If no private reporting channel exists yet, open a minimal public issue asking maintainers to establish one without posting sensitive details.
