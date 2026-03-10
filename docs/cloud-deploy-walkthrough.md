# Cloud Deploy Walkthrough

This is the shortest reliable path to deploy the app and infra to Google Cloud.

Assumptions:

- you already have a GCP project
- billing is enabled on that project
- Docker Hub account exists
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

## 1. Verify local tooling

Run:

```bash
docker --version
node --version
npm --version
gcloud version
tofu version
```

If one command fails, fix that first.

## 2. Sanity-check the app locally

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

Verify:

- `http://localhost:3000`
- `http://localhost:3001/api/health`
- `http://localhost:3001/docs`

In the UI:

1. click `Load`
2. click `Refresh`
3. confirm AQI cards, charts, and readings render

Stop the stack when done:

```bash
docker compose down
```

## 3. Authenticate to Google Cloud

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

The value must be your intended project ID.

## 4. Enable required Google Cloud APIs

Run:

```bash
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  iam.googleapis.com
```

## 5. Choose one image tag

Use one tag for both services so the infra input stays simple.

Example:

```bash
export IMAGE_TAG=manual-$(date +%Y%m%d-%H%M)
export DOCKERHUB_USERNAME=your-dockerhub-user
export FRONTEND_IMAGE_REPOSITORY=gdgocode-team01-cloud-track-frontend
export BACKEND_IMAGE_REPOSITORY=gdgocode-team01-cloud-track-backend
```

## 6. Log in to Docker Hub

Run:

```bash
docker login
```

Important:

- the infra repo now accepts team-specific image repository names
- the values must match what you put in `terraform.tfvars`

Required image names:

- `${DOCKERHUB_USERNAME}/${FRONTEND_IMAGE_REPOSITORY}:${IMAGE_TAG}`
- `${DOCKERHUB_USERNAME}/${BACKEND_IMAGE_REPOSITORY}:${IMAGE_TAG}`

## 7. Build and push the backend image

From the app repo:

```bash
cd gdgocode-cloud-track-app

docker build \
  -t ${DOCKERHUB_USERNAME}/${BACKEND_IMAGE_REPOSITORY}:${IMAGE_TAG} \
  ./backend

docker push ${DOCKERHUB_USERNAME}/${BACKEND_IMAGE_REPOSITORY}:${IMAGE_TAG}
```

## 8. Build and push the frontend image

From the app repo:

```bash
docker build \
  -t ${DOCKERHUB_USERNAME}/${FRONTEND_IMAGE_REPOSITORY}:${IMAGE_TAG} \
  ./frontend

docker push ${DOCKERHUB_USERNAME}/${FRONTEND_IMAGE_REPOSITORY}:${IMAGE_TAG}
```

## 9. Prepare the infra variables

Go to the infra repo:

```bash
cd gdgocode-cloud-track-infra/environments/dev
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` to match your project.

Recommended starter values:

```tfvars
project_id          = "YOUR_GCP_PROJECT_ID"
team_name           = "team01"
region              = "europe-west3"
dockerhub_username  = "your-dockerhub-user"
frontend_image_repository = "gdgocode-team01-cloud-track-frontend"
backend_image_repository  = "gdgocode-team01-cloud-track-backend"
frontend_image_tag  = "REPLACE_WITH_IMAGE_TAG"
backend_image_tag   = "REPLACE_WITH_IMAGE_TAG"
frontend_event_name = "GDGoCode 2026"
backend_cors_origin = "*"
```

Notes:

- `frontend_image_tag` and `backend_image_tag` should both be the value of `${IMAGE_TAG}`
- `frontend_image_repository` and `backend_image_repository` should match the Docker Hub repos you created for your team
- `team_name` must be 3-12 chars, lowercase letters, numbers, or hyphens
- if `db_password` is omitted, OpenTofu generates one and stores it in Secret Manager
- if you prefer to set it yourself, you can still add `db_password = "..."` to `terraform.tfvars`
- keep `backend_cors_origin = "*"` for workshop simplicity unless you want stricter CORS

## 10. Validate the infra config

From `gdgocode-cloud-track-infra/environments/dev`:

```bash
tofu init
tofu validate
tofu plan
```

Review the plan. You should see:

- one Cloud SQL instance
- one database
- one database user
- one backend service account
- one Secret Manager secret
- one backend Cloud Run service
- one frontend Cloud Run service

## 11. Apply the infra

Run:

```bash
tofu apply
```

Type `yes` when prompted.

When it finishes, note these outputs:

- `frontend_url`
- `backend_url`
- `cloudsql_connection_name`
- `db_password_secret_name`

## 12. Verify the deployment

Use the `backend_url` from the outputs.

Check health:

```bash
curl <backend_url>/api/health
```

Seed data:

```bash
curl -X POST <backend_url>/api/readings/seed
```

Read data:

```bash
curl <backend_url>/api/readings
```

Open in the browser:

- `<frontend_url>`
- `<backend_url>/docs`

In the frontend:

1. confirm the AQI dashboard loads
2. confirm sample data appears after seeding
3. confirm the charts and table render

## 13. If something breaks, check in this order

1. wrong GCP project
2. missing enabled APIs
3. wrong Docker Hub username
4. wrong image tag in `terraform.tfvars`
5. Cloud SQL still provisioning
6. backend cannot read `DB_PASSWORD`

Useful commands:

```bash
gcloud run services list --region=europe-west3
gcloud run services describe YOUR_BACKEND_SERVICE --region=europe-west3
gcloud sql instances list
gcloud secrets list
```

## 14. What the infra is doing for you

The infra repo wires these pieces together automatically:

- frontend Cloud Run gets `VITE_API_BASE_URL` set to the deployed backend URL
- backend Cloud Run gets Cloud SQL mounted at `/cloudsql/...`
- backend reads `DB_PASSWORD` from Secret Manager
- backend startup runs migrations automatically

That means you do not need to:

- create tables manually
- inject the frontend backend URL by hand into the container
- connect your laptop directly to Cloud SQL

## 15. Recommended first production-like test

After deploy:

1. open the frontend URL
2. open the backend Swagger docs
3. seed data from Swagger or `curl`
4. refresh the frontend
5. confirm the dashboard shows the seeded AQI scenario

If that works, the full path is healthy:

- Cloud Run frontend
- Cloud Run backend
- Cloud SQL
- Secret Manager
- runtime config wiring

## 16. Cleanup after the event

When you are done with the workshop or demo:

```bash
cd gdgocode-cloud-track-infra/environments/dev
tofu destroy
```

This is the most important cost-control step.
