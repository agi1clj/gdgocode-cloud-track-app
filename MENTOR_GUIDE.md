# Mentor Guide

Mentor runbook for the GDGoCode 2026 Cloud Track.

Related repos:

- app repo: [gdgocode-cloud-track-app](.)
- infra repo: [gdgocode-cloud-track-infra](https://github.com/agi1clj/gdgocode-cloud-track-infra)

## What mentors verify first

1. the app runs locally
2. the student can access the intended GCP project
3. billing is enabled
4. Docker Hub login works
5. images were pushed with the expected names

## Student happy path

1. run the app locally
2. seed and inspect AQI data
3. build and push Docker images
4. fill in `terraform.tfvars`
5. run `tofu init`, `tofu validate`, `tofu plan`, `tofu apply`
6. verify frontend URL, backend health, Swagger docs, and seeded data

Use this walkthrough:

- [docs/cloud-deploy-walkthrough.md](docs/cloud-deploy-walkthrough.md)

## Fast mentor checks

App repo:

```bash
cd gdgocode-cloud-track-app
npm run format:check
npm run check
npm run build
```

Infra repo:

```bash
cd gdgocode-cloud-track-infra/environments/dev
tofu validate
```

## If teams change the schema

Direct them to:

- [docs/schema-migration-guide.md](docs/schema-migration-guide.md)

Enforce this order:

1. add a new SQL migration, never edit an old applied migration
2. update backend row and API types
3. update service logic
4. update OpenAPI docs
5. update frontend types and UI
6. rerun `npm run check` and `npm run build`

Red flags:

- SQL changed but backend types did not
- backend response changed but frontend types did not
- `/docs` still shows the old schema
- only one side of the app still builds

## Common deployment mistakes

- wrong GCP project selected
- required APIs not enabled
- wrong Docker Hub username
- wrong image tag in `terraform.tfvars`
- custom Docker Hub repo names that do not match infra expectations
- Cloud SQL still provisioning when students test the backend

## Important reminder

After the hackathon:

```bash
cd gdgocode-cloud-track-infra/environments/dev
tofu destroy
```
