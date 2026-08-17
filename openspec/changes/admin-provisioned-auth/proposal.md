## Why

SummitSync currently uses open PocketBase API rules (`""`) with no authentication, allowing anyone with network access to view or mutate trip data. Because Vercel free tier does not provide deployment password protection, we need a secure, zero-cost access control mechanism where only manually invited friends can access the app and data.

## What Changes

- **BREAKING**: Lock PocketBase data collections (`trips`, `members`, `group_items`, `personal_items`, `route`, `itinerary`) to require authenticated sessions (`@request.auth.id != ""`).
- **BREAKING**: Restrict PocketBase `users` collection creation rule to admin-only (disable public sign-up).
- Add application-level login view and authentication guard using PocketBase password auth (`authWithPassword`).
- Persist authenticated session token in client storage via PocketBase SDK `authStore`.
- Add logout capability and user profile display in top navigation.
- Pre-fill or link member identity to authenticated user record while preserving trip member workflow.

## Capabilities

### New Capabilities
- `access-control`: Admin-provisioned authentication gate, session lifecycle management, and protected PocketBase API access.

### Modified Capabilities
None.

## Impact

- **Frontend**: `src/routes/+layout.svelte`, `src/lib/pb.js`, and navigation components will enforce authentication state. Unauthenticated users cannot view trips or create new trips.
- **Backend / Schema**: PocketBase `pb_schema.json` collection API rules updated from `""` to `@request.auth.id != ""`.
- **Operations**: Account provisioning is handled manually by the admin in PocketBase dashboard (`/_/`).
