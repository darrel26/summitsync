## 1. Schema Updates

- [x] 1.1 Update `pocketbase/pb_schema.json` to add `pin` (text) field to `trips` collection
- [x] 1.2 Update `pocketbase/pb_schema.json` to add `role` (text) field to `members` collection

## 2. Trip Creation with Organizer Identity & PIN

- [x] 2.1 Update Create Trip modal on `src/routes/+page.svelte` to include "Organizer Name" and "Organizer PIN" fields
- [x] 2.2 When creating a trip, create the `trips` record and auto-create an owner record in `members` with `role: "owner"`
- [x] 2.3 Persist creator's identity in `localStorage` (`trip_member_<tripId>` and `trip_is_owner_<tripId>: "true"`)

## 3. Organizer PIN Unlock Modal & Permissions State

- [x] 3.1 Create `OrganizerUnlockModal.svelte` component for PIN input and verification
- [x] 3.2 Add reactive permission check (`isOwner`) in `src/routes/trip/[id]/+page.svelte` based on `localStorage` state and PIN matching
- [x] 3.3 Add "Organizer Unlock / Login" button in the trip header for non-owners
- [x] 3.4 Restrict trip deletion in header to owners only

## 4. Group Gear RBAC & Permissions

- [x] 4.1 Update `ChecklistTab.svelte` to receive `isOwner` and `currentMemberId`
- [x] 4.2 Disable add, edit, delete, and assignee selector controls for non-owner members
- [x] 4.3 Enable "Packed" checkbox for Trip Owner OR if the item is assigned to `currentMemberId`; disable for other items
- [x] 4.4 Add subtle visual indicator/notice when viewing group gear in member mode

## 5. Route & Itinerary RBAC

- [x] 5.1 Update `RouteTab.svelte` to disable add form and hide move up/down, edit, and delete buttons when `!isOwner`
- [x] 5.2 Add view-only notice banner in `RouteTab.svelte` for members
- [x] 5.3 Update `ItineraryTab.svelte` to disable add form and hide move up/down, edit, and delete buttons when `!isOwner`
- [x] 5.4 Add view-only notice banner in `ItineraryTab.svelte` for members

## 6. Members Tab RBAC

- [x] 6.1 Update `MembersTab.svelte` to hide remove member action buttons when `!isOwner`
- [x] 6.2 Display "Organizer" badge next to members with `role: "owner"`
