<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import X from '@lucide/svelte/icons/x';
	import { toast } from 'svelte-sonner';

	let relayInput = $state('');
	let relays = $state<string[]>([]);

	function addRelay() {
		if (!relayInput.trim()) return;
		if (relays.includes(relayInput.trim())) {
			toast.warning('Duplicate relay URL');
			return;
		}
		relays.push(relayInput.trim());
		relayInput = '';
	}

	function removeRelay(index: number) {
		relays.splice(index, 1);
	}

	function clearRelays() {
		relays = [];
	}

	let { onSetRelays }: { onSetRelays: (relays: string[]) => void } = $props();

	function emitRelays() {
		onSetRelays(relays);
	}
</script>

<div class="mx-auto w-full max-w-2xl space-y-6 p-6">
	<div class="flex flex-col gap-4 rounded-lg border bg-card p-6">
		<h2 class="mb-6 text-2xl font-bold text-foreground">Nostr Relay URL Creator</h2>

		<div class="space-y-2">
			<Label for="relay-url">Relay URL</Label>
			<div class="flex gap-2">
				<Input
					id="relay-url"
					bind:value={relayInput}
					placeholder="wss://relay.example.com"
					class="flex-1"
				/>
				<Button variant="outline" size="icon" onclick={addRelay} disabled={!relayInput.trim()}>
					<PlusIcon class="h-4 w-4" />
				</Button>
			</div>
			<div>
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

		<div class="flex gap-2 pt-4">
			<Button variant="outline" onclick={clearRelays}>Clear All</Button>
			<Button onclick={emitRelays}>Set Relays</Button>
		</div>
	</div>

	<div class="rounded-lg border bg-card p-6">
		<h3 class="mb-4 text-lg font-semibold">Relay Preview</h3>
		<pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm">
{JSON.stringify(relays, null, 2)}
		</pre>
	</div>
</div>
