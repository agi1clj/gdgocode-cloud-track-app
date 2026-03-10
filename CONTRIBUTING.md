# Contributing

## Scope

This repository is a student-friendly workshop starter.

Contributions should keep the project:

- easy to understand
- easy to run locally
- inexpensive to deploy
- aligned with Google Cloud workshop learning goals

## Before opening a pull request

1. Run formatting:

```bash
npm install
npm run format:check
```

2. Run TypeScript checks:

```bash
npm run check
```

3. Run builds:

```bash
npm run build
```

4. If you change runtime behavior, test locally with Docker Compose.

## Contribution guidelines

- Prefer simple, explicit code over clever abstractions.
- Keep the student experience first.
- Do not introduce authentication, networking, or platform complexity unless it is clearly documented and justified.
- Keep the deployment path consistent with the infra repo.
- Do not commit secrets, `.env` files, credentials, or generated cloud access tokens.

## Pull request content

Please include:

- what changed
- why it changed
- how you tested it
- any impact on workshop instructions
