<script lang="ts">
	import type { NostrEvent } from 'nostr-tools';
	import ProfileCard from './ProfileCard.svelte';
	import { reactionsLoader } from '$lib/services/loaders';
	import { eventStore } from '$lib/services/eventStore';
	import { ReactionsModel } from 'applesauce-core/models';
	import { config } from '$lib/services/config.svelte';

	let { note }: { note: NostrEvent } = $props();
	$effect(() => {
		if (!config.loadReactions) return;
		const sub = reactionsLoader(note).subscribe();
		return () => sub.unsubscribe();
	});

	const reactions = eventStore.model(ReactionsModel, note);
</script>

<div class="mb-4 rounded-lg bg-white p-4 shadow-md">
	<ProfileCard pubkey={note.pubkey} />
	<div>
		<span class="font-bold">· {note.kind}</span>
		<span class="font-bold">· {new Date(note.created_at * 1000).toLocaleString()}</span>
	</div>
	<p class="break-words text-gray-800">{note.content}</p>
	{#if $reactions.length}
		<h2 class="text-lg font-bold">Reactions: {$reactions.length}</h2>
		<div class="flex flex-row gap-4">
			{#each $reactions as reaction (reaction.id)}
				<div class="flex items-center space-x-2">
					<p class="text-gray-800">{reaction.content}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
