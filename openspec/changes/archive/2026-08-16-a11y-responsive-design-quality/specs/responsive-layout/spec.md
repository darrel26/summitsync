## Purpose

Defines responsive layout behavior so SummitSync renders correctly and remains fully operable on viewports from 320px (small phones) through desktop, including devices with notched displays.

## ADDED Requirements

### Requirement: Mobile breakpoints for page layouts
All page layouts SHALL adapt to narrow viewports (below 640px) by stacking horizontal arrangements vertically, collapsing multi-column grids to single-column, and ensuring no horizontal overflow or content clipping.

#### Scenario: Landing page header on mobile
- **WHEN** the viewport width is below 640px
- **THEN** the top bar brand and "New Trip" button MUST stack or wrap without overlapping, and the hero section MUST render single-column

#### Scenario: Trip workspace header on mobile
- **WHEN** the viewport width is below 640px
- **THEN** the header title/meta and action buttons MUST stack vertically and action buttons MUST wrap to a new line

### Requirement: Form inputs stack on narrow viewports
Multi-column form layouts (organizer name/PIN grid, date range grid) SHALL collapse to single-column when the viewport is below 480px.

#### Scenario: Create trip modal on small phone
- **WHEN** the create trip modal is open on a 375px viewport
- **THEN** the organizer name and PIN fields MUST render stacked vertically, not side-by-side

### Requirement: Tab navigation adapts to mobile
The tab navigation SHALL remain fully operable on narrow viewports. Tab labels MAY be hidden in favor of icon-only display below 480px. When tabs overflow the visible area, a visual affordance (e.g., fade/gradient or partial tab visibility) SHALL indicate that more tabs exist.

#### Scenario: Tab labels hidden on small screen
- **WHEN** the viewport is below 480px
- **THEN** tabs MUST display icons only (no text labels) and each tab MUST retain its `aria-label` for accessibility

#### Scenario: Scroll affordance when tabs overflow
- **WHEN** tabs overflow the visible navigation area on a narrow viewport
- **THEN** a visual indicator MUST signal that the user can scroll to see more tabs

### Requirement: Touch targets meet minimum size
All interactive elements (buttons, checkboxes, links) SHALL have a minimum touch target size of 44x44 CSS pixels on viewports below 768px, per WCAG 2.5.8.

#### Scenario: Icon button touch target on mobile
- **WHEN** the viewport is below 768px and a user taps an edit or delete icon button
- **THEN** the tappable area MUST be at least 44x44px even if the visible icon is smaller

### Requirement: Safe area insets for notched devices
Page content padding SHALL account for `env(safe-area-inset-*)` so that content is not obscured by device notches, rounded corners, or home indicators.

#### Scenario: Content on iPhone with notch
- **WHEN** the app is viewed in a mobile browser on a device with a display notch
- **THEN** page content MUST not be hidden behind the notch or home indicator area

### Requirement: No horizontal scrolling on the page body
The page body SHALL never produce a horizontal scrollbar on any supported viewport width (320px and above). Individual content areas (e.g., code blocks, wide tables) MAY scroll internally.

#### Scenario: Landing page at 320px viewport
- **WHEN** the viewport is 320px wide
- **THEN** the page body MUST not have horizontal overflow
