import { writable } from 'svelte/store';
import { pb } from './pb.js';

/**
 * Creates a reactive real-time store for a PocketBase collection filtered by trip ID.
 * Automatically handles initial fetch, SSE subscriptions (create/update/delete),
 * and unsubscribing.
 *
 * @param {string} collectionName - Name of the PocketBase collection
 * @param {string} tripId - ID of the trip to filter by
 * @param {Object} [options]
 * @param {string} [options.sort] - Sort order string (e.g. 'sort_order,created' or '-created')
 * @param {string} [options.expand] - Expand relations (e.g. 'assigned_to,member')
 * @param {string} [options.filterField='trip'] - The field linking record to the trip
 */
export function createTripCollectionStore(collectionName, tripId, options = {}) {
	const { sort = '', expand = '', filterField = 'trip' } = options;
	const { subscribe, set, update } = writable([]);
	const loading = writable(true);
	const error = writable(null);

	let isSubscribed = false;

	async function init() {
		if (!tripId) return;
		loading.set(true);
		error.set(null);

		try {
			// Construct filter
			const filter = filterField ? `${filterField} = "${tripId}"` : '';

			// Initial fetch
			const records = await pb.collection(collectionName).getFullList({
				filter: filter || undefined,
				sort: sort || undefined,
				expand: expand || undefined,
				requestKey: null
			});

			set(records);
			loading.set(false);

			// Real-time SSE subscription
			// PocketBase allows filtering topics or handling actions client-side
			if (!isSubscribed) {
				isSubscribed = true;
				pb.collection(collectionName).subscribe('*', (e) => {
					// Verify record belongs to this trip if filterField is present
					const recordTripId = filterField ? e.record[filterField] : null;

					if (filterField && recordTripId && recordTripId !== tripId) {
						return;
					}

					update((currentList) => {
						if (e.action === 'create') {
							// Avoid duplicates
							if (currentList.some((item) => item.id === e.record.id)) {
								return currentList.map((item) => (item.id === e.record.id ? e.record : item));
							}
							return [...currentList, e.record];
						} else if (e.action === 'update') {
							return currentList.map((item) => (item.id === e.record.id ? e.record : item));
						} else if (e.action === 'delete') {
							return currentList.filter((item) => item.id !== e.record.id);
						}
						return currentList;
					});
				}, {
					expand: expand || undefined
				}).catch((err) => {
					console.error(`Error subscribing to ${collectionName}:`, err);
					isSubscribed = false;
				});
			}
		} catch (err) {
			console.error(`Error initializing store for ${collectionName}:`, err);
			error.set(err.message || 'Failed to load records');
			loading.set(false);
		}
	}

	function unsubscribeStore() {
		if (isSubscribed) {
			pb.collection(collectionName).unsubscribe('*').catch(() => { });
			isSubscribed = false;
		}
	}

	return {
		subscribe,
		loading: { subscribe: loading.subscribe },
		error: { subscribe: error.subscribe },
		init,
		unsubscribe: unsubscribeStore,
		// Helper direct mutations with optimistic/standard fallback
		async create(data) {
			const payload = filterField && !data[filterField] ? { ...data, [filterField]: tripId } : { ...data };
			return await pb.collection(collectionName).create(payload, { expand: expand || undefined });
		},
		async updateRecord(id, data) {
			return await pb.collection(collectionName).update(id, data, { expand: expand || undefined });
		},
		async deleteRecord(id) {
			return await pb.collection(collectionName).delete(id);
		}
	};
}
