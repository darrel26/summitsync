## Purpose

Manages an ordered list of transportation stops and waypoints for a trip — meeting points, drive segments, and key locations along the way, displayed as structured text without a map.

## Requirements

### Requirement: Add route stop
The system SHALL allow only the Trip Owner to add route stops.

#### Scenario: Add route stop
- **WHEN** the trip owner submits a route stop label and description
- **THEN** the system creates the stop linked to the trip, appended to the list

#### Scenario: Member views route add form
- **WHEN** a non-owner views the Route tab
- **THEN** the add stop form is disabled or indicates view-only mode

### Requirement: Reorder route stops
The system SHALL allow only the Trip Owner to reorder route stops.

#### Scenario: Reorder stops
- **WHEN** the trip owner moves a stop up or down
- **THEN** the system updates sort_order values and displays stops in the new order

#### Scenario: Member views reorder controls
- **WHEN** a non-owner views route stops
- **THEN** the move up/down controls are hidden or disabled

### Requirement: Edit route stop
The system SHALL allow only the Trip Owner to edit a route stop's label and description.

#### Scenario: Edit stop details
- **WHEN** the trip owner edits a stop
- **THEN** the system updates the record

#### Scenario: Member views edit actions
- **WHEN** a non-owner views route stops
- **THEN** the edit and delete actions are hidden or disabled

### Requirement: Remove route stop
The system SHALL allow only the Trip Owner to remove a route stop from the list.

#### Scenario: Delete stop
- **WHEN** the trip owner deletes a stop
- **THEN** the system removes the stop record

#### Scenario: Member views delete action
- **WHEN** a non-owner views route stops
- **THEN** the delete stop action is disabled or hidden

### Requirement: Display route stops in order
The system SHALL display route stops as a numbered ordered list sorted by sort_order.

#### Scenario: View route
- **WHEN** a user views the Route tab
- **THEN** the system displays all route stops in ascending sort_order as a numbered list
