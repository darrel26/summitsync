## Why

The project has no developer documentation beyond a minimal CLAUDE.md stub. New contributors (human or AI agent) have zero guidance on the tech stack, how to set up the frontend or backend, project structure, or development workflow. Documentation needs to exist before the first line of app code is written, so the `trip-planner-app` change can be implemented with proper context. Additionally, AGENTS.md should symlink to CLAUDE.md so tools that look for either file find the same source of truth.

## What Changes

- **Enhance CLAUDE.md**: Expand with full project context — tech stack (SvelteKit + PocketBase), project structure conventions, development setup instructions (frontend + backend), common commands, architecture overview, and coding conventions
- **Create AGENTS.md symlink**: Symlink `AGENTS.md → CLAUDE.md` so AI tools looking for either file get the same guidance
- **Create README.md**: User-facing project overview — what the app is, how to run it locally, how to deploy

## Capabilities

### New Capabilities
(none — this is a docs/config change with `skip_specs: true`)

### Modified Capabilities
(none)

## Impact

- **Files created/modified**: `CLAUDE.md` (enhanced), `AGENTS.md` (symlink), `README.md` (new)
- **No code changes**: Documentation only
- **Dependencies**: None
