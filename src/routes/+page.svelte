<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pb.js';
	import { showToast } from '$lib/toast.js';
	import {
		Compass,
		Plus,
		Calendar,
		ArrowUpRight,
		X,
		Mountain,
		Users2,
		ListChecks,
		MapPin,
		Clock,
		Sparkles
	} from 'lucide-svelte';

	let trips = $state([]);
	let tripStats = $state({}); // keyed by tripId: { membersCount, itemsCount, stopsCount }
	let loading = $state(true);
	let showModal = $state(false);
	let creating = $state(false);

	let tripName = $state('');
	let organizerName = $state('');
	let organizerPin = $state('');
	let startDate = $state('');
	let endDate = $state('');
	let isRange = $state(true);
	let tripDescription = $state('');

	// Format display date for a trip record
	function formatDisplayDate(dateStr) {
		if (!dateStr) return null;
		// If stored as YYYY-MM-DD to YYYY-MM-DD or single YYYY-MM-DD
		if (dateStr.includes(' - ')) {
			const [start, end] = dateStr.split(' - ');
			return `${formatFriendly(start)} – ${formatFriendly(end)}`;
		}
		return formatFriendly(dateStr);
	}

	function formatFriendly(isoDate) {
		try {
			if (!isoDate || !isoDate.includes('-')) return isoDate;
			const parts = isoDate.split('-');
			if (parts.length !== 3) return isoDate;
			const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
			if (isNaN(d.getTime())) return isoDate;
			return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
		} catch {
			return isoDate;
		}
	}

	async function loadTrips() {
		loading = true;
		try {
			const list = await pb.collection('trips').getFullList();
			trips = list;

			// Fetch counts for each trip to enrich the cards with micro-stats
			fetchTripCounts(list);
		} catch (err) {
			console.error('Error fetching trips:', err);
			showToast('Failed to load trips from PocketBase', 'error');
		} finally {
			loading = false;
		}
	}

	async function fetchTripCounts(tripList) {
		const statsMap = {};
		for (const t of tripList) {
			try {
				const [membersRes, groupRes, routeRes] = await Promise.all([
					pb.collection('members').getList(1, 1, { filter: `trip = "${t.id}"` }).catch(() => ({ totalItems: 0 })),
					pb.collection('group_items').getList(1, 1, { filter: `trip = "${t.id}"` }).catch(() => ({ totalItems: 0 })),
					pb.collection('route').getList(1, 1, { filter: `trip = "${t.id}"` }).catch(() => ({ totalItems: 0 }))
				]);
				statsMap[t.id] = {
					members: membersRes.totalItems || 0,
					items: groupRes.totalItems || 0,
					stops: routeRes.totalItems || 0
				};
			} catch {
				statsMap[t.id] = { members: 0, items: 0, stops: 0 };
			}
		}
		tripStats = statsMap;
	}

	async function handleCreateTrip(e) {
		e.preventDefault();
		if (!tripName.trim()) {
			showToast('Trip name is required', 'error');
			return;
		}

		if (!organizerName.trim()) {
			showToast('Organizer name is required', 'error');
			return;
		}

		if (!organizerPin.trim()) {
			showToast('Organizer PIN is required', 'error');
			return;
		}

		let formattedDate = '';
		if (isRange && startDate && endDate) {
			formattedDate = `${startDate} - ${endDate}`;
		} else if (startDate) {
			formattedDate = startDate;
		}

		creating = true;
		try {
			const tripRecord = await pb.collection('trips').create({
				name: tripName.trim(),
				date: formattedDate,
				description: tripDescription.trim(),
				pin: organizerPin.trim()
			});

			// Create Owner record in members collection
			const memberRecord = await pb.collection('members').create({
				name: organizerName.trim(),
				trip: tripRecord.id,
				role: 'owner'
			});

			// Persist identity in localStorage
			localStorage.setItem(`trip_member_${tripRecord.id}`, memberRecord.id);
			localStorage.setItem(`trip_is_owner_${tripRecord.id}`, 'true');

			showToast('Trip created successfully as Organizer!', 'success');
			showModal = false;
			goto(`/trip/${tripRecord.id}`);
		} catch (err) {
			console.error('Error creating trip:', err);
			showToast('Failed to create trip', 'error');
		} finally {
			creating = false;
		}
	}

	function resetForm() {
		tripName = '';
		organizerName = '';
		organizerPin = '';
		startDate = '';
		endDate = '';
		tripDescription = '';
		showModal = false;
	}

	onMount(() => {
		loadTrips();
	});
</script>

<svelte:head>
	<title>SummitSync - Group Trip Planner</title>
</svelte:head>

<div class="page-wrap">
	<!-- Top Bar -->
	<header class="top-bar">
		<div class="brand">
			<div class="brand-icon">
				<Mountain size={20} strokeWidth={2.2} />
			</div>
			<div class="brand-text">
				<span class="brand-name">SummitSync</span>
				<span class="brand-badge">Outdoor Expedition Planner</span>
			</div>
		</div>

		<button class="btn btn-primary" onclick={() => (showModal = true)}>
			<Plus size={16} />
			<span>New Trip</span>
		</button>
	</header>

	<!-- Main Container -->
	<main class="content-container">
		<div class="hero-header">
			<div class="hero-text-wrap">
				<h1 class="hero-title">Adventures & Expeditions</h1>
				<p class="hero-desc">
					Coordinate group gear, routes, and day-by-day itineraries with instant real-time sync.
				</p>
			</div>

			<div class="hero-badge-pill">
				<Sparkles size={14} class="pill-sparkle" />
				<span>Zero Login Required</span>
			</div>
		</div>

		{#if loading}
			<div class="loading-state">
				<div class="spinner"></div>
				<p>Loading trips...</p>
			</div>
		{:else if trips.length === 0}
			<div class="empty-card">
				<div class="empty-icon-wrap">
					<Compass size={32} strokeWidth={1.5} />
				</div>
				<h2 class="empty-title">No adventures planned yet</h2>
				<p class="empty-desc">
					Create your first trip to organize packing gear, checkpoints, and schedules together with your group.
				</p>
				<button class="btn btn-primary" onclick={() => (showModal = true)}>
					<Plus size={16} />
					<span>Create Your First Trip</span>
				</button>
			</div>
		{:else}
			<div class="trips-grid">
				{#each trips as trip (trip.id)}
					{@const stats = tripStats[trip.id] || { members: 0, items: 0, stops: 0 }}
					{@const displayDate = formatDisplayDate(trip.date)}
					<a href="/trip/{trip.id}" class="trip-card">
						<div class="card-header">
							<div class="card-header-main">
								<h2 class="card-title">{trip.name}</h2>
								{#if displayDate}
									<div class="card-date-badge">
										<Calendar size={12} />
										<span>{displayDate}</span>
									</div>
								{/if}
							</div>
							<div class="icon-open-circle">
								<ArrowUpRight size={16} />
							</div>
						</div>

						<div class="card-body">
							{#if trip.description}
								<p class="card-description">{trip.description}</p>
							{:else}
								<p class="card-description empty-desc">No description added yet.</p>
							{/if}
						</div>

						<!-- Card Footer with Micro-Stats -->
						<div class="card-footer">
							<div class="micro-stats">
								<div class="stat-item" title="Members">
									<Users2 size={13} />
									<span>{stats.members}</span>
								</div>
								<div class="stat-item" title="Group Gear Items">
									<ListChecks size={13} />
									<span>{stats.items}</span>
								</div>
								<div class="stat-item" title="Route Checkpoints">
									<MapPin size={13} />
									<span>{stats.stops}</span>
								</div>
							</div>

							<span class="open-label">Open Workspace</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</main>
</div>

<!-- Modal: New Trip with Date Picker -->
{#if showModal}
	<div
		class="modal-overlay"
		role="dialog"
		aria-modal="true"
		onclick={(e) => { if (e.target === e.currentTarget) resetForm(); }}
		onkeydown={(e) => { if (e.key === 'Escape') resetForm(); }}
		tabindex="-1"
	>
		<div class="modal-window">
			<div class="modal-head">
				<div>
					<h3 class="modal-title">Create New Trip</h3>
					<p class="modal-sub">Start planning gear, trail routes, and day schedules.</p>
				</div>
				<button class="btn-close" onclick={resetForm} aria-label="Close modal">
					<X size={18} />
				</button>
			</div>

			<form onsubmit={handleCreateTrip} class="modal-form">
				<!-- Trip Name -->
				<div class="input-group">
					<label for="trip-name">Trip Name <span class="required">*</span></label>
					<input
						type="text"
						id="trip-name"
						bind:value={tripName}
						placeholder="e.g., Mount Gede Weekend Expedition"
						required
					/>
				</div>

				<!-- Organizer Details -->
				<div class="organizer-inputs-grid">
					<div class="input-group">
						<label for="organizer-name">Your Name (Organizer) <span class="required">*</span></label>
						<input
							type="text"
							id="organizer-name"
							bind:value={organizerName}
							placeholder="e.g., Dion"
							required
						/>
					</div>

					<div class="input-group">
						<label for="organizer-pin">Organizer PIN <span class="required">*</span></label>
						<input
							type="password"
							id="organizer-pin"
							bind:value={organizerPin}
							placeholder="e.g. 1234"
							maxlength="10"
							required
						/>
					</div>
				</div>

				<!-- Date Selection Mode (Range or Single Date) -->
				<div class="date-picker-section">
					<div class="date-picker-header">
						<label class="date-label">
							<Calendar size={14} />
							<span>Trip Dates (Optional)</span>
						</label>

						<div class="date-mode-toggle">
							<button
								type="button"
								class="mode-btn"
								class:active={isRange}
								onclick={() => (isRange = true)}
							>
								Date Range
							</button>
							<button
								type="button"
								class="mode-btn"
								class:active={!isRange}
								onclick={() => { isRange = false; endDate = ''; }}
							>
								Single Day
							</button>
						</div>
					</div>

					<div class="date-inputs-grid" class:is-range={isRange}>
						<div class="date-field-wrap">
							<span class="sub-label">{isRange ? 'Start Date' : 'Date'}</span>
							<input
								type="date"
								bind:value={startDate}
								class="input-date"
							/>
						</div>

						{#if isRange}
							<div class="date-field-wrap">
								<span class="sub-label">End Date</span>
								<input
									type="date"
									bind:value={endDate}
									min={startDate || undefined}
									class="input-date"
								/>
							</div>
						{/if}
					</div>
				</div>

				<!-- Description / Notes -->
				<div class="input-group">
					<label for="trip-desc">Overview & Meeting Details (Optional)</label>
					<textarea
						id="trip-desc"
						rows="3"
						bind:value={tripDescription}
						placeholder="Add trail checkpoint, meeting point, or logistics notes..."
					></textarea>
				</div>

				<!-- Actions -->
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-secondary"
						onclick={resetForm}
						disabled={creating}
					>
						Cancel
					</button>
					<button type="submit" class="btn btn-primary" disabled={creating || !tripName.trim()}>
						{creating ? 'Creating...' : 'Create Expedition'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.page-wrap {
		max-width: 1060px;
		margin: 0 auto;
		padding: 32px 24px 80px;
		width: 100%;
	}

	/* Top Bar */
	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 24px;
		border-bottom: 1px solid var(--border-default);
		margin-bottom: 36px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.brand-icon {
		width: 38px;
		height: 38px;
		border-radius: var(--radius-md);
		background: var(--color-primary);
		color: #ffffff;
		display: grid;
		place-content: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
	}

	.brand-text {
		display: flex;
		flex-direction: column;
	}

	.brand-name {
		font-weight: 800;
		font-size: 1.1rem;
		color: var(--text-main);
		letter-spacing: -0.02em;
	}

	.brand-badge {
		font-size: 0.75rem;
		color: var(--text-muted);
		font-weight: 500;
	}

	/* Hero Header */
	.hero-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 32px;
		gap: 16px;
		flex-wrap: wrap;
	}

	.hero-title {
		font-size: 1.85rem;
		font-weight: 800;
		color: var(--text-main);
		letter-spacing: -0.025em;
		margin-bottom: 6px;
	}

	.hero-desc {
		color: var(--text-secondary);
		font-size: 0.95rem;
		max-width: 580px;
	}

	.hero-badge-pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 5px 12px;
		border-radius: var(--radius-full);
		background: var(--bg-surface);
		border: 1px solid var(--border-default);
		font-size: 0.775rem;
		font-weight: 600;
		color: var(--text-secondary);
		box-shadow: var(--shadow-subtle);
	}

	.pill-sparkle {
		color: #d97706;
	}

	/* Buttons */
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 9px 16px;
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.15s ease;
		cursor: pointer;
	}

	.btn-primary {
		background: var(--color-primary);
		color: #ffffff;
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--color-primary-hover);
		transform: translateY(-1px);
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: var(--bg-subtle);
		color: var(--text-main);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--border-default);
	}

	.btn-close {
		color: var(--text-muted);
		padding: 6px;
		border-radius: var(--radius-sm);
		display: grid;
		place-content: center;
		transition: all 0.15s ease;
	}

	.btn-close:hover {
		color: var(--text-main);
		background: var(--bg-subtle);
	}

	/* 21st.dev-Inspired Enhanced Trips Grid */
	.trips-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 20px;
	}

	.trip-card {
		background: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-lg);
		padding: 22px;
		display: flex;
		flex-direction: column;
		box-shadow: var(--shadow-card);
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.trip-card::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: transparent;
		transition: background 0.2s ease;
	}

	.trip-card:hover {
		border-color: var(--border-hover);
		transform: translateY(-3px);
		box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.06), 0 4px 8px -4px rgba(0, 0, 0, 0.02);
	}

	.trip-card:hover::before {
		background: var(--color-primary);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 12px;
		gap: 12px;
	}

	.card-header-main {
		flex: 1;
	}

	.card-title {
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--text-main);
		line-height: 1.3;
		letter-spacing: -0.015em;
	}

	.card-date-badge {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		margin-top: 6px;
		font-size: 0.775rem;
		font-weight: 600;
		color: var(--color-emerald);
		background: var(--color-emerald-light);
		padding: 3px 9px;
		border-radius: var(--radius-full);
	}

	.icon-open-circle {
		width: 32px;
		height: 32px;
		border-radius: var(--radius-full);
		background: var(--bg-subtle);
		color: var(--text-secondary);
		display: grid;
		place-content: center;
		flex-shrink: 0;
		transition: all 0.2s ease;
	}

	.trip-card:hover .icon-open-circle {
		background: var(--color-primary);
		color: #ffffff;
		transform: translate(2px, -2px);
	}

	.card-body {
		flex-grow: 1;
		margin-bottom: 20px;
	}

	.card-description {
		color: var(--text-secondary);
		font-size: 0.875rem;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.empty-desc {
		color: var(--text-muted);
		font-style: italic;
	}

	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 14px;
		border-top: 1px solid var(--border-subtle);
	}

	.micro-stats {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 0.775rem;
		font-weight: 600;
		color: var(--text-muted);
	}

	.open-label {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-main);
	}

	/* Empty State */
	.empty-card {
		text-align: center;
		padding: 64px 24px;
		background: var(--bg-surface);
		border: 1px dashed var(--border-default);
		border-radius: var(--radius-lg);
	}

	.empty-icon-wrap {
		width: 60px;
		height: 60px;
		border-radius: var(--radius-full);
		background: var(--bg-subtle);
		color: var(--text-muted);
		display: grid;
		place-content: center;
		margin: 0 auto 16px;
	}

	.empty-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-main);
		margin-bottom: 6px;
	}

	.empty-desc {
		color: var(--text-secondary);
		font-size: 0.9rem;
		max-width: 420px;
		margin: 0 auto 24px;
		line-height: 1.5;
	}

	/* Loading State */
	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 80px 0;
		color: var(--text-muted);
		gap: 12px;
		font-size: 0.9rem;
	}

	.spinner {
		width: 28px;
		height: 28px;
		border: 2px solid var(--border-default);
		border-top-color: var(--text-main);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Modal & Date Picker Form */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(15, 23, 42, 0.45);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		z-index: 1000;
		backdrop-filter: blur(5px);
	}

	.modal-window {
		background: var(--bg-surface);
		width: 100%;
		max-width: 500px;
		border-radius: var(--radius-lg);
		padding: 28px;
		box-shadow: var(--shadow-modal);
		border: 1px solid var(--border-default);
		animation: modalPop 0.18s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes modalPop {
		from {
			transform: scale(0.96);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.modal-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 22px;
	}

	.modal-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-main);
		letter-spacing: -0.015em;
	}

	.modal-sub {
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin-top: 2px;
	}

	.input-group {
		margin-bottom: 18px;
	}

	.input-group label {
		display: block;
		font-size: 0.85rem;
		font-weight: 600;
		margin-bottom: 6px;
		color: var(--text-main);
	}

	.required {
		color: var(--color-danger);
	}

	.input-group input,
	.input-group textarea {
		width: 100%;
		padding: 9px 12px;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		background: var(--bg-surface);
		outline: none;
		font-size: 0.9rem;
		transition: border-color 0.15s ease;
	}

	.input-group input:focus,
	.input-group textarea:focus {
		border-color: var(--border-focus);
	}

	.organizer-inputs-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	/* Date Picker Section */
	.date-picker-section {
		background: var(--bg-subtle);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		padding: 14px;
		margin-bottom: 18px;
	}

	.date-picker-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.date-label {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.825rem;
		font-weight: 700;
		color: var(--text-main);
	}

	.date-mode-toggle {
		display: flex;
		background: #ffffff;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-sm);
		padding: 2px;
	}

	.mode-btn {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 3px 8px;
		border-radius: 4px;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.mode-btn.active {
		background: var(--color-primary);
		color: #ffffff;
	}

	.date-inputs-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
	}

	.date-inputs-grid.is-range {
		grid-template-columns: 1fr 1fr;
	}

	.date-field-wrap {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.sub-label {
		font-size: 0.725rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.input-date {
		width: 100%;
		padding: 8px 10px;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-sm);
		background: #ffffff;
		font-size: 0.85rem;
		font-family: inherit;
		outline: none;
		color: var(--text-main);
	}

	.input-date:focus {
		border-color: var(--border-focus);
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		margin-top: 24px;
	}
</style>
