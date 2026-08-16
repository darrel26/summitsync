<script>
	import { showToast } from '$lib/toast.js';
	import {
		Tent,
		Backpack,
		Plus,
		Pencil,
		Trash2,
		Check,
		X,
		User,
		CheckCircle2
	} from 'lucide-svelte';

	let {
		groupItems = [],
		personalItems = [],
		members = [],
		currentMemberId = '',
		isOwner = false,
		onAddGroupItem,
		onUpdateGroupItem,
		onDeleteGroupItem,
		onAddPersonalItem,
		onUpdatePersonalItem,
		onDeletePersonalItem
	} = $props();

	// Form states
	let newGroupName = $state('');
	let newGroupQty = $state(1);
	let addingGroup = $state(false);

	let newPersonalNames = $state({}); // keyed by memberId
	let addingPersonal = $state({});

	// Inline edit states
	let editingGroupId = $state(null);
	let editGroupName = $state('');
	let editGroupQty = $state(1);
	let editGroupAssigned = $state('');

	let editingPersonalId = $state(null);
	let editPersonalName = $state('');

	// Group Item actions
	async function handleAddGroup(e) {
		e.preventDefault();
		if (!newGroupName.trim()) return;

		addingGroup = true;
		try {
			await onAddGroupItem({
				name: newGroupName.trim(),
				qty: Number(newGroupQty) || 1,
				packed: false
			});
			newGroupName = '';
			newGroupQty = 1;
			showToast('Group gear item added', 'success');
		} catch (err) {
			console.error('Error adding group item:', err);
			showToast('Failed to add item', 'error');
		} finally {
			addingGroup = false;
		}
	}

	function startEditGroup(item) {
		editingGroupId = item.id;
		editGroupName = item.name;
		editGroupQty = item.qty || 1;
		editGroupAssigned = item.assigned_to || '';
	}

	async function saveEditGroup(id) {
		if (!editGroupName.trim()) return;
		try {
			await onUpdateGroupItem(id, {
				name: editGroupName.trim(),
				qty: Number(editGroupQty) || 1,
				assigned_to: editGroupAssigned || null
			});
			editingGroupId = null;
			showToast('Item updated', 'success');
		} catch (err) {
			console.error('Error updating item:', err);
			showToast('Failed to update item', 'error');
		}
	}

	async function toggleGroupPacked(item) {
		try {
			await onUpdateGroupItem(item.id, {
				packed: !item.packed
			});
		} catch (err) {
			console.error('Error toggling packed status:', err);
			showToast('Failed to update status', 'error');
		}
	}

	async function updateGroupAssignment(item, newAssigneeId) {
		try {
			await onUpdateGroupItem(item.id, {
				assigned_to: newAssigneeId || null
			});
		} catch (err) {
			console.error('Error assigning item:', err);
			showToast('Failed to assign item', 'error');
		}
	}

	async function handleDeleteGroup(item) {
		if (confirm(`Delete "${item.name}"?`)) {
			try {
				await onDeleteGroupItem(item.id);
				showToast('Item removed', 'info');
			} catch (err) {
				console.error('Error deleting group item:', err);
				showToast('Failed to delete item', 'error');
			}
		}
	}

	// Personal Item actions
	async function handleAddPersonal(memberId, e) {
		e.preventDefault();
		const name = (newPersonalNames[memberId] || '').trim();
		if (!name) return;

		addingPersonal[memberId] = true;
		try {
			await onAddPersonalItem({
				name,
				member: memberId,
				packed: false
			});
			newPersonalNames[memberId] = '';
			showToast('Personal item added', 'success');
		} catch (err) {
			console.error('Error adding personal item:', err);
			showToast('Failed to add personal item', 'error');
		} finally {
			addingPersonal[memberId] = false;
		}
	}

	function startEditPersonal(item) {
		editingPersonalId = item.id;
		editPersonalName = item.name;
	}

	async function saveEditPersonal(id) {
		if (!editPersonalName.trim()) return;
		try {
			await onUpdatePersonalItem(id, {
				name: editPersonalName.trim()
			});
			editingPersonalId = null;
			showToast('Personal item updated', 'success');
		} catch (err) {
			console.error('Error updating personal item:', err);
			showToast('Failed to update personal item', 'error');
		}
	}

	async function togglePersonalPacked(item) {
		try {
			await onUpdatePersonalItem(item.id, {
				packed: !item.packed
			});
		} catch (err) {
			console.error('Error toggling packed status:', err);
			showToast('Failed to update status', 'error');
		}
	}

	async function handleDeletePersonal(item) {
		if (confirm(`Delete "${item.name}"?`)) {
			try {
				await onDeletePersonalItem(item.id);
				showToast('Item removed', 'info');
			} catch (err) {
				console.error('Error deleting personal item:', err);
				showToast('Failed to delete item', 'error');
			}
		}
	}
</script>

<div class="checklist-layout">
	<!-- GROUP GEAR SECTION -->
	<section class="card group-card">
		<div class="section-top">
			<div class="title-with-icon">
				<div class="icon-badge">
					<Tent size={18} />
				</div>
				<div>
					<h2 class="section-title">Shared Group Gear</h2>
					<p class="section-desc">Equipment brought for the whole group (tents, stoves, fuel, etc.)</p>
				</div>
			</div>

			<div class="progress-pill">
				<CheckCircle2 size={14} class="pill-icon" />
				<span>{groupItems.filter((i) => i.packed).length} / {groupItems.length} packed</span>
			</div>
		</div>

		<!-- Add Group Item Form -->
		{#if isOwner}
			<form onsubmit={handleAddGroup} class="add-group-form">
				<input
					type="text"
					placeholder="Add shared item (e.g. 4-person Tent, Cooking Stove)..."
					bind:value={newGroupName}
					class="input-group-name"
					required
				/>
				<div class="qty-field">
					<span class="qty-label">Qty</span>
					<input
						type="number"
						min="1"
						max="99"
						bind:value={newGroupQty}
						class="input-qty"
					/>
				</div>
				<button type="submit" class="btn btn-primary" disabled={addingGroup || !newGroupName.trim()}>
					<Plus size={16} />
					<span>{addingGroup ? 'Adding...' : 'Add'}</span>
				</button>
			</form>
		{:else}
			<div class="view-only-notice">
				<span>🔒 Group gear items are managed by the trip organizer. You can check off items assigned to you below.</span>
			</div>
		{/if}

		<!-- Group Items List -->
		{#if groupItems.length === 0}
			<div class="empty-placeholder">
				<p>No group gear added yet. List items above and designate who will carry them.</p>
			</div>
		{:else}
			<div class="group-items-list">
				{#each groupItems as item (item.id)}
					{@const canToggle = isOwner || item.assigned_to === currentMemberId}
					<div class="item-row" class:is-packed={item.packed}>
						<div class="item-left">
							<input
								type="checkbox"
								checked={item.packed}
								disabled={!canToggle}
								onchange={() => toggleGroupPacked(item)}
								title={canToggle ? "Toggle packed status" : "Only assigned member or organizer can toggle"}
								aria-label="Mark {item.name} as packed"
							/>

							{#if editingGroupId === item.id}
								<div class="edit-group-row">
									<input
										type="text"
										bind:value={editGroupName}
										class="edit-input-field"
										placeholder="Item name"
									/>
									<input
										type="number"
										min="1"
										bind:value={editGroupQty}
										class="edit-qty-field"
									/>
									<select bind:value={editGroupAssigned} class="edit-select-field">
										<option value="">Unassigned</option>
										{#each members as member}
											<option value={member.id}>{member.name}</option>
										{/each}
									</select>
									<button type="button" class="btn-action-check" onclick={() => saveEditGroup(item.id)} aria-label="Save item changes">
										<Check size={14} />
									</button>
									<button type="button" class="btn-action-cancel" onclick={() => (editingGroupId = null)} aria-label="Cancel editing item">
										<X size={14} />
									</button>
								</div>
							{:else}
								<div class="item-text-wrap">
									<span class="item-name">{item.name}</span>
									{#if item.qty && item.qty > 1}
										<span class="qty-tag">×{item.qty}</span>
									{/if}
								</div>

								<div class="assignee-wrap">
									{#if isOwner}
										<select
											value={item.assigned_to || ''}
											onchange={(e) => updateGroupAssignment(item, e.target.value)}
											class="assign-dropdown"
											class:is-assigned={!!item.assigned_to}
										>
											<option value="">Unassigned</option>
											{#each members as member}
												<option value={member.id}>{member.name}</option>
											{/each}
										</select>
									{:else}
										{@const assignedMember = members.find((m) => m.id === item.assigned_to)}
										<span class="assignee-badge" class:is-assigned={!!item.assigned_to}>
											{assignedMember ? assignedMember.name : 'Unassigned'}
										</span>
									{/if}
								</div>
							{/if}
						</div>

						{#if isOwner}
							<div class="item-right">
								{#if editingGroupId !== item.id}
									<button
										type="button"
										class="btn-icon"
										aria-label="Edit item {item.name}"
										title="Edit item"
										onclick={() => startEditGroup(item)}
									>
										<Pencil size={14} />
									</button>
									<button
										type="button"
										class="btn-icon btn-danger-hover"
										aria-label="Delete item {item.name}"
										title="Delete item"
										onclick={() => handleDeleteGroup(item)}
									>
										<Trash2 size={14} />
									</button>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<!-- PERSONAL GEAR SECTION -->
	<section class="personal-section">
		<div class="section-top-clean">
			<div class="title-with-icon">
				<div class="icon-badge">
					<Backpack size={18} />
				</div>
				<div>
					<h2 class="section-title">Personal Packing Lists</h2>
					<p class="section-desc">Each member's personal gear checklist</p>
				</div>
			</div>
		</div>

		{#if members.length === 0}
			<div class="card empty-placeholder">
				<p>No members registered yet. Add participants in the <strong>Members</strong> tab first.</p>
			</div>
		{:else}
			<div class="personal-grid">
				{#each members as member (member.id)}
					{@const memberItems = personalItems.filter((i) => i.member === member.id)}
					{@const packedCount = memberItems.filter((i) => i.packed).length}
					{@const isSelf = member.id === currentMemberId}

					<div class="card member-bag-card" class:is-self={isSelf}>
						<div class="bag-header">
							<div class="bag-user">
								<div class="avatar-tiny">{member.name.charAt(0).toUpperCase()}</div>
								<h3 class="bag-username">{member.name}</h3>
								{#if isSelf}
									<span class="tag-you">You</span>
								{/if}
							</div>
							<span class="bag-count">{packedCount}/{memberItems.length}</span>
						</div>

						<!-- Add item form for member -->
						<form onsubmit={(e) => handleAddPersonal(member.id, e)} class="add-personal-row">
							<input
								type="text"
								placeholder="Add personal item..."
								bind:value={newPersonalNames[member.id]}
								class="personal-input"
							/>
							<button
								type="submit"
								class="btn-personal-add"
								disabled={addingPersonal[member.id] || !(newPersonalNames[member.id] || '').trim()}
								aria-label="Add personal item for {member.name}"
								title="Add personal item"
							>
								<Plus size={14} />
							</button>
						</form>

						<!-- Item list -->
						{#if memberItems.length === 0}
							<p class="empty-subtext">No personal items yet</p>
						{:else}
							<div class="personal-list">
								{#each memberItems as pItem (pItem.id)}
									<div class="personal-item-row" class:is-packed={pItem.packed}>
										<div class="personal-left">
											<input
												type="checkbox"
												checked={pItem.packed}
												onchange={() => togglePersonalPacked(pItem)}
												aria-label="Mark {pItem.name} as packed"
											/>

											{#if editingPersonalId === pItem.id}
												<div class="inline-edit-personal">
													<input
														type="text"
														bind:value={editPersonalName}
														class="edit-personal-field"
													/>
													<button
														type="button"
														class="btn-action-check"
														onclick={() => saveEditPersonal(pItem.id)}
														aria-label="Save personal item"
													>
														<Check size={12} />
													</button>
													<button
														type="button"
														class="btn-action-cancel"
														onclick={() => (editingPersonalId = null)}
														aria-label="Cancel editing personal item"
													>
														<X size={12} />
													</button>
												</div>
											{:else}
												<span class="personal-name">{pItem.name}</span>
											{/if}
										</div>

										<div class="personal-right">
											{#if editingPersonalId !== pItem.id}
												<button
													type="button"
													class="btn-tiny"
													onclick={() => startEditPersonal(pItem)}
													aria-label="Edit {pItem.name}"
													title="Edit"
												>
													<Pencil size={12} />
												</button>
												<button
													type="button"
													class="btn-tiny btn-danger-hover"
													onclick={() => handleDeletePersonal(pItem)}
													aria-label="Delete {pItem.name}"
													title="Delete"
												>
													<Trash2 size={12} />
												</button>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>

<style>
	.checklist-layout {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.section-top,
	.section-top-clean {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.title-with-icon {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.icon-badge {
		width: 36px;
		height: 36px;
		border-radius: var(--radius-md);
		background: var(--bg-subtle);
		color: var(--text-main);
		display: grid;
		place-content: center;
	}

	.section-title {
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--text-main);
		letter-spacing: -0.01em;
	}

	.section-desc {
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin-top: 1px;
	}

	.progress-pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-emerald);
		background: var(--color-emerald-light);
		padding: 4px 12px;
		border-radius: var(--radius-full);
	}

	/* Add Group Form */
	.add-group-form {
		display: flex;
		gap: 10px;
		margin-bottom: 20px;
	}

	.input-group-name {
		flex: 1;
		padding: 9px 12px;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		font-size: 0.9rem;
		outline: none;
	}

	.input-group-name:focus {
		border-color: var(--border-focus);
	}

	.view-only-notice {
		background: var(--bg-subtle);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		padding: 10px 14px;
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin-bottom: 16px;
	}

	.assignee-badge {
		font-size: 0.775rem;
		padding: 3px 8px;
		border-radius: var(--radius-sm);
		background: var(--bg-subtle);
		color: var(--text-muted);
	}

	.assignee-badge.is-assigned {
		background: var(--color-emerald-light);
		color: var(--color-emerald);
		font-weight: 600;
	}

	.qty-label {
		font-size: 0.75rem;
		color: var(--text-muted);
		font-weight: 600;
		margin-right: 4px;
	}

	.input-qty {
		width: 44px;
		border: none;
		outline: none;
		font-size: 0.9rem;
		font-weight: 600;
		text-align: center;
	}

	/* Group Items List */
	.group-items-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.item-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 14px;
		background: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		transition: all 0.15s ease;
	}

	.item-row:hover {
		border-color: var(--border-hover);
	}

	.item-row.is-packed {
		background: var(--bg-subtle);
	}

	.item-row.is-packed .item-name {
		text-decoration: line-through;
		color: var(--text-muted);
	}

	.item-left {
		display: flex;
		align-items: center;
		gap: 12px;
		flex: 1;
		flex-wrap: wrap;
	}

	.item-text-wrap {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.item-name {
		font-size: 0.925rem;
		font-weight: 600;
		color: var(--text-main);
	}

	.qty-tag {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-secondary);
		background: var(--bg-subtle);
		padding: 1px 6px;
		border-radius: 4px;
	}

	.assignee-wrap {
		margin-left: auto;
		margin-right: 12px;
	}

	.assign-dropdown {
		font-size: 0.8rem;
		padding: 4px 8px;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-sm);
		background: var(--bg-subtle);
		color: var(--text-secondary);
		outline: none;
		cursor: pointer;
	}

	.assign-dropdown.is-assigned {
		background: var(--color-emerald-light);
		color: var(--color-emerald);
		border-color: var(--color-emerald-border);
		font-weight: 600;
	}

	.edit-group-row {
		display: flex;
		align-items: center;
		gap: 6px;
		flex: 1;
	}

	.edit-input-field {
		flex: 1;
		padding: 4px 8px;
		border: 1px solid var(--border-focus);
		border-radius: var(--radius-sm);
		font-size: 0.875rem;
	}

	.edit-qty-field {
		width: 44px;
		padding: 4px 4px;
		border: 1px solid var(--border-focus);
		border-radius: var(--radius-sm);
		font-size: 0.875rem;
		text-align: center;
	}

	.edit-select-field {
		padding: 4px 8px;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-sm);
		font-size: 0.8rem;
	}

	.btn-action-check,
	.btn-action-cancel {
		padding: 5px;
		border-radius: var(--radius-sm);
		display: grid;
		place-content: center;
	}

	.btn-action-check {
		background: var(--color-emerald);
		color: white;
	}

	.btn-action-cancel {
		background: var(--bg-subtle);
		color: var(--text-secondary);
	}

	.item-right {
		display: flex;
		gap: 4px;
	}

	.btn-danger-hover:hover {
		color: var(--color-danger);
		background: var(--color-danger-light);
	}

	/* Personal Section Grid */
	.personal-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
		gap: 16px;
	}

	.member-bag-card {
		padding: 18px;
	}

	.member-bag-card.is-self {
		border-color: var(--color-emerald-border);
	}

	.bag-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 14px;
		padding-bottom: 10px;
		border-bottom: 1px solid var(--border-subtle);
	}

	.bag-user {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.avatar-tiny {
		width: 24px;
		height: 24px;
		border-radius: var(--radius-full);
		background: var(--bg-subtle);
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-main);
		display: grid;
		place-content: center;
	}

	.member-bag-card.is-self .avatar-tiny {
		background: var(--color-emerald);
		color: white;
	}

	.bag-username {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--text-main);
	}

	.tag-you {
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--color-emerald);
		background: var(--color-emerald-light);
		padding: 1px 5px;
		border-radius: 4px;
		border: 1px solid var(--color-emerald-border);
	}

	.bag-count {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.add-personal-row {
		display: flex;
		gap: 6px;
		margin-bottom: 12px;
	}

	.personal-input {
		flex: 1;
		padding: 6px 10px;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-sm);
		font-size: 0.85rem;
		outline: none;
	}

	.personal-input:focus {
		border-color: var(--border-focus);
	}

	.btn-personal-add {
		background: var(--color-primary);
		color: white;
		padding: 6px 10px;
		border-radius: var(--radius-sm);
		display: grid;
		place-content: center;
	}

	.btn-personal-add:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.personal-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.personal-item-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 5px 8px;
		border-radius: var(--radius-sm);
		background: var(--bg-subtle);
	}

	.personal-item-row.is-packed {
		color: var(--text-muted);
	}

	.personal-item-row.is-packed .personal-name {
		text-decoration: line-through;
		color: var(--text-muted);
	}

	.personal-left {
		display: flex;
		align-items: center;
		gap: 8px;
		flex: 1;
	}

	.personal-name {
		font-size: 0.875rem;
		color: var(--text-main);
	}

	.inline-edit-personal {
		display: flex;
		align-items: center;
		gap: 4px;
		flex: 1;
	}

	.edit-personal-field {
		flex: 1;
		padding: 3px 6px;
		border: 1px solid var(--border-focus);
		border-radius: 4px;
		font-size: 0.8rem;
	}

	.personal-right {
		display: flex;
		gap: 2px;
	}

	.btn-tiny {
		color: var(--text-muted);
		padding: 4px;
		border-radius: 3px;
	}

	.btn-tiny:hover {
		color: var(--text-main);
		background: var(--border-default);
	}

	.empty-placeholder {
		text-align: center;
		padding: 32px 16px;
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	.empty-subtext {
		text-align: center;
		padding: 16px 0;
		color: var(--text-muted);
		font-size: 0.8rem;
	}

	@media (max-width: 640px) {
		.add-group-form {
			flex-direction: column;
			align-items: stretch;
		}

		.personal-grid {
			grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		}
	}
</style>
