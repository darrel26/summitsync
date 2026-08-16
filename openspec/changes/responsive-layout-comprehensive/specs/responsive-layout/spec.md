## Purpose

Defines comprehensive responsive layout behavior for every feature tab and interaction pattern so SummitSync is fully operable on 320px–375px phone viewports without content clipping, overflow, or unusably small touch targets.

## ADDED Requirements

### Requirement: Itinerary event cards stack on narrow viewports
Itinerary event cards SHALL stack their time column, content area, and action buttons vertically when the viewport is below 640px, ensuring no content is clipped by the fixed-width time column.

#### Scenario: Event card at 375px viewport
- **WHEN** the viewport width is 375px and an itinerary event card is displayed
- **THEN** the time/day badges, event title/description, and action buttons MUST render stacked vertically, not as a horizontal row

#### Scenario: Time column does not clip event title
- **WHEN** the viewport width is 320px
- **THEN** the event title MUST be fully visible and not truncated by the time column's minimum width

### Requirement: Itinerary inline edit form stacks on narrow viewports
The itinerary inline edit form (day, time, and title inputs) SHALL stack vertically when the viewport is below 480px, with each input at full width.

#### Scenario: Edit event form at 375px
- **WHEN** a user edits an itinerary event on a 375px viewport
- **THEN** the day number, time, and title inputs MUST render stacked vertically, each occupying full available width

### Requirement: Itinerary add-event notes row stacks on narrow viewports
The notes input and "Add Event" button SHALL stack vertically when the viewport is below 480px.

#### Scenario: Add event form at 375px
- **WHEN** the add-event form is visible on a 375px viewport
- **THEN** the notes input and submit button MUST render stacked vertically, with the button at full width

### Requirement: Itinerary day-filter bar has scroll affordance
The day-filter pill bar SHALL provide a visual indicator when pills overflow the visible area, signaling that more day filters exist beyond the visible edge.

#### Scenario: Many days with overflow
- **WHEN** the itinerary has more than 5 days and the day-filter bar overflows on a narrow viewport
- **THEN** a visual gradient or fade MUST appear at the trailing edge to indicate scrollability

### Requirement: Checklist inline edit row stacks on narrow viewports
The group item inline edit row (name input, quantity input, assignee select, save/cancel buttons) SHALL stack or wrap into multiple rows when the viewport is below 480px.

#### Scenario: Editing group item at 375px
- **WHEN** a user edits a group gear item on a 375px viewport
- **THEN** the name input MUST occupy full width on one row, and the quantity, assignee, and action buttons MUST wrap to a second row

### Requirement: Checklist item row assignee does not push item name off-screen
The checklist item row's assignee dropdown or badge SHALL wrap below the item name on narrow viewports rather than squeezing the item name into an unreadable width.

#### Scenario: Long item name with assignee at 320px
- **WHEN** a group gear item has a long name and an assigned member on a 320px viewport
- **THEN** the assignee dropdown or badge MUST wrap below the item name, and the item name MUST remain fully readable

### Requirement: Checklist section header wraps on narrow viewports
The section header row (title with icon and progress pill) SHALL wrap so the progress pill moves below the title when there is insufficient horizontal space.

#### Scenario: Section header at 320px
- **WHEN** the "Shared Group Gear" section header is displayed on a 320px viewport
- **THEN** the progress pill MUST wrap below the section title, not overlap or clip

### Requirement: Trip card grid does not overflow 320px viewports
The landing page trip card grid's minimum column width SHALL be small enough that a single card fits within a 320px viewport including page padding.

#### Scenario: Trip list at 320px
- **WHEN** the landing page is viewed at 320px viewport width
- **THEN** trip cards MUST display in a single column without horizontal overflow on the page body

### Requirement: Viewport meta tag enables safe area insets
The HTML viewport meta tag SHALL include `viewport-fit=cover` so CSS `env(safe-area-inset-*)` values are populated on notched devices.

#### Scenario: App on a notched phone
- **WHEN** the app is opened on a device with a display notch
- **THEN** the browser MUST report accurate safe area inset values to CSS, and existing padding rules MUST take effect

### Requirement: Interactive elements meet 44px minimum touch target on mobile
All icon-only buttons and small interactive controls SHALL have a minimum tappable area of 44×44 CSS pixels on viewports below 768px.

#### Scenario: Checklist delete button on phone
- **WHEN** a user taps the delete icon button on a checklist item at a 375px viewport
- **THEN** the tappable area MUST be at least 44×44px even if the visible icon is smaller

#### Scenario: Personal item edit/delete buttons on phone
- **WHEN** a user taps the edit or delete button on a personal packing item at a 375px viewport
- **THEN** the tappable area MUST be at least 44×44px
