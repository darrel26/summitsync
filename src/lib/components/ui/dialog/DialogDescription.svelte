<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		class: className = '',
		...rest
	}: DialogPrimitive.DescriptionProps = $props();
</script>

<DialogPrimitive.Description
	class={cn('text-sm text-slate-500', className)}
	{...rest}
/>
