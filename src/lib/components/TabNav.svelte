<script>
	import {
		CheckSquare,
		Users,
		MapPin,
		CalendarDays
	} from 'lucide-svelte';

	let {
		activeTab = 'checklist',
		memberCount = 0,
		groupItemCount = 0,
		personalItemCount = 0,
		routeCount = 0,
		itineraryCount = 0,
		onSelectTab
	} = $props();

	const tabs = [
		{ id: 'checklist', label: 'Checklist', icon: CheckSquare, count: () => groupItemCount + personalItemCount },
		{ id: 'members', label: 'Members', icon: Users, count: () => memberCount },
		{ id: 'route', label: 'Route', icon: MapPin, count: () => routeCount },
		{ id: 'itinerary', label: 'Schedule', icon: CalendarDays, count: () => itineraryCount }
	];
</script>

<div class="tabs-nav-wrapper">
	<div class="tabs-nav" role="tablist" aria-label="Trip workspace views">
		{#each tabs as tab}
			{@const Icon = tab.icon}
			{@const count = tab.count()}
			<button
				id="tab-{tab.id}"
				type="button"
				role="tab"
				aria-selected={activeTab === tab.id}
				aria-controls="main-content"
				aria-label={count > 0 ? `${tab.label} (${count})` : tab.label}
				class="tab-item"
				class:active={activeTab === tab.id}
				onclick={() => onSelectTab(tab.id)}
			>
				<div class="tab-icon-wrap">
					<Icon size={18} strokeWidth={activeTab === tab.id ? 2.4 : 1.8} />
					{#if count > 0}
						<span class="tab-badge">{count}</span>
					{/if}
				</div>
				<span class="tab-label">{tab.label}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.tabs-nav-wrapper {
		margin-bottom: 28px;
		background: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-lg);
		padding: 4px;
		box-shadow: var(--shadow-subtle);
		position: relative;
	}

	.tabs-nav {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 4px;
		width: 100%;
	}

	.tab-item {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 10px 16px;
		border-radius: var(--radius-md);
		color: var(--text-secondary);
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		user-select: none;
		border: none;
		background: transparent;
	}

	.tab-item:hover:not(.active) {
		color: var(--text-main);
		background-color: var(--bg-subtle);
	}

	.tab-item.active {
		color: var(--text-main);
		background-color: var(--bg-surface);
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08);
	}

	.tab-icon-wrap {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tab-label {
		white-space: nowrap;
	}

	.tab-badge {
		position: absolute;
		top: -6px;
		right: -10px;
		background-color: var(--color-primary);
		color: #ffffff;
		font-size: 0.65rem;
		font-weight: 700;
		height: 16px;
		min-width: 16px;
		padding: 0 4px;
		border-radius: var(--radius-full);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		font-family: var(--font-mono);
	}

	/* Fixed Bottom Nav for Mobile */
	@media (max-width: 640px) {
		.tabs-nav-wrapper {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			margin-bottom: 0;
			border-radius: var(--radius-lg) var(--radius-lg) 0 0;
			border-left: none;
			border-right: none;
			border-bottom: none;
			background: var(--bg-surface);
			z-index: 100;
			padding: 6px 8px calc(6px + env(safe-area-inset-bottom));
			box-shadow: 0 -4px 16px -2px rgba(0, 0, 0, 0.08);
		}

		.tabs-nav {
			display: flex;
			justify-content: space-around;
			gap: 2px;
		}

		.tab-item {
			flex: 1;
			flex-direction: column;
			gap: 3px;
			padding: 6px 2px;
			min-height: 52px;
			border-radius: var(--radius-md);
		}

		.tab-label {
			font-size: 0.6875rem;
			font-weight: 600;
			letter-spacing: -0.01em;
		}

		.tab-badge {
			top: -4px;
			right: -8px;
			font-size: 0.6rem;
			height: 14px;
			min-width: 14px;
			padding: 0 3px;
		}

		.tab-item.active {
			background-color: var(--bg-subtle);
			color: var(--color-primary);
			box-shadow: none;
		}
	}
</style>
