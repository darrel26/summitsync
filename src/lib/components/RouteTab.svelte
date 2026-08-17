<script lang="ts">
	import { showToast } from '$lib/toast.js';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/Button.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import Badge from '$lib/components/ui/badge/Badge.svelte';
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

	interface RouteStop {
		id: string;
		label: string;
		description?: string;
		sort_order?: number;
	}

	interface Props {
		routeStops?: RouteStop[];
		isOwner?: boolean;
		onAddStop: (data: any) => Promise<any>;
		onUpdateStop: (id: string, data: any) => Promise<any>;
		onDeleteStop: (id: string) => Promise<any>;
	}

	let {
		routeStops = [],
		isOwner = false,
		onAddStop,
		onUpdateStop,
		onDeleteStop
	}: Props = $props();

	let newLabel = $state('');
	let newDescription = $state('');
	let adding = $state(false);

	let editingStopId = $state<string | null>(null);
	let editLabel = $state('');
	let editDescription = $state('');

	let sortedStops = $derived([...routeStops].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));

	async function handleAddStop(e: SubmitEvent) {
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

	function startEdit(stop: RouteStop) {
		editingStopId = stop.id;
		editLabel = stop.label;
		editDescription = stop.description || '';
	}

	async function saveEdit(id: string) {
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

	async function handleDelete(stop: RouteStop) {
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

	async function moveStop(index: number, direction: number) {
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

<div class="space-y-6">
	<!-- Add Stop Card -->
	{#if isOwner}
		<Card.Card>
			<Card.CardHeader class="pb-3">
				<Card.CardTitle class="text-base font-bold">Add Waypoint / Checkpoint</Card.CardTitle>
				<Card.CardDescription>Meeting points, trailheads, shelters, and campsites.</Card.CardDescription>
			</Card.CardHeader>

			<Card.CardContent>
				<form onsubmit={handleAddStop} class="flex flex-col gap-3">
					<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
						<Input
							type="text"
							placeholder="Location or checkpoint (e.g. Cibodas Basecamp)..."
							bind:value={newLabel}
							required
						/>
						<Input
							type="text"
							placeholder="Notes & instructions (e.g. Meet at 05:00 AM)..."
							bind:value={newDescription}
						/>
					</div>
					<Button type="submit" disabled={adding || !newLabel.trim()} class="self-start gap-1.5">
						<Plus class="h-4 w-4" />
						<span>{adding ? 'Adding...' : 'Add Waypoint'}</span>
					</Button>
				</form>
			</Card.CardContent>
		</Card.Card>
	{:else}
		<div class="rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-sm">
			🔒 View-Only Mode — Route waypoints and stops are maintained by the trip organizer.
		</div>
	{/if}

	<!-- Stops Timeline Card -->
	<Card.Card>
		<Card.CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
			<div>
				<Card.CardTitle class="text-base font-bold">Route Trail & Stops</Card.CardTitle>
				<Card.CardDescription>Step-by-step route order</Card.CardDescription>
			</div>
			<Badge variant="secondary" class="gap-1">
				<MapPin class="h-3 w-3" />
				<span>{sortedStops.length} stops</span>
			</Badge>
		</Card.CardHeader>

		<Card.CardContent>
			{#if sortedStops.length === 0}
				<div class="py-8 text-center text-xs text-slate-500">
					No route stops added yet. Add your starting point, checkpoints, and destination above.
				</div>
			{:else}
				<div class="relative space-y-4">
					{#each sortedStops as stop, index (stop.id)}
						<div class="flex gap-3">
							<!-- Step Indicator -->
							<div class="flex flex-col items-center">
								<div class="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-sm">
									{index + 1}
								</div>
								{#if index < sortedStops.length - 1}
									<div class="w-0.5 flex-1 bg-slate-200 my-1"></div>
								{/if}
							</div>

							<!-- Stop Body -->
							<div class="flex-1 rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
								{#if editingStopId === stop.id}
									<div class="space-y-2">
										<Input bind:value={editLabel} class="h-8 text-xs" placeholder="Stop name" />
										<Input bind:value={editDescription} class="h-8 text-xs" placeholder="Notes or instructions" />
										<div class="flex gap-2">
											<Button size="sm" class="h-7 gap-1 text-xs" onclick={() => saveEdit(stop.id)}>
												<Check class="h-3 w-3" />
												<span>Save</span>
											</Button>
											<Button variant="outline" size="sm" class="h-7 gap-1 text-xs" onclick={() => (editingStopId = null)}>
												<X class="h-3 w-3" />
												<span>Cancel</span>
											</Button>
										</div>
									</div>
								{:else}
									<div class="flex items-start justify-between gap-2">
										<div>
											<h3 class="text-sm font-bold text-slate-900">{stop.label}</h3>
											{#if stop.description}
												<p class="mt-0.5 text-xs text-slate-500">{stop.description}</p>
											{/if}
										</div>

										{#if isOwner}
											<div class="flex items-center gap-0.5 shrink-0">
												<Button
													variant="ghost"
													size="sm"
													class="h-7 w-7 p-0 text-slate-500"
													disabled={index === 0}
													onclick={() => moveStop(index, -1)}
												>
													<ChevronUp class="h-3.5 w-3.5" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													class="h-7 w-7 p-0 text-slate-500"
													disabled={index === sortedStops.length - 1}
													onclick={() => moveStop(index, 1)}
												>
													<ChevronDown class="h-3.5 w-3.5" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													class="h-7 w-7 p-0 text-slate-500"
													onclick={() => startEdit(stop)}
												>
													<Pencil class="h-3.5 w-3.5" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													class="h-7 w-7 p-0 text-slate-500 hover:text-red-600"
													onclick={() => handleDelete(stop)}
												>
													<Trash2 class="h-3.5 w-3.5" />
												</Button>
											</div>
										{/if}
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</Card.CardContent>
	</Card.Card>
</div>
