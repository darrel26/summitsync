<script lang="ts">
	import { showToast } from "$lib/toast";
	import * as Card from "$lib/components/ui/card";
	import Button from "$lib/components/ui/button/Button.svelte";
	import Input from "$lib/components/ui/input/Input.svelte";
	import Badge from "$lib/components/ui/badge/Badge.svelte";
	import Checkbox from "$lib/components/ui/checkbox/Checkbox.svelte";
	import type { Member, GroupItem, PersonalItem } from "$lib/types";
	import {
		Tent,
		Backpack,
		Plus,
		Pencil,
		Trash2,
		Check,
		X,
		CheckCircle2,
	} from "lucide-svelte";

	interface Props {
		groupItems?: GroupItem[];
		personalItems?: PersonalItem[];
		members?: Member[];
		currentMemberId?: string;
		isOwner?: boolean;
		onAddGroupItem: (data: Partial<GroupItem>) => Promise<unknown>;
		onUpdateGroupItem: (id: string, data: Partial<GroupItem>) => Promise<unknown>;
		onDeleteGroupItem: (id: string) => Promise<unknown>;
		onAddPersonalItem: (data: Partial<PersonalItem>) => Promise<unknown>;
		onUpdatePersonalItem: (id: string, data: Partial<PersonalItem>) => Promise<unknown>;
		onDeletePersonalItem: (id: string) => Promise<unknown>;
	}

	let {
		groupItems = [],
		personalItems = [],
		members = [],
		currentMemberId = "",
		isOwner = false,
		onAddGroupItem,
		onUpdateGroupItem,
		onDeleteGroupItem,
		onAddPersonalItem,
		onUpdatePersonalItem,
		onDeletePersonalItem,
	}: Props = $props();

	// Form states
	let newGroupName = $state("");
	let newGroupQty = $state(1);
	let addingGroup = $state(false);

	let newPersonalNames = $state<Record<string, string>>({});
	let addingPersonal = $state<Record<string, boolean>>({});

	// Inline edit states
	let editingGroupId = $state<string | null>(null);
	let editGroupName = $state("");
	let editGroupQty = $state(1);
	let editGroupAssigned = $state("");

	let editingPersonalId = $state<string | null>(null);
	let editPersonalName = $state("");

	let orderedMembers = $derived(
		!currentMemberId
			? members
			: [...members].sort((a, b) => {
					if (a.id === currentMemberId) return -1;
					if (b.id === currentMemberId) return 1;
					return 0;
				}),
	);

	// Group Item actions
	async function handleAddGroup(e: SubmitEvent) {
		e.preventDefault();
		if (!newGroupName.trim()) return;

		addingGroup = true;
		try {
			await onAddGroupItem({
				name: newGroupName.trim(),
				qty: Number(newGroupQty) || 1,
				packed: false,
			});
			newGroupName = "";
			newGroupQty = 1;
			showToast("Group gear item added", "success");
		} catch (err) {
			console.error("Error adding group item:", err);
			showToast("Failed to add item", "error");
		} finally {
			addingGroup = false;
		}
	}

	function startEditGroup(item: GroupItem) {
		editingGroupId = item.id;
		editGroupName = item.name;
		editGroupQty = item.qty || 1;
		editGroupAssigned = item.assigned_to || "";
	}

	async function saveEditGroup(id: string) {
		if (!editGroupName.trim()) return;
		try {
			await onUpdateGroupItem(id, {
				name: editGroupName.trim(),
				qty: Number(editGroupQty) || 1,
				assigned_to: editGroupAssigned || undefined,
			});
			editingGroupId = null;
			showToast("Item updated", "success");
		} catch (err) {
			console.error("Error updating item:", err);
			showToast("Failed to update item", "error");
		}
	}

	async function toggleGroupPacked(item: GroupItem) {
		try {
			await onUpdateGroupItem(item.id, {
				packed: !item.packed,
			});
		} catch (err) {
			console.error("Error toggling packed status:", err);
			showToast("Failed to update status", "error");
		}
	}

	async function updateGroupAssignment(
		item: GroupItem,
		newAssigneeId: string,
	) {
		try {
			await onUpdateGroupItem(item.id, {
				assigned_to: newAssigneeId || undefined,
			});
		} catch (err) {
			console.error("Error assigning item:", err);
			showToast("Failed to assign item", "error");
		}
	}

	async function handleDeleteGroup(item: GroupItem) {
		if (confirm(`Delete "${item.name}"?`)) {
			try {
				await onDeleteGroupItem(item.id);
				showToast("Item removed", "info");
			} catch (err) {
				console.error("Error deleting group item:", err);
				showToast("Failed to delete item", "error");
			}
		}
	}

	// Personal Item actions
	async function handleAddPersonal(memberId: string, e: SubmitEvent) {
		e.preventDefault();
		const name = (newPersonalNames[memberId] || "").trim();
		if (!name) return;

		addingPersonal[memberId] = true;
		try {
			await onAddPersonalItem({
				name,
				member: memberId,
				packed: false,
			});
			newPersonalNames[memberId] = "";
			showToast("Personal item added", "success");
		} catch (err) {
			console.error("Error adding personal item:", err);
			showToast("Failed to add personal item", "error");
		} finally {
			addingPersonal[memberId] = false;
		}
	}

	function startEditPersonal(item: PersonalItem) {
		editingPersonalId = item.id;
		editPersonalName = item.name;
	}

	async function saveEditPersonal(id: string) {
		if (!editPersonalName.trim()) return;
		try {
			await onUpdatePersonalItem(id, {
				name: editPersonalName.trim(),
			});
			editingPersonalId = null;
			showToast("Personal item updated", "success");
		} catch (err) {
			console.error("Error updating personal item:", err);
			showToast("Failed to update personal item", "error");
		}
	}

	async function togglePersonalPacked(item: PersonalItem) {
		try {
			await onUpdatePersonalItem(item.id, {
				packed: !item.packed,
			});
		} catch (err) {
			console.error("Error toggling packed status:", err);
			showToast("Failed to update status", "error");
		}
	}

	async function handleDeletePersonal(item: PersonalItem) {
		if (confirm(`Delete "${item.name}"?`)) {
			try {
				await onDeletePersonalItem(item.id);
				showToast("Item removed", "info");
			} catch (err) {
				console.error("Error deleting personal item:", err);
				showToast("Failed to delete item", "error");
			}
		}
	}
</script>

<div class="space-y-8">
	<!-- GROUP GEAR SECTION -->
	<Card.Card>
		<Card.CardHeader
			class="flex flex-row items-center justify-between space-y-0 pb-4"
		>
			<div class="flex items-center gap-3">
				<div
					class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-900"
				>
					<Tent class="h-4 w-4" />
				</div>
				<div>
					<Card.CardTitle class="text-base font-bold"
						>Shared Group Gear</Card.CardTitle
					>
					<Card.CardDescription
						>Equipment brought for the whole group</Card.CardDescription
					>
				</div>
			</div>

			<Badge variant="success" class="gap-1.5 font-medium">
				<CheckCircle2 class="h-3 w-3" />
				<span
					>{groupItems.filter((i) => i.packed).length} / {groupItems.length}
					packed</span
				>
			</Badge>
		</Card.CardHeader>

		<Card.CardContent class="space-y-4">
			{#if isOwner}
				<form
					onsubmit={handleAddGroup}
					class="flex flex-col sm:flex-row gap-2"
				>
					<Input
						type="text"
						placeholder="Add shared item (e.g. 4-person Tent, Cooking Stove)..."
						bind:value={newGroupName}
						class="flex-1"
						required
					/>
					<div class="flex gap-2">
						<div
							class="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5"
						>
							<span class="text-xs font-semibold text-slate-500"
								>Qty</span
							>
							<input
								type="number"
								min="1"
								max="99"
								bind:value={newGroupQty}
								class="w-10 border-0 bg-transparent text-center text-sm font-semibold outline-none"
							/>
						</div>
						<Button
							type="submit"
							disabled={addingGroup || !newGroupName.trim()}
							class="gap-1 shrink-0"
						>
							<Plus class="h-4 w-4" />
							<span>{addingGroup ? "Adding..." : "Add"}</span>
						</Button>
					</div>
				</form>
			{:else}
				<div
					class="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600"
				>
					🔒 Group gear items are managed by the trip organizer. You
					can check off items assigned to you below.
				</div>
			{/if}

			<!-- Group Items List -->
			{#if groupItems.length === 0}
				<div
					class="rounded-lg border border-dashed border-slate-200 py-8 text-center text-xs text-slate-500"
				>
					No group gear added yet. List items above and designate who
					will carry them.
				</div>
			{:else}
				<div class="space-y-2">
					{#each groupItems as item (item.id)}
						{@const canToggle =
							isOwner || item.assigned_to === currentMemberId}
						<div
							class="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300 {item.packed
								? 'bg-slate-50/60'
								: ''}"
						>
							<div
								class="flex flex-1 flex-wrap items-center gap-3"
							>
								<Checkbox
									checked={!!item.packed}
									disabled={!canToggle}
									onCheckedChange={() =>
										toggleGroupPacked(item)}
									title={canToggle
										? "Toggle packed status"
										: "Only assigned member or organizer can toggle"}
								/>

								{#if editingGroupId === item.id}
									<div
										class="flex flex-1 flex-wrap items-center gap-2"
									>
										<Input
											bind:value={editGroupName}
											class="h-8 flex-1 text-xs"
											placeholder="Item name"
										/>
										<Input
											type="number"
											min="1"
											bind:value={editGroupQty}
											class="h-8 w-16 text-xs text-center"
										/>
										<select
											bind:value={editGroupAssigned}
											class="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs outline-none"
										>
											<option value="">Unassigned</option>
											{#each members as member}
												<option value={member.id}
													>{member.name}</option
												>
											{/each}
										</select>
										<Button
											size="sm"
											class="h-8 w-8 p-0"
											onclick={() =>
												saveEditGroup(item.id)}
										>
											<Check class="h-3.5 w-3.5" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											class="h-8 w-8 p-0"
											onclick={() =>
												(editingGroupId = null)}
										>
											<X class="h-3.5 w-3.5" />
										</Button>
									</div>
								{:else}
									<div class="flex items-center gap-2">
										<span
											class="text-sm font-semibold {item.packed
												? 'line-through text-slate-400'
												: 'text-slate-900'}"
										>
											{item.name}
										</span>
										{#if item.qty && item.qty > 1}
											<Badge
												variant="secondary"
												class="font-mono text-[10px] px-1.5 py-0"
											>
												×{item.qty}
											</Badge>
										{/if}
									</div>

									<div class="ml-auto mr-3">
										{#if isOwner}
											<select
												value={item.assigned_to || ""}
												onchange={(e: Event) =>
													updateGroupAssignment(
														item,
														(e.target as HTMLSelectElement).value,
													)}
												class="h-7 rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-700 outline-none hover:bg-slate-100 {item.assigned_to
													? 'font-semibold text-emerald-800 bg-emerald-50 border-emerald-200'
													: ''}"
											>
												<option value=""
													>Unassigned</option
												>
												{#each members as member}
													<option value={member.id}
														>{member.name}</option
													>
												{/each}
											</select>
										{:else}
											{@const assignedMember =
												members.find(
													(m) =>
														m.id ===
														item.assigned_to,
												)}
											<Badge
												variant={item.assigned_to
													? "success"
													: "secondary"}
												class="text-[11px]"
											>
												{assignedMember
													? assignedMember.name
													: "Unassigned"}
											</Badge>
										{/if}
									</div>
								{/if}
							</div>

							{#if isOwner && editingGroupId !== item.id}
								<div class="flex items-center gap-1">
									<Button
										variant="ghost"
										size="sm"
										class="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
										onclick={() => startEditGroup(item)}
									>
										<Pencil class="h-3.5 w-3.5" />
									</Button>
									<Button
										variant="ghost"
										size="sm"
										class="h-8 w-8 p-0 text-slate-500 hover:text-red-600"
										onclick={() => handleDeleteGroup(item)}
									>
										<Trash2 class="h-3.5 w-3.5" />
									</Button>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</Card.CardContent>
	</Card.Card>

	<!-- PERSONAL GEAR SECTION -->
	<div class="space-y-4">
		<div class="flex items-center gap-3">
			<div
				class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-900"
			>
				<Backpack class="h-4 w-4" />
			</div>
			<div>
				<h2 class="text-base font-bold text-slate-900">
					Personal Packing Lists
				</h2>
				<p class="text-xs text-slate-500">
					Each member's personal gear checklist
				</p>
			</div>
		</div>

		{#if members.length === 0}
			<Card.Card class="py-8 text-center text-xs text-slate-500">
				No members registered yet. Add participants in the <strong
					>Members</strong
				> tab first.
			</Card.Card>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each orderedMembers as member (member.id)}
					{@const memberItems = personalItems.filter(
						(i) => i.member === member.id,
					)}
					{@const packedCount = memberItems.filter(
						(i) => i.packed,
					).length}
					{@const isSelf = member.id === currentMemberId}

					<Card.Card
						class={isSelf ? "border-emerald-300 shadow-sm" : ""}
					>
						<Card.CardHeader
							class="flex flex-row items-center justify-between space-y-0 p-4 pb-2"
						>
							<div class="flex items-center gap-2">
								<div
									class="flex h-6 w-6 items-center justify-center rounded-full {isSelf
										? 'bg-emerald-600 text-white'
										: 'bg-slate-100 text-slate-700'} text-xs font-bold"
								>
									{member.name.charAt(0).toUpperCase()}
								</div>
								<span class="text-sm font-bold text-slate-900"
									>{member.name}</span
								>
								{#if isSelf}
									<Badge
										variant="success"
										class="text-[10px] px-1.5 py-0"
										>You</Badge
									>
								{/if}
							</div>
							<span class="text-xs font-semibold text-slate-500"
								>{packedCount}/{memberItems.length}</span
						>
						</Card.CardHeader>

						<Card.CardContent class="p-4 pt-2 space-y-3">
							<form
								onsubmit={(e) =>
									handleAddPersonal(member.id, e)}
								class="flex gap-1.5"
							>
								<Input
									placeholder="Add personal item..."
									bind:value={newPersonalNames[member.id]}
									class="h-8 text-xs"
								/>
								<Button
									type="submit"
									size="sm"
									class="h-8 px-2.5 shrink-0"
									disabled={addingPersonal[member.id] ||
										!(
											newPersonalNames[member.id] || ""
										).trim()}
								>
									<Plus class="h-3.5 w-3.5" />
								</Button>
							</form>

							{#if memberItems.length === 0}
								<p
									class="py-3 text-center text-xs text-slate-400"
								>
									No personal items yet
								</p>
							{:else}
								<div
									class="space-y-1.5 max-h-48 overflow-y-auto"
								>
									{#each memberItems as pItem (pItem.id)}
										<div
											class="flex items-center justify-between rounded-md bg-slate-50 p-2 text-xs"
										>
											<div
												class="flex items-center gap-2 flex-1"
											>
												<Checkbox
													checked={!!pItem.packed}
													onCheckedChange={() =>
														togglePersonalPacked(
															pItem,
														)}
												/>
												{#if editingPersonalId === pItem.id}
													<div
														class="flex items-center gap-1 flex-1"
													>
														<Input
															bind:value={
																editPersonalName
															}
															class="h-7 text-xs flex-1"
														/>
														<Button
															size="sm"
															class="h-7 w-7 p-0"
															onclick={() =>
																saveEditPersonal(
																	pItem.id,
																)}
														>
															<Check
																class="h-3 w-3"
															/>
														</Button>
														<Button
															variant="ghost"
															size="sm"
															class="h-7 w-7 p-0"
															onclick={() =>
																(editingPersonalId =
																	null)}
														>
															<X
																class="h-3 w-3"
															/>
														</Button>
													</div>
												{:else}
													<span
														class="font-medium {pItem.packed
															? 'line-through text-slate-400'
															: 'text-slate-800'}"
													>
														{pItem.name}
													</span>
												{/if}
											</div>

											{#if editingPersonalId !== pItem.id}
												<div
													class="flex items-center gap-0.5"
												>
													<Button
														variant="ghost"
														size="sm"
														class="h-6 w-6 p-0 text-slate-400 hover:text-slate-800"
														onclick={() =>
															startEditPersonal(
																pItem,
															)}
													>
														<Pencil
															class="h-3 w-3"
														/>
													</Button>
													<Button
														variant="ghost"
														size="sm"
														class="h-6 w-6 p-0 text-slate-400 hover:text-red-600"
														onclick={() =>
															handleDeletePersonal(
																pItem,
															)}
													>
														<Trash2
															class="h-3 w-3"
														/>
													</Button>
												</div>
											{/if}
										</div>
									{/each}
								</div>
							{/if}
						</Card.CardContent>
					</Card.Card>
				{/each}
			</div>
		{/if}
	</div>
</div>
