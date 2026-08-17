import { writable } from 'svelte/store';
import type { ToastMessage, ToastType } from './types';

export const toast = writable<ToastMessage | null>(null);

let activeTimeout: ReturnType<typeof setTimeout> | null = null;

export function showToast(message: string, type: ToastType = 'info', duration = 3500) {
	const id = Math.random().toString(36).slice(2, 9);

	if (activeTimeout) {
		clearTimeout(activeTimeout);
		activeTimeout = null;
	}

	toast.set({ id, message, type, duration });

	if (duration > 0) {
		activeTimeout = setTimeout(() => {
			toast.update((current) => (current && current.id === id ? null : current));
			activeTimeout = null;
		}, duration);
	}
}

export function dismissToast(id?: string) {
	if (activeTimeout) {
		clearTimeout(activeTimeout);
		activeTimeout = null;
	}
	if (id) {
		toast.update((current) => (current && current.id === id ? null : current));
	} else {
		toast.set(null);
	}
}
