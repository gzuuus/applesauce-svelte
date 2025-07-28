<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { manager } from '$lib/services/accountManager.svelte';
	import { ExtensionSigner } from 'applesauce-signers/signers';
	import { SimpleAccount } from 'applesauce-accounts/accounts';
	import { ExtensionAccount } from 'applesauce-accounts/accounts';

	let open = $state(false);
	let selectedTab = $state<'extension' | 'simple'>('extension');
	let privateKey = $state('');
	let loading = $state(false);
	let error = $state('');

	async function connectExtension() {
		try {
			loading = true;
			error = '';

			const signer = new ExtensionSigner();
			const pubkey = await signer.getPublicKey();
			const account = new ExtensionAccount(pubkey, signer);

			manager.addAccount(account);
			manager.setActive(account);

			open = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to connect extension';
		} finally {
			loading = false;
		}
	}

	async function connectSimple() {
		if (!privateKey.trim()) {
			error = 'Please enter a private key';
			return;
		}

		try {
			loading = true;
			error = '';

			const signer = SimpleAccount.fromKey(privateKey.trim());
			const account = new SimpleAccount(signer.pubkey, signer.signer);

			manager.addAccount(account);
			manager.setActive(account);

			open = false;
			privateKey = '';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to connect with private key';
		} finally {
			loading = false;
		}
	}

	function handleSubmit() {
		if (selectedTab === 'extension') {
			connectExtension();
		} else {
			connectSimple();
		}
	}

	$effect(() => {
		// Check if extension is available
		if (typeof window !== 'undefined' && !('nostr' in window)) {
			selectedTab = 'simple';
		}
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Login</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Connect Account</Dialog.Title>
			<Dialog.Description>Choose how you want to connect to Nostr</Dialog.Description>
		</Dialog.Header>

		<div class="grid gap-4 py-4">
			<!-- Tab Navigation -->
			<div class="flex space-x-1 rounded-lg bg-muted p-1">
				<button
					class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors {selectedTab ===
					'extension'
						? 'bg-background shadow-sm'
						: 'hover:bg-muted-foreground/10'}"
					onclick={() => (selectedTab = 'extension')}
					disabled={typeof window !== 'undefined' && !('nostr' in window)}
				>
					Extension
				</button>
				<button
					class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors {selectedTab ===
					'simple'
						? 'bg-background shadow-sm'
						: 'hover:bg-muted-foreground/10'}"
					onclick={() => (selectedTab = 'simple')}
				>
					Private Key
				</button>
			</div>

			<!-- Extension Tab -->
			{#if selectedTab === 'extension'}
				<div class="space-y-4">
					<p class="text-sm text-muted-foreground">
						Connect using a browser extension like Nos2x or Alby.
					</p>
					{#if typeof window !== 'undefined' && !('nostr' in window)}
						<p class="text-sm text-destructive">
							No Nostr extension detected. Please install a Nostr extension first.
						</p>
					{/if}
				</div>
			{/if}

			<!-- Simple Tab -->
			{#if selectedTab === 'simple'}
				<div class="space-y-4">
					<div class="space-y-2">
						<Label for="private-key">Private Key</Label>
						<Input
							id="private-key"
							placeholder="Enter your private key (hex format)"
							bind:value={privateKey}
							class="font-mono"
							type="password"
						/>
						<p class="text-xs text-muted-foreground">
							Your private key will be stored securely in your browser's local storage.
						</p>
					</div>
				</div>
			{/if}

			{#if error}
				<p class="text-sm text-destructive">{error}</p>
			{/if}
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
			<Button onclick={handleSubmit} disabled={loading}>
				{loading ? 'Connecting...' : 'Connect'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
