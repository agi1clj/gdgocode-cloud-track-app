# Cloud Deploy Walkthrough

This is the shortest reliable path to deploy the Romania Perimeter Index Dashboard to Google Cloud.

Assumptions:

- you already have a GCP project
- billing is enabled on that project
- your Google account has permission to create Cloud SQL, Cloud Run, Secret Manager, service accounts, and project IAM bindings on that project
- Docker Hub account exists
- the app repo is connected to GitHub
- both repos are available locally:
  - `gdgocode-cloud-track-app`
  - `gdgocode-cloud-track-infra`

Infra repo:

- `https://github.com/agi1clj/gdgocode-cloud-track-infra`

This walkthrough uses the actual infra shape in this project:

- frontend on Cloud Run
- backend on Cloud Run
- PostgreSQL on Cloud SQL
- `DB_PASSWORD` in Secret Manager
- Docker images published by GitHub Actions after you push code

## 1. Verify local tooling

Run:

```bash
docker --version
node --version
npm --version
gcloud version
tofu version
```

## 2. Confirm the app repo can publish images on push

The app repo already contains the publish workflow:

- `.github/workflows/docker-publish-deploy.yml`

That workflow builds and pushes:

- `DOCKERHUB_USERNAME/gdgocode-cloud-track-frontend:sha-<commit>`
- `DOCKERHUB_USERNAME/gdgocode-cloud-track-backend:sha-<commit>`

Make sure these GitHub repository secrets exist:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

Recommended setup:

1. Sign in to Docker Hub.
2. Open `Account settings`.
3. Open the `Personal access tokens` section.
4. Create a new token for GitHub Actions.
5. Copy the token value immediately and store it somewhere temporary. Docker Hub will not show the full token again later.
6. In the GitHub app repository, open `Settings` -> `Secrets and variables` -> `Actions`.
7. Add a new repository secret named `DOCKERHUB_USERNAME` with your Docker Hub username as the value.
8. Add a new repository secret named `DOCKERHUB_TOKEN` with the Docker Hub personal access token as the value.
9. Push a commit to `main` or manually run the `Publish Docker Images` workflow to confirm the login succeeds.

If you prefer GitHub CLI, you can set the secrets from the app repo with:

```bash
gh secret set DOCKERHUB_USERNAME
gh secret set DOCKERHUB_TOKEN
```

Common mistakes in this step:

- using a Docker Hub password instead of a personal access token
- adding the secret to the wrong GitHub repository
- saving the wrong Docker Hub username
- rotating the Docker Hub token without updating `DOCKERHUB_TOKEN` in GitHub
- pushing to a branch other than `main` and expecting the publish workflow to run automatically

## 3. Sanity-check the app locally

From the app repo:

```bash
cd gdgocode-cloud-track-app
npm install
npm run setup
npm run format:check
npm run check
npm run build
npm run dev
```

If you want the exact local Docker Compose command, it is:

```bash
docker compose --env-file frontend/.env up --build
```

Verify:

- `http://localhost:3000`
- `http://localhost:3001/`
- `http://localhost:3001/api/health`
- `http://localhost:3001/docs`

In the UI:

1. click `Load scenario`
2. click `Refresh`
3. confirm the perimeter cards, charts, and event log render

Stop the stack when done:

```bash
docker compose down
```

## 4. Push the code that should be deployed

From the app repo:

```bash
cd gdgocode-cloud-track-app
git status
git add .
git commit -m "feat: ready for cloud deploy"
git push origin main
```

After the push:

1. open the GitHub Actions tab for the app repo
2. wait for `Publish Docker Images` to succeed
3. note the commit SHA that was pushed

The image tag format is:

- `sha-<first7commit>`

## 5. Authenticate to Google Cloud

Run:

```bash
gcloud auth login
gcloud auth application-default login
gcloud config set project YOUR_GCP_PROJECT_ID
```

Confirm:

```bash
gcloud config get-value project
```

OpenTofu enables the required Google Cloud APIs during `tofu apply`, so students do not need to enable them manually first.

## 6. Prepare the infra variables

Go to the infra repo:

```bash
cd gdgocode-cloud-track-infra/environments/dev
cp terraform.tfvars.example terraform.tfvars
cp backend.hcl.example backend.hcl
```

Recommended starter values:

```tfvars
project_id          = "YOUR_GCP_PROJECT_ID"
team_name           = "team01"
region              = "europe-west3"
frontend_image      = "your-dockerhub-user/gdgocode-cloud-track-frontend:sha-abc1234"
backend_image       = "your-dockerhub-user/gdgocode-cloud-track-backend:sha-abc1234"
frontend_event_name = "GDGoCode 2026"
backend_cors_origin = "*"
backend_read_only   = true
```

Notes:

- `frontend_image` and `backend_image` must be the exact Docker Hub image references published by GitHub Actions for the commit you pushed
- keep `backend_read_only = true` for a public read-only backend and set it to `false` only when a live demo explicitly needs `Load scenario` and `Clear`
- students do not need to rebuild the frontend to switch read-only mode because the UI follows the backend API response
- if `db_password` is omitted, OpenTofu generates one and stores it in Secret Manager

## 7. Create a GCS bucket for OpenTofu state

Example:

```bash
export PROJECT_ID="YOUR_GCP_PROJECT_ID"
export TEAM_NAME="YOUR_TEAM_NAME"
export STATE_BUCKET="${TEAM_NAME}-gdgocode-tfstate"

gcloud storage buckets create "gs://${STATE_BUCKET}" \
  --project="${PROJECT_ID}" \
  --location=europe-west3 \
  --uniform-bucket-level-access
```

Then edit `backend.hcl`:

```hcl
bucket = "YOUR_TEAM_NAME-gdgocode-tfstate"
```

## 8. Initialize OpenTofu with the GCS backend

From `gdgocode-cloud-track-infra/environments/dev`:

```bash
tofu init -backend-config=backend.hcl
```

If you already created local state earlier and want to move it into the bucket, run:

```bash
tofu init -migrate-state -backend-config=backend.hcl
```

## 9. Validate and apply the infra

From `gdgocode-cloud-track-infra/environments/dev`:

```bash
tofu validate
tofu plan
tofu apply
```

Expected result:

- required Google Cloud APIs are enabled by OpenTofu
- Cloud SQL, Secret Manager, backend Cloud Run, and frontend Cloud Run are created
- the backend uses the image and `BACKEND_READ_ONLY` value defined by your infra variables

## 10. Verify the deployment

After `tofu apply`, check:

1. the frontend URL opens
2. the backend root URL returns `200`
3. `/api/health` returns `ok`
4. `/docs` and `/openapi.json` load
5. `GET /api/events` returns `readOnly: true` if you deployed read-only mode
6. the dashboard loads the perimeter view without runtime errors

If you deployed writable mode for a demo:

1. click `Load scenario`
2. confirm the event cards, charts, and status cards populate
3. optionally click `Clear` and confirm the data resets

## 11. Cleanup

When the workshop is over:

```bash
cd gdgocode-cloud-track-infra/environments/dev
tofu destroy
```
