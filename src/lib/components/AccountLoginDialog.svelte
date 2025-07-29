<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { manager } from '$lib/services/accountManager.svelte';
	import { ExtensionSigner, NostrConnectSigner } from 'applesauce-signers/signers';
	import {
		SimpleAccount,
		ExtensionAccount,
		NostrConnectAccount
	} from 'applesauce-accounts/accounts';

	let open = $state(false);
	let selectedTab = $state<'extension' | 'simple' | 'remote'>('extension');
	let privateKey = $state('');
	let bunkerUri = $state('');
	let qrCodeDataUrl = $state('');
	let nostrConnectUri = $state('');
	let loading = $state(false);
	let error = $state('');
	let remoteSignerStep = $state<'generate' | 'connecting' | 'manual'>('generate');

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

	async function generateRemoteSignerUri() {
		try {
			loading = true;
			error = '';

			const signer = new NostrConnectSigner({
				relays: ['wss://relay.nsec.app', 'wss://relay.damus.io']
			});

			// Generate nostr connect URI with app metadata and permissions
			const uri = signer.getNostrConnectURI({
				name: 'Applesauce',
				url: window.location.origin,
				image: `${window.location.origin}/favicon.svg`
			});

			nostrConnectUri = uri;

			// Generate QR code using qrserver.com API
			qrCodeDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}`;

			remoteSignerStep = 'connecting';

			// Start waiting for the signer to connect
			await signer.waitForSigner();

			// Get the user's public key
			const pubkey = await signer.getPublicKey();
			const account = new NostrConnectAccount(pubkey, signer);

			manager.addAccount(account);
			manager.setActive(account);

			// Reset state and close dialog
			resetRemoteSignerState();
			open = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to connect remote signer';
			remoteSignerStep = 'generate';
		} finally {
			loading = false;
		}
	}

	async function connectWithBunkerUri() {
		if (!bunkerUri.trim()) {
			error = 'Please enter a bunker URI';
			return;
		}

		try {
			loading = true;
			error = '';

			const signer = await NostrConnectSigner.fromBunkerURI(bunkerUri.trim());

			// Connect to the remote signer
			await signer.connect();

			// Get the user's public key
			const pubkey = await signer.getPublicKey();
			const account = new NostrConnectAccount(pubkey, signer);

			manager.addAccount(account);
			manager.setActive(account);

			// Reset state and close dialog
			resetRemoteSignerState();
			bunkerUri = '';
			open = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to connect with bunker URI';
		} finally {
			loading = false;
		}
	}

	function resetRemoteSignerState() {
		loading = false;
		remoteSignerStep = 'generate';
		qrCodeDataUrl = '';
		nostrConnectUri = '';
		error = '';
	}

	function handleSubmit() {
		if (selectedTab === 'extension') {
			connectExtension();
		} else if (selectedTab === 'simple') {
			connectSimple();
		} else if (selectedTab === 'remote') {
			if (remoteSignerStep === 'manual') {
				connectWithBunkerUri();
			} else {
				generateRemoteSignerUri();
			}
		}
	}

	// Reset remote signer state when tab changes
	$effect(() => {
		if (selectedTab !== 'remote') {
			resetRemoteSignerState();
		}
	});

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
				<button
					class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors {selectedTab ===
					'remote'
						? 'bg-background shadow-sm'
						: 'hover:bg-muted-foreground/10'}"
					onclick={() => (selectedTab = 'remote')}
				>
					Remote Signer
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

			<!-- Remote Signer Tab -->
			{#if selectedTab === 'remote'}
				<div class="space-y-4">
					{#if remoteSignerStep === 'generate'}
						<div class="space-y-4">
							<p class="text-sm text-muted-foreground">
								Connect using a remote signer app that supports NIP-46 (Nostr Connect).
							</p>
							<div class="flex gap-2">
								<Button
									variant="outline"
									class="flex-1"
									onclick={() => (remoteSignerStep = 'manual')}
								>
									Enter Bunker URI
								</Button>
							</div>
						</div>
					{:else if remoteSignerStep === 'connecting'}
						<div class="space-y-4 text-center">
							<p class="text-sm text-muted-foreground">
								Scan this QR code with your signer app or copy the connection string:
							</p>

							{#if qrCodeDataUrl}
								<div class="flex justify-center">
									<img src={qrCodeDataUrl} alt="Nostr Connect QR Code" class="rounded-lg border" />
								</div>
							{/if}

							<div class="space-y-2">
								<Label for="connect-uri">Connection String</Label>
								<Input
									id="connect-uri"
									value={nostrConnectUri}
									readonly
									class="font-mono text-xs"
									onclick={(e) => (e.target as HTMLInputElement)?.select()}
								/>
								<p class="text-xs text-muted-foreground">Waiting for signer app to connect...</p>
							</div>

							<Button variant="outline" onclick={() => resetRemoteSignerState()}>Cancel</Button>
						</div>
					{:else if remoteSignerStep === 'manual'}
						<div class="space-y-4">
							<div class="space-y-2">
								<Label for="bunker-uri">Bunker URI</Label>
								<Input
									id="bunker-uri"
									placeholder="bunker://..."
									bind:value={bunkerUri}
									class="font-mono"
								/>
								<p class="text-xs text-muted-foreground">
									Enter the bunker URI provided by your signer app.
								</p>
							</div>
							<Button variant="outline" onclick={() => (remoteSignerStep = 'generate')}>
								Back to QR Code
							</Button>
						</div>
					{/if}
				</div>
			{/if}

			{#if error}
				<p class="text-sm text-destructive">{error}</p>
			{/if}
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)} disabled={loading}>Cancel</Button>
			{#if selectedTab === 'remote' && remoteSignerStep === 'connecting'}
				<!-- No connect button when waiting for remote signer -->
			{:else}
				<Button onclick={handleSubmit}>
					{loading
						? 'Connecting...'
						: selectedTab === 'remote' && remoteSignerStep === 'manual'
							? 'Connect with Bunker URI'
							: selectedTab === 'remote'
								? 'Generate QR Code'
								: 'Connect'}
				</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
