## Purpose

Manages a day-by-day trip itinerary — the schedule of activities for each day including timing, titles, and descriptions, displayed in chronological order.

## Requirements

### Requirement: Add itinerary day
The system SHALL allow only the Trip Owner to add itinerary events.

#### Scenario: Add itinerary day
- **WHEN** the trip owner submits an itinerary event
- **THEN** the system creates the itinerary entry linked to the trip

#### Scenario: Member views itinerary add form
- **WHEN** a non-owner views the Itinerary tab
- **THEN** the add event form is disabled or indicates view-only mode

### Requirement: Reorder itinerary days
The system SHALL allow only the Trip Owner to reorder itinerary entries.

#### Scenario: Reorder days
- **WHEN** the trip owner moves an entry to a different position
- **THEN** the system updates sort_order values and displays entries in the new order

#### Scenario: Member views reorder buttons
- **WHEN** a non-owner views itinerary entries
- **THEN** the move up/down controls are hidden or disabled

### Requirement: Edit itinerary entry
The system SHALL allow only the Trip Owner to edit an itinerary entry.

#### Scenario: Edit day details
- **WHEN** the trip owner edits an itinerary entry
- **THEN** the system updates the record

#### Scenario: Member views edit buttons
- **WHEN** a non-owner views itinerary entries
- **THEN** the edit actions are hidden or disabled

### Requirement: Remove itinerary entry
The system SHALL allow only the Trip Owner to remove an itinerary entry.

#### Scenario: Delete day
- **WHEN** the trip owner deletes an itinerary entry
- **THEN** the system removes the record

#### Scenario: Member views delete button
- **WHEN** a non-owner views itinerary entries
- **THEN** the delete action is disabled or hidden

### Requirement: Display itinerary in order
The system SHALL display itinerary entries sorted by sort_order.

#### Scenario: View itinerary
- **WHEN** a user views the Itinerary tab
- **THEN** the system displays all itinerary entries in ascending sort_order showing day number, title, time, and description
