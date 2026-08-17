import { Dialog as DialogPrimitive } from 'bits-ui';

export const Root = DialogPrimitive.Root;
export const Trigger = DialogPrimitive.Trigger;
export const Close = DialogPrimitive.Close;
export const Portal = DialogPrimitive.Portal;

export { default as Content } from './DialogContent.svelte';
export { default as Overlay } from './DialogOverlay.svelte';
export { default as Header } from './DialogHeader.svelte';
export { default as Footer } from './DialogFooter.svelte';
export { default as Title } from './DialogTitle.svelte';
export { default as Description } from './DialogDescription.svelte';

export {
	Root as Dialog,
	Trigger as DialogTrigger,
	Close as DialogClose,
	Portal as DialogPortal
};
