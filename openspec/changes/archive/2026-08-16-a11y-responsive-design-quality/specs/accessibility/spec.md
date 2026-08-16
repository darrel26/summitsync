## Purpose

Ensures all SummitSync UI surfaces meet WCAG 2.2 AA compliance so users with disabilities — visual, motor, cognitive — can perceive, navigate, and operate every feature using assistive technology or keyboard alone.

## ADDED Requirements

### Requirement: Color contrast meets WCAG AA minimums
All text and interactive element labels SHALL have a contrast ratio of at least 4.5:1 against their background for normal text and 3:1 for large text (18px+ bold or 24px+ regular).

#### Scenario: Muted text on white background
- **WHEN** any element uses a muted/secondary text color on a white or light surface
- **THEN** the computed contrast ratio MUST be at least 4.5:1

#### Scenario: Packed item with reduced opacity
- **WHEN** a checklist item is marked as packed and rendered with reduced opacity
- **THEN** the resulting text contrast ratio MUST still meet 4.5:1 against its background

### Requirement: Toast notifications are announced to screen readers
The toast notification region SHALL use `aria-live="polite"` and `role="status"` so that assistive technology announces toast messages when they appear.

#### Scenario: Success toast after adding an item
- **WHEN** a user adds a group gear item and a success toast appears
- **THEN** a screen reader MUST announce the toast message without requiring the user to navigate to it

### Requirement: Modals trap focus and are operable by keyboard
All modal dialogs SHALL trap keyboard focus within the modal while open, return focus to the triggering element on close, and close when the Escape key is pressed.

#### Scenario: Create trip modal focus trap
- **WHEN** the "New Trip" modal is open and the user presses Tab repeatedly
- **THEN** focus MUST cycle within the modal and never reach elements behind the overlay

#### Scenario: Modal Escape key dismissal
- **WHEN** a modal is open and the user presses Escape
- **THEN** the modal MUST close

#### Scenario: Focus restoration on close
- **WHEN** a modal is closed by any means (Escape, close button, overlay click)
- **THEN** focus MUST return to the element that opened the modal

### Requirement: Tab navigation uses ARIA tabs pattern
The trip workspace tab navigation SHALL use `role="tablist"` on the container, `role="tab"` with `aria-selected` on each tab button, and `role="tabpanel"` on the content area so assistive technology conveys the tabbed interface structure.

#### Scenario: Screen reader identifies active tab
- **WHEN** a screen reader user navigates to the tab bar
- **THEN** the screen reader MUST announce the element as a tab within a tablist and indicate whether it is selected

### Requirement: Icon-only buttons have accessible names
Every interactive button that displays only an icon (no visible text label) SHALL have an `aria-label` attribute providing a text description of its action.

#### Scenario: Delete button on a checklist item
- **WHEN** a screen reader user focuses a delete icon button on a checklist item
- **THEN** the screen reader MUST announce the button's purpose (e.g., "Delete item")

### Requirement: Loading states are announced
Loading spinners SHALL have `role="status"` and an `aria-label` describing the loading state so screen readers announce that content is loading.

#### Scenario: Trip list loading
- **WHEN** the landing page is loading trips and a spinner is visible
- **THEN** a screen reader MUST announce the loading state (e.g., "Loading trips")

### Requirement: Skip-to-content navigation link
The application SHALL provide a visually hidden skip link as the first focusable element that becomes visible on focus and navigates to the main content area, allowing keyboard users to bypass repeated navigation.

#### Scenario: Keyboard user skips header
- **WHEN** a keyboard user presses Tab on page load and the skip link receives focus
- **THEN** the link MUST become visible and activating it MUST move focus to the main content area

### Requirement: Animations respect reduced motion preference
All CSS animations and transitions SHALL be disabled or simplified when the user's operating system has `prefers-reduced-motion: reduce` enabled.

#### Scenario: Modal animation with reduced motion
- **WHEN** the user has reduced motion enabled and opens a modal
- **THEN** the modal MUST appear without scale/opacity animation
