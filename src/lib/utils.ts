import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Reorders two items by sort_order and executes the updates in parallel.
 */
export async function swapSortOrder<T extends { id: string; sort_order?: number }>(
	items: T[],
	index: number,
	targetIndex: number,
	updateFn: (id: string, data: { sort_order: number }) => Promise<unknown>
): Promise<void> {
	if (index < 0 || targetIndex < 0 || index >= items.length || targetIndex >= items.length) {
		return;
	}

	const currentItem = items[index];
	const targetItem = items[targetIndex];

	const currentOrder = currentItem.sort_order ?? index;
	const targetOrder = targetItem.sort_order ?? targetIndex;

	const newCurrentOrder = currentOrder === targetOrder ? targetIndex : targetOrder;
	const newTargetOrder = currentOrder === targetOrder ? index : currentOrder;

	await Promise.all([
		updateFn(currentItem.id, { sort_order: newCurrentOrder }),
		updateFn(targetItem.id, { sort_order: newTargetOrder })
	]);
}
