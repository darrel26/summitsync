import { writable } from 'svelte/store';
import { pb } from './pb.js';

/**
 * Creates a reactive real-time store for a PocketBase collection filtered by trip ID or member IDs.
 *
 * @template T
 * @param {string} collectionName - Name of the PocketBase collection
 * @param {string} tripId - ID of the trip to filter by
 * @param {Object} [options]
 * @param {string} [options.sort] - Sort order string
 * @param {string} [options.expand] - Expand relations
 * @param {string} [options.filterField='trip'] - The field linking record to the trip
 * @param {() => string[]} [options.getMemberIds] - Optional member IDs provider for personal items
 */
export function createTripCollectionStore(collectionName, tripId, options = {}) {
	const { sort = '', expand = '', filterField = 'trip', getMemberIds } = options;
	const { subscribe, set, update } = writable([]);
	const loading = writable(true);
	const error = writable(null);

	let isSubscribing = false;
	let isSubscribed = false;
	let unsubscribeFn = null;

	async function init() {
		if (!tripId) return;
		loading.set(true);
		error.set(null);

		try {
			let filter = '';
			if (filterField) {
				filter = `${filterField} = "${tripId}"`;
			} else if (getMemberIds) {
				const memberIds = getMemberIds();
				if (memberIds.length > 0) {
					filter = memberIds.map((id) => `member = "${id}"`).join(' || ');
				}
			}

			const records = await pb.collection(collectionName).getFullList({
				filter: filter || undefined,
				sort: sort || undefined,
				expand: expand || undefined,
				requestKey: null
			});

			set(records);
			loading.set(false);

			if (!isSubscribed && !isSubscribing) {
				isSubscribing = true;
				try {
					unsubscribeFn = await pb.collection(collectionName).subscribe(
						'*',
						(e) => {
							if (filterField) {
								const recordTripId = e.record[filterField];
								if (recordTripId && recordTripId !== tripId) return;
							} else if (getMemberIds) {
								const memberIds = getMemberIds();
								const itemMember = e.record.member;
								if (memberIds.length > 0 && !memberIds.includes(itemMember)) return;
							}

							update((currentList) => {
								if (e.action === 'create') {
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
						},
						{ expand: expand || undefined }
					);
					isSubscribed = true;
				} catch (err) {
					console.error(`Error subscribing to ${collectionName}:`, err);
				} finally {
					isSubscribing = false;
				}
			}
		} catch (err) {
			console.error(`Error initializing store for ${collectionName}:`, err);
			error.set(err.message || 'Failed to load records');
			loading.set(false);
		}
	}

	async function unsubscribeStore() {
		if (unsubscribeFn) {
			try {
				await unsubscribeFn();
			} catch (_) {}
			unsubscribeFn = null;
		}
		isSubscribed = false;
		isSubscribing = false;
	}

	return {
		subscribe,
		loading: { subscribe: loading.subscribe },
		error: { subscribe: error.subscribe },
		init,
		unsubscribe: unsubscribeStore,
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
