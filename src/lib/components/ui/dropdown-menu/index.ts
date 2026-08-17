import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

export const Root = DropdownMenuPrimitive.Root;
export const Trigger = DropdownMenuPrimitive.Trigger;
export const Group = DropdownMenuPrimitive.Group;
export const Portal = DropdownMenuPrimitive.Portal;
export const Sub = DropdownMenuPrimitive.Sub;
export const RadioGroup = DropdownMenuPrimitive.RadioGroup;

export { default as Content } from './DropdownMenuContent.svelte';
export { default as Item } from './DropdownMenuItem.svelte';
export { default as Label } from './DropdownMenuLabel.svelte';
export { default as Separator } from './DropdownMenuSeparator.svelte';
export { default as Shortcut } from './DropdownMenuShortcut.svelte';

export {
	Root as DropdownMenu,
	Trigger as DropdownMenuTrigger,
	Group as DropdownMenuGroup,
	Portal as DropdownMenuPortal,
	Sub as DropdownMenuSub,
	RadioGroup as DropdownMenuRadioGroup
};
