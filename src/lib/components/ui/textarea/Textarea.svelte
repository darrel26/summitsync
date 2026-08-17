<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	interface Props extends HTMLTextareaAttributes {
		class?: string;
		value?: any;
		error?: boolean | string;
	}

	let {
		class: className = '',
		value = $bindable(),
		error = false,
		...rest
	}: Props = $props();
</script>

<textarea
	bind:value
	aria-invalid={error ? true : undefined}
	class={cn(
		'flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		error && 'border-red-500 focus-visible:ring-red-500',
		className
	)}
	{...rest}
></textarea>
