<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Compass } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	interface Props extends HTMLAttributes<HTMLElement> {
		class?: string;
		children?: Snippet;
		actions?: Snippet;
	}

	let { class: className = '', children, actions, ...rest }: Props = $props();
</script>

<header
	class={cn('sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md', className)}
	{...rest}
>
	<div class="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
		<div class="flex items-center gap-3">
			<a
				href="/"
				aria-label="SummitSync Home"
				class="flex items-center gap-2.5 font-bold text-slate-900 transition-opacity hover:opacity-80"
			>
				<div
					aria-hidden="true"
					class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm"
				>
					<Compass class="h-5 w-5" />
				</div>
				<span class="text-lg tracking-tight font-extrabold">SummitSync</span>
			</a>
			{#if children}
				<div class="hidden sm:flex items-center gap-2 text-sm text-slate-400">
					<span aria-hidden="true">/</span>
					{@render children()}
				</div>
			{/if}
		</div>
		{#if actions}
			<div class="flex items-center gap-2">
				{@render actions()}
			</div>
		{/if}
	</div>
</header>
