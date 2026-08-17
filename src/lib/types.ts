export type MemberRole = 'owner' | 'member';

export interface Member {
	id: string;
	name: string;
	role?: MemberRole;
	trip?: string;
	created?: string;
	updated?: string;
}

export interface Trip {
	id: string;
	name: string;
	date?: string;
	description?: string;
	pin?: string;
	created?: string;
	updated?: string;
}

export interface GroupItem {
	id: string;
	name: string;
	qty?: number;
	assigned_to?: string;
	packed?: boolean;
	trip: string;
	expand?: {
		assigned_to?: Member;
	};
	created?: string;
	updated?: string;
}

export interface PersonalItem {
	id: string;
	name: string;
	packed?: boolean;
	member: string;
	created?: string;
	updated?: string;
}

export interface RouteStop {
	id: string;
	label: string;
	description?: string;
	sort_order?: number;
	trip: string;
	created?: string;
	updated?: string;
}

export interface ItineraryEntry {
	id: string;
	day?: number;
	title: string;
	description?: string;
	time?: string;
	sort_order?: number;
	trip: string;
	created?: string;
	updated?: string;
}

export type ToastType = 'info' | 'success' | 'error';

export interface ToastMessage {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
}
