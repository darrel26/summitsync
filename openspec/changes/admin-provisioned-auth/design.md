## Context

See `proposal.md` for motivation.
SummitSync is an SPA built on SvelteKit and PocketBase. The frontend is hosted on Vercel (Hobby plan) and PocketBase runs on Fly.io. We must enforce authentication without subscription costs or public registration.

## Goals / Non-Goals

**Goals:**
- Enforce full PocketBase API rule protection across collections.
- Provide a clean, low-friction login UI in SvelteKit using PocketBase password authentication.
- Maintain persistent auth state with `pb.authStore`.
- Provide sign-out capability in the UI.

**Non-Goals:**
- Self-serve registration or public password resets (accounts are manually provisioned by the admin via PocketBase dashboard).
- Complex role-based access control (RBAC) across different friends (all authenticated friends share trip access).
- Multi-factor authentication (MFA).

## Decisions

### Decision 1: Authentication Provider
- **Choice**: Use PocketBase native `users` collection with `pb.collection('users').authWithPassword(email, password)`.
- **Rationale**: Built-in to existing stack, zero additional services or hosting costs, automatic token storage and SSE authentication.
- **Alternatives Considered**:
  - Cloudflare Access (Zero Trust): Requires custom domain and dual configuration for Vercel + Fly.io.
  - Vercel Password Protection: Requires paid Pro tier.

### Decision 2: Client Auth Guard Pattern
- **Choice**: Root-level layout gate in `src/routes/+layout.svelte` reactive to a custom auth store / `pb.authStore.isValid`.
- **Rationale**: Minimal code diff. Unauthenticated users see a modal or full-screen login card while preserving deep-linked URL paths on successful login.
- **Alternatives Considered**: SvelteKit `hooks.client.js` navigation redirect. (SPA static build with hash/client routing works cleaner when guarded in layout state).

### Decision 3: Backend API Rule Security
- **Choice**: Update `pocketbase/pb_schema.json` rules:
  - `users`: `createRule: null` (admin only), `listRule: "@request.auth.id != ''"`, `viewRule: "@request.auth.id != ''"`.
  - `trips`, `members`, `group_items`, `personal_items`, `route`, `itinerary`: `listRule`, `viewRule`, `createRule`, `updateRule`, `deleteRule` set to `"@request.auth.id != ''"`.
- **Rationale**: Closes all unauthorized REST and SSE data access at the database level.

## Risks / Trade-offs

- **[Risk] Admin overhead creating accounts** → Acceptable given small friend circle. Credentials shared out-of-band.
- **[Risk] Token expiration mid-session** → `pb.authStore` triggers reactive state update, cleanly prompting user to log in again.
- **[Risk] Schema synchronization in production** → PocketBase admin can import updated `pb_schema.json` via admin UI or migration.
