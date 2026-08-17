<script lang="ts">
	import { CheckSquare, Users, MapPin, CalendarDays } from "lucide-svelte";
	import { cn } from "$lib/utils";

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
		activeTab = "checklist",
		memberCount = 0,
		groupItemCount = 0,
		personalItemCount = 0,
		routeCount = 0,
		itineraryCount = 0,
		onSelectTab,
	}: Props = $props();

	const tabs = [
		{
			id: "checklist",
			label: "Checklist",
			icon: CheckSquare,
			count: () => groupItemCount + personalItemCount,
		},
		{
			id: "members",
			label: "Members",
			icon: Users,
			count: () => memberCount,
		},
		{ id: "route", label: "Route", icon: MapPin, count: () => routeCount },
		{
			id: "itinerary",
			label: "Schedule",
			icon: CalendarDays,
			count: () => itineraryCount,
		},
	];
</script>

<div
	class="my-6 rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-sm backdrop-blur-sm transition-all max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:z-50 max-sm:my-0 max-sm:rounded-b-none max-sm:rounded-t-2xl max-sm:border-x-0 max-sm:border-b-0 max-sm:border-t-slate-200 max-sm:bg-white/95 max-sm:p-2 max-sm:shadow-xl max-sm:pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
>
	<div
		class="grid grid-cols-4 gap-1.5"
		role="tablist"
		aria-label="Trip workspace views"
	>
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
					"group relative flex items-center justify-center gap-2 rounded-xl py-2.5 px-3.5 text-sm font-semibold cursor-pointer select-none outline-none transition-all duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1 max-sm:flex-col max-sm:gap-1 max-sm:py-2 max-sm:text-[11px]",
					isActive
						? "bg-slate-900 text-white shadow-sm max-sm:bg-slate-900 max-sm:text-white"
						: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200/70",
				)}
				onclick={() => onSelectTab(tab.id)}
			>
				<div class="relative flex items-center justify-center">
					<Icon
						class="h-4 w-4 transition-transform duration-150 group-hover:scale-105 group-active:scale-95 max-sm:h-4 max-sm:w-4"
						strokeWidth={isActive ? 2.5 : 2}
					/>
					{#if count > 0}
						<span
							class={cn(
								"absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold font-mono tracking-tight transition-transform duration-150",
								isActive
									? "bg-white text-slate-900 max-sm:bg-white max-sm:text-slate-900"
									: "bg-slate-900 text-white group-hover:bg-slate-800",
							)}
						>
							{count}
						</span>
					{/if}
				</div>
				<span class="truncate tracking-tight">{tab.label}</span>
			</button>
		{/each}
	</div>
</div>
