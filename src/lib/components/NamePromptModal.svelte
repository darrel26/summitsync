<script>
	import { Sparkles, User, ArrowRight } from 'lucide-svelte';

	let {
		submitting = false,
		onSubmit
	} = $props();

	let inputName = $state('');

	function handleSubmit(e) {
		e.preventDefault();
		if (!inputName.trim()) return;
		onSubmit(inputName.trim());
	}
</script>

<div class="modal-backdrop" role="dialog" aria-modal="true">
	<div class="modal-card">
		<div class="modal-icon-wrap">
			<Sparkles size={24} class="modal-icon" />
		</div>
		<h2 class="modal-title">Join Trip Workspace</h2>
		<p class="modal-desc">Enter your name so your group knows what items you're bringing.</p>

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
		padding: 32px 24px;
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
		margin: 0 auto 16px;
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
		margin-bottom: 24px;
		line-height: 1.5;
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

	.field-icon {
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
		font-size: 0.95rem;
		background: var(--bg-surface);
		outline: none;
		transition: border-color 0.15s ease;
	}

	.name-field:focus {
		border-color: var(--border-focus);
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 11px 20px;
		border-radius: var(--radius-md);
		font-weight: 600;
		font-size: 0.95rem;
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

	.btn-block {
		width: 100%;
	}
</style>
