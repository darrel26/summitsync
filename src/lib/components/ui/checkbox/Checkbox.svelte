<script lang="ts">
	import { Checkbox as CheckboxPrimitive } from 'bits-ui';
	import { Check } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	let {
		class: className = '',
		checked = $bindable(false),
		disabled = false,
		...rest
	}: CheckboxPrimitive.RootProps = $props();
</script>

<CheckboxPrimitive.Root
	bind:checked
	{disabled}
	class={cn(
		'peer h-4 w-4 shrink-0 rounded-sm border border-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 data-[state=checked]:text-white',
		className
	)}
	{...rest}
>
	{#snippet children({ checked: isChecked })}
		{#if isChecked}
			<Check class="h-3.5 w-3.5 text-white" />
		{/if}
	{/snippet}
</CheckboxPrimitive.Root>
