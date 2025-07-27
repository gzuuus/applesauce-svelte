<script lang="ts">
	import { NoteBlueprint } from 'applesauce-factory/blueprints';
	import { publishEvent } from '../services/publishing';
	import { config } from '$lib/services/config.svelte';

	let content: string = '';
	let isPosting: boolean = false;
	let error: string = '';

	async function postNote() {
		if (!content.trim() || !config.eventFactory) return;

		isPosting = true;
		error = '';

		try {
			// Create a draft event using the NoteBlueprint
			const draft = await config.eventFactory.create(NoteBlueprint, content);

			// Sign the draft event
			const signed = await config.eventFactory.sign(draft);

			// Publish the event
			await publishEvent(signed);

			// Clear the form
			content = '';
		} catch (err) {
			console.error('Failed to post note:', err);
			error = 'Failed to post note. Please try again.';
		} finally {
			isPosting = false;
		}
	}
</script>

<div class="mb-4 rounded-lg bg-white p-4 shadow-md">
	<textarea
		bind:value={content}
		placeholder="What's happening?"
		class="w-full resize-none rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		rows="3"
	></textarea>

	<div class="mt-3 flex items-center justify-between">
		<div>
			{#if error}
				<p class="text-sm text-red-500">{error}</p>
			{/if}
		</div>

		<button
			on:click={postNote}
			disabled={isPosting || !content.trim()}
			class="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{#if isPosting}
				Posting...
			{:else}
				Post
			{/if}
		</button>
	</div>
</div>
