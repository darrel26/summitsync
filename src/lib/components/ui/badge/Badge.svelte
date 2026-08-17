<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { badgeVariants, type BadgeVariant } from './index';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: BadgeVariant;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'default',
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<div class={cn(badgeVariants({ variant }), className)} {...rest}>
	{@render children?.()}
</div>
