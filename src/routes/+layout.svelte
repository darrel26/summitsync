<script lang="ts">
	import { toast } from "$lib/toast";
	import { CheckCircle2, AlertCircle, Info } from "lucide-svelte";
	import "../app.css";

	let { children } = $props();
</script>

<div class="app-layout">
	<a href="#main-content" class="skip-link">Skip to main content</a>

	<div class="main-content-wrapper">
		{@render children()}
	</div>

	{#if $toast}
		<div class="toast-wrapper" aria-live="polite" role="status">
			<div class="toast toast-{$toast.type}">
				{#if $toast.type === "success"}
					<CheckCircle2 size={16} class="toast-icon" />
				{:else if $toast.type === "error"}
					<AlertCircle size={16} class="toast-icon" />
				{:else}
					<Info size={16} class="toast-icon" />
				{/if}
				<span class="toast-msg">{$toast.message}</span>
			</div>
		</div>
	{/if}
</div>

<style>
	.app-layout {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.main-content-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.toast-wrapper {
		position: fixed;
		bottom: 24px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 9999;
		pointer-events: none;
	}

	.toast {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 16px;
		border-radius: var(--radius-full, 9999px);
		font-weight: 500;
		font-size: 0.875rem;
		background: #0f172a;
		color: #ffffff;
		box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.15);
		border: 1px solid rgba(255, 255, 255, 0.1);
		animation: toastSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		pointer-events: auto;
	}

	.toast-success :global(.toast-icon) {
		color: #34d399;
	}

	.toast-error :global(.toast-icon) {
		color: #f87171;
	}

	.toast-info :global(.toast-icon) {
		color: #60a5fa;
	}

	@keyframes toastSlideUp {
		from {
			transform: translateY(12px) scale(0.96);
			opacity: 0;
		}
		to {
			transform: translateY(0) scale(1);
			opacity: 1;
		}
	}
</style>
