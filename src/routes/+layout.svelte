<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import { activeAccount, manager } from '$lib/services/accountManager.svelte';
	import { config } from '$lib/services/config.svelte';
	import { EventFactory } from 'applesauce-factory';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import '../app.css';

	let { children } = $props();

	$effect(() => {
		if ($activeAccount) {
			config.eventFactory = new EventFactory({ signer: $activeAccount.signer });
		} else {
			const json = JSON.parse(localStorage.getItem('accounts') || '[]');
			if (!json.length) return;
			manager.fromJSON(json);
			manager.setActive(json[0].id);
		}
		manager.accounts$.subscribe(() => {
			localStorage.setItem('accounts', JSON.stringify(manager.toJSON()));
		});
	});
</script>

<div class="mx-auto max-w-[90vw] p-4">
	<Toaster />
	<Header />
	{@render children()}
</div>
