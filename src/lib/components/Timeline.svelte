<script lang="ts">
	import { relayPool } from '$lib/services/relay';
	import { eventStore } from '../services/eventStore';
	import NoteCard from './NoteCard.svelte';
	import type { Filter, NostrEvent } from 'nostr-tools';
	import FilterCreator from '$lib/components/FilterCreator.svelte';
	import RelayUrlCreator from '$lib/components/RelayUrlCreator.svelte';
	import Button from './ui/button/button.svelte';
	import { onDestroy } from 'svelte';
	import type { Subscription } from 'rxjs';
	import { createTimelineLoader } from 'applesauce-loaders/loaders';

	let {
		filter,
		relays,
		loadReactions
	}: { filter?: Filter; relays?: string[]; loadReactions?: boolean } = $props();

	let currentFilter: Filter | undefined = $state(filter);
	let currentRelays: string[] | undefined = $state(relays);
	let currentLoadReactions = $state(loadReactions || false);
	let subscription = $state<Subscription | null>(null);
	let filterOpen = $state(false);
	let relaysOpen = $state(false);

	// State for timeline loader and events
	let timelineLoader = $state<ReturnType<typeof createTimelineLoader> | null>(null);
	let events = $state<NostrEvent[]>([]);
	let loading = $state(false);
	let hasLoaded = $state(false);

	function handleSetFilter(filter: Filter) {
		currentFilter = filter;
		filterOpen = false;
		// Reset timeline when filter changes
		timelineLoader = null;
		events = [];
		hasLoaded = false;
	}

	function handleSetRelays(relays: string[]) {
		currentRelays = relays;
		relaysOpen = false;
		// Reset timeline when relays change
		timelineLoader = null;
		events = [];
		hasLoaded = false;
	}

	// Initialize timeline loader when filter and relays are set
	$effect(() => {
		if (currentFilter && currentRelays && currentRelays.length > 0 && !timelineLoader) {
			timelineLoader = createTimelineLoader(relayPool, currentRelays, currentFilter, {
				eventStore
			});
		}
	});

	// Load initial events
	$effect(() => {
		if (timelineLoader && !hasLoaded && !loading) {
			loadMoreEvents();
		}
	});

	// Function to load more events
	function loadMoreEvents() {
		if (!timelineLoader || loading) return;

		loading = true;

		subscription = timelineLoader().subscribe({
			next: (event) => {
				events = [...events, event];
			},
			complete: () => {
				loading = false;
				hasLoaded = true;
			}
		});
	}

	onDestroy(() => {
		if (subscription) {
			console.log('Unsubscribing from timeline');
			subscription?.unsubscribe();
		}
	});
</script>

<div class="mx-auto w-full max-w-2xl space-y-6 p-6">
	<h2 class="mb-6 text-2xl font-bold text-foreground">Timeline</h2>
	<!-- Filter Creator Collapsible -->
	<div>
		<Button variant={filterOpen ? 'default' : 'outline'} onclick={() => (filterOpen = !filterOpen)}
			>Create a filter</Button
		>
		<div class="" class:hidden={!filterOpen}>
			<FilterCreator onSetFilter={handleSetFilter} />
		</div>

		<!-- Relay URL Creator Collapsible -->
		<Button variant={relaysOpen ? 'default' : 'outline'} onclick={() => (relaysOpen = !relaysOpen)}
			>Add relays</Button
		>
		<div class="w-full space-y-2" class:hidden={!relaysOpen}>
			<RelayUrlCreator onSetRelays={handleSetRelays} />
		</div>
		<Button
			variant={currentLoadReactions ? 'default' : 'outline'}
			onclick={() => (currentLoadReactions = !currentLoadReactions)}>Load Reactions</Button
		>
	</div>
	{#if !currentFilter || !currentRelays || currentRelays.length === 0}
		<p class="py-4 text-center text-gray-500">To create a timeline, add filters and relays.</p>
	{/if}
	<div class="mb-4 space-y-2 text-sm">
		{#if currentFilter}
			<div class="font-medium">Filter:</div>
			<code class="block overflow-x-auto rounded bg-gray-100 p-2 text-xs">
				{JSON.stringify(currentFilter)}
			</code>
		{/if}
		{#if currentRelays}
			<div class="font-medium">Relays:</div>
			<code class="block overflow-x-auto rounded bg-gray-100 p-2 text-xs">
				{JSON.stringify(currentRelays)}
			</code>
		{/if}
	</div>
	<div>
		{#if events.length > 0}
			{#each events as note (note.id)}
				<NoteCard {note} loadReactions={currentLoadReactions} />
			{/each}
		{:else if loading}
			<p class="py-4 text-center text-gray-500">Loading events...</p>
		{:else}
			<p class="py-4 text-center text-gray-500">No notes to display</p>
		{/if}

		{#if hasLoaded && !loading}
			<div class="mt-6 flex justify-center">
				<Button variant="outline" onclick={loadMoreEvents} class="w-full max-w-xs">
					{loading ? 'Loading...' : 'Load More'}
				</Button>
			</div>
		{/if}
	</div>
</div>
