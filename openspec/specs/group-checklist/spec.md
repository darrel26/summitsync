## Purpose

Manages shared group gear items for a trip — things like tents, stoves, and tarps that the group needs collectively, with clear ownership of who is responsible for bringing each item.

## Requirements

### Requirement: Add group item
The system SHALL allow only the Trip Owner to add group items.

#### Scenario: Add group item
- **WHEN** the trip owner submits a group item name and quantity
- **THEN** the system creates the item linked to the trip, visible to all members

#### Scenario: Member views group add form
- **WHEN** a non-owner views the Group Gear section
- **THEN** the add group item form is disabled or hidden

### Requirement: Assign group item to member
The system SHALL allow assigning a group item to a specific member who is responsible for bringing it.

#### Scenario: Assign item
- **WHEN** a member selects an assignee from the trip's member list for a group item
- **THEN** the system updates the item's assigned_to field and displays the assignee's name next to the item

#### Scenario: Unassigned item
- **WHEN** a group item has no assignee
- **THEN** the system displays the item without an assignee label

### Requirement: Toggle group item packed status
The system SHALL allow toggling the packed status of a group item by the Trip Owner OR the member to whom the item is assigned.

#### Scenario: Mark as packed
- **WHEN** the trip owner checks the packed checkbox on any item, OR an assigned member checks the packed checkbox on their assigned item
- **THEN** the system updates the item's packed status to true

#### Scenario: Unmark as packed
- **WHEN** the trip owner unchecks the packed checkbox on any item, OR an assigned member unchecks the packed checkbox on their assigned item
- **THEN** the system updates the item's packed status to false

#### Scenario: Unassigned or other member's gear checkbox
- **WHEN** a non-owner member views a group item assigned to another member or unassigned
- **THEN** the packed checkbox is disabled for that member

### Requirement: Remove group item
The system SHALL allow removing a group item from the trip only by the Trip Owner.

#### Scenario: Delete group item
- **WHEN** the trip owner deletes a group item
- **THEN** the system removes the item record

#### Scenario: Member views delete button
- **WHEN** a non-owner member views group items
- **THEN** the delete action is disabled or hidden

### Requirement: Edit group item
The system SHALL allow only the Trip Owner to edit a group item's name, quantity, and assigned member.

#### Scenario: Edit item details
- **WHEN** the trip owner edits a group item's details
- **THEN** the system updates the record and syncs changes to all participants

#### Scenario: Member views edit actions
- **WHEN** a non-owner views group gear items
- **THEN** the edit, delete, and assignee selector controls are disabled
