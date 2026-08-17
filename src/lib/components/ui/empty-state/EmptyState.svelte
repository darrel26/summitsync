<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		icon?: Component<any>;
		title: string;
		description?: string;
		action?: Snippet;
		class?: string;
	}

	let {
		icon: Icon,
		title,
		description,
		action,
		class: className = '',
		...rest
	}: Props = $props();
</script>

<div
	role="region"
	aria-label={title}
	class={cn(
		'flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center sm:p-12',
		className
	)}
	{...rest}
>
	{#if Icon}
		<div
			aria-hidden="true"
			class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500"
		>
			<Icon class="h-6 w-6" />
		</div>
	{/if}
	<h3 class="text-base font-semibold text-slate-900">{title}</h3>
	{#if description}
		<p class="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
	{/if}
	{#if action}
		<div class="mt-6">
			{@render action()}
		</div>
	{/if}
</div>
