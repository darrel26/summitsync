## Context

The repository lacks `.git` initialization and ignores local binary downloads (`pb_bin/`) and SQLite database files (`pb_data/data.db`). See `proposal.md` for motivation. We need clean repository hygiene and a deployment workflow targeting Vercel (frontend SPA) and Railway (PocketBase backend).

## Goals / Non-Goals

**Goals:**
- Initialize Git repository and add rules to `.gitignore` preventing database, binary, and environment secret leaks.
- Document deployment guide (`DEPLOYMENT.md`) for Vercel and Railway.
- Create initial git commit.

**Non-Goals:**
- Automating CI/CD pipelines (GitHub Actions) at this stage.

## Decisions

### 1. `.gitignore` Rule Enhancements
- **Rules**:
  ```
  # PocketBase local binaries & sqlite databases
  pb_bin/
  pb_data/
  *.db
  *.db-journal
  *.db-shm
  *.db-wal
  ```

### 2. Deployment Architecture
- **Vercel**: Deploy SvelteKit SPA from repository root using `@sveltejs/adapter-static` with environment variable `VITE_POCKETBASE_URL` set to the live Railway domain.
- **Railway**: Deploy `Dockerfile.pocketbase` container with a persistent volume mounted to `/pb/pb_data` to preserve SQLite data across builds.

## Risks / Trade-offs

- **[Unmounted Railway Volume]** → If Railway is deployed without a volume, SQLite resets on container restart. Mitigation: Document volume mounting step explicitly in `DEPLOYMENT.md`.
