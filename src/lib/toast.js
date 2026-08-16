import { writable } from 'svelte/store';

export const toast = writable(null);

/**
 * Show a toast notification
 * @param {string} message
 * @param {'info' | 'success' | 'error'} type
 * @param {number} duration
 */
export function showToast(message, type = 'info', duration = 3000) {
	toast.set({ message, type, id: Date.now() });
	setTimeout(() => {
		toast.update((t) => (t && t.message === message ? null : t));
	}, duration);
}
