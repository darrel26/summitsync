<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import Button from "$lib/components/ui/button/Button.svelte";
	import { PinInput } from "$lib/components/ui/pin-input";
	import { KeyRound, ArrowRight } from "lucide-svelte";

	interface Props {
		open?: boolean;
		submitting?: boolean;
		onUnlock: (pin: string) => void;
	}

	let {
		open = $bindable(false),
		submitting = false,
		onUnlock,
	}: Props = $props();

	let enteredPin = $state("");

	function handleSubmit(e?: SubmitEvent) {
		e?.preventDefault();
		const clean = enteredPin.replace(/\D/g, "");
		if (clean.length !== 6) return;
		onUnlock(clean);
	}

	function handleComplete(pin: string) {
		enteredPin = pin;
		onUnlock(pin);
	}

	$effect(() => {
		if (!open) {
			enteredPin = "";
		}
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[420px]">
		<div
			class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-800 mb-1 ring-8 ring-slate-50"
		>
			<KeyRound class="h-6 w-6 text-slate-700" />
		</div>
		<Dialog.Header class="text-center sm:text-center">
			<Dialog.Title class="text-xl font-bold"
				>Organizer PIN Unlock</Dialog.Title
			>
			<Dialog.Description>
				Enter your 6-digit trip organizer PIN to unlock owner permissions.
			</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit} class="space-y-6 pt-3">
			<div class="flex flex-col items-center justify-center">
				<PinInput
					bind:value={enteredPin}
					length={6}
					disabled={submitting}
					onComplete={handleComplete}
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
				<Button
					type="submit"
					disabled={submitting || enteredPin.replace(/\D/g, "").length !== 6}
					class="gap-1.5"
				>
					<span>{submitting ? "Verifying..." : "Unlock"}</span>
					{#if !submitting}
						<ArrowRight class="h-4 w-4" />
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
