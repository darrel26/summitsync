<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface Props extends HTMLAttributes<HTMLElement> {
		class?: string;
		children?: Snippet;
	}

	let { class: className = '', children, ...rest }: Props = $props();
</script>

<main class={cn('mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 md:py-10', className)} {...rest}>
	{@render children?.()}
</main>
