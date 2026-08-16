## Purpose

Manages an ordered list of transportation stops and waypoints for a trip — meeting points, drive segments, and key locations along the way, displayed as structured text without a map.

## ADDED Requirements

### Requirement: Add route stop
The system SHALL allow adding a route stop with a label and optional description.

#### Scenario: Add route stop
- **WHEN** a member submits a route stop label and description
- **THEN** the system creates the stop linked to the trip, appended to the end of the list

### Requirement: Reorder route stops
The system SHALL allow reordering route stops via drag-and-drop or move up/down controls.

#### Scenario: Reorder stops
- **WHEN** a member moves a route stop to a different position
- **THEN** the system updates sort_order values and displays stops in the new order for all members

### Requirement: Edit route stop
The system SHALL allow editing a route stop's label and description.

#### Scenario: Edit stop details
- **WHEN** a member edits a route stop's label or description
- **THEN** the system updates the record and reflects changes in real-time

### Requirement: Remove route stop
The system SHALL allow removing a route stop from the list.

#### Scenario: Delete stop
- **WHEN** a member deletes a route stop
- **THEN** the system removes the stop record and re-renders the list

### Requirement: Display route stops in order
The system SHALL display route stops as a numbered ordered list sorted by sort_order.

#### Scenario: View route
- **WHEN** a user views the Route tab
- **THEN** the system displays all route stops in ascending sort_order as a numbered list
