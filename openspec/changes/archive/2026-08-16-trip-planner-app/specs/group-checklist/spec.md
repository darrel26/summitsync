## Purpose

Manages shared group gear items for a trip — things like tents, stoves, and tarps that the group needs collectively, with clear ownership of who is responsible for bringing each item.

## ADDED Requirements

### Requirement: Add group item
The system SHALL allow any member to add a group item with a name and quantity.

#### Scenario: Add group item
- **WHEN** a member submits a group item name and quantity
- **THEN** the system creates the item linked to the trip, visible to all members, with packed status unchecked

### Requirement: Assign group item to member
The system SHALL allow assigning a group item to a specific member who is responsible for bringing it.

#### Scenario: Assign item
- **WHEN** a member selects an assignee from the trip's member list for a group item
- **THEN** the system updates the item's assigned_to field and displays the assignee's name next to the item

#### Scenario: Unassigned item
- **WHEN** a group item has no assignee
- **THEN** the system displays the item without an assignee label

### Requirement: Toggle group item packed status
The system SHALL allow toggling the packed/not-packed checkbox on a group item.

#### Scenario: Mark as packed
- **WHEN** a member checks the packed checkbox on a group item
- **THEN** the system updates the item's packed status to true, visible to all members in real-time

#### Scenario: Unmark as packed
- **WHEN** a member unchecks the packed checkbox on a group item
- **THEN** the system updates the item's packed status to false

### Requirement: Remove group item
The system SHALL allow removing a group item from the trip.

#### Scenario: Delete group item
- **WHEN** a member deletes a group item
- **THEN** the system removes the item record

### Requirement: Edit group item
The system SHALL allow editing a group item's name, quantity, and assignment.

#### Scenario: Edit item details
- **WHEN** a member edits a group item's name, quantity, or assigned member
- **THEN** the system updates the record and reflects changes to all members in real-time
