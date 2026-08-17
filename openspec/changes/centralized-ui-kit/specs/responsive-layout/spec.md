## MODIFIED Requirements

### Requirement: Mobile breakpoints for page layouts
All page layouts SHALL adapt to narrow viewports (below 640px) using standardized UI kit layout containers and responsive grid primitives, stacking horizontal arrangements vertically and ensuring zero horizontal page overflow.

#### Scenario: Landing page header on mobile
- **WHEN** the viewport width is below 640px
- **THEN** the top bar brand and "New Trip" button MUST stack or wrap without overlapping, and the hero section MUST render single-column

#### Scenario: Trip workspace header on mobile
- **WHEN** the viewport width is below 640px
- **THEN** the header title/meta and action buttons MUST stack vertically and action buttons MUST wrap to a new line
