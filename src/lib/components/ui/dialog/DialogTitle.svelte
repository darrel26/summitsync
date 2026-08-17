<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		class: className = '',
		...rest
	}: DialogPrimitive.TitleProps = $props();
</script>

<DialogPrimitive.Title
	class={cn('text-lg font-semibold leading-none tracking-tight text-slate-900', className)}
	{...rest}
/>
