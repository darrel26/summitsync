## Context

The repository name and configuration files refer to `mt-gede`. See `proposal.md` for motivation. We need to rename references across metadata and deployment configurations to `summitsync`.

## Goals / Non-Goals

**Goals:**
- Update project name in `package.json` to `summitsync`.
- Update Fly.io app configuration in `fly.toml` to `summitsync-pocketbase`.
- Update project references in `README.md`, `CLAUDE.md`, `DEPLOYMENT.md`, and `openspec/config.yaml`.

**Non-Goals:**
- Renaming the parent directory on the local filesystem.

## Decisions

### 1. Naming Choice
- **Name**: `summitsync`
- **Why**: Aligns directly with the application header branding ("SummitSync"), conveying outdoor expedition planning and real-time collaboration without restricting the app to a single mountain or trip.

## Risks / Trade-offs

- **[Fly.io app name collision]** → If `summitsync-pocketbase` is taken on Fly.io, the deployment config can be adjusted.
