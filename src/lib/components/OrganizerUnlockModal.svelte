<script>
	import { showToast } from '$lib/toast.js';
	import { KeyRound, X, ArrowRight } from 'lucide-svelte';

	let {
		submitting = false,
		onUnlock,
		onClose
	} = $props();

	let enteredPin = $state('');

	function handleSubmit(e) {
		e.preventDefault();
		if (!enteredPin.trim()) return;
		onUnlock(enteredPin.trim());
	}
</script>

<div
	class="modal-backdrop"
	role="dialog"
	aria-modal="true"
	onclick={(e) => { if (e.target === e.currentTarget) onClose(); }}
	onkeydown={(e) => { if (e.key === 'Escape') onClose(); }}
	tabindex="-1"
>
	<div class="modal-card">
		<div class="modal-head">
			<div class="icon-wrap">
				<KeyRound size={22} />
			</div>
			<button type="button" class="btn-close" onclick={onClose} aria-label="Close modal">
				<X size={18} />
			</button>
		</div>

		<h2 class="modal-title">Organizer PIN Unlock</h2>
		<p class="modal-desc">Enter the trip organizer PIN to unlock owner permissions (edit route, itinerary, and group gear).</p>

		<form onsubmit={handleSubmit} class="pin-form">
			<div class="input-wrap">
				<input
					type="password"
					bind:value={enteredPin}
					placeholder="Enter 4-6 digit PIN"
					required
					maxlength="10"
					class="pin-field"
				/>
			</div>

			<div class="modal-actions">
				<button type="button" class="btn btn-secondary" onclick={onClose} disabled={submitting}>
					Cancel
				</button>
				<button type="submit" class="btn btn-primary" disabled={submitting || !enteredPin.trim()}>
					<span>{submitting ? 'Verifying...' : 'Unlock Permissions'}</span>
					{#if !submitting}
						<ArrowRight size={16} />
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(15, 23, 42, 0.45);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		z-index: 2000;
		backdrop-filter: blur(5px);
	}

	.modal-card {
		background: var(--bg-surface);
		width: 100%;
		max-width: 400px;
		border-radius: var(--radius-lg);
		padding: 28px 24px;
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

	.modal-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}

	.icon-wrap {
		width: 44px;
		height: 44px;
		border-radius: var(--radius-full);
		background: var(--bg-subtle);
		color: var(--text-main);
		display: grid;
		place-content: center;
	}

	.btn-close {
		color: var(--text-muted);
		padding: 6px;
		border-radius: var(--radius-sm);
		display: grid;
		place-content: center;
		transition: all 0.15s ease;
	}

	.btn-close:hover {
		color: var(--text-main);
		background: var(--bg-subtle);
	}

	.modal-title {
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--text-main);
		margin-bottom: 6px;
		letter-spacing: -0.01em;
	}

	.modal-desc {
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin-bottom: 20px;
		line-height: 1.5;
	}

	.pin-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.pin-field {
		width: 100%;
		padding: 11px 14px;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		font-size: 1rem;
		background: var(--bg-surface);
		outline: none;
		text-align: center;
		letter-spacing: 0.1em;
		transition: border-color 0.15s ease;
	}

	.pin-field:focus {
		border-color: var(--border-focus);
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 9px 16px;
		border-radius: var(--radius-md);
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-primary {
		background: var(--color-primary);
		color: #ffffff;
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--color-primary-hover);
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: var(--bg-subtle);
		color: var(--text-main);
	}
</style>
