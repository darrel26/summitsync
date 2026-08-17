<script lang="ts">
	import { showToast } from '$lib/toast.js';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/Button.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import Badge from '$lib/components/ui/badge/Badge.svelte';
	import {
		UserPlus,
		Trash2,
		Users,
		UserCheck,
		Crown,
		ArrowRightLeft
	} from 'lucide-svelte';

	interface Member {
		id: string;
		name: string;
		role?: string;
	}

	interface Props {
		members?: Member[];
		currentMemberId?: string;
		isOwner?: boolean;
		onAddMember: (name: string) => Promise<any>;
		onRemoveMember: (id: string) => Promise<any>;
		onSwitchIdentity?: () => void;
	}

	let {
		members = [],
		currentMemberId = '',
		isOwner = false,
		onAddMember,
		onRemoveMember,
		onSwitchIdentity
	}: Props = $props();

	let newMemberName = $state('');
	let adding = $state(false);

	async function handleAddMember(e: SubmitEvent) {
		e.preventDefault();
		if (!newMemberName.trim()) return;

		adding = true;
		try {
			await onAddMember(newMemberName.trim());
			newMemberName = '';
			showToast('Member added', 'success');
		} catch (err) {
			console.error('Error adding member:', err);
			showToast('Failed to add member', 'error');
		} finally {
			adding = false;
		}
	}

	async function handleRemove(member: Member) {
		if (confirm(`Remove "${member.name}" from this trip? Personal gear assigned to this member will also be deleted.`)) {
			try {
				await onRemoveMember(member.id);
				showToast('Member removed', 'info');
			} catch (err) {
				console.error('Error removing member:', err);
				showToast('Failed to remove member', 'error');
			}
		}
	}
</script>

<div class="space-y-6">
	<!-- Add Member Card -->
	<Card.Card>
		<Card.CardHeader class="pb-3">
			<Card.CardTitle class="text-base font-bold">Add Member</Card.CardTitle>
			<Card.CardDescription>Add friends directly or invite them via the share link.</Card.CardDescription>
		</Card.CardHeader>

		<Card.CardContent>
			<form onsubmit={handleAddMember} class="flex flex-col sm:flex-row gap-2">
				<Input
					type="text"
					placeholder="Member full name or nickname..."
					bind:value={newMemberName}
					required
					class="flex-1"
				/>
				<Button type="submit" disabled={adding || !newMemberName.trim()} class="gap-1.5 shrink-0">
					<UserPlus class="h-4 w-4" />
					<span>{adding ? 'Adding...' : 'Add Member'}</span>
				</Button>
			</form>
		</Card.CardContent>
	</Card.Card>

	<!-- Members List Card -->
	<Card.Card>
		<Card.CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
			<div>
				<Card.CardTitle class="text-base font-bold">Trip Participants</Card.CardTitle>
				<Card.CardDescription>People collaborating on this trip</Card.CardDescription>
			</div>
			<Badge variant="secondary" class="gap-1">
				<Users class="h-3 w-3" />
				<span>{members.length} {members.length === 1 ? 'member' : 'members'}</span>
			</Badge>
		</Card.CardHeader>

		<Card.CardContent>
			{#if members.length === 0}
				<div class="py-8 text-center text-xs text-slate-500">
					No members registered yet. Share the trip link or add members above.
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{#each members as member (member.id)}
						{@const isSelf = member.id === currentMemberId}
						{@const isMemberOwner = member.role === 'owner'}
						<div class="flex items-center justify-between rounded-lg border p-3 transition-colors {isSelf ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200 bg-white hover:border-slate-300'}">
							<div class="flex items-center gap-2.5 min-w-0">
								<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold {isSelf ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}">
									{member.name.charAt(0).toUpperCase()}
								</div>
								<div class="flex flex-wrap items-center gap-1.5 min-w-0">
									<span class="text-sm font-semibold text-slate-900 truncate">{member.name}</span>
									{#if isMemberOwner}
										<Badge variant="warning" class="gap-0.5 text-[10px] px-1.5 py-0">
											<Crown class="h-2.5 w-2.5" />
											<span>Organizer</span>
										</Badge>
									{/if}
									{#if isSelf}
										<Badge variant="success" class="gap-0.5 text-[10px] px-1.5 py-0">
											<UserCheck class="h-2.5 w-2.5" />
											<span>You</span>
										</Badge>
									{/if}
								</div>
							</div>

							<div class="flex items-center gap-1">
								{#if isSelf && onSwitchIdentity}
									<Button
										variant="ghost"
										size="sm"
										class="h-8 w-8 p-0 text-slate-500 hover:text-emerald-700 hover:bg-emerald-100/50"
										title="Switch Identity"
										onclick={onSwitchIdentity}
									>
										<ArrowRightLeft class="h-3.5 w-3.5" />
									</Button>
								{/if}

								{#if isOwner && !isMemberOwner}
									<Button
										variant="ghost"
										size="sm"
										class="h-8 w-8 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50"
										title="Remove member"
										onclick={() => handleRemove(member)}
									>
										<Trash2 class="h-3.5 w-3.5" />
									</Button>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</Card.CardContent>
	</Card.Card>
</div>
