<script lang="ts">
	import { onMount } from "svelte";
	import { pb } from "$lib/pb.js";
	import { showToast } from "$lib/toast";
	import { AppHeader } from "$lib/components/ui/app-header";
	import { PageContainer } from "$lib/components/ui/page-container";
	import * as Card from "$lib/components/ui/card";
	import Button from "$lib/components/ui/button/Button.svelte";
	import Badge from "$lib/components/ui/badge/Badge.svelte";
	import { EmptyState } from "$lib/components/ui/empty-state";
	import CreateTripModal from "$lib/components/CreateTripModal.svelte";
	import type { Trip } from "$lib/types";
	import {
		Plus,
		Calendar,
		ArrowUpRight,
		Compass,
		Users2,
		ListChecks,
		MapPin,
		Sparkles,
	} from "lucide-svelte";

	interface TripStats {
		members: number;
		items: number;
		stops: number;
	}

	let trips = $state<Trip[]>([]);
	let tripStats = $state<Record<string, TripStats>>({});
	let loading = $state(true);
	let isCreateModalOpen = $state(false);

	function formatDisplayDate(dateStr?: string) {
		if (!dateStr) return null;
		if (dateStr.includes(" - ")) {
			const [start, end] = dateStr.split(" - ");
			return `${formatFriendly(start)} – ${formatFriendly(end)}`;
		}
		return formatFriendly(dateStr);
	}

	function formatFriendly(isoDate: string) {
		try {
			if (!isoDate || !isoDate.includes("-")) return isoDate;
			const parts = isoDate.split("-");
			if (parts.length !== 3) return isoDate;
			const d = new Date(
				Number(parts[0]),
				Number(parts[1]) - 1,
				Number(parts[2]),
			);
			if (isNaN(d.getTime())) return isoDate;
			return d.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
		} catch {
			return isoDate;
		}
	}

	async function loadTrips() {
		loading = true;
		try {
			const list = await pb
				.collection("trips")
				.getFullList<Trip>({ sort: "-created" });
			trips = list;
			fetchTripCounts(list);
		} catch (err) {
			console.error("Error fetching trips:", err);
			showToast("Failed to load trips from PocketBase", "error");
		} finally {
			loading = false;
		}
	}

	async function fetchTripCounts(tripList: Trip[]) {
		const results = await Promise.allSettled(
			tripList.map(async (t) => {
				const [membersRes, groupRes, routeRes] = await Promise.all([
					pb
						.collection("members")
						.getList(1, 1, { filter: `trip = "${t.id}"` })
						.catch(() => ({ totalItems: 0 })),
					pb
						.collection("group_items")
						.getList(1, 1, { filter: `trip = "${t.id}"` })
						.catch(() => ({ totalItems: 0 })),
					pb
						.collection("route")
						.getList(1, 1, { filter: `trip = "${t.id}"` })
						.catch(() => ({ totalItems: 0 })),
				]);
				return {
					id: t.id,
					stats: {
						members: membersRes.totalItems || 0,
						items: groupRes.totalItems || 0,
						stops: routeRes.totalItems || 0,
					},
				};
			}),
		);

		const statsMap: Record<string, TripStats> = {};
		for (const res of results) {
			if (res.status === "fulfilled") {
				statsMap[res.value.id] = res.value.stats;
			}
		}
		tripStats = statsMap;
	}

	onMount(() => {
		loadTrips();
	});
</script>

<svelte:head>
	<title>SummitSync - Group Trip Planner</title>
</svelte:head>

<div class="min-h-screen bg-slate-50/50">
	<AppHeader>
		{#snippet actions()}
			<Button onclick={() => (isCreateModalOpen = true)}>
				<Plus class="h-4 w-4" />
				<span>New Trip</span>
			</Button>
		{/snippet}
	</AppHeader>

	<PageContainer>
		<!-- Hero Section -->
		<div
			class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
		>
			<div>
				<h1
					class="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
				>
					Adventures & Expeditions
				</h1>
				<p class="mt-1 text-sm text-slate-500 max-w-xl">
					Coordinate group gear, routes, and day-by-day itineraries
					with instant real-time sync.
				</p>
			</div>

			<div
				class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm"
			>
				<Sparkles class="h-3.5 w-3.5 text-amber-500" />
				<span>Zero Login Required</span>
			</div>
		</div>

		<!-- Content State -->
		{#if loading}
			<div
				class="flex flex-col items-center justify-center py-20 text-slate-400 gap-3"
			>
				<div
					class="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900"
				></div>
				<p class="text-sm">Loading trips...</p>
			</div>
		{:else if trips.length === 0}
			<EmptyState
				icon={Compass}
				title="No adventures planned yet"
				description="Create your first trip to organize packing gear, checkpoints, and schedules together with your group."
			>
				{#snippet action()}
					<Button onclick={() => (isCreateModalOpen = true)}>
						<Plus class="h-4 w-4" />
						<span>Create Your First Trip</span>
					</Button>
				{/snippet}
			</EmptyState>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each trips as trip (trip.id)}
					{@const stats = tripStats[trip.id] || {
						members: 0,
						items: 0,
						stops: 0,
					}}
					{@const displayDate = formatDisplayDate(trip.date)}
					<a href="/trip/{trip.id}" class="group block">
						<Card.Card
							class="h-full transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
						>
							<Card.CardHeader class="p-5 pb-3">
								<div
									class="flex items-start justify-between gap-2"
								>
									<Card.CardTitle
										class="text-base font-bold text-slate-900 group-hover:text-slate-700"
									>
										{trip.name}
									</Card.CardTitle>
									<div
										class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-slate-900 group-hover:text-white"
									>
										<ArrowUpRight class="h-4 w-4" />
									</div>
								</div>
								{#if displayDate}
									<div class="pt-1">
										<Badge
											variant="success"
											class="gap-1 font-medium"
										>
											<Calendar class="h-3 w-3" />
											<span>{displayDate}</span>
										</Badge>
									</div>
								{/if}
							</Card.CardHeader>

							<Card.CardContent class="p-5 pt-0 pb-4">
								<p class="line-clamp-2 text-xs text-slate-500">
									{trip.description ||
										"No description added yet."}
								</p>
							</Card.CardContent>

							<Card.CardFooter
								class="flex items-center justify-between border-t border-slate-100 p-5 py-3 text-xs text-slate-500"
							>
								<div class="flex items-center gap-3">
									<div
										class="flex items-center gap-1 font-medium"
										title="Members"
									>
										<Users2 class="h-3.5 w-3.5" />
										<span>{stats.members}</span>
									</div>
									<div
										class="flex items-center gap-1 font-medium"
										title="Group Gear Items"
									>
										<ListChecks class="h-3.5 w-3.5" />
										<span>{stats.items}</span>
									</div>
									<div
										class="flex items-center gap-1 font-medium"
										title="Route Checkpoints"
									>
										<MapPin class="h-3.5 w-3.5" />
										<span>{stats.stops}</span>
									</div>
								</div>
								<span
									class="font-semibold text-slate-700 group-hover:text-slate-900"
									>Open</span
								>
							</Card.CardFooter>
						</Card.Card>
					</a>
				{/each}
			</div>
		{/if}
	</PageContainer>
</div>

<CreateTripModal bind:open={isCreateModalOpen} onSuccess={loadTrips} />
