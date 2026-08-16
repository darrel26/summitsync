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
		MapPin
	} from 'lucide-svelte';

	let {
		routeStops = [],
		isOwner = false,
		onAddStop,
		onUpdateStop,
		onDeleteStop
	} = $props();

	let newLabel = $state('');
	let newDescription = $state('');
	let adding = $state(false);

	let editingStopId = $state(null);
	let editLabel = $state('');
	let editDescription = $state('');

	let sortedStops = $derived([...routeStops].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));

	async function handleAddStop(e) {
		e.preventDefault();
		if (!newLabel.trim()) return;

		adding = true;
		try {
			const maxSort = sortedStops.reduce((max, s) => Math.max(max, s.sort_order ?? 0), -1);
			await onAddStop({
				label: newLabel.trim(),
				description: newDescription.trim(),
				sort_order: maxSort + 1
			});
			newLabel = '';
			newDescription = '';
			showToast('Route stop added', 'success');
		} catch (err) {
			console.error('Error adding stop:', err);
			showToast('Failed to add stop', 'error');
		} finally {
			adding = false;
		}
	}

	function startEdit(stop) {
		editingStopId = stop.id;
		editLabel = stop.label;
		editDescription = stop.description || '';
	}

	async function saveEdit(id) {
		if (!editLabel.trim()) return;
		try {
			await onUpdateStop(id, {
				label: editLabel.trim(),
				description: editDescription.trim()
			});
			editingStopId = null;
			showToast('Stop updated', 'success');
		} catch (err) {
			console.error('Error updating stop:', err);
			showToast('Failed to update stop', 'error');
		}
	}

	async function handleDelete(stop) {
		if (confirm(`Delete stop "${stop.label}"?`)) {
			try {
				await onDeleteStop(stop.id);
				showToast('Stop removed', 'info');
			} catch (err) {
				console.error('Error deleting stop:', err);
				showToast('Failed to delete stop', 'error');
			}
		}
	}

	async function moveStop(index, direction) {
		const targetIndex = index + direction;
		if (targetIndex < 0 || targetIndex >= sortedStops.length) return;

		const currentItem = sortedStops[index];
		const targetItem = sortedStops[targetIndex];

		try {
			const currentOrder = currentItem.sort_order ?? index;
			const targetOrder = targetItem.sort_order ?? targetIndex;

			const newCurrentOrder = currentOrder === targetOrder ? targetIndex : targetOrder;
			const newTargetOrder = currentOrder === targetOrder ? index : currentOrder;

			await Promise.all([
				onUpdateStop(currentItem.id, { sort_order: newCurrentOrder }),
				onUpdateStop(targetItem.id, { sort_order: newTargetOrder })
			]);
		} catch (err) {
			console.error('Error reordering stops:', err);
			showToast('Failed to reorder stops', 'error');
		}
	}
</script>

<div class="route-layout">
	<!-- Add Stop Card -->
	{#if isOwner}
		<div class="card add-card">
			<div class="card-header">
				<h2 class="card-title">Add Waypoint / Checkpoint</h2>
				<p class="card-sub">Meeting points, trailheads, shelters, water sources and campsites.</p>
			</div>

			<form onsubmit={handleAddStop} class="add-stop-form">
				<div class="input-grid">
					<input
						type="text"
						placeholder="Location or checkpoint (e.g. Cibodas Basecamp)..."
						bind:value={newLabel}
						required
						class="input-location"
					/>
					<input
						type="text"
						placeholder="Notes & instructions (e.g. Meet at 05:00 AM, parking fee 20k)..."
						bind:value={newDescription}
						class="input-notes"
					/>
				</div>
				<button type="submit" class="btn btn-primary" disabled={adding || !newLabel.trim()}>
					<Plus size={16} />
					<span>{adding ? 'Adding...' : 'Add Waypoint'}</span>
				</button>
			</form>
		</div>
	{:else}
		<div class="view-only-banner">
			<span>🔒 View-Only Mode — Route waypoints and stops are maintained by the trip organizer.</span>
		</div>
	{/if}

	<!-- Stops Timeline Card -->
	<div class="card timeline-card">
		<div class="card-header flex-between">
			<div>
				<h2 class="card-title">Route Trail & Stops</h2>
				<p class="card-sub">Step-by-step route order</p>
			</div>
			<div class="count-pill">
				<MapPin size={13} />
				<span>{sortedStops.length} stops</span>
			</div>
		</div>

		{#if sortedStops.length === 0}
			<div class="empty-state">
				<p>No route stops added yet. Add your starting point, checkpoints, and destination above.</p>
			</div>
		{:else}
			<div class="trail-timeline">
				{#each sortedStops as stop, index (stop.id)}
					<div class="timeline-step">
						<!-- Marker & Connecting Line -->
						<div class="step-indicator">
							<div class="step-num">{index + 1}</div>
							{#if index < sortedStops.length - 1}
								<div class="step-line"></div>
							{/if}
						</div>

						<!-- Step Box -->
						<div class="step-body">
							{#if editingStopId === stop.id}
								<div class="edit-stop-block">
									<input
										type="text"
										bind:value={editLabel}
										class="edit-input-field"
										placeholder="Stop name"
									/>
									<input
										type="text"
										bind:value={editDescription}
										class="edit-input-field"
										placeholder="Notes or instructions"
									/>
									<div class="edit-btn-row">
										<button type="button" class="btn btn-sm btn-primary" onclick={() => saveEdit(stop.id)}>
											<Check size={14} />
											<span>Save</span>
										</button>
										<button type="button" class="btn btn-sm btn-secondary" onclick={() => (editingStopId = null)}>
											<X size={14} />
											<span>Cancel</span>
										</button>
									</div>
								</div>
							{:else}
								<div class="stop-info">
									<h3 class="stop-name">{stop.label}</h3>
									{#if stop.description}
										<p class="stop-details">{stop.description}</p>
									{/if}
								</div>

								{#if isOwner}
									<div class="step-actions">
										<button
											type="button"
											class="btn-icon"
											disabled={index === 0}
											onclick={() => moveStop(index, -1)}
											title="Move up"
											aria-label="Move stop up"
										>
											<ChevronUp size={15} />
										</button>
										<button
											type="button"
											class="btn-icon"
											disabled={index === sortedStops.length - 1}
											onclick={() => moveStop(index, 1)}
											title="Move down"
											aria-label="Move stop down"
										>
											<ChevronDown size={15} />
										</button>
										<button
											type="button"
											class="btn-icon"
											onclick={() => startEdit(stop)}
											title="Edit stop"
											aria-label="Edit stop"
										>
											<Pencil size={14} />
										</button>
										<button
											type="button"
											class="btn-icon btn-danger-hover"
											onclick={() => handleDelete(stop)}
											title="Delete stop"
											aria-label="Delete stop"
										>
											<Trash2 size={14} />
										</button>
									</div>
								{/if}
							{/if}
						</div>
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

	.add-stop-form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.input-grid {
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: 10px;
	}

	@media (max-width: 640px) {
		.input-grid {
			grid-template-columns: 1fr;
		}
	}

	.input-location,
	.input-notes {
		padding: 9px 12px;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		font-size: 0.9rem;
		outline: none;
	}

	.input-location:focus,
	.input-notes:focus {
		border-color: var(--border-focus);
	}

	/* Timeline */
	.trail-timeline {
		display: flex;
		flex-direction: column;
		margin-top: 8px;
	}

	.timeline-step {
		display: flex;
		gap: 14px;
		position: relative;
		padding-bottom: 18px;
	}

	.timeline-step:last-child {
		padding-bottom: 0;
	}

	.step-indicator {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.step-num {
		width: 28px;
		height: 28px;
		border-radius: var(--radius-full);
		background: var(--color-primary);
		color: #ffffff;
		font-size: 0.75rem;
		font-weight: 700;
		display: grid;
		place-content: center;
		z-index: 2;
	}

	.step-line {
		width: 2px;
		flex: 1;
		background: var(--border-default);
		margin-top: 4px;
		margin-bottom: 4px;
	}

	.step-body {
		flex: 1;
		background: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		padding: 12px 16px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		transition: border-color 0.15s ease;
	}

	.step-body:hover {
		border-color: var(--border-hover);
	}

	.stop-info {
		flex: 1;
	}

	.stop-name {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--text-main);
	}

	.stop-details {
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin-top: 2px;
	}

	.step-actions {
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

	.edit-stop-block {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
	}

	.edit-input-field {
		width: 100%;
		padding: 7px 10px;
		border: 1px solid var(--border-focus);
		border-radius: var(--radius-sm);
		font-size: 0.875rem;
	}

	.edit-btn-row {
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
		.step-body {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
			padding: 14px;
		}

		.step-actions {
			align-self: flex-end;
			gap: 6px;
		}

		.step-actions .btn-icon {
			min-width: 40px;
			min-height: 40px;
			padding: 10px;
		}
	}
</style>
