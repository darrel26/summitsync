<script>
	import { showToast } from '$lib/toast.js';
	import {
		Plus,
		ChevronUp,
		ChevronDown,
		Pencil,
		Trash2,
		Check,
		X,
		CalendarDays,
		Clock
	} from 'lucide-svelte';

	let {
		itineraryEntries = [],
		isOwner = false,
		onAddEntry,
		onUpdateEntry,
		onDeleteEntry
	} = $props();

	let newDay = $state(1);
	let newTitle = $state('');
	let newTime = $state('');
	let newDescription = $state('');
	let adding = $state(false);

	let editingEntryId = $state(null);
	let editDay = $state(1);
	let editTitle = $state('');
	let editTime = $state('');
	let editDescription = $state('');

	let selectedDayFilter = $state('all');

	let sortedEntries = $derived([...itineraryEntries].sort((a, b) => {
		if ((a.day ?? 0) !== (b.day ?? 0)) {
			return (a.day ?? 0) - (b.day ?? 0);
		}
		return (a.sort_order ?? 0) - (b.sort_order ?? 0);
	}));

	// Get unique days for quick-filter tabs
	let availableDays = $derived(
		Array.from(new Set(sortedEntries.map((e) => e.day || 1))).sort((a, b) => a - b)
	);

	let filteredEntries = $derived(
		selectedDayFilter === 'all'
			? sortedEntries
			: sortedEntries.filter((e) => (e.day || 1) === selectedDayFilter)
	);

	async function handleAddEntry(e) {
		e.preventDefault();
		if (!newTitle.trim()) return;

		adding = true;
		try {
			const maxSort = sortedEntries.reduce((max, item) => Math.max(max, item.sort_order ?? 0), -1);
			await onAddEntry({
				day: Number(newDay) || 1,
				title: newTitle.trim(),
				time: newTime.trim(),
				description: newDescription.trim(),
				sort_order: maxSort + 1
			});
			newTitle = '';
			newTime = '';
			newDescription = '';
			showToast('Itinerary event added', 'success');
		} catch (err) {
			console.error('Error adding itinerary entry:', err);
			showToast('Failed to add entry', 'error');
		} finally {
			adding = false;
		}
	}

	function startEdit(entry) {
		editingEntryId = entry.id;
		editDay = entry.day ?? 1;
		editTitle = entry.title;
		editTime = entry.time || '';
		editDescription = entry.description || '';
	}

	async function saveEdit(id) {
		if (!editTitle.trim()) return;
		try {
			await onUpdateEntry(id, {
				day: Number(editDay) || 1,
				title: editTitle.trim(),
				time: editTime.trim(),
				description: editDescription.trim()
			});
			editingEntryId = null;
			showToast('Entry updated', 'success');
		} catch (err) {
			console.error('Error updating entry:', err);
			showToast('Failed to update entry', 'error');
		}
	}

	async function handleDelete(entry) {
		if (confirm(`Delete "${entry.title}"?`)) {
			try {
				await onDeleteEntry(entry.id);
				showToast('Entry removed', 'info');
			} catch (err) {
				console.error('Error deleting entry:', err);
				showToast('Failed to delete entry', 'error');
			}
		}
	}

	async function moveEntry(index, direction) {
		const targetIndex = index + direction;
		if (targetIndex < 0 || targetIndex >= sortedEntries.length) return;

		const currentItem = sortedEntries[index];
		const targetItem = sortedEntries[targetIndex];

		try {
			const currentOrder = currentItem.sort_order ?? index;
			const targetOrder = targetItem.sort_order ?? targetIndex;

			const newCurrentOrder = currentOrder === targetOrder ? targetIndex : targetOrder;
			const newTargetOrder = currentOrder === targetOrder ? index : currentOrder;

			await Promise.all([
				onUpdateEntry(currentItem.id, { sort_order: newCurrentOrder }),
				onUpdateEntry(targetItem.id, { sort_order: newTargetOrder })
			]);
		} catch (err) {
			console.error('Error reordering itinerary:', err);
			showToast('Failed to reorder itinerary', 'error');
		}
	}
</script>

<div class="itinerary-layout">
	<!-- Add Event Card -->
	{#if isOwner}
		<div class="card add-card">
			<div class="card-header">
				<h2 class="card-title">Schedule Activity / Event</h2>
				<p class="card-sub">Add timeline events, summit pushes, meal times, and rest stops.</p>
			</div>

			<form onsubmit={handleAddEntry} class="add-event-form">
				<div class="event-form-grid">
					<div class="field-wrap field-day">
						<label for="entry-day">Day</label>
						<input id="entry-day" type="number" min="1" max="30" bind:value={newDay} />
					</div>
					<div class="field-wrap field-time">
						<label for="entry-time">Time</label>
						<input id="entry-time" type="text" placeholder="e.g. 05:00 AM" bind:value={newTime} />
					</div>
					<div class="field-wrap field-title">
						<label for="entry-title">Activity Title <span class="required">*</span></label>
						<input id="entry-title" type="text" placeholder="e.g. Summit Attack to Surya Kencana" bind:value={newTitle} required />
					</div>
				</div>

				<div class="notes-row">
					<input
						type="text"
						placeholder="Activity details & requirements (e.g. Bring headlamps, warm jackets, 1L water)..."
						bind:value={newDescription}
						class="input-notes"
					/>
					<button type="submit" class="btn btn-primary" disabled={adding || !newTitle.trim()}>
						<Plus size={16} />
						<span>{adding ? 'Adding...' : 'Add Event'}</span>
					</button>
				</div>
			</form>
		</div>
	{:else}
		<div class="view-only-banner">
			<span>🔒 View-Only Mode — Itinerary activities and schedules are maintained by the trip organizer.</span>
		</div>
	{/if}

	<!-- Itinerary Timeline Card -->
	<div class="card timeline-card">
		<div class="card-header flex-between">
			<div>
				<h2 class="card-title">Chronological Itinerary</h2>
				<p class="card-sub">Day-by-day plan of events</p>
			</div>
			<div class="count-pill">
				<CalendarDays size={13} />
				<span>{sortedEntries.length} events</span>
			</div>
		</div>

		<!-- Day Filter Pill Nav (if multiple days exist) -->
		{#if availableDays.length > 1}
			<div class="day-filter-bar">
				<button
					type="button"
					class="day-filter-pill"
					class:active={selectedDayFilter === 'all'}
					onclick={() => (selectedDayFilter = 'all')}
				>
					All Days
				</button>
				{#each availableDays as dayNum}
					<button
						type="button"
						class="day-filter-pill"
						class:active={selectedDayFilter === dayNum}
						onclick={() => (selectedDayFilter = dayNum)}
					>
						Day {dayNum}
					</button>
				{/each}
			</div>
		{/if}

		{#if sortedEntries.length === 0}
			<div class="empty-state">
				<p>No itinerary activities planned yet. Add schedule events above.</p>
			</div>
		{:else}
			<div class="itinerary-timeline">
				{#each filteredEntries as entry, index (entry.id)}
					<div class="event-card">
						{#if editingEntryId === entry.id}
							<div class="edit-event-block">
								<div class="edit-top-row">
									<input type="number" min="1" bind:value={editDay} class="edit-day-num" placeholder="Day" />
									<input type="text" bind:value={editTime} class="edit-time-str" placeholder="Time (e.g. 06:00 AM)" />
									<input type="text" bind:value={editTitle} class="edit-title-str" placeholder="Activity title" />
								</div>
								<input type="text" bind:value={editDescription} class="edit-desc-str" placeholder="Activity details and notes..." />
								<div class="edit-actions">
									<button type="button" class="btn btn-sm btn-primary" onclick={() => saveEdit(entry.id)}>
										<Check size={14} />
										<span>Save</span>
									</button>
									<button type="button" class="btn btn-sm btn-secondary" onclick={() => (editingEntryId = null)}>
										<X size={14} />
										<span>Cancel</span>
									</button>
								</div>
							</div>
						{:else}
							<!-- Event Time Badge -->
							<div class="time-col">
								<span class="day-badge">Day {entry.day || 1}</span>
								{#if entry.time}
									<div class="time-badge">
										<Clock size={12} />
										<span>{entry.time}</span>
									</div>
								{/if}
							</div>

							<!-- Event Content -->
							<div class="event-main">
								<h3 class="event-title">{entry.title}</h3>
								{#if entry.description}
									<p class="event-description">{entry.description}</p>
								{/if}
							</div>

							{#if isOwner}
								<!-- Actions -->
								<div class="event-actions">
									<button
										type="button"
										class="btn-icon"
										disabled={index === 0}
										onclick={() => moveEntry(index, -1)}
										title="Move up"
										aria-label="Move event up"
									>
										<ChevronUp size={15} />
									</button>
									<button
										type="button"
										class="btn-icon"
										disabled={index === sortedEntries.length - 1}
										onclick={() => moveEntry(index, 1)}
										title="Move down"
										aria-label="Move event down"
									>
										<ChevronDown size={15} />
									</button>
									<button
										type="button"
										class="btn-icon"
										onclick={() => startEdit(entry)}
										title="Edit"
										aria-label="Edit event"
									>
										<Pencil size={14} />
									</button>
									<button
										type="button"
										class="btn-icon btn-danger-hover"
										onclick={() => handleDelete(entry)}
										title="Delete"
										aria-label="Delete event"
									>
										<Trash2 size={14} />
									</button>
								</div>
							{/if}
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.view-only-banner {
		background: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-lg);
		padding: 14px 18px;
		font-size: 0.875rem;
		color: var(--text-secondary);
		box-shadow: var(--shadow-card);
	}

	.card-header {
		margin-bottom: 18px;
	}

	.flex-between {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card-title {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--text-main);
		letter-spacing: -0.01em;
	}

	.card-sub {
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin-top: 2px;
	}

	.count-pill {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-secondary);
		background: var(--bg-subtle);
		padding: 4px 10px;
		border-radius: var(--radius-full);
	}

	.add-event-form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.event-form-grid {
		display: grid;
		grid-template-columns: 80px 140px 1fr;
		gap: 10px;
	}

	@media (max-width: 640px) {
		.event-form-grid {
			grid-template-columns: 1fr;
		}
	}

	.field-wrap {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.field-wrap label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.required {
		color: var(--color-danger);
	}

	input {
		padding: 9px 12px;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		font-size: 0.9rem;
		outline: none;
	}

	input:focus {
		border-color: var(--border-focus);
	}

	.notes-row {
		display: flex;
		gap: 10px;
	}

	.input-notes {
		flex: 1;
	}

	/* Day Filter Bar */
	.day-filter-bar {
		display: flex;
		gap: 6px;
		margin-bottom: 16px;
		overflow-x: auto;
		padding-bottom: 4px;
		scrollbar-width: none;
		-webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
		mask-image: linear-gradient(to right, black 85%, transparent 100%);
	}

	.day-filter-bar::-webkit-scrollbar {
		display: none;
	}

	.day-filter-pill {
		padding: 4px 12px;
		border-radius: var(--radius-full);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-secondary);
		background: var(--bg-subtle);
		transition: all 0.15s ease;
		cursor: pointer;
	}

	.day-filter-pill:hover {
		background: var(--border-default);
		color: var(--text-main);
	}

	.day-filter-pill.active {
		background: var(--color-primary);
		color: #ffffff;
	}

	/* Timeline Events */
	.itinerary-timeline {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.event-card {
		display: flex;
		align-items: center;
		padding: 12px 16px;
		background: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		gap: 16px;
		transition: border-color 0.15s ease;
	}

	.event-card:hover {
		border-color: var(--border-hover);
	}

	.time-col {
		display: flex;
		flex-direction: column;
		gap: 4px;
		align-items: flex-start;
		min-width: 90px;
	}

	.day-badge {
		font-size: 0.725rem;
		font-weight: 700;
		background: var(--bg-subtle);
		color: var(--text-main);
		padding: 2px 7px;
		border-radius: var(--radius-sm);
	}

	.time-badge {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-emerald);
		font-family: var(--font-mono);
	}

	.event-main {
		flex: 1;
	}

	.event-title {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--text-main);
	}

	.event-description {
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin-top: 2px;
	}

	.event-actions {
		display: flex;
		gap: 2px;
	}

	.btn-icon:disabled {
		opacity: 0.25;
		cursor: not-allowed;
	}

	.btn-danger-hover:hover:not(:disabled) {
		color: var(--color-danger);
		background: var(--color-danger-light);
	}

	/* Inline Edit Box */
	.edit-event-block {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
	}

	.edit-top-row {
		display: flex;
		gap: 8px;
	}

	.edit-day-num {
		width: 60px;
	}

	.edit-time-str {
		width: 130px;
	}

	.edit-title-str {
		flex: 1;
	}

	.edit-desc-str {
		width: 100%;
	}

	.edit-actions {
		display: flex;
		gap: 8px;
	}

	.empty-state {
		text-align: center;
		padding: 36px 16px;
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	@media (max-width: 640px) {
		.event-card {
			flex-direction: column;
			align-items: flex-start;
			padding: 14px;
			gap: 12px;
		}

		.time-col {
			min-width: auto;
			flex-direction: row;
			align-items: center;
			gap: 8px;
		}

		.event-actions {
			align-self: flex-end;
			gap: 6px;
		}

		.event-actions .btn-icon {
			min-width: 40px;
			min-height: 40px;
			padding: 10px;
		}

		.day-filter-pill {
			min-height: 38px;
			display: inline-flex;
			align-items: center;
			padding: 6px 14px;
		}
	}

	@media (max-width: 480px) {
		.edit-top-row {
			flex-direction: column;
		}

		.edit-day-num,
		.edit-time-str,
		.edit-title-str {
			width: 100%;
		}

		.notes-row {
			flex-direction: column;
		}

		.notes-row .btn {
			width: 100%;
		}
	}
</style>
