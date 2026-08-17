<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { buttonVariants, type ButtonVariant, type ButtonSize } from './index';

	interface Props extends HTMLButtonAttributes {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'default',
		size = 'default',
		class: className = '',
		children,
		type = 'button',
		...rest
	}: Props = $props();
</script>

<button
	{type}
	class={cn(buttonVariants({ variant, size }), className)}
	{...rest}
>
	{@render children?.()}
</button>
