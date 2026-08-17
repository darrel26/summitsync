<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/Button.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import { KeyRound, ArrowRight } from 'lucide-svelte';

	interface Props {
		open?: boolean;
		submitting?: boolean;
		onUnlock: (pin: string) => void;
	}

	let {
		open = $bindable(false),
		submitting = false,
		onUnlock
	}: Props = $props();

	let enteredPin = $state('');

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!enteredPin.trim()) return;
		onUnlock(enteredPin.trim());
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[400px]">
		<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-800 mb-1">
			<KeyRound class="h-6 w-6 text-slate-700" />
		</div>
		<Dialog.Header class="text-center sm:text-center">
			<Dialog.Title class="text-xl font-bold">Organizer PIN Unlock</Dialog.Title>
			<Dialog.Description>
				Enter the trip organizer PIN to unlock owner permissions.
			</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit} class="space-y-4 pt-2">
			<div>
				<Input
					type="password"
					bind:value={enteredPin}
					placeholder="Enter PIN"
					maxlength={10}
					class="text-center tracking-widest font-mono text-base"
					required
				/>
			</div>

			<Dialog.Footer class="pt-2 flex-row gap-2 justify-end">
				<Button
					type="button"
					variant="outline"
					onclick={() => (open = false)}
					disabled={submitting}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={submitting || !enteredPin.trim()} class="gap-1.5">
					<span>{submitting ? 'Verifying...' : 'Unlock'}</span>
					{#if !submitting}
						<ArrowRight class="h-4 w-4" />
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
