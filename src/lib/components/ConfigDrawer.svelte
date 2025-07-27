<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { config } from '$lib/services/config.svelte';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import SearchIcon from '@lucide/svelte/icons/search';
	import UserIcon from '@lucide/svelte/icons/user';
	import HashIcon from '@lucide/svelte/icons/hash';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import * as Calendar from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { getLocalTimeZone, type CalendarDate, parseDate } from '@internationalized/date';

	// State for form inputs
	let inputKind = $state('');
	let inputAuthor = $state('');
	let inputSearch = $state(config.timelineFilter.search || '');
	let inputSinceDate = $state<CalendarDate | undefined>(
		config.timelineFilter.since
			? parseDate(new Date(config.timelineFilter.since * 1000).toISOString().split('T')[0])
			: undefined
	);
	let inputSinceTime = $state(
		config.timelineFilter.since
			? new Date(config.timelineFilter.since * 1000).toTimeString().slice(0, 5)
			: '00:00'
	);
	let inputUntilDate = $state<CalendarDate | undefined>(
		config.timelineFilter.until
			? parseDate(new Date(config.timelineFilter.until * 1000).toISOString().split('T')[0])
			: undefined
	);
	let inputUntilTime = $state(
		config.timelineFilter.until
			? new Date(config.timelineFilter.until * 1000).toTimeString().slice(0, 5)
			: '23:59'
	);
	let inputTagKey = $state('');
	let inputTagValue = $state('');
	let inputLimit = $state(config.timelineFilter.limit?.toString() || '');

	// State for popover open states
	let sincePopoverOpen = $state(false);
	let untilPopoverOpen = $state(false);

	// Update functions for filter properties
	function updateLimit() {
		if (inputLimit === '' || inputLimit === undefined) {
			config.timelineFilter.limit = undefined;
		} else {
			const limit = parseInt(inputLimit);
			if (!isNaN(limit) && limit > 0) {
				config.timelineFilter.limit = limit;
			} else {
				config.timelineFilter.limit = undefined;
			}
		}
	}

	function incrementLimit() {
		const currentLimit = config.timelineFilter.limit || 0;
		config.timelineFilter.limit = currentLimit + 1;
		inputLimit = config.timelineFilter.limit.toString();
	}

	function decrementLimit() {
		const currentLimit = config.timelineFilter.limit || 1;
		if (currentLimit > 1) {
			config.timelineFilter.limit = currentLimit - 1;
			inputLimit = config.timelineFilter.limit.toString();
		} else if (currentLimit === 1) {
			config.timelineFilter.limit = undefined;
			inputLimit = '';
		}
	}

	function addKind() {
		if (inputKind && !isNaN(parseInt(inputKind))) {
			if (!config.timelineFilter.kinds) {
				config.timelineFilter.kinds = [];
			}
			config.timelineFilter.kinds.push(parseInt(inputKind));
			inputKind = '';
		}
	}

	function removeKind(index: number) {
		if (config.timelineFilter.kinds) {
			config.timelineFilter.kinds.splice(index, 1);
			if (config.timelineFilter.kinds.length === 0) {
				config.timelineFilter.kinds = undefined;
			}
		}
	}

	function addAuthor() {
		if (inputAuthor) {
			if (!config.timelineFilter.authors) {
				config.timelineFilter.authors = [];
			}
			config.timelineFilter.authors.push(inputAuthor);
			inputAuthor = '';
		}
	}

	function removeAuthor(index: number) {
		if (config.timelineFilter.authors) {
			config.timelineFilter.authors.splice(index, 1);
			if (config.timelineFilter.authors.length === 0) {
				config.timelineFilter.authors = undefined;
			}
		}
	}

	function updateSearch() {
		if (inputSearch) {
			config.timelineFilter.search = inputSearch;
		} else {
			config.timelineFilter.search = undefined;
		}
	}

	function updateSince() {
		if (inputSinceDate) {
			const dateStr = inputSinceDate.toString();
			const timeStr = inputSinceTime;
			const dateTimeStr = `${dateStr}T${timeStr}:00`;
			const date = new Date(dateTimeStr);
			config.timelineFilter.since = Math.floor(date.getTime() / 1000);
		} else {
			config.timelineFilter.since = undefined;
		}
	}

	function updateUntil() {
		if (inputUntilDate) {
			const dateStr = inputUntilDate.toString();
			const timeStr = inputUntilTime;
			const dateTimeStr = `${dateStr}T${timeStr}:00`;
			const date = new Date(dateTimeStr);
			config.timelineFilter.until = Math.floor(date.getTime() / 1000);
		} else {
			config.timelineFilter.until = undefined;
		}
	}

	function addTag() {
		if (inputTagKey && inputTagValue) {
			const tagKey = `#${inputTagKey}`;
			// Use type assertion to access dynamic properties
			if (!(config.timelineFilter as any)[tagKey]) {
				(config.timelineFilter as any)[tagKey] = [];
			}
			(config.timelineFilter as any)[tagKey].push(inputTagValue);
			inputTagKey = '';
			inputTagValue = '';
		}
	}

	function removeTag(key: string, index: number) {
		// Use type assertion to access dynamic properties
		if ((config.timelineFilter as any)[key]) {
			(config.timelineFilter as any)[key].splice(index, 1);
			if ((config.timelineFilter as any)[key].length === 0) {
				delete (config.timelineFilter as any)[key];
			}
		}
	}

	function toggleReactions() {
		config.loadReactions = !config.loadReactions;
	}

	// Initialize input fields when timelineFilter changes
	$effect(() => {
		inputLimit = config.timelineFilter.limit?.toString() || '';
		inputSearch = config.timelineFilter.search || '';
		inputSinceDate = config.timelineFilter.since
			? parseDate(new Date(config.timelineFilter.since * 1000).toISOString().split('T')[0])
			: undefined;
		inputSinceTime = config.timelineFilter.since
			? new Date(config.timelineFilter.since * 1000).toTimeString().slice(0, 5)
			: '00:00';
		inputUntilDate = config.timelineFilter.until
			? parseDate(new Date(config.timelineFilter.until * 1000).toISOString().split('T')[0])
			: undefined;
		inputUntilTime = config.timelineFilter.until
			? new Date(config.timelineFilter.until * 1000).toTimeString().slice(0, 5)
			: '23:59';
	});

	let open = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}
</script>

<svelte:document onkeydown={handleKeydown} />
<Drawer.Root {open}>
	<Drawer.Trigger class={buttonVariants({ variant: 'outline' })}>
		Configure Timeline
		<kbd
			class="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 select-none"
		>
			<span class="text-xs">⌘</span>k
		</kbd>
	</Drawer.Trigger>
	<Drawer.Content>
		<div class="mx-auto w-full max-w-4xl">
			<Drawer.Header>
				<Drawer.Title>Timeline Configuration</Drawer.Title>
				<Drawer.Description>Adjust your timeline settings</Drawer.Description>
			</Drawer.Header>
			<div class="max-h-[70vh] overflow-y-auto p-4 pb-0">
				<!-- Main configuration grid -->
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<!-- Left column -->
					<div class="space-y-6">
						<!-- Limit Configuration -->
						<div>
							<Label for="limit">Event Limit</Label>
							<div class="mt-2 flex items-center gap-2">
								<Button
									variant="outline"
									size="icon"
									class="size-8 shrink-0 rounded-full"
									onclick={decrementLimit}
									disabled={config.timelineFilter.limit === undefined ||
										config.timelineFilter.limit <= 1}
								>
									<MinusIcon class="size-4" />
									<span class="sr-only">Decrease</span>
								</Button>
								<div class="flex-1">
									{#if inputLimit !== ''}
										<Input
											type="number"
											id="limit"
											bind:value={inputLimit}
											onchange={updateLimit}
											class="text-center"
											min="1"
										/>
									{:else}
										<Input value="Limit disabled" class="text-center" disabled />
									{/if}
								</div>
								<Button
									variant="outline"
									size="icon"
									class="size-8 shrink-0 rounded-full"
									onclick={incrementLimit}
								>
									<PlusIcon class="size-4" />
									<span class="sr-only">Increase</span>
								</Button>
								<Button
									variant="outline"
									size="icon"
									class="size-8 shrink-0 rounded-full"
									onclick={() => {
										config.timelineFilter.limit = undefined;
										inputLimit = '';
									}}
								>
									×
									<span class="sr-only">Clear</span>
								</Button>
							</div>
						</div>

						<!-- Kinds Configuration -->
						<div>
							<Label for="kinds">Event Kinds</Label>
							<div class="mt-2 flex gap-2">
								<Input
									type="text"
									id="kinds"
									bind:value={inputKind}
									placeholder="Enter kind number"
									class="flex-1"
								/>
								<Button
									variant="default"
									size="icon"
									class="size-9"
									onclick={addKind}
									disabled={!inputKind || isNaN(parseInt(inputKind))}
								>
									<PlusIcon class="size-4" />
									<span class="sr-only">Add kind</span>
								</Button>
							</div>
							{#if config.timelineFilter.kinds?.length}
								<div class="mt-2 flex flex-wrap gap-2">
									{#each config.timelineFilter.kinds as kind, i}
										<div class="flex items-center rounded-md bg-secondary py-1 pr-1 pl-3">
											<span class="text-sm">{kind}</span>
											<Button
												variant="ghost"
												size="icon"
												class="ml-1 size-6"
												onclick={() => removeKind(i)}
											>
												<TrashIcon class="size-3" />
												<span class="sr-only">Remove kind</span>
											</Button>
										</div>
									{/each}
								</div>
							{/if}
						</div>

						<!-- Authors Configuration -->
						<div>
							<Label for="authors">Authors</Label>
							<div class="mt-2 flex gap-2">
								<Input
									type="text"
									id="authors"
									bind:value={inputAuthor}
									placeholder="Enter author pubkey"
									class="flex-1"
								/>
								<Button
									variant="default"
									size="icon"
									class="size-9"
									onclick={addAuthor}
									disabled={!inputAuthor}
								>
									<UserIcon class="size-4" />
									<span class="sr-only">Add author</span>
								</Button>
							</div>
							{#if config.timelineFilter.authors?.length}
								<div class="mt-2 flex flex-wrap gap-2">
									{#each config.timelineFilter.authors as author, i}
										<div class="flex items-center rounded-md bg-secondary py-1 pr-1 pl-3">
											<span class="max-w-[120px] truncate text-sm">{author}</span>
											<Button
												variant="ghost"
												size="icon"
												class="ml-1 size-6"
												onclick={() => removeAuthor(i)}
											>
												<TrashIcon class="size-3" />
												<span class="sr-only">Remove author</span>
											</Button>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</div>

					<!-- Right column -->
					<div class="space-y-6">
						<!-- Search Configuration -->
						<div>
							<Label for="search">Search</Label>
							<div class="mt-2 flex gap-2">
								<Input
									type="text"
									id="search"
									bind:value={inputSearch}
									placeholder="Search terms"
									class="flex-1"
									onchange={updateSearch}
								/>
								<Button variant="default" size="icon" class="size-9" onclick={updateSearch}>
									<SearchIcon class="size-4" />
									<span class="sr-only">Update search</span>
								</Button>
							</div>
						</div>

						<!-- Time Filters -->
						<div>
							<Label>Time Filters</Label>
							<div class="mt-2 grid grid-cols-1 gap-4">
								<!-- Since -->
								<div class="space-y-2">
									<Label class="text-xs">Since</Label>
									<div class="flex gap-2">
										<Popover.Root bind:open={sincePopoverOpen}>
											<Popover.Trigger>
												<Button variant="outline" class="w-full justify-between font-normal">
													{inputSinceDate
														? inputSinceDate.toDate(getLocalTimeZone()).toLocaleDateString()
														: 'Select date'}
													<ChevronDownIcon />
												</Button>
											</Popover.Trigger>
											<Popover.Content class="w-auto overflow-hidden p-0" align="start">
												<Calendar.Calendar
													type="single"
													bind:value={inputSinceDate}
													onValueChange={() => {
														sincePopoverOpen = false;
														updateSince();
													}}
													captionLayout="dropdown"
												/>
											</Popover.Content>
										</Popover.Root>
										<Input
											type="time"
											bind:value={inputSinceTime}
											onchange={updateSince}
											class="w-32 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
										/>
									</div>
								</div>

								<!-- Until -->
								<div class="space-y-2">
									<Label class="text-xs">Until</Label>
									<div class="flex gap-2">
										<Popover.Root bind:open={untilPopoverOpen}>
											<Popover.Trigger>
												<Button variant="outline" class="w-full justify-between font-normal">
													{inputUntilDate
														? inputUntilDate.toDate(getLocalTimeZone()).toLocaleDateString()
														: 'Select date'}
													<ChevronDownIcon />
												</Button>
											</Popover.Trigger>
											<Popover.Content class="w-auto overflow-hidden p-0" align="start">
												<Calendar.Calendar
													type="single"
													bind:value={inputUntilDate}
													onValueChange={() => {
														untilPopoverOpen = false;
														updateUntil();
													}}
													captionLayout="dropdown"
												/>
											</Popover.Content>
										</Popover.Root>
										<Input
											type="time"
											bind:value={inputUntilTime}
											onchange={updateUntil}
											class="w-32 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
										/>
									</div>
								</div>

								<!-- Reset Dates Button -->
								<div class="flex justify-end">
									<Button
										variant="outline"
										size="sm"
										onclick={() => {
											inputSinceDate = undefined;
											inputSinceTime = '00:00';
											inputUntilDate = undefined;
											inputUntilTime = '23:59';
											config.timelineFilter.since = undefined;
											config.timelineFilter.until = undefined;
										}}
									>
										Reset Dates
									</Button>
								</div>
							</div>
						</div>

						<!-- Tag Filters -->
						<div>
							<Label>Tag Filters</Label>
							<div class="mt-2 grid grid-cols-2 gap-2">
								<Input
									type="text"
									bind:value={inputTagKey}
									placeholder="Tag key (e.g., t)"
									class="text-xs"
								/>
								<Input
									type="text"
									bind:value={inputTagValue}
									placeholder="Tag value"
									class="text-xs"
								/>
							</div>
							<Button
								variant="default"
								size="sm"
								class="mt-2 w-full"
								onclick={addTag}
								disabled={!inputTagKey || !inputTagValue}
							>
								<HashIcon class="mr-2 size-4" />
								Add Tag Filter
							</Button>
							{#if Object.keys(config.timelineFilter).some((key) => key.startsWith('#'))}
								<div class="mt-2 flex flex-wrap gap-2">
									{#each Object.entries(config.timelineFilter) as [key, values]}
										{#if key.startsWith('#') && Array.isArray(values) && values.length}
											{#each values as value, i}
												<div class="flex items-center rounded-md bg-secondary py-1 pr-1 pl-3">
													<span class="text-xs">{key.slice(1)}:{value}</span>
													<Button
														variant="ghost"
														size="icon"
														class="ml-1 size-6"
														onclick={() => removeTag(key, i)}
													>
														<TrashIcon class="size-3" />
														<span class="sr-only">Remove tag</span>
													</Button>
												</div>
											{/each}
										{/if}
									{/each}
								</div>
							{/if}
						</div>

						<!-- Reactions Toggle -->
						<div class="col-span-2">
							<Button
								variant={config.loadReactions ? 'default' : 'outline'}
								class="w-full"
								onclick={toggleReactions}
							>
								{config.loadReactions ? 'Reactions Enabled' : 'Load Reactions'}
							</Button>
						</div>
					</div>
				</div>
			</div>
			<Drawer.Footer>
				<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Close</Drawer.Close>
			</Drawer.Footer>
		</div>
	</Drawer.Content>
</Drawer.Root>
