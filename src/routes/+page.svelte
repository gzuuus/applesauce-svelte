<script lang="ts">
	import Timeline from '../lib/components/Timeline.svelte';
	import NoteComposer from '../lib/components/NoteComposer.svelte';
	import ConfigDrawer from '../lib/components/ConfigDrawer.svelte';
</script>

<div class="mx-auto max-w-2xl p-4">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Nostr Feed</h1>
		<div class=" flex gap-2">
			<ConfigDrawer />
		</div>
	</div>
	<div class="mb-6">
		<NoteComposer />
	</div>
	<div>
		<Timeline />
	</div>
</div>
