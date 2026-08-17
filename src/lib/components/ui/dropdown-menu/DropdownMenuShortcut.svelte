<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		class?: string;
		children?: Snippet;
	}

	let { class: className = '', children, ...rest }: Props = $props();
</script>

<span
	class={cn('ml-auto text-xs tracking-widest opacity-60', className)}
	{...rest}
>
	{@render children?.()}
</span>
