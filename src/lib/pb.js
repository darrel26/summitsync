import PocketBase from 'pocketbase';

// Use environment variable if provided (VITE_POCKETBASE_URL), otherwise default to local or configured instance
export const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(POCKETBASE_URL);

// Disable auto-cancellation globally for multiple parallel calls
pb.autoCancellation(false);
