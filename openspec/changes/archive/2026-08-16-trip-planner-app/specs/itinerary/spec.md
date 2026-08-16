## Purpose

Manages a day-by-day trip itinerary — the schedule of activities for each day including timing, titles, and descriptions, displayed in chronological order.

## ADDED Requirements

### Requirement: Add itinerary day
The system SHALL allow adding an itinerary entry with a day number, title, description, and time notes.

#### Scenario: Add itinerary day
- **WHEN** a member submits a day number, title, description, and time
- **THEN** the system creates the itinerary entry linked to the trip

### Requirement: Reorder itinerary days
The system SHALL allow reordering itinerary entries via drag-and-drop or move up/down controls.

#### Scenario: Reorder days
- **WHEN** a member moves an itinerary entry to a different position
- **THEN** the system updates sort_order values and displays entries in the new order

### Requirement: Edit itinerary entry
The system SHALL allow editing an itinerary entry's day number, title, description, and time.

#### Scenario: Edit day details
- **WHEN** a member edits an itinerary entry
- **THEN** the system updates the record and reflects changes in real-time

### Requirement: Remove itinerary entry
The system SHALL allow removing an itinerary entry.

#### Scenario: Delete day
- **WHEN** a member deletes an itinerary entry
- **THEN** the system removes the record

### Requirement: Display itinerary in order
The system SHALL display itinerary entries sorted by sort_order.

#### Scenario: View itinerary
- **WHEN** a user views the Itinerary tab
- **THEN** the system displays all itinerary entries in ascending sort_order showing day number, title, time, and description
