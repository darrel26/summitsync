## Why

The application code, components, and Docker configurations for PocketBase and SvelteKit SPA are complete, but the project is not yet initialized as a Git repository nor prepared for seamless multi-platform deployment (Vercel for frontend SPA, Railway for PocketBase container with persistent SQLite volume). This change initializes Git, configures proper `.gitignore` rules for binaries and SQLite data, and documents step-by-step deployment instructions.

## What Changes

- **Git Initialization & Ignores**: Initialize Git repository and update `.gitignore` to ensure PocketBase binaries (`pb_bin/`), local databases (`*.db`, `pb_data`), and environment secrets are excluded from source control.
- **Deployment Documentation & Environment Templates**: Provide clear configurations and deployment documentation for Vercel (Frontend SPA) and Railway (PocketBase Docker backend with persistent volume).

## Capabilities

### New Capabilities
(none — this is a tooling, repository, and deployment setup change with `skip_specs: true`)

### Modified Capabilities
(none)

## Impact

- **Git**: Initializes local `.git` repository and initial commit.
- **Files Modified/Created**: `.gitignore` updated, `DEPLOYMENT.md` created.
