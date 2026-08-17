## Purpose

Provides a centralized, accessible, and customizable atomic UI component kit and layout primitives built with Svelte 5 runes, Bits UI, and Tailwind CSS.

## ADDED Requirements

### Requirement: Centralized Atomic UI Kit Components
The system SHALL provide a centralized set of reusable atomic UI components located under `$lib/components/ui/` including Button, Input, Textarea, Dialog, Card, Badge, Checkbox, Tabs, and DropdownMenu.

#### Scenario: Reusable Button rendering and variants
- **WHEN** a view uses the `Button` component with variant ("default", "outline", "ghost", "destructive") or size props
- **THEN** the system renders the button with the correct styling, focus ring, and disabled state styling via Tailwind CSS classes and CVA

#### Scenario: Form input with accessible label and error state
- **WHEN** a view uses `Input` or `Textarea` with validation errors
- **THEN** the system applies danger border styles, aria-invalid attributes, and renders accessible error messages

#### Scenario: Accessible modal dialog with focus management
- **WHEN** a modal dialog is opened
- **THEN** the system manages focus trap, prevents background scrolling, and closes on Escape key or overlay click via Bits UI primitives

### Requirement: Standardized Layout Shell Primitives
The system SHALL provide layout primitives for app headers, max-width page containers, responsive content grids, and empty states.

#### Scenario: Layout container max-width and padding clamping
- **WHEN** a page view wraps content inside `PageContainer`
- **THEN** the container applies standardized responsive padding and max-width constraints across viewport sizes

#### Scenario: Standardized Empty State presentation
- **WHEN** a tab or collection has no records
- **THEN** the system renders a standardized `EmptyState` component with icon, title, description, and primary action button
