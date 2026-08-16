## Why

The project is currently named `mt-gede` across `package.json`, `fly.toml`, documentation, and configuration files. Rebranding the application to `summitsync` (matching the active UI branding "SummitSync") reflects the general-purpose nature of the collaborative group trip planner rather than a single specific location.

## What Changes

- **Update Package Metadata**: Change `name` in `package.json` to `summitsync`.
- **Update Infrastructure Configuration**: Rename `app` in `fly.toml` to `summitsync-pocketbase`.
- **Update Documentation & System Specs**: Update references to `mt-gede` across `README.md`, `CLAUDE.md`, `DEPLOYMENT.md`, and OpenSpec configuration (`openspec/config.yaml`).

## Capabilities

### New Capabilities
(none — this is a project metadata and branding rename with `skip_specs: true`)

### Modified Capabilities
(none)

## Impact

- **Configuration & Packages**: `package.json`, `fly.toml`, `openspec/config.yaml`.
- **Documentation**: `README.md`, `CLAUDE.md`, `DEPLOYMENT.md`.
