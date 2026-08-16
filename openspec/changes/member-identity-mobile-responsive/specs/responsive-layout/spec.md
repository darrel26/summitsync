## MODIFIED Requirements

### Requirement: Tab navigation adapts to mobile
The tab navigation SHALL remain fully operable and descriptive on narrow viewports (below 640px). Tab labels SHALL remain visible alongside icons and badge counts, utilizing an adaptive layout (such as a 4-column bottom navigation bar or compact equal-width segmented control) without truncating or entirely hiding tab labels.

#### Scenario: Tab labels hidden on small screen
- **WHEN** the viewport is below 480px
- **THEN** tabs MUST display icons and compact labels and each tab MUST retain its `aria-label` for accessibility

#### Scenario: Scroll affordance when tabs overflow
- **WHEN** tabs overflow the visible navigation area on a narrow viewport
- **THEN** a visual indicator MUST signal that the user can scroll to see more tabs or tabs render in fixed equal columns

#### Scenario: Mobile tab bar rendering
- **WHEN** the viewport width is below 640px
- **THEN** all tabs display an icon, concise text label, and count badge in a balanced touch-friendly layout

#### Scenario: Tab selection on mobile
- **WHEN** a user taps any tab in the mobile navigation
- **THEN** the active tab view is displayed and the active state is visually highlighted with high contrast

## ADDED Requirements

### Requirement: Mobile form input zoom prevention
All text inputs, number inputs, select dropdowns, and textareas SHALL use a minimum font size of 16px (1rem) on mobile viewports below 640px to prevent automatic viewport zoom in iOS Safari.

#### Scenario: User focuses input on iOS device
- **WHEN** a user taps a text or dropdown input on an iPhone / iOS browser
- **THEN** the browser focuses the field without triggering an automatic page zoom

### Requirement: Mobile vertical timeline view
Route stops and Itinerary events SHALL render as connected vertical timelines with touch-friendly actions on viewports below 640px.

#### Scenario: Route stops on mobile
- **WHEN** route stops are displayed on a viewport below 640px
- **THEN** stops render in a vertical sequence connected by a timeline spine with minimum 44px touch targets for reordering and editing
