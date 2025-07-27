<script lang="ts">
	import { addressLoader } from '$lib/services/loaders';
	import { metadataRelays } from '$lib/services/relay';
	import { eventStore } from '../services/eventStore';
	import { ProfileModel } from 'applesauce-core/models';

	let { pubkey }: { pubkey: string } = $props();

	const profile = eventStore.model(ProfileModel, pubkey);
	$effect(() => {
		const sub = !$profile
			? addressLoader({
					kind: 0,
					pubkey,
					relays: metadataRelays
				}).subscribe()
			: undefined;
		return () => sub?.unsubscribe();
	});
</script>

{#if $profile}
	<div class="flex items-center space-x-4">
		<img
			src={$profile.picture || `https://robohash.org/${pubkey}.png`}
			alt="pfp"
			class="my-4 h-12 w-12 rounded-full object-cover"
		/>
		<div>
			<h3 class="text-lg font-semibold">{$profile.name || $profile.display_name}</h3>
		</div>
	</div>
{/if}
