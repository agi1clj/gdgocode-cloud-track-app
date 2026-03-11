# Mentor Guide

Mentor runbook for the GDGoCode 2026 Cloud Track defense challenge.

Related repos:

- app repo: [gdgocode-cloud-track-app](https://github.com/agi1clj/gdgocode-cloud-track-app)
- infra repo: [gdgocode-cloud-track-infra](https://github.com/agi1clj/gdgocode-cloud-track-infra)

## What mentors verify first

1. the app runs locally
2. the student can access the intended GCP project
3. billing is enabled
4. the app repo is connected to GitHub
5. GitHub Actions has Docker Hub secrets configured
6. images were published with the expected names

## Student tutorial path

The student should follow one clear path:

1. start in [README.md](README.md)
2. run the app locally
3. seed and inspect perimeter data
4. push code to GitHub
5. open [docs/cloud-deploy-walkthrough.md](docs/cloud-deploy-walkthrough.md)
6. wait for `Publish Docker Images` to complete
7. fill in `terraform.tfvars`
8. run `tofu init`, `tofu validate`, `tofu plan`, `tofu apply`
9. verify frontend URL, backend health, Swagger docs, and seeded data

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

Review focus:

- the migration is additive or intentionally breaking
- seed data still works
- backend and frontend types stay aligned
- the API docs reflect the new response
- the UI does not silently ignore the new field

Red flags:

- student edited `001_init_perimeter_monitoring_schema.sql` after it was already used
- SQL changed but backend types did not
- backend response changed but frontend types did not
- `/docs` still shows the old schema
- only one side of the app still builds

Manual verification:

1. open `/docs`
2. call `GET /api/readings`
3. confirm the new field is present when expected
4. open the frontend dashboard
5. confirm the UI renders without missing data or runtime errors

## Common deployment mistakes

- wrong GCP project selected
- insufficient project permissions for `tofu apply`
- GitHub Actions did not publish the images
- wrong image tag in `terraform.tfvars`
- wrong Docker Hub username in GitHub secrets
- Cloud SQL still provisioning when students test the backend

Mentor check for CI:

1. open the app repo Actions page
2. confirm `Publish Docker Images` is green
3. confirm the commit SHA matches the `sha-xxxxxxx` image tag in `terraform.tfvars`

## Important reminder

After the hackathon:

```bash
cd gdgocode-cloud-track-infra/environments/dev
tofu destroy
```
