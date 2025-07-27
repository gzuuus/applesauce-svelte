<script lang="ts">
	import { config } from '$lib/services/config.svelte';
	import { timelineFactory } from '$lib/services/loaders';
	import { eventStore } from '../services/eventStore';
	import NoteCard from './NoteCard.svelte';
	import { TimelineModel } from 'applesauce-core/models';
	import type { Filter } from 'nostr-tools';

	let {
		filter = config.timelineFilter,
		relays = config.timelineRelays
	}: { filter?: Filter; relays?: string[] } = $props();

	$effect(() => {
		const sub = timelineFactory(relays, filter).subscribe();
		return () => sub.unsubscribe();
	});

	const timeline = eventStore.model(TimelineModel, filter);
</script>

<div>
	<h2>Timeline</h2>
	<small>
		Filter: {JSON.stringify(filter)}
		<br />
		Relays: {JSON.stringify(relays)}
	</small>
	<div>
		{#if $timeline.length}
			{#each $timeline as note (note.id)}
				<NoteCard {note} />
			{/each}
		{:else}
			<p class="py-4 text-center text-gray-500">No notes to display</p>
		{/if}
	</div>
</div>
