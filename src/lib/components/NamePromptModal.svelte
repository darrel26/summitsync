<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import Button from "$lib/components/ui/button/Button.svelte";
	import Input from "$lib/components/ui/input/Input.svelte";
	import type { Member } from "$lib/types";
	import { Sparkles, User, ArrowRight, UserCheck } from "lucide-svelte";

	interface Props {
		open?: boolean;
		members?: Member[];
		submitting?: boolean;
		onSubmit: (name: string) => void;
		onClaim?: (member: Member) => void;
	}

	let {
		open = $bindable(false),
		members = [],
		submitting = false,
		onSubmit,
		onClaim,
	}: Props = $props();

	let inputName = $state("");

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!inputName.trim()) return;
		onSubmit(inputName.trim());
	}

	function handleSelectMember(member: Member) {
		if (onClaim) {
			onClaim(member);
		} else {
			onSubmit(member.name);
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[420px] text-center">
		<div
			class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-800 mb-1"
		>
			<Sparkles class="h-6 w-6 text-amber-500" />
		</div>
		<Dialog.Header class="text-center sm:text-center">
			<Dialog.Title class="text-xl font-bold"
				>Join Trip Workspace</Dialog.Title
			>
			<Dialog.Description>
				Select your profile or enter your name to collaborate.
			</Dialog.Description>
		</Dialog.Header>

		{#if members && members.length > 0}
			<div class="my-2 text-left">
				<span
					class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2"
				>
					Are you on the roster?
				</span>
				<div class="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
					{#each members as member}
						<button
							type="button"
							class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
							onclick={() => handleSelectMember(member)}
							disabled={submitting}
						>
							<span
								class="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold border border-slate-200"
							>
								{member.name.charAt(0).toUpperCase()}
							</span>
							<span>{member.name}</span>
							<UserCheck
								class="h-3 w-3 text-emerald-600 opacity-70"
							/>
						</button>
					{/each}
				</div>

				<div class="relative my-4 flex items-center justify-center">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t border-slate-200"></span>
					</div>
					<span
						class="relative bg-white px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400"
					>
						or join as new
					</span>
				</div>
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-4 pt-1">
			<div class="relative flex items-center">
				<User
					class="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none"
				/>
				<Input
					bind:value={inputName}
					placeholder="What's your name? (e.g. Alex)"
					maxlength={40}
					class="pl-9"
					required
				/>
			</div>

			<Button
				type="submit"
				class="w-full gap-2"
				disabled={submitting || !inputName.trim()}
			>
				<span
					>{submitting ? "Joining..." : "Continue to Workspace"}</span
				>
				{#if !submitting}
					<ArrowRight class="h-4 w-4" />
				{/if}
			</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
