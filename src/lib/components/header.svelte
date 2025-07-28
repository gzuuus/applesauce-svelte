<script lang="ts">
	import AccountLoginDialog from './AccountLoginDialog.svelte';
	import ProfileCard from './ProfileCard.svelte';
	import { activeAccount, logout } from '$lib/services/accountManager.svelte';
	import Button from './ui/button/button.svelte';
</script>

<div class="mb-8 flex items-center justify-between">
	<h1 class="text-3xl font-bold">Applesauce Svelte</h1>
	<div class="flex items-center gap-4">
		{#if $activeAccount}
			<div class="flex items-center gap-3">
				<ProfileCard pubkey={$activeAccount.pubkey} />
				<Button variant="outline" onclick={logout}>Logout</Button>
			</div>
		{:else}
			<AccountLoginDialog />
		{/if}
	</div>
</div>
