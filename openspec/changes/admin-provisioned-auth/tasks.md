## 1. PocketBase Backend Rules

- [x] 1.1 Update `pocketbase/pb_schema.json` to disable public user registration (`createRule: null` on `users` collection)
- [x] 1.2 Update API rules on `trips`, `members`, `group_items`, `personal_items`, `route`, and `itinerary` collections to `@request.auth.id != ""`

## 2. Frontend Authentication State & Login UI

- [x] 2.1 Create reactive auth store wrapper in `src/lib/auth.svelte.js` or `src/lib/pb.js` syncing with `pb.authStore`
- [x] 2.2 Create `src/lib/components/LoginModal.svelte` / login view supporting email + password submission and error handling
- [x] 2.3 Add root layout auth guard in `src/routes/+layout.svelte` to block unauthenticated views
- [x] 2.4 Add user status badge and sign-out button to the app header/navigation

## 3. Verification & Testing

- [x] 3.1 Verify unauthenticated direct API access fails with 401/403
- [x] 3.2 Verify login with provisioned user credentials grants full access and restores session on refresh
- [x] 3.3 Verify sign-out clears auth token and redirects to login view
