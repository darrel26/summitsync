<script>
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pb.js';
	import { createTripCollectionStore } from '$lib/realtimeStore.js';
	import { showToast } from '$lib/toast.js';
	import {
		ChevronLeft,
		Share2,
		Trash2,
		Calendar,
		KeyRound,
		Crown,
		ShieldCheck
	} from 'lucide-svelte';

	import TabNav from '$lib/components/TabNav.svelte';
	import NamePromptModal from '$lib/components/NamePromptModal.svelte';
	import OrganizerUnlockModal from '$lib/components/OrganizerUnlockModal.svelte';
	import MembersTab from '$lib/components/MembersTab.svelte';
	import ChecklistTab from '$lib/components/ChecklistTab.svelte';
	import RouteTab from '$lib/components/RouteTab.svelte';
	import ItineraryTab from '$lib/components/ItineraryTab.svelte';

	let tripId = $derived($page.params.id);

	let trip = $state(null);
	let loadingTrip = $state(true);
	let activeTab = $state('checklist');

	let currentMemberId = $state('');
	let isOwner = $state(false);
	let namePromptModalEl = $state();
	let unlockModalEl = $state();
	let submittingName = $state(false);
	let verifyingPin = $state(false);
	let deletingTrip = $state(false);

	// Real-time stores
	let membersStore;
	let groupItemsStore;
	let personalItemsStore;
	let routeStore;
	let itineraryStore;

	let members = $state([]);
	let groupItems = $state([]);
	let personalItems = $state([]);
	let routeStops = $state([]);
	let itineraryEntries = $state([]);

	let unsubMembers, unsubGroup, unsubPersonal, unsubRoute, unsubItinerary;

	async function fetchTrip() {
		loadingTrip = true;
		try {
			trip = await pb.collection('trips').getOne(tripId);
			checkPermissions();
		} catch (err) {
			console.error('Error fetching trip:', err);
			showToast('Trip not found or network error', 'error');
		} finally {
			loadingTrip = false;
		}
	}

	function checkPermissions() {
		const storedId = localStorage.getItem(`trip_member_${tripId}`);
		const storedOwner = localStorage.getItem(`trip_is_owner_${tripId}`);

		if (storedId) {
			currentMemberId = storedId;
		} else {
			setTimeout(() => {
				namePromptModalEl?.showModal();
			}, 50);
		}

		if (storedOwner === 'true') {
			isOwner = true;
		} else {
			isOwner = false;
		}
	}

	async function handleJoinName(name) {
		submittingName = true;
		try {
			const member = await membersStore.create({ name, role: 'member' });
			currentMemberId = member.id;
			localStorage.setItem(`trip_member_${tripId}`, member.id);
			namePromptModalEl?.close();
			showToast(`Welcome, ${name}!`, 'success');
		} catch (err) {
			console.error('Error creating member identity:', err);
			showToast('Failed to save your name', 'error');
		} finally {
			submittingName = false;
		}
	}

	async function handleUnlockOrganizer(enteredPin) {
		verifyingPin = true;
		try {
			if (trip && trip.pin && trip.pin === enteredPin) {
				isOwner = true;
				localStorage.setItem(`trip_is_owner_${tripId}`, 'true');
				unlockModalEl?.close();
				showToast('Organizer permissions unlocked!', 'success');
			} else {
				showToast('Incorrect Organizer PIN', 'error');
			}
		} catch (err) {
			console.error('Error unlocking permissions:', err);
			showToast('Failed to verify PIN', 'error');
		} finally {
			verifyingPin = false;
		}
	}

	async function copyTripLink() {
		try {
			await navigator.clipboard.writeText(window.location.href);
			showToast('Trip link copied to clipboard', 'success');
		} catch (err) {
			showToast('Failed to copy link', 'error');
		}
	}

	async function handleDeleteTrip() {
		if (!isOwner) {
			showToast('Only the trip organizer can delete this trip', 'error');
			return;
		}

		if (
			!confirm(
				'Are you sure you want to delete this trip and all its gear items, route stops, and schedule?'
			)
		) {
			return;
		}

		deletingTrip = true;
		try {
			// Cascade deletion
			const [membersList, groupList, personalList, routeList, itinList] = await Promise.all([
				pb.collection('members').getFullList({ filter: `trip = "${tripId}"` }).catch(() => []),
				pb.collection('group_items').getFullList({ filter: `trip = "${tripId}"` }).catch(() => []),
				pb.collection('personal_items').getFullList({
					filter: members.map((m) => `member = "${m.id}"`).join(' || ') || 'id = ""'
				}).catch(() => []),
				pb.collection('route').getFullList({ filter: `trip = "${tripId}"` }).catch(() => []),
				pb.collection('itinerary').getFullList({ filter: `trip = "${tripId}"` }).catch(() => [])
			]);

			await Promise.all([
				...groupList.map((i) => pb.collection('group_items').delete(i.id).catch(() => {})),
				...personalList.map((i) => pb.collection('personal_items').delete(i.id).catch(() => {})),
				...routeList.map((i) => pb.collection('route').delete(i.id).catch(() => {})),
				...itinList.map((i) => pb.collection('itinerary').delete(i.id).catch(() => {})),
				...membersList.map((i) => pb.collection('members').delete(i.id).catch(() => {}))
			]);

			// Delete trip itself
			await pb.collection('trips').delete(tripId);
			localStorage.removeItem(`trip_member_${tripId}`);
			localStorage.removeItem(`trip_is_owner_${tripId}`);
			showToast('Trip deleted successfully', 'info');
			goto('/');
		} catch (err) {
			console.error('Error deleting trip:', err);
			showToast('Failed to delete trip', 'error');
		} finally {
			deletingTrip = false;
		}
	}

	async function handleAddMember(name) {
		return await membersStore.create({ name, role: 'member' });
	}

	async function handleRemoveMember(memberId) {
		if (!isOwner) {
			showToast('Only the organizer can remove members', 'error');
			return;
		}

		const memberPersonal = personalItems.filter((i) => i.member === memberId);
		await Promise.all(memberPersonal.map((i) => personalItemsStore.deleteRecord(i.id).catch(() => {})));
		await membersStore.deleteRecord(memberId);

		if (currentMemberId === memberId) {
			currentMemberId = '';
			localStorage.removeItem(`trip_member_${tripId}`);
			showNamePrompt = true;
		}
	}

	onMount(() => {
		fetchTrip();

		// Initialize real-time stores
		membersStore = createTripCollectionStore('members', tripId);
		groupItemsStore = createTripCollectionStore('group_items', tripId);
		personalItemsStore = createTripCollectionStore('personal_items', tripId, {
			filterField: ''
		});
		routeStore = createTripCollectionStore('route', tripId, { sort: 'sort_order' });
		itineraryStore = createTripCollectionStore('itinerary', tripId, { sort: 'sort_order' });

		unsubMembers = membersStore.subscribe((val) => (members = val));
		unsubGroup = groupItemsStore.subscribe((val) => (groupItems = val));
		unsubPersonal = personalItemsStore.subscribe((val) => (personalItems = val));
		unsubRoute = routeStore.subscribe((val) => (routeStops = val));
		unsubItinerary = itineraryStore.subscribe((val) => (itineraryEntries = val));

		membersStore.init();
		groupItemsStore.init();
		personalItemsStore.init();
		routeStore.init();
		itineraryStore.init();
	});

	onDestroy(() => {
		if (unsubMembers) unsubMembers();
		if (unsubGroup) unsubGroup();
		if (unsubPersonal) unsubPersonal();
		if (unsubRoute) unsubRoute();
		if (unsubItinerary) unsubItinerary();

		if (membersStore) membersStore.unsubscribe();
		if (groupItemsStore) groupItemsStore.unsubscribe();
		if (personalItemsStore) personalItemsStore.unsubscribe();
		if (routeStore) routeStore.unsubscribe();
		if (itineraryStore) itineraryStore.unsubscribe();
	});
</script>

<svelte:head>
	<title>{trip ? `${trip.name} · SummitSync` : 'Trip View'}</title>
</svelte:head>

<div class="workspace-wrap">
	{#if loadingTrip}
		<div class="loading-state" role="status" aria-label="Loading trip workspace">
			<div class="spinner"></div>
			<p>Loading trip workspace...</p>
		</div>
	{:else if !trip}
		<div class="card error-card">
			<h2>Trip Not Found</h2>
			<p>This trip link may be invalid or the trip was deleted.</p>
			<a href="/" class="btn btn-primary">Back to Trips</a>
		</div>
	{:else}
		<!-- Header -->
		<header class="workspace-header">
			<div class="header-left">
				<a href="/" class="back-link">
					<ChevronLeft size={16} />
					<span>All Trips</span>
				</a>

				<div class="title-meta-row">
					<h1 class="trip-title">{trip.name}</h1>
					{#if trip.date}
						<div class="trip-date-tag">
							<Calendar size={13} />
							<span>{trip.date}</span>
						</div>
					{/if}
					{#if isOwner}
						<div class="owner-pill">
							<Crown size={12} />
							<span>Organizer Mode</span>
						</div>
					{/if}
				</div>

				{#if trip.description}
					<p class="trip-description">{trip.description}</p>
				{/if}
			</div>

			<div class="header-actions">
				{#if !isOwner}
					<button
						class="btn btn-secondary btn-unlock"
						onclick={() => unlockModalEl?.showModal()}
						title="Enter PIN for organizer access"
					>
						<KeyRound size={15} />
						<span>Organizer Unlock</span>
					</button>
				{/if}

				<button class="btn btn-secondary" onclick={copyTripLink} title="Copy shareable link">
					<Share2 size={15} />
					<span>Share Link</span>
				</button>

				{#if isOwner}
					<button
						class="btn btn-danger-outline"
						onclick={handleDeleteTrip}
						disabled={deletingTrip}
						title="Delete trip"
					>
						<Trash2 size={15} />
						<span>{deletingTrip ? 'Deleting...' : 'Delete'}</span>
					</button>
				{/if}
			</div>
		</header>

		<!-- Tabs -->
		<TabNav
			{activeTab}
			memberCount={members.length}
			groupItemCount={groupItems.length}
			personalItemCount={personalItems.length}
			routeCount={routeStops.length}
			itineraryCount={itineraryEntries.length}
			onSelectTab={(tabId) => (activeTab = tabId)}
		/>

		<!-- Tab Content -->
		<main id="main-content">
			<div class="workspace-content" role="tabpanel" aria-labelledby="tab-{activeTab}">
				{#if activeTab === 'checklist'}
					<ChecklistTab
						{groupItems}
						{personalItems}
						{members}
						{currentMemberId}
						{isOwner}
						onAddGroupItem={(data) => groupItemsStore.create(data)}
						onUpdateGroupItem={(id, data) => groupItemsStore.updateRecord(id, data)}
						onDeleteGroupItem={(id) => groupItemsStore.deleteRecord(id)}
						onAddPersonalItem={(data) => personalItemsStore.create(data)}
						onUpdatePersonalItem={(id, data) => personalItemsStore.updateRecord(id, data)}
						onDeletePersonalItem={(id) => personalItemsStore.deleteRecord(id)}
					/>
				{:else if activeTab === 'members'}
					<MembersTab
						{members}
						{currentMemberId}
						{isOwner}
						onAddMember={handleAddMember}
						onRemoveMember={handleRemoveMember}
					/>
				{:else if activeTab === 'route'}
					<RouteTab
						{routeStops}
						{isOwner}
						onAddStop={(data) => routeStore.create(data)}
						onUpdateStop={(id, data) => routeStore.updateRecord(id, data)}
						onDeleteStop={(id) => routeStore.deleteRecord(id)}
						onReorderStops={handleReorderRoute}
					/>
				{:else if activeTab === 'itinerary'}
					<ItineraryTab
						{itineraryEntries}
						{isOwner}
						onAddEntry={(data) => itineraryStore.create(data)}
						onUpdateEntry={(id, data) => itineraryStore.updateRecord(id, data)}
						onDeleteEntry={(id) => itineraryStore.deleteRecord(id)}
					/>
				{/if}
			</div>
		</main>
	{/if}
</div>

<NamePromptModal
	bind:this={namePromptModalEl}
	submitting={submittingName}
	onSubmit={handleJoinName}
/>

<OrganizerUnlockModal
	bind:this={unlockModalEl}
	submitting={verifyingPin}
	onUnlock={handleUnlockOrganizer}
	onClose={() => unlockModalEl?.close()}
/>

<style>
	.workspace-wrap {
		max-width: 1040px;
		margin: 0 auto;
		padding: calc(32px + env(safe-area-inset-top, 0px)) calc(24px + env(safe-area-inset-right, 0px)) calc(80px + env(safe-area-inset-bottom, 0px)) calc(24px + env(safe-area-inset-left, 0px));
		width: 100%;
	}

	.workspace-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 24px;
		gap: 20px;
		flex-wrap: wrap;
	}

	.header-left {
		flex: 1;
		min-width: 280px;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-secondary);
		margin-bottom: 10px;
		transition: color 0.15s ease;
	}

	.back-link:hover {
		color: var(--text-main);
	}

	.title-meta-row {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
		margin-bottom: 6px;
	}

	.trip-title {
		font-size: 1.75rem;
		font-weight: 800;
		color: var(--text-main);
		line-height: 1.25;
		letter-spacing: -0.02em;
	}

	.trip-date-tag {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 0.8rem;
		font-weight: 600;
		background: var(--color-emerald-light);
		color: var(--color-emerald);
		padding: 3px 10px;
		border-radius: var(--radius-full);
	}

	.owner-pill {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 0.775rem;
		font-weight: 700;
		background: var(--color-amber-light);
		color: var(--color-amber);
		padding: 3px 10px;
		border-radius: var(--radius-full);
		border: 1px solid rgba(217, 119, 6, 0.2);
	}

	.trip-description {
		color: var(--text-secondary);
		font-size: 0.9rem;
		max-width: 620px;
		line-height: 1.5;
	}

	.header-actions {
		display: flex;
		gap: 8px;
		align-items: center;
		flex-wrap: wrap;
	}

	.btn-unlock {
		background: var(--color-primary-subtle);
		border-color: var(--border-default);
	}

	.btn-danger-outline {
		background: var(--bg-surface);
		border: 1px solid var(--color-danger-border);
		color: var(--color-danger);
	}

	.btn-danger-outline:hover:not(:disabled) {
		background: var(--color-danger-light);
	}

	.btn-danger-outline:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100px 0;
		color: var(--text-muted);
		gap: 12px;
		font-size: 0.9rem;
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 2.5px solid var(--border-default);
		border-top-color: var(--text-main);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.error-card {
		text-align: center;
		padding: 60px 24px;
		background: var(--bg-surface);
		border-radius: var(--radius-lg);
		border: 1px solid var(--border-default);
	}

	.error-card h2 {
		font-size: 1.35rem;
		font-weight: 700;
		color: var(--text-main);
		margin-bottom: 6px;
	}

	.error-card p {
		color: var(--text-secondary);
		margin-bottom: 20px;
	}

	@media (max-width: 640px) {
		.workspace-wrap {
			padding: calc(20px + env(safe-area-inset-top, 0px)) calc(16px + env(safe-area-inset-right, 0px)) calc(60px + env(safe-area-inset-bottom, 0px)) calc(16px + env(safe-area-inset-left, 0px));
		}

		.workspace-header {
			flex-direction: column;
			align-items: stretch;
			gap: 16px;
		}

		.header-left {
			min-width: 0;
		}

		.trip-title {
			font-size: 1.45rem;
		}

		.header-actions {
			width: 100%;
			flex-wrap: wrap;
		}

		.header-actions .btn {
			flex: 1 1 auto;
		}
	}
</style>
