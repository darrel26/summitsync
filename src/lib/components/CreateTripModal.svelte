<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pb.js';
	import { showToast } from '$lib/toast.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/Button.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import Textarea from '$lib/components/ui/textarea/Textarea.svelte';
	import { Calendar, Compass, ShieldAlert, User, KeyRound } from 'lucide-svelte';

	interface Props {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		onSuccess?: () => void;
	}

	let { open = $bindable(false), onOpenChange, onSuccess }: Props = $props();

	let tripName = $state('');
	let organizerName = $state('');
	let organizerPin = $state('');
	let startDate = $state('');
	let endDate = $state('');
	let isRange = $state(true);
	let tripDescription = $state('');
	let creating = $state(false);
	let touched = $state({
		tripName: false,
		organizerName: false,
		organizerPin: false
	});

	let tripNameError = $derived(touched.tripName && !tripName.trim() ? 'Trip name is required' : '');
	let organizerNameError = $derived(touched.organizerName && !organizerName.trim() ? 'Organizer name is required' : '');
	let organizerPinError = $derived.by(() => {
		if (!touched.organizerPin) return '';
		if (!organizerPin.trim()) return 'PIN is required';
		if (!/^\d+$/.test(organizerPin.trim())) return 'PIN must contain only numbers';
		if (organizerPin.trim().length < 4) return 'PIN must be at least 4 digits';
		return '';
	});

	let isFormValid = $derived(
		tripName.trim().length > 0 &&
		organizerName.trim().length > 0 &&
		organizerPin.trim().length >= 4 &&
		/^\d+$/.test(organizerPin.trim())
	);

	function resetForm() {
		tripName = '';
		organizerName = '';
		organizerPin = '';
		startDate = '';
		endDate = '';
		tripDescription = '';
		touched = { tripName: false, organizerName: false, organizerPin: false };
	}

	$effect(() => {
		if (!open) {
			resetForm();
		}
	});

	async function handleCreateTrip(e: SubmitEvent) {
		e.preventDefault();
		touched.tripName = true;
		touched.organizerName = true;
		touched.organizerPin = true;

		if (!isFormValid) return;

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

			const memberRecord = await pb.collection('members').create({
				name: organizerName.trim(),
				trip: tripRecord.id,
				role: 'owner'
			});

			localStorage.setItem(`trip_member_${tripRecord.id}`, memberRecord.id);
			localStorage.setItem(`trip_is_owner_${tripRecord.id}`, 'true');

			showToast('Trip created successfully as Organizer!', 'success');
			open = false;
			onOpenChange?.(false);
			onSuccess?.();
			goto(`/trip/${tripRecord.id}`);
		} catch (err) {
			console.error('Error creating trip:', err);
			showToast('Failed to create trip', 'error');
		} finally {
			creating = false;
		}
	}
</script>

<Dialog.Root bind:open {onOpenChange}>
	<Dialog.Content class="sm:max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title class="text-xl font-bold">Create New Trip</Dialog.Title>
			<Dialog.Description>
				Start planning gear, trail routes, and day schedules with your group.
			</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleCreateTrip} class="space-y-4 pt-2">
			<!-- Trip Name Section -->
			<div class="space-y-1.5">
				<label for="trip-name" class="text-xs font-semibold uppercase tracking-wider text-slate-700">
					Trip Name <span class="text-red-500">*</span>
				</label>
				<Input
					id="trip-name"
					bind:value={tripName}
					placeholder="e.g., Mount Gede Weekend Expedition"
					error={!!tripNameError}
					onblur={() => (touched.tripName = true)}
					required
				/>
				{#if tripNameError}
					<p class="text-xs text-red-500 font-medium">{tripNameError}</p>
				{/if}
			</div>

			<!-- Organizer Section -->
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<div class="space-y-1.5">
					<label for="organizer-name" class="text-xs font-semibold uppercase tracking-wider text-slate-700">
						Your Name <span class="text-red-500">*</span>
					</label>
					<Input
						id="organizer-name"
						bind:value={organizerName}
						placeholder="e.g., Dion"
						error={!!organizerNameError}
						onblur={() => (touched.organizerName = true)}
						required
					/>
					{#if organizerNameError}
						<p class="text-xs text-red-500 font-medium">{organizerNameError}</p>
					{/if}
				</div>

				<div class="space-y-1.5">
					<label for="organizer-pin" class="text-xs font-semibold uppercase tracking-wider text-slate-700">
						Organizer PIN <span class="text-red-500">*</span>
					</label>
					<Input
						id="organizer-pin"
						type="password"
						bind:value={organizerPin}
						placeholder="4-digit PIN"
						maxlength={10}
						error={!!organizerPinError}
						onblur={() => (touched.organizerPin = true)}
						required
					/>
					{#if organizerPinError}
						<p class="text-xs text-red-500 font-medium">{organizerPinError}</p>
					{/if}
				</div>
			</div>

			<!-- Dates Section -->
			<div class="rounded-lg border border-slate-200 bg-slate-50/70 p-3 space-y-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700">
						<Calendar class="h-3.5 w-3.5" />
						<span>Trip Dates (Optional)</span>
					</div>
					<div class="flex rounded-md border border-slate-200 bg-white p-0.5 text-xs">
						<button
							type="button"
							class="rounded px-2 py-0.5 font-medium transition-colors {isRange ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}"
							onclick={() => (isRange = true)}
						>
							Range
						</button>
						<button
							type="button"
							class="rounded px-2 py-0.5 font-medium transition-colors {!isRange ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}"
							onclick={() => { isRange = false; endDate = ''; }}
						>
							Single
						</button>
					</div>
				</div>

				<div class="grid gap-2 {isRange ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}">
					<div>
						<span class="mb-1 block text-[11px] font-medium text-slate-500">{isRange ? 'Start Date' : 'Date'}</span>
						<Input type="date" bind:value={startDate} class="h-9 bg-white text-xs" />
					</div>
					{#if isRange}
						<div>
							<span class="mb-1 block text-[11px] font-medium text-slate-500">End Date</span>
							<Input type="date" bind:value={endDate} min={startDate || undefined} class="h-9 bg-white text-xs" />
						</div>
					{/if}
				</div>
			</div>

			<!-- Description Section -->
			<div class="space-y-1.5">
				<label for="trip-desc" class="text-xs font-semibold uppercase tracking-wider text-slate-700">
					Overview & Notes (Optional)
				</label>
				<Textarea
					id="trip-desc"
					rows={3}
					bind:value={tripDescription}
					placeholder="Trail checkpoints, meeting point, or logistics notes..."
				/>
			</div>

			<Dialog.Footer class="pt-2">
				<Button
					type="button"
					variant="outline"
					onclick={() => { open = false; onOpenChange?.(false); }}
					disabled={creating}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={creating || !isFormValid}>
					{creating ? 'Creating...' : 'Create Expedition'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
