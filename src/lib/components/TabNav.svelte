<script lang="ts">
	import {
		CheckSquare,
		Users,
		MapPin,
		CalendarDays
	} from 'lucide-svelte';
	import { cn } from '$lib/utils';

	interface Props {
		activeTab?: string;
		memberCount?: number;
		groupItemCount?: number;
		personalItemCount?: number;
		routeCount?: number;
		itineraryCount?: number;
		onSelectTab: (tabId: string) => void;
	}

	let {
		activeTab = 'checklist',
		memberCount = 0,
		groupItemCount = 0,
		personalItemCount = 0,
		routeCount = 0,
		itineraryCount = 0,
		onSelectTab
	}: Props = $props();

	const tabs = [
		{ id: 'checklist', label: 'Checklist', icon: CheckSquare, count: () => groupItemCount + personalItemCount },
		{ id: 'members', label: 'Members', icon: Users, count: () => memberCount },
		{ id: 'route', label: 'Route', icon: MapPin, count: () => routeCount },
		{ id: 'itinerary', label: 'Schedule', icon: CalendarDays, count: () => itineraryCount }
	];
</script>

<div class="mb-6 rounded-xl border border-slate-200 bg-white p-1 shadow-sm max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:z-50 max-sm:mb-0 max-sm:rounded-b-none max-sm:rounded-t-xl max-sm:border-x-0 max-sm:border-b-0 max-sm:p-1.5 max-sm:shadow-lg max-sm:pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
	<div class="grid grid-cols-4 gap-1" role="tablist" aria-label="Trip workspace views">
		{#each tabs as tab}
			{@const Icon = tab.icon}
			{@const count = tab.count()}
			{@const isActive = activeTab === tab.id}
			<button
				id="tab-{tab.id}"
				type="button"
				role="tab"
				aria-selected={isActive}
				aria-controls="main-content"
				aria-label={count > 0 ? `${tab.label} (${count})` : tab.label}
				class={cn(
					'flex items-center justify-center gap-2 rounded-lg py-2 px-3 text-sm font-semibold transition-all max-sm:flex-col max-sm:gap-0.5 max-sm:py-1.5 max-sm:text-[11px]',
					isActive
						? 'bg-slate-900 text-white shadow-sm max-sm:bg-slate-100 max-sm:text-slate-900 max-sm:shadow-none'
						: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
				)}
				onclick={() => onSelectTab(tab.id)}
			>
				<div class="relative flex items-center justify-center">
					<Icon class="h-4 w-4 max-sm:h-4 max-sm:w-4" strokeWidth={isActive ? 2.5 : 2} />
					{#if count > 0}
						<span
							class={cn(
								'absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold font-mono',
								isActive
									? 'bg-white text-slate-900 max-sm:bg-slate-900 max-sm:text-white'
									: 'bg-slate-900 text-white'
							)}
						>
							{count}
						</span>
					{/if}
				</div>
				<span class="truncate">{tab.label}</span>
			</button>
		{/each}
	</div>
</div>
