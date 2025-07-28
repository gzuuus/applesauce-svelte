<script lang="ts">
	import { timelineFactory } from '$lib/services/loaders';
	import { eventStore } from '../services/eventStore';
	import NoteCard from './NoteCard.svelte';
	import { TimelineModel } from 'applesauce-core/models';
	import type { Filter } from 'nostr-tools';
	import FilterCreator from '$lib/components/FilterCreator.svelte';
	import RelayUrlCreator from '$lib/components/RelayUrlCreator.svelte';
	import Button from './ui/button/button.svelte';

	let currentFilter: Filter | undefined = $state(undefined);
	let currentRelays: string[] | undefined = $state(undefined);
	let loadReactions = $state(false);

	let filterCollapsibleOpen = $state(false);
	let relaysCollapsibleOpen = $state(false);

	function handleSetFilter(filter: Filter) {
		currentFilter = filter;
		filterCollapsibleOpen = false;
	}

	function handleSetRelays(relays: string[]) {
		currentRelays = relays;
		relaysCollapsibleOpen = false;
	}

	$effect(() => {
		if (currentFilter && currentRelays && currentRelays.length > 0) {
			const sub = timelineFactory(currentRelays, currentFilter).subscribe();
			return () => sub.unsubscribe();
		}
	});

	const timeline = $derived(
		currentFilter ? eventStore.model(TimelineModel, currentFilter) : undefined
	);
</script>

<div class="mx-auto w-full max-w-2xl space-y-6 p-6">
	<h2 class="mb-6 text-2xl font-bold text-foreground">Timeline</h2>
	<!-- Filter Creator Collapsible -->
	<div>
		<Button
			variant={filterCollapsibleOpen ? 'default' : 'outline'}
			onclick={() => (filterCollapsibleOpen = !filterCollapsibleOpen)}>Create a filter</Button
		>
		<div class="w-full space-y-2" class:hidden={!filterCollapsibleOpen}>
			<FilterCreator onSetFilter={handleSetFilter} />
		</div>

		<!-- Relay URL Creator Collapsible -->
		<Button
			variant={relaysCollapsibleOpen ? 'default' : 'outline'}
			onclick={() => (relaysCollapsibleOpen = !relaysCollapsibleOpen)}>Add relays</Button
		>
		<div class="w-full space-y-2" class:hidden={!relaysCollapsibleOpen}>
			<RelayUrlCreator onSetRelays={handleSetRelays} />
		</div>
		<Button
			variant={loadReactions ? 'default' : 'outline'}
			onclick={() => (loadReactions = !loadReactions)}>Load Reactions</Button
		>
	</div>
	{#if !currentFilter || !currentRelays || currentRelays.length === 0}
		<p class="py-4 text-center text-gray-500">To create a timeline, add filters and relays.</p>
	{/if}
	{#if currentFilter}
		Filter: {JSON.stringify(currentFilter)}
	{/if}
	{#if currentRelays}
		Relays: {JSON.stringify(currentRelays)}
	{/if}
	<div>
		{#if $timeline?.length}
			{#each $timeline as note (note.id)}
				<NoteCard {note} {loadReactions} />
			{/each}
		{:else}
			<p class="py-4 text-center text-gray-500">No notes to display</p>
		{/if}
	</div>
</div>
