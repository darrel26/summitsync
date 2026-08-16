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
		{ id: 'route', label: 'Route & Stops', icon: MapPin, count: () => routeCount },
		{ id: 'itinerary', label: 'Itinerary', icon: CalendarDays, count: () => itineraryCount }
	];
</script>

<div class="tabs-nav-wrapper">
	<nav class="tabs-nav" aria-label="Trip workspace views">
		{#each tabs as tab}
			{@const Icon = tab.icon}
			{@const count = tab.count()}
			<button
				type="button"
				class="tab-item"
				class:active={activeTab === tab.id}
				onclick={() => onSelectTab(tab.id)}
			>
				<Icon size={16} strokeWidth={activeTab === tab.id ? 2.2 : 1.8} />
				<span class="tab-label">{tab.label}</span>
				{#if count > 0}
					<span class="tab-badge">{count}</span>
				{/if}
			</button>
		{/each}
	</nav>
</div>

<style>
	.tabs-nav-wrapper {
		margin-bottom: 28px;
		background: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-lg);
		padding: 4px;
		box-shadow: var(--shadow-subtle);
	}

	.tabs-nav {
		display: flex;
		gap: 4px;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.tabs-nav::-webkit-scrollbar {
		display: none;
	}

	.tab-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 9px 16px;
		border-radius: var(--radius-md);
		color: var(--text-secondary);
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.15s ease;
		white-space: nowrap;
		cursor: pointer;
	}

	.tab-item:hover {
		color: var(--text-main);
		background: var(--bg-subtle);
	}

	.tab-item.active {
		background: var(--color-primary);
		color: #ffffff;
		font-weight: 600;
	}

	.tab-badge {
		font-size: 0.725rem;
		font-weight: 600;
		padding: 1px 7px;
		border-radius: var(--radius-full);
		background: var(--bg-subtle);
		color: var(--text-secondary);
	}

	.tab-item.active .tab-badge {
		background: rgba(255, 255, 255, 0.2);
		color: #ffffff;
	}
</style>
