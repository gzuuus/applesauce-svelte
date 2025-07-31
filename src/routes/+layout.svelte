<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import '../app.css';

	let { children } = $props();
</script>

<div class="mx-auto max-w-[90vw] p-4">
	<Toaster />
	<Header />
	{@render children()}
</div>
