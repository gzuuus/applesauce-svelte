<script lang="ts">
	import type { Filter } from 'nostr-tools';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import X from '@lucide/svelte/icons/x';
	import { toast } from 'svelte-sonner';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { getLocalTimeZone } from '@internationalized/date';
	import type { CalendarDate } from '@internationalized/date';

	// Reactive state for the filter
	let filter = $state<Filter>({});

	let sinceOpen = $state(false);
	let sinceDateValue = $state<CalendarDate | undefined>();
	let sinceTimeValue = $state('00:00:00');

	let untilOpen = $state(false);
	let untilDateValue = $state<CalendarDate | undefined>();
	let untilTimeValue = $state('00:00:00');

	// Form state for arrays
	let idsInput = $state('');
	let authorsInput = $state('');
	let kindsInput = $state(0);
	// Tag management
	let tagKey = $state('');
	let tagValue = $state('');
	let tags = $state<Array<{ key: string; values: string[] }>>([]);

	function updateFilterField<T>(field: string, value: T) {
		if (value === undefined || (Array.isArray(value) && value.length === 0)) {
			const newFilter = { ...filter };
			delete newFilter[field as keyof Filter];
			filter = newFilter;
		} else {
			filter = { ...filter, [field]: value };
		}
	}

	function addArrayItem(field: keyof Filter, item: string | number) {
		const current = filter[field] as string[] | number[] | undefined;
		if (current && current.some((val) => val === item)) {
			toast.warning('Duplicate value');
			return;
		}
		const newArray = [...(current || []), item];
		updateFilterField(field, newArray);
	}

	function removeArrayItem(field: keyof Filter, index: number) {
		const current = filter[field] as string[] | number[] | undefined;
		if (current) {
			const newArray = current.filter((_, i) => i !== index);
			updateFilterField(field, newArray);
		}
	}

	function addTag() {
		if (!tagKey.trim() || !tagValue.trim()) return;

		const existingTag = tags.find((t) => t.key === tagKey);
		if (existingTag) {
			if (!existingTag.values.includes(tagValue)) {
				existingTag.values.push(tagValue);
			}
		} else {
			tags.push({ key: tagKey, values: [tagValue] });
		}

		// Update filter
		const tagValues = tags.find((t) => t.key === tagKey)?.values || [];
		updateFilterField(`#${tagKey}`, tagValues);

		// Clear inputs
		tagKey = '';
		tagValue = '';
	}

	function removeTag(tagIndex: number) {
		const tag = tags[tagIndex];
		if (tag) {
			tags.splice(tagIndex, 1);
			// Update filter
			const tagValues = tags.find((t) => t.key === tag.key)?.values || [];
			if (tagValues.length > 0) {
				updateFilterField(`#${tag.key}`, tagValues);
			} else {
				updateFilterField(`#${tag.key}`, undefined);
			}
		}
	}

	let { onSetFilter }: { onSetFilter: (filter: Filter) => void } = $props();

	function clearFilter() {
		filter = {};
		tags = [];
		idsInput = '';
		authorsInput = '';
		kindsInput = 0;
		tagKey = '';
		tagValue = '';
		sinceDateValue = undefined;
		sinceTimeValue = '00:00:00';
		untilDateValue = undefined;
		untilTimeValue = '23:59:59';
	}

	function handleSetFilter() {
		onSetFilter(filter);
	}

	// Derived state for display
	let filterPreview = $derived(JSON.stringify(filter, null, 2));

	$effect(() => {
		if (sinceDateValue) {
			const [hours, minutes, seconds] = sinceTimeValue.split(':').map(Number);
			const date = sinceDateValue.toDate(getLocalTimeZone());
			date.setHours(hours, minutes, seconds);
			filter.since = Math.floor(date.getTime() / 1000);
		} else {
			filter.since = undefined;
		}
	});

	$effect(() => {
		if (untilDateValue) {
			const [hours, minutes, seconds] = untilTimeValue.split(':').map(Number);
			const date = untilDateValue.toDate(getLocalTimeZone());
			date.setHours(hours, minutes, seconds);
			filter.until = Math.floor(date.getTime() / 1000);
		} else {
			filter.until = undefined;
		}
	});
</script>

<div class="mx-auto w-full max-w-2xl space-y-6 p-2">
	<div class="flex flex-col gap-4 rounded-lg border bg-card p-2">
		<h2 class="mb-6 text-2xl font-bold text-foreground">Nostr Filter Creator</h2>

		<!-- Event IDs -->
		<div class="space-y-2">
			<Label for="ids">Event IDs</Label>
			<div class="flex gap-2">
				<Input
					id="ids"
					bind:value={idsInput}
					placeholder="Enter event IDs (comma-separated)"
					class="flex-1"
				/>
				<Button
					variant="outline"
					size="icon"
					onclick={() => addArrayItem('ids', idsInput)}
					disabled={!idsInput.trim()}
				>
					<PlusIcon class="h-4 w-4" />
				</Button>
			</div>
			{#if filter.ids?.length}
				<div class="mt-2 flex flex-wrap gap-2">
					{#each filter.ids as id, i (id)}
						<button
							type="button"
							class="hover:text-destructive"
							onclick={() => removeArrayItem('ids', i)}
						>
							<span
								class="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm text-secondary-foreground"
							>
								{id}
								<X class="h-3 w-3" />
							</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Authors -->
		<div class="space-y-2">
			<Label for="authors">Authors</Label>
			<div class="flex gap-2">
				<Input
					id="authors"
					bind:value={authorsInput}
					placeholder="Enter author pubkeys (comma-separated)"
					class="flex-1"
				/>
				<Button
					variant="outline"
					size="icon"
					onclick={() => addArrayItem('authors', authorsInput)}
					disabled={!authorsInput.trim()}
				>
					<PlusIcon class="h-4 w-4" />
				</Button>
			</div>
			{#if filter.authors?.length}
				<div class="mt-2 flex flex-wrap gap-2">
					{#each filter.authors as author, i (author)}
						<span
							class="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm text-secondary-foreground"
						>
							{author.slice(0, 8)}...{author.slice(-8)}
							<button
								type="button"
								class="hover:text-destructive"
								onclick={() => removeArrayItem('authors', i)}
							>
								<X class="h-3 w-3" />
							</button>
						</span>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Event Kinds -->
		<div class="space-y-2">
			<Label for="kinds">Event Kinds</Label>
			<div class="flex gap-2">
				<Input
					id="kinds"
					bind:value={kindsInput}
					placeholder="Enter kind numbers (comma-separated)"
					class="flex-1"
					type="number"
				/>
				<Button variant="outline" size="icon" onclick={() => addArrayItem('kinds', kindsInput)}>
					<PlusIcon class="h-4 w-4" />
				</Button>
			</div>
			{#if filter.kinds?.length}
				<div class="mt-2 flex flex-wrap gap-2">
					{#each filter.kinds as kind, i (kind)}
						<span
							class="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm text-secondary-foreground"
						>
							{kind}
							<button
								type="button"
								class="hover:text-destructive"
								onclick={() => removeArrayItem('kinds', i)}
							>
								<X class="h-3 w-3" />
							</button>
						</span>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Time Range -->
		<div class="grid grid-cols-2 gap-4">
			<div class="flex flex-col gap-3">
				<Label for="since-date" class="px-1">Since (Date)</Label>
				<Popover.Root bind:open={sinceOpen}>
					<Popover.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" class="justify-between font-normal">
								{sinceDateValue
									? sinceDateValue.toDate(getLocalTimeZone()).toLocaleDateString()
									: 'Select date'}
								<ChevronDownIcon />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-auto overflow-hidden p-0" align="start">
						<Calendar
							type="single"
							bind:value={sinceDateValue}
							onValueChange={() => {
								sinceOpen = false;
							}}
							captionLayout="dropdown"
						/>
					</Popover.Content>
				</Popover.Root>
			</div>
			<div class="flex flex-col gap-3">
				<Label for="since-time" class="px-1">Since (Time)</Label>
				<Input
					type="time"
					id="since-time"
					step="1"
					bind:value={sinceTimeValue}
					class="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
				/>
			</div>

			<div class="flex flex-col gap-3">
				<Label for="until-date" class="px-1">Until (Date)</Label>
				<Popover.Root bind:open={untilOpen}>
					<Popover.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" class="justify-between font-normal">
								{untilDateValue
									? untilDateValue.toDate(getLocalTimeZone()).toLocaleDateString()
									: 'Select date'}
								<ChevronDownIcon />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-auto overflow-hidden p-0" align="start">
						<Calendar
							type="single"
							bind:value={untilDateValue}
							onValueChange={() => {
								untilOpen = false;
							}}
							captionLayout="dropdown"
						/>
					</Popover.Content>
				</Popover.Root>
			</div>
			<div class="flex flex-col gap-3">
				<Label for="until-time" class="px-1">Until (Time)</Label>
				<Input
					type="time"
					id="until-time"
					step="1"
					bind:value={untilTimeValue}
					class="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
				/>
			</div>
		</div>

		<!-- Limit -->
		<div class="space-y-2">
			<Label for="limit">Limit</Label>
			<Input
				id="limit"
				type="number"
				bind:value={filter.limit}
				placeholder="Maximum number of events"
				min="1"
			/>
		</div>

		<!-- Search -->
		<div class="space-y-2">
			<Label for="search">Search</Label>
			<Input id="search" bind:value={filter.search} placeholder="Search query" />
		</div>

		<!-- Tags -->
		<div class="space-y-4">
			<h3 class="text-lg font-semibold">Tags</h3>
			<div class="space-y-2">
				<div class="flex gap-2">
					<Input bind:value={tagKey} placeholder="Tag key (e.g., 'e', 'p', 't')" class="flex-1" />
					<Input bind:value={tagValue} placeholder="Tag value" class="flex-1" />
					<Button
						variant="outline"
						size="icon"
						onclick={addTag}
						disabled={!tagKey.trim() || !tagValue.trim()}
					>
						<PlusIcon class="h-4 w-4" />
					</Button>
				</div>
			</div>

			{#if tags.length > 0}
				<div class="space-y-2">
					{#each tags as tag, i (tag.key)}
						<div class="flex items-center justify-between rounded-md bg-secondary/20 p-2">
							<span class="font-mono text-sm">
								#{tag.key}: {tag.values.join(', ')}
							</span>
							<Button variant="ghost" size="icon" onclick={() => removeTag(i)}>
								<Trash2 class="h-4 w-4" />
							</Button>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Actions -->
		<div class="flex gap-2 pt-4">
			<Button variant="outline" onclick={clearFilter}>Clear All</Button>
			<Button onclick={handleSetFilter}>Set Filter</Button>
		</div>
	</div>

	<!-- Filter Preview -->
	<div class="rounded-lg border bg-card p-6">
		<h3 class="mb-4 text-lg font-semibold">Filter Preview</h3>
		<pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm">
{filterPreview}
		</pre>
	</div>
</div>
