# Cloud Deploy Walkthrough

This is the shortest reliable path to deploy the app and infra to Google Cloud.

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

If one command fails, fix that first.

## 2. Confirm the app repo can publish images on push

The app repo already contains the publish workflow:

- `.github/workflows/docker-publish-deploy.yml`

That workflow builds and pushes:

- `DOCKERHUB_USERNAME/gdgocode-cloud-track-frontend:sha-<commit>`
- `DOCKERHUB_USERNAME/gdgocode-cloud-track-backend:sha-<commit>`

Before relying on it, make sure these GitHub repository secrets exist:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

The intended flow is:

1. commit your code
2. push to `main`
3. wait for the GitHub Action to finish
4. use the produced image tags in `terraform.tfvars`

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

1. click `Load`
2. click `Refresh`
3. confirm AQI cards, charts, and readings render

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

Example:

- commit `3f75895...` becomes image tag `sha-3f75895`

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

The value must be your intended project ID.

OpenTofu enables the required Google Cloud APIs during `tofu apply`, so students do not need to enable them manually first.

## 6. Prepare the infra variables

Go to the infra repo:

```bash
cd gdgocode-cloud-track-infra/environments/dev
cp terraform.tfvars.example terraform.tfvars
cp backend.hcl.example backend.hcl
```

Edit `terraform.tfvars` to match your project.

Recommended starter values:

```tfvars
project_id          = "YOUR_GCP_PROJECT_ID"
team_name           = "team01"
region              = "europe-west3"
frontend_image      = "your-dockerhub-user/gdgocode-cloud-track-frontend:sha-abc1234"
backend_image       = "your-dockerhub-user/gdgocode-cloud-track-backend:sha-abc1234"
frontend_event_name = "GDGoCode 2026"
backend_cors_origin = "*"
```

Notes:

- `frontend_image` and `backend_image` must be the exact Docker Hub image references published by GitHub Actions for the commit you pushed
- the usual tag format is `sha-<first7commit>`, for example `sha-3f75895`
- `team_name` must be 3-12 chars, lowercase letters, numbers, or hyphens
- if `db_password` is omitted, OpenTofu generates one and stores it in Secret Manager
- if you prefer to set it yourself, you can still add `db_password = "..."` to `terraform.tfvars`
- keep `backend_cors_origin = "*"` for workshop simplicity unless you want stricter CORS

## 7. Create a GCS bucket for OpenTofu state

Each student can keep their own remote state bucket in their own project. A prefix is recommended for each team.

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

If the bucket name is already taken globally, use a unique variant such as:

```bash
export STATE_BUCKET="${TEAM_NAME}-${PROJECT_ID}-tfstate"
```

and put that exact value in `backend.hcl`.

## 8. Initialize OpenTofu with the GCS backend

From `gdgocode-cloud-track-infra/environments/dev`:

```bash
tofu init -backend-config=backend.hcl
```

If you already created local state earlier and want to move it into the bucket, run:

```bash
tofu init -migrate-state -backend-config=backend.hcl
```

After migration, OpenTofu uses the remote state automatically. A local `terraform.tfstate.backup` file can remain in the directory as a safety copy from the migration step.

## 9. Validate the infra config

From `gdgocode-cloud-track-infra/environments/dev`:

```bash
tofu validate
tofu plan
```

Review the plan. You should see:

- one Cloud SQL instance
- one database
- one database user
- one backend service account
- one Secret Manager secret

## 10. Apply the infra

From `gdgocode-cloud-track-infra/environments/dev`:

```bash
tofu apply
```

Expected result:

- the bootstrap module enables the required Google Cloud APIs if they are not already enabled
- Cloud SQL, Secret Manager, backend Cloud Run, and frontend Cloud Run are created
- OpenTofu prints the frontend URL and backend URL at the end

Note:

- Cloud SQL instance creation is usually the slowest step in the deployment and can take several minutes
- it is normal for `tofu apply` to appear to pause while `google_sql_database_instance` is being created
- treat it as a problem only if OpenTofu returns an explicit error

Type `yes` when prompted.

When it finishes, note these outputs:

- `frontend_url`
- `backend_url`
- `cloudsql_connection_name`
- `db_password_secret_name`

## 11. Fallback for insufficient project permissions

If `tofu apply` fails with `403 notAuthorized` on Cloud SQL creation, service accounts, Secret Manager, or project IAM, the project permissions are not sufficient for the student account.

In that case, an instructor or project admin can grant the missing roles by running:

```bash
export PROJECT_ID="YOUR_GCP_PROJECT_ID"
export STUDENT_EMAIL="student@example.com"

gcloud config set project "${PROJECT_ID}"

for ROLE in \
  roles/cloudsql.admin \
  roles/run.admin \
  roles/secretmanager.admin \
  roles/iam.serviceAccountAdmin \
  roles/iam.serviceAccountUser \
  roles/resourcemanager.projectIamAdmin \
  roles/serviceusage.serviceUsageAdmin
do
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="user:${STUDENT_EMAIL}" \
    --role="${ROLE}"
done
```

This grants the student enough access to:

- allows the student to create the Cloud SQL instance
- allows the student to create Cloud Run services
- allows the student to create the backend service account and attach it to Cloud Run
- allows the student to create the Secret Manager secret
- allows the student to let OpenTofu enable required project services
- allows the student-run OpenTofu to write the project IAM binding for `roles/cloudsql.client`

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
2. insufficient project permissions for `tofu apply`
3. GitHub Action did not publish the images
4. wrong image tag in `terraform.tfvars`
5. wrong Docker Hub username in GitHub secrets
6. Cloud SQL still provisioning
7. backend cannot read `DB_PASSWORD`

Useful commands:

```bash
gcloud run services list --region=europe-west3
gcloud run services describe YOUR_BACKEND_SERVICE --region=europe-west3
gcloud sql instances list
gcloud secrets list
```

Also check the app repo Actions page:

- confirm `Publish Docker Images` is green
- confirm the pushed commit SHA matches the image tag in `terraform.tfvars`
- confirm the Docker Hub repos in the workflow output match the image refs in `terraform.tfvars`

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

## 15. Recommended first test

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
