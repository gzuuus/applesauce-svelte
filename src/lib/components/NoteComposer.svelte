<script lang="ts">
	import { publishEventToRelays } from '../services/publishing';
	import { defaultRelays } from '$lib/services/relay';
	import { validateRelay } from '$lib/utils';
	import type { EventTemplate } from 'nostr-tools';
	import { Button } from './ui/button';
	import { Input } from './ui/input';
	import { Label } from './ui/label';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import X from '@lucide/svelte/icons/x';
	import { activeAccount, manager } from '$lib/services/accountManager.svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import AccountLoginDialog from './AccountLoginDialog.svelte';
	let content: string = $state('');
	let isPosting: boolean = $state(false);
	let error: string = $state('');

	let advancedOptionsOpen = $state(false);

	let kind: number = $state(1); // Default kind to 1 (text note)

	// Tag management
	let tagKey: string = $state('');
	let tagValue: string = $state('');
	let tags: string[][] = $state([]); // This will store [['e', 'id1'], ['p', 'pubkey1']]

	// Relay management
	let relayInput: string = $state('');
	let relays: string[] = $state(defaultRelays);

	// No more addKind/removeKind as it's a single value

	function addTag() {
		if (!tagKey.trim() || !tagValue.trim()) return;

		// Check if tag with this key and value already exists
		if (tags.some(([key, value]) => key === tagKey && value === tagValue)) {
			// Optionally, show a toast or message for duplicate tag
			return;
		}

		tags = [...tags, [tagKey, tagValue]];
		tagKey = '';
		tagValue = '';
	}

	function removeTag(index: number) {
		tags = tags.filter((_, i) => i !== index);
	}

	function addRelay() {
		if (!relayInput.trim()) return;

		const normalizedRelay = validateRelay(relayInput);

		if (!normalizedRelay) return;

		if (relays.includes(normalizedRelay)) {
			// Optionally, show a toast or message for duplicate relay
			return;
		}

		relays = [...relays, normalizedRelay];
		relayInput = '';
	}

	function removeRelay(index: number) {
		relays = relays.filter((_, i) => i !== index);
	}

	async function postNote() {
		if (!content.trim() || !manager.signer) return;

		isPosting = true;
		error = '';

		try {
			// Create a draft event using the NoteBlueprint
			const draft: EventTemplate = $state.snapshot({
				kind: kind,
				content: content,
				tags: tags,
				created_at: Math.floor(Date.now() / 1000)
			});

			// Sign the draft event
			const signed = await manager.signer.signEvent(draft);

			// Publish the event
			await publishEventToRelays(signed, relays);

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

	<Button
		variant={advancedOptionsOpen ? 'default' : 'outline'}
		onclick={() => (advancedOptionsOpen = !advancedOptionsOpen)}
		class="mt-2 text-sm"
	>
		{advancedOptionsOpen ? 'Hide' : 'Show'} Advanced Options
	</Button>

	<div class="w-full space-y-2" class:hidden={!advancedOptionsOpen}>
		<!-- Event Kinds -->
		<div class="mt-4 space-y-2">
			<Label for="kinds">Event Kind</Label>
			<div class="flex gap-2">
				<Input
					id="kind"
					bind:value={kind}
					placeholder="Enter kind number"
					class="flex-1"
					type="number"
					min="0"
				/>
			</div>
		</div>

		<!-- Tags -->
		<div class="mt-4 space-y-4">
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
					{#each tags as tag, i (i)}
						<div class="flex items-center justify-between rounded-md bg-secondary/20 p-2">
							<span class="font-mono text-sm">
								#{tag[0]}: {tag[1]}
							</span>
							<Button variant="ghost" size="icon" onclick={() => removeTag(i)}>
								<X class="h-4 w-4" />
							</Button>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Relays -->
		<div class="mt-4 space-y-2">
			<Label for="relays">Relays</Label>
			<div class="flex gap-2">
				<Input id="relays" bind:value={relayInput} placeholder="Enter relay URL" class="flex-1" />
				<Button variant="outline" size="icon" onclick={addRelay} disabled={!relayInput.trim()}>
					<PlusIcon class="h-4 w-4" />
				</Button>
			</div>
			<div class="flex flex-wrap gap-2">
				<Button
					variant="outline"
					onclick={() => {
						relayInput = 'wss://nos.lol';
						addRelay();
					}}>Add Nos.lol</Button
				>
				<Button
					variant="outline"
					onclick={() => {
						relayInput = 'wss://relay.nostr.band';
						addRelay();
					}}>Add Nostr Band</Button
				>
				<Button
					variant="outline"
					onclick={() => {
						relayInput = 'wss://relay.damus.io';
						addRelay();
					}}>Add Damus</Button
				>
				<Button
					variant="outline"
					onclick={() => {
						relayInput = 'wss://relay.nostr.net';
						addRelay();
					}}>Add Nostr Net</Button
				>
			</div>
			{#if relays.length}
				<div class="mt-2 flex flex-wrap gap-2">
					{#each relays as relay, i (relay)}
						<span
							class="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm text-secondary-foreground"
						>
							{relay}
							<button type="button" class="hover:text-destructive" onclick={() => removeRelay(i)}>
								<X class="h-3 w-3" />
							</button>
						</span>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="mt-3 flex items-center justify-between">
		<div>
			{#if error}
				<p class="text-sm text-red-500">{error}</p>
			{/if}
		</div>
		{#if !$activeAccount}
			<Alert.Root>
				<Alert.Description>
					<div class=" flex w-full items-center justify-between">
						<div class=" inline-flex gap-2">
							<CircleAlertIcon class="size-4" />
							You must be logged in to post a note.
						</div>
						<AccountLoginDialog />
					</div>
				</Alert.Description>
			</Alert.Root>
		{:else}
			<Button
				onclick={postNote}
				disabled={isPosting || !content.trim() || !$activeAccount}
				class="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isPosting}
					Posting...
				{:else}
					Post
				{/if}
			</Button>
		{/if}
	</div>
</div>
