<script>
	import { Sparkles, User, ArrowRight, UserCheck } from 'lucide-svelte';

	let {
		members = [],
		submitting = false,
		onSubmit,
		onClaim
	} = $props();

	let dialogEl = $state();
	let inputName = $state('');

	export function showModal() {
		dialogEl?.showModal();
	}

	export function close() {
		dialogEl?.close();
	}

	function handleSubmit(e) {
		e.preventDefault();
		if (!inputName.trim()) return;
		onSubmit(inputName.trim());
	}

	function handleSelectMember(member) {
		if (onClaim) {
			onClaim(member);
		} else {
			onSubmit(member.name);
		}
	}
</script>

<dialog
	bind:this={dialogEl}
	class="modal-dialog"
	onclose={() => {}}
>
	<div class="modal-card">
		<div class="modal-icon-wrap">
			<Sparkles size={24} class="modal-icon" />
		</div>
		<h2 class="modal-title">Join Trip Workspace</h2>
		<p class="modal-desc">Select your profile or enter your name to collaborate.</p>

		{#if members && members.length > 0}
			<div class="roster-section">
				<span class="roster-label">Are you on the roster?</span>
				<div class="roster-chips">
					{#each members as member}
						<button
							type="button"
							class="roster-chip"
							onclick={() => handleSelectMember(member)}
							disabled={submitting}
						>
							<div class="chip-avatar">{member.name.charAt(0).toUpperCase()}</div>
							<span class="chip-name">{member.name}</span>
							<UserCheck size={13} class="chip-check" />
						</button>
					{/each}
				</div>
				<div class="divider">
					<span>or join as new</span>
				</div>
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="join-form">
			<div class="input-wrapper">
				<User size={16} class="field-icon" />
				<input
					type="text"
					bind:value={inputName}
					placeholder="What's your name? (e.g. Alex)"
					required
					maxlength="40"
					class="name-field"
				/>
			</div>

			<button type="submit" class="btn btn-primary btn-block" disabled={submitting || !inputName.trim()}>
				<span>{submitting ? 'Joining...' : 'Continue to Workspace'}</span>
				{#if !submitting}
					<ArrowRight size={16} />
				{/if}
			</button>
		</form>
	</div>
</dialog>

<style>
	.modal-dialog {
		margin: auto;
		border: none;
		background: transparent;
		padding: 20px;
		max-width: calc(100vw - 32px);
	}

	.modal-dialog::backdrop {
		background: rgba(15, 23, 42, 0.45);
		backdrop-filter: blur(5px);
	}

	.modal-card {
		background: var(--bg-surface);
		width: 100%;
		max-width: 420px;
		border-radius: var(--radius-lg);
		padding: 28px 24px;
		text-align: center;
		box-shadow: var(--shadow-modal);
		border: 1px solid var(--border-default);
		animation: popUp 0.18s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes popUp {
		from {
			transform: scale(0.96);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.modal-icon-wrap {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-full);
		background: var(--bg-subtle);
		color: var(--text-main);
		display: grid;
		place-content: center;
		margin: 0 auto 14px;
	}

	.modal-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-main);
		margin-bottom: 6px;
		letter-spacing: -0.01em;
	}

	.modal-desc {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin-bottom: 20px;
		line-height: 1.5;
	}

	.roster-section {
		margin-bottom: 18px;
		text-align: left;
	}

	.roster-label {
		display: block;
		font-size: 0.775rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-muted);
		margin-bottom: 8px;
	}

	.roster-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		max-height: 140px;
		overflow-y: auto;
		padding: 2px;
	}

	.roster-chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px 6px 6px;
		border-radius: var(--radius-full);
		background: var(--bg-subtle);
		border: 1px solid var(--border-default);
		color: var(--text-main);
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s ease;
		min-height: 36px;
	}

	.roster-chip:hover {
		border-color: var(--color-emerald-border);
		background: var(--color-emerald-light);
		color: var(--color-emerald);
	}

	.chip-avatar {
		width: 24px;
		height: 24px;
		border-radius: var(--radius-full);
		background: var(--bg-surface);
		display: grid;
		place-content: center;
		font-size: 0.75rem;
		font-weight: 700;
		border: 1px solid var(--border-default);
	}

	:global(.chip-check) {
		color: var(--color-emerald);
		opacity: 0.7;
	}

	.divider {
		display: flex;
		align-items: center;
		text-align: center;
		margin: 16px 0 12px;
		color: var(--text-muted);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		border-bottom: 1px solid var(--border-default);
	}

	.divider span {
		padding: 0 10px;
	}

	.join-form {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	:global(.field-icon) {
		position: absolute;
		left: 14px;
		color: var(--text-muted);
		pointer-events: none;
	}

	.name-field {
		width: 100%;
		padding: 11px 14px 11px 40px;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		font-size: 1rem;
		background: var(--bg-surface);
		outline: none;
		transition: border-color 0.15s ease;
	}

	.name-field:focus {
		border-color: var(--border-focus);
	}

	.btn-block {
		width: 100%;
		min-height: 44px;
	}
</style>
