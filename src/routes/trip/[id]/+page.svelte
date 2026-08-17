<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { tick } from "svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { pb } from "$lib/pb.js";
	import { createTripCollectionStore } from "$lib/realtimeStore.js";
	import { showToast } from "$lib/toast";
	import { AppHeader } from "$lib/components/ui/app-header";
	import { PageContainer } from "$lib/components/ui/page-container";
	import Button from "$lib/components/ui/button/Button.svelte";
	import Badge from "$lib/components/ui/badge/Badge.svelte";
	import * as Card from "$lib/components/ui/card";
	import type { Trip, Member, GroupItem, PersonalItem, RouteStop, ItineraryEntry } from "$lib/types";
	import {
		ChevronLeft,
		Share2,
		Trash2,
		Calendar,
		KeyRound,
		Crown,
	} from "lucide-svelte";

	import TabNav from "$lib/components/TabNav.svelte";
	import NamePromptModal from "$lib/components/NamePromptModal.svelte";
	import OrganizerUnlockModal from "$lib/components/OrganizerUnlockModal.svelte";
	import MembersTab from "$lib/components/MembersTab.svelte";
	import ChecklistTab from "$lib/components/ChecklistTab.svelte";
	import RouteTab from "$lib/components/RouteTab.svelte";
	import ItineraryTab from "$lib/components/ItineraryTab.svelte";

	let tripId = $derived($page.params.id);

	let trip = $state<Trip | null>(null);
	let loadingTrip = $state(true);
	let activeTab = $state("checklist");

	let currentMemberId = $state("");
	let isOwner = $state(false);
	let isNamePromptOpen = $state(false);
	let isUnlockModalOpen = $state(false);
	let submittingName = $state(false);
	let verifyingPin = $state(false);
	let deletingTrip = $state(false);

	let membersStore: ReturnType<typeof createTripCollectionStore>;
	let groupItemsStore: ReturnType<typeof createTripCollectionStore>;
	let personalItemsStore: ReturnType<typeof createTripCollectionStore>;
	let routeStore: ReturnType<typeof createTripCollectionStore>;
	let itineraryStore: ReturnType<typeof createTripCollectionStore>;

	let members = $state<Member[]>([]);
	let groupItems = $state<GroupItem[]>([]);
	let personalItems = $state<PersonalItem[]>([]);
	let routeStops = $state<RouteStop[]>([]);
	let itineraryEntries = $state<ItineraryEntry[]>([]);

	let unsubMembers: (() => void) | undefined;
	let unsubGroup: (() => void) | undefined;
	let unsubPersonal: (() => void) | undefined;
	let unsubRoute: (() => void) | undefined;
	let unsubItinerary: (() => void) | undefined;

	async function fetchTrip() {
		loadingTrip = true;
		try {
			trip = await pb.collection("trips").getOne<Trip>(tripId);
			await checkPermissions();
		} catch (err) {
			console.error("Error fetching trip:", err);
			showToast("Trip not found or network error", "error");
		} finally {
			loadingTrip = false;
		}
	}

	async function checkPermissions() {
		const storedId = localStorage.getItem(`trip_member_${tripId}`);
		const storedOwner = localStorage.getItem(`trip_is_owner_${tripId}`);

		if (storedId) {
			currentMemberId = storedId;
		} else {
			await tick();
			isNamePromptOpen = true;
		}

		isOwner = storedOwner === "true";
	}

	async function handleJoinName(name: string) {
		submittingName = true;
		try {
			const trimmedName = name.trim();
			const existing = members.find(
				(m) => m.name.toLowerCase() === trimmedName.toLowerCase(),
			);

			if (existing) {
				currentMemberId = existing.id;
				localStorage.setItem(`trip_member_${tripId}`, existing.id);
				isNamePromptOpen = false;
				showToast(`Welcome back, ${existing.name}!`, "success");
			} else {
				const member = await membersStore.create({
					name: trimmedName,
					role: "member",
				});
				currentMemberId = member.id;
				localStorage.setItem(`trip_member_${tripId}`, member.id);
				isNamePromptOpen = false;
				showToast(`Welcome, ${trimmedName}!`, "success");
			}
		} catch (err) {
			console.error("Error handling member identity:", err);
			showToast("Failed to save your name", "error");
		} finally {
			submittingName = false;
		}
	}

	function handleClaimMember(member: Member) {
		currentMemberId = member.id;
		localStorage.setItem(`trip_member_${tripId}`, member.id);
		isNamePromptOpen = false;
		showToast(`Connected as ${member.name}`, "success");
	}

	function handleSwitchIdentity() {
		isNamePromptOpen = true;
	}

	async function handleUnlockOrganizer(enteredPin: string) {
		verifyingPin = true;
		try {
			if (trip && trip.pin && trip.pin === enteredPin) {
				isOwner = true;
				localStorage.setItem(`trip_is_owner_${tripId}`, "true");
				isUnlockModalOpen = false;
				showToast("Organizer permissions unlocked!", "success");
			} else {
				showToast("Incorrect Organizer PIN", "error");
			}
		} catch (err) {
			console.error("Error unlocking permissions:", err);
			showToast("Failed to verify PIN", "error");
		} finally {
			verifyingPin = false;
		}
	}

	async function copyTripLink() {
		try {
			await navigator.clipboard.writeText(window.location.href);
			showToast("Trip link copied to clipboard", "success");
		} catch (err) {
			showToast("Failed to copy link", "error");
		}
	}

	async function handleDeleteTrip() {
		if (!isOwner) {
			showToast("Only the trip organizer can delete this trip", "error");
			return;
		}

		if (
			!confirm(
				"Are you sure you want to delete this trip and all its gear items, route stops, and schedule?",
			)
		) {
			return;
		}

		deletingTrip = true;
		try {
			const [membersList, groupList, routeList, itinList] =
				await Promise.all([
					pb
						.collection("members")
						.getFullList<Member>({ filter: `trip = "${tripId}"` })
						.catch(() => []),
					pb
						.collection("group_items")
						.getFullList<GroupItem>({ filter: `trip = "${tripId}"` })
						.catch(() => []),
					pb
						.collection("route")
						.getFullList<RouteStop>({ filter: `trip = "${tripId}"` })
						.catch(() => []),
					pb
						.collection("itinerary")
						.getFullList<ItineraryEntry>({ filter: `trip = "${tripId}"` })
						.catch(() => []),
				]);

			const memberIds = membersList.map((m) => m.id);
			let personalList: PersonalItem[] = [];
			if (memberIds.length > 0) {
				personalList = await pb
					.collection("personal_items")
					.getFullList<PersonalItem>({
						filter: memberIds.map((id) => `member = "${id}"`).join(" || "),
					})
					.catch(() => []);
			}

			await Promise.all([
				...groupList.map((i) =>
					pb.collection("group_items").delete(i.id).catch(() => {}),
				),
				...personalList.map((i) =>
					pb.collection("personal_items").delete(i.id).catch(() => {}),
				),
				...routeList.map((i) =>
					pb.collection("route").delete(i.id).catch(() => {}),
				),
				...itinList.map((i) =>
					pb.collection("itinerary").delete(i.id).catch(() => {}),
				),
				...membersList.map((i) =>
					pb.collection("members").delete(i.id).catch(() => {}),
				),
			]);

			await pb.collection("trips").delete(tripId);
			localStorage.removeItem(`trip_member_${tripId}`);
			localStorage.removeItem(`trip_is_owner_${tripId}`);
			showToast("Trip deleted successfully", "info");
			goto("/");
		} catch (err) {
			console.error("Error deleting trip:", err);
			showToast("Failed to delete trip", "error");
		} finally {
			deletingTrip = false;
		}
	}

	async function handleAddMember(name: string) {
		return await membersStore.create({ name, role: "member" });
	}

	async function handleRemoveMember(memberId: string) {
		if (!isOwner) {
			showToast("Only the organizer can remove members", "error");
			return;
		}

		const memberPersonal = personalItems.filter(
			(i) => i.member === memberId,
		);
		await Promise.all(
			memberPersonal.map((i) =>
				personalItemsStore.deleteRecord(i.id).catch(() => {}),
			),
		);
		await membersStore.deleteRecord(memberId);

		if (currentMemberId === memberId) {
			currentMemberId = "";
			localStorage.removeItem(`trip_member_${tripId}`);
			isNamePromptOpen = true;
		}
	}

	onMount(() => {
		fetchTrip();

		membersStore = createTripCollectionStore("members", tripId);
		groupItemsStore = createTripCollectionStore("group_items", tripId);
		personalItemsStore = createTripCollectionStore(
			"personal_items",
			tripId,
			{
				filterField: "",
				getMemberIds: () => members.map((m) => m.id),
			},
		);
		routeStore = createTripCollectionStore("route", tripId, {
			sort: "sort_order",
		});
		itineraryStore = createTripCollectionStore("itinerary", tripId, {
			sort: "sort_order",
		});

		unsubMembers = membersStore.subscribe((val) => (members = val as Member[]));
		unsubGroup = groupItemsStore.subscribe((val) => (groupItems = val as GroupItem[]));
		unsubPersonal = personalItemsStore.subscribe((val) => (personalItems = val as PersonalItem[]));
		unsubRoute = routeStore.subscribe((val) => (routeStops = val as RouteStop[]));
		unsubItinerary = itineraryStore.subscribe((val) => (itineraryEntries = val as ItineraryEntry[]));

		membersStore.init();
		groupItemsStore.init();
		personalItemsStore.init();
		routeStore.init();
		itineraryStore.init();
	});

	onDestroy(() => {
		unsubMembers?.();
		unsubGroup?.();
		unsubPersonal?.();
		unsubRoute?.();
		unsubItinerary?.();

		membersStore?.unsubscribe();
		groupItemsStore?.unsubscribe();
		personalItemsStore?.unsubscribe();
		routeStore?.unsubscribe();
		itineraryStore?.unsubscribe();
	});
</script>

<svelte:head>
	<title>{trip ? `${trip.name} · SummitSync` : "Trip View"}</title>
</svelte:head>

<div class="min-h-screen bg-slate-50/50 pb-20 sm:pb-12">
	<AppHeader>
		{#snippet children()}
			<span class="truncate max-w-[200px] font-medium text-slate-700"
				>{trip?.name || "Trip"}</span
			>
		{/snippet}
		{#snippet actions()}
			<Button
				variant="outline"
				size="sm"
				onclick={copyTripLink}
				class="gap-1.5"
			>
				<Share2 class="h-3.5 w-3.5" />
				<span class="hidden sm:inline">Share Link</span>
			</Button>
			{#if !isOwner}
				<Button
					variant="secondary"
					size="sm"
					onclick={() => (isUnlockModalOpen = true)}
					class="gap-1.5"
				>
					<KeyRound class="h-3.5 w-3.5" />
					<span class="hidden sm:inline">Unlock PIN</span>
				</Button>
			{/if}
		{/snippet}
	</AppHeader>

	<PageContainer>
		{#if loadingTrip}
			<div
				class="flex flex-col items-center justify-center py-20 text-slate-400 gap-3"
			>
				<div
					class="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900"
				></div>
				<p class="text-sm">Loading trip workspace...</p>
			</div>
		{:else if !trip}
			<Card.Card class="text-center p-8">
				<Card.CardHeader>
					<Card.CardTitle class="text-xl"
						>Trip Not Found</Card.CardTitle
					>
					<Card.CardDescription
						>This trip link may be invalid or the trip was deleted.</Card.CardDescription
					>
				</Card.CardHeader>
				<Card.CardContent>
					<Button href="/" variant="default">Back to Trips</Button>
				</Card.CardContent>
			</Card.Card>
		{:else}
			<!-- Workspace Header -->
			<div
				class="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start"
			>
				<div class="space-y-2">
					<div class="flex items-center gap-2">
						<a
							href="/"
							class="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
						>
							<ChevronLeft class="h-3.5 w-3.5" />
							<span>All Trips</span>
						</a>
					</div>

					<div class="flex flex-wrap items-center gap-2.5">
						<h1
							class="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
						>
							{trip.name}
						</h1>
						{#if trip.date}
							<Badge variant="success" class="gap-1">
								<Calendar class="h-3 w-3" />
								<span>{trip.date}</span>
							</Badge>
						{/if}
						{#if isOwner}
							<Badge variant="warning" class="gap-1">
								<Crown class="h-3 w-3" />
								<span>Organizer Mode</span>
							</Badge>
						{/if}
					</div>

					{#if trip.description}
						<p
							class="max-w-2xl text-sm text-slate-600 leading-relaxed"
						>
							{trip.description}
						</p>
					{/if}
				</div>

				<div class="flex flex-wrap items-center gap-2">
					{#if isOwner}
						<Button
							variant="destructive"
							size="sm"
							onclick={handleDeleteTrip}
							disabled={deletingTrip}
							class="gap-1.5"
						>
							<Trash2 class="h-3.5 w-3.5" />
							<span
								>{deletingTrip
									? "Deleting..."
									: "Delete Trip"}</span
							>
						</Button>
					{/if}
				</div>
			</div>

			<!-- Navigation Tabs -->
			<TabNav
				{activeTab}
				memberCount={members.length}
				groupItemCount={groupItems.length}
				personalItemCount={personalItems.length}
				routeCount={routeStops.length}
				itineraryCount={itineraryEntries.length}
				onSelectTab={(tabId) => (activeTab = tabId)}
			/>

			<!-- Active Tab View -->
			<div role="tabpanel" aria-labelledby="tab-{activeTab}">
				{#if activeTab === "checklist"}
					<ChecklistTab
						{groupItems}
						{personalItems}
						{members}
						{currentMemberId}
						{isOwner}
						onAddGroupItem={(data) =>
							groupItemsStore.create(data)}
						onUpdateGroupItem={(id, data) =>
							groupItemsStore.updateRecord(id, data)}
						onDeleteGroupItem={(id) =>
							groupItemsStore.deleteRecord(id)}
						onAddPersonalItem={(data) =>
							personalItemsStore.create(data)}
						onUpdatePersonalItem={(id, data) =>
							personalItemsStore.updateRecord(id, data)}
						onDeletePersonalItem={(id) =>
							personalItemsStore.deleteRecord(id)}
					/>
				{:else if activeTab === "members"}
					<MembersTab
						{members}
						{currentMemberId}
						{isOwner}
						onAddMember={handleAddMember}
						onRemoveMember={handleRemoveMember}
						onSwitchIdentity={handleSwitchIdentity}
					/>
				{:else if activeTab === "route"}
					<RouteTab
						{routeStops}
						{isOwner}
						onAddStop={(data) => routeStore.create(data)}
						onUpdateStop={(id, data) =>
							routeStore.updateRecord(id, data)}
						onDeleteStop={(id) =>
							routeStore.deleteRecord(id)}
					/>
				{:else if activeTab === "itinerary"}
					<ItineraryTab
						{itineraryEntries}
						{isOwner}
						onAddEntry={(data) => itineraryStore.create(data)}
						onUpdateEntry={(id, data) =>
							itineraryStore.updateRecord(id, data)}
						onDeleteEntry={(id) =>
							itineraryStore.deleteRecord(id)}
					/>
				{/if}
			</div>
		{/if}
	</PageContainer>
</div>

<NamePromptModal
	bind:open={isNamePromptOpen}
	{members}
	submitting={submittingName}
	onSubmit={handleJoinName}
	onClaim={handleClaimMember}
/>

<OrganizerUnlockModal
	bind:open={isUnlockModalOpen}
	submitting={verifyingPin}
	onUnlock={handleUnlockOrganizer}
/>
