<script lang="ts">
	import { showToast } from "$lib/toast";
	import { swapSortOrder } from "$lib/utils";
	import * as Card from "$lib/components/ui/card";
	import Button from "$lib/components/ui/button/Button.svelte";
	import Input from "$lib/components/ui/input/Input.svelte";
	import Badge from "$lib/components/ui/badge/Badge.svelte";
	import type { ItineraryEntry } from "$lib/types";
	import {
		Plus,
		ChevronUp,
		ChevronDown,
		Pencil,
		Trash2,
		Check,
		X,
		CalendarDays,
		Clock,
	} from "lucide-svelte";

	interface Props {
		itineraryEntries?: ItineraryEntry[];
		isOwner?: boolean;
		onAddEntry: (data: Partial<ItineraryEntry>) => Promise<unknown>;
		onUpdateEntry: (id: string, data: Partial<ItineraryEntry>) => Promise<unknown>;
		onDeleteEntry: (id: string) => Promise<unknown>;
	}

	let {
		itineraryEntries = [],
		isOwner = false,
		onAddEntry,
		onUpdateEntry,
		onDeleteEntry,
	}: Props = $props();

	let newDay = $state(1);
	let newTitle = $state("");
	let newTime = $state("");
	let newDescription = $state("");
	let adding = $state(false);

	let editingEntryId = $state<string | null>(null);
	let editDay = $state(1);
	let editTitle = $state("");
	let editTime = $state("");
	let editDescription = $state("");

	let selectedDayFilter = $state<string | number>("all");

	let sortedEntries = $derived(
		[...itineraryEntries].sort((a, b) => {
			if ((a.day ?? 0) !== (b.day ?? 0)) {
				return (a.day ?? 0) - (b.day ?? 0);
			}
			return (a.sort_order ?? 0) - (b.sort_order ?? 0);
		}),
	);

	let availableDays = $derived(
		Array.from(new Set(sortedEntries.map((e) => e.day || 1))).sort(
			(a, b) => a - b,
		),
	);

	let filteredEntries = $derived(
		selectedDayFilter === "all"
			? sortedEntries
			: sortedEntries.filter((e) => (e.day || 1) === selectedDayFilter),
	);

	async function handleAddEntry(e: SubmitEvent) {
		e.preventDefault();
		if (!newTitle.trim()) return;

		adding = true;
		try {
			const maxSort = sortedEntries.reduce(
				(max, item) => Math.max(max, item.sort_order ?? 0),
				-1,
			);
			await onAddEntry({
				day: Number(newDay) || 1,
				title: newTitle.trim(),
				time: newTime.trim(),
				description: newDescription.trim(),
				sort_order: maxSort + 1,
			});
			newTitle = "";
			newTime = "";
			newDescription = "";
			showToast("Itinerary event added", "success");
		} catch (err) {
			console.error("Error adding itinerary entry:", err);
			showToast("Failed to add entry", "error");
		} finally {
			adding = false;
		}
	}

	function startEdit(entry: ItineraryEntry) {
		editingEntryId = entry.id;
		editDay = entry.day ?? 1;
		editTitle = entry.title;
		editTime = entry.time || "";
		editDescription = entry.description || "";
	}

	async function saveEdit(id: string) {
		if (!editTitle.trim()) return;
		try {
			await onUpdateEntry(id, {
				day: Number(editDay) || 1,
				title: editTitle.trim(),
				time: editTime.trim(),
				description: editDescription.trim(),
			});
			editingEntryId = null;
			showToast("Entry updated", "success");
		} catch (err) {
			console.error("Error updating entry:", err);
			showToast("Failed to update entry", "error");
		}
	}

	async function handleDelete(entry: ItineraryEntry) {
		if (confirm(`Delete "${entry.title}"?`)) {
			try {
				await onDeleteEntry(entry.id);
				showToast("Entry removed", "info");
			} catch (err) {
				console.error("Error deleting entry:", err);
				showToast("Failed to delete entry", "error");
			}
		}
	}

	async function moveEntry(index: number, direction: number) {
		const targetIndex = index + direction;
		try {
			await swapSortOrder(filteredEntries, index, targetIndex, onUpdateEntry);
		} catch (err) {
			console.error("Error reordering itinerary:", err);
			showToast("Failed to reorder itinerary", "error");
		}
	}
</script>

<div class="space-y-6">
	<!-- Add Event Card -->
	{#if isOwner}
		<Card.Card>
			<Card.CardHeader class="pb-3">
				<Card.CardTitle class="text-base font-bold"
					>Schedule Activity / Event</Card.CardTitle
				>
				<Card.CardDescription
					>Add timeline events, summit pushes, meal times, and rest
					stops.</Card.CardDescription
				>
			</Card.CardHeader>

			<Card.CardContent>
				<form onsubmit={handleAddEntry} class="space-y-3">
					<div class="grid grid-cols-1 gap-2 sm:grid-cols-6">
						<div class="sm:col-span-1">
							<Input
								type="number"
								min="1"
								max="30"
								bind:value={newDay}
								placeholder="Day"
							/>
						</div>
						<div class="sm:col-span-2">
							<Input
								type="text"
								placeholder="e.g. 05:00 AM"
								bind:value={newTime}
							/>
						</div>
						<div class="sm:col-span-3">
							<Input
								type="text"
								placeholder="Activity Title (e.g. Summit Attack)"
								bind:value={newTitle}
								required
							/>
						</div>
					</div>

					<div class="flex flex-col sm:flex-row gap-2">
						<Input
							type="text"
							placeholder="Activity details & requirements (e.g. Bring headlamps)..."
							bind:value={newDescription}
							class="flex-1"
						/>
						<Button
							type="submit"
							disabled={adding || !newTitle.trim()}
							class="gap-1.5 shrink-0"
						>
							<Plus class="h-4 w-4" />
							<span>{adding ? "Adding..." : "Add Event"}</span>
						</Button>
					</div>
				</form>
			</Card.CardContent>
		</Card.Card>
	{:else}
		<div
			class="rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-sm"
		>
			🔒 View-Only Mode — Itinerary activities and schedules are
			maintained by the trip organizer.
		</div>
	{/if}

	<!-- Itinerary Timeline Card -->
	<Card.Card>
		<Card.CardHeader
			class="flex flex-row items-center justify-between space-y-0 pb-4"
		>
			<div>
				<Card.CardTitle class="text-base font-bold"
					>Chronological Itinerary</Card.CardTitle
				>
				<Card.CardDescription
					>Day-by-day plan of events</Card.CardDescription
				>
			</div>
			<Badge variant="secondary" class="gap-1">
				<CalendarDays class="h-3 w-3" />
				<span>{sortedEntries.length} events</span>
			</Badge>
		</Card.CardHeader>

		<Card.CardContent class="space-y-4">
			{#if availableDays.length > 1}
				<div class="flex flex-wrap gap-1.5">
					<Button
						variant={selectedDayFilter === "all"
							? "default"
							: "outline"}
						size="sm"
						class="h-7 text-xs rounded-full"
						onclick={() => (selectedDayFilter = "all")}
					>
						All Days
					</Button>
					{#each availableDays as dayNum}
						<Button
							variant={selectedDayFilter === dayNum
								? "default"
								: "outline"}
							size="sm"
							class="h-7 text-xs rounded-full"
							onclick={() => (selectedDayFilter = dayNum)}
						>
							Day {dayNum}
						</Button>
					{/each}
				</div>
			{/if}

			{#if sortedEntries.length === 0}
				<div class="py-8 text-center text-xs text-slate-500">
					No itinerary activities planned yet. Add schedule events
					above.
				</div>
			{:else}
				<div class="space-y-2">
					{#each filteredEntries as entry, index (entry.id)}
						<div
							class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-xs"
						>
							{#if editingEntryId === entry.id}
								<div class="flex-1 space-y-2">
									<div
										class="grid grid-cols-1 gap-2 sm:grid-cols-6"
									>
										<Input
											type="number"
											min="1"
											bind:value={editDay}
											class="h-8 text-xs sm:col-span-1"
										/>
										<Input
											type="text"
											bind:value={editTime}
											class="h-8 text-xs sm:col-span-2"
											placeholder="Time"
										/>
										<Input
											type="text"
											bind:value={editTitle}
											class="h-8 text-xs sm:col-span-3"
											placeholder="Title"
										/>
									</div>
									<Input
										type="text"
										bind:value={editDescription}
										class="h-8 text-xs"
										placeholder="Details"
									/>
									<div class="flex gap-2">
										<Button
											size="sm"
											class="h-7 gap-1 text-xs"
											onclick={() => saveEdit(entry.id)}
										>
											<Check class="h-3 w-3" />
											<span>Save</span>
										</Button>
										<Button
											variant="outline"
											size="sm"
											class="h-7 gap-1 text-xs"
											onclick={() =>
												(editingEntryId = null)}
										>
											<X class="h-3 w-3" />
											<span>Cancel</span>
										</Button>
									</div>
								</div>
							{:else}
								<div class="flex items-center gap-3">
									<div
										class="flex flex-col gap-1 min-w-[75px]"
									>
										<Badge
											variant="secondary"
											class="w-fit text-[10px] px-1.5 py-0"
											>Day {entry.day || 1}</Badge
										>
										{#if entry.time}
											<div
												class="flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-700"
											>
												<Clock class="h-3 w-3" />
												<span>{entry.time}</span>
											</div>
										{/if}
									</div>

									<div>
										<h3
											class="text-sm font-bold text-slate-900"
										>
											{entry.title}
										</h3>
										{#if entry.description}
											<p class="text-xs text-slate-500">
												{entry.description}
											</p>
										{/if}
									</div>
								</div>

								{#if isOwner}
									<div
										class="flex items-center gap-0.5 self-end sm:self-center shrink-0"
									>
										<Button
											variant="ghost"
											size="sm"
											class="h-7 w-7 p-0 text-slate-500"
											disabled={index === 0}
											onclick={() => moveEntry(index, -1)}
										>
											<ChevronUp class="h-3.5 w-3.5" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											class="h-7 w-7 p-0 text-slate-500"
											disabled={index ===
												sortedEntries.length - 1}
											onclick={() => moveEntry(index, 1)}
										>
											<ChevronDown class="h-3.5 w-3.5" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											class="h-7 w-7 p-0 text-slate-500"
											onclick={() => startEdit(entry)}
										>
											<Pencil class="h-3.5 w-3.5" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											class="h-7 w-7 p-0 text-slate-500 hover:text-red-600"
											onclick={() => handleDelete(entry)}
										>
											<Trash2 class="h-3.5 w-3.5" />
										</Button>
									</div>
								{/if}
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</Card.CardContent>
	</Card.Card>
</div>
