<script>
	import { showToast } from '$lib/toast.js';
	import {
		UserPlus,
		Trash2,
		Users,
		UserCheck,
		Crown
	} from 'lucide-svelte';

	let {
		members = [],
		currentMemberId = '',
		isOwner = false,
		onAddMember,
		onRemoveMember
	} = $props();

	let newMemberName = $state('');
	let adding = $state(false);

	async function handleAddMember(e) {
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

	async function handleRemove(member) {
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

<div class="members-layout">
	<!-- Add Member Card -->
	<div class="card add-card">
		<div class="card-header">
			<h2 class="card-title">Add Member</h2>
			<p class="card-sub">Add friends directly or invite them via the share link.</p>
		</div>

		<form onsubmit={handleAddMember} class="add-member-form">
			<input
				type="text"
				placeholder="Member full name or nickname..."
				bind:value={newMemberName}
				required
				class="name-input"
			/>
			<button type="submit" class="btn btn-primary" disabled={adding || !newMemberName.trim()}>
				<UserPlus size={16} />
				<span>{adding ? 'Adding...' : 'Add Member'}</span>
			</button>
		</form>
	</div>

	<!-- Members List Card -->
	<div class="card list-card">
		<div class="card-header flex-between">
			<div>
				<h2 class="card-title">Trip Participants</h2>
				<p class="card-sub">People collaborating on this trip</p>
			</div>
			<div class="count-badge">
				<Users size={14} />
				<span>{members.length} {members.length === 1 ? 'member' : 'members'}</span>
			</div>
		</div>

		{#if members.length === 0}
			<div class="empty-state">
				<p>No members registered yet. Share the trip link or add members above.</p>
			</div>
		{:else}
			<div class="members-grid">
				{#each members as member (member.id)}
					{@const isSelf = member.id === currentMemberId}
					{@const isMemberOwner = member.role === 'owner'}
					<div class="member-card" class:is-self={isSelf}>
						<div class="member-profile">
							<div class="avatar">{member.name.charAt(0).toUpperCase()}</div>
							<div class="member-meta">
								<span class="member-name">{member.name}</span>
								{#if isMemberOwner}
									<span class="badge-organizer" title="Trip Organizer">
										<Crown size={11} />
										<span>Organizer</span>
									</span>
								{/if}
								{#if isSelf}
									<span class="badge-you">
										<UserCheck size={12} />
										<span>You</span>
									</span>
								{/if}
							</div>
						</div>

						{#if isOwner && !isMemberOwner}
							<button
								type="button"
								class="btn-icon"
								title="Remove member"
								onclick={() => handleRemove(member)}
								aria-label="Remove {member.name}"
							>
								<Trash2 size={15} />
							</button>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.members-layout {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.card-header {
		margin-bottom: 18px;
	}

	.flex-between {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card-title {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--text-main);
		letter-spacing: -0.01em;
	}

	.card-sub {
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin-top: 2px;
	}

	.count-badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-secondary);
		background: var(--bg-subtle);
		padding: 4px 10px;
		border-radius: var(--radius-full);
	}

	.add-member-form {
		display: flex;
		gap: 10px;
	}

	.name-input {
		flex: 1;
		padding: 9px 12px;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		outline: none;
		font-size: 0.9rem;
	}

	.name-input:focus {
		border-color: var(--border-focus);
	}

	.members-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 12px;
	}

	.member-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 14px;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		background: var(--bg-surface);
		transition: border-color 0.15s ease;
	}

	.member-card.is-self {
		border-color: var(--color-emerald-border);
		background: var(--color-emerald-light);
	}

	.member-profile {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.avatar {
		width: 32px;
		height: 32px;
		border-radius: var(--radius-full);
		background: var(--bg-subtle);
		color: var(--text-main);
		font-weight: 700;
		font-size: 0.85rem;
		display: grid;
		place-content: center;
	}

	.member-card.is-self .avatar {
		background: var(--color-emerald);
		color: #ffffff;
	}

	.member-meta {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.member-name {
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--text-main);
	}

	.badge-organizer {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--color-amber);
		background: var(--color-amber-light);
		padding: 1px 6px;
		border-radius: var(--radius-full);
		border: 1px solid rgba(217, 119, 6, 0.2);
	}

	.badge-you {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--color-emerald);
		background: var(--bg-surface);
		padding: 1px 6px;
		border-radius: var(--radius-full);
		border: 1px solid var(--color-emerald-border);
	}

	.btn-icon {
		color: var(--text-muted);
		padding: 6px;
		border-radius: var(--radius-sm);
		transition: all 0.15s ease;
	}

	.btn-icon:hover {
		color: var(--color-danger);
		background: var(--color-danger-light);
	}

	.empty-state {
		text-align: center;
		padding: 36px 16px;
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	@media (max-width: 640px) {
		.members-grid {
			grid-template-columns: 1fr;
		}

		.add-member-form {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
