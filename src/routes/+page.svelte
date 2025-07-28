<script lang="ts">
	import Timeline from '../lib/components/Timeline.svelte';
	import NoteComposer from '../lib/components/NoteComposer.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Filter } from 'nostr-tools';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';

	interface TimelineComponent {
		id: number;
		component: typeof Timeline;
		props: {
			filter?: Filter;
			relays?: string[];
			loadReactions?: boolean;
		};
	}

	let nextTimelineId = 1;

	let timelines: TimelineComponent[] = $state([
		{
			id: nextTimelineId++,
			component: Timeline,
			props: {}
		}
	]);

	function addTimeline() {
		timelines = [...timelines, { id: nextTimelineId++, component: Timeline, props: {} }];
	}

	function removeTimeline(id: number) {
		timelines = timelines.filter((timeline) => timeline.id !== id);
	}
</script>

<div class="mb-6">
	<NoteComposer />
</div>

<div class="mb-6 flex space-x-2 p-2">
	<Button onclick={addTimeline}>Add New Timeline</Button>
</div>

<div class="flex overflow-x-auto p-4">
	{#each timelines as timeline (timeline.id)}
		<Collapsible.Root
			class="relative mr-4 mb-6 min-w-[500px] space-y-2 rounded-md border p-4 shadow-sm last:mr-0"
			open={true}
		>
			<div class="flex items-center justify-between space-x-4 px-4">
				<h4 class="text-sm font-semibold">Timeline {timeline.id}</h4>
				<div class="flex items-center space-x-2">
					<Collapsible.Trigger
						class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'w-9 p-0' })}
					>
						<ChevronsUpDownIcon class="h-4 w-4" />
						<span class="sr-only">Toggle</span>
					</Collapsible.Trigger>
					<button
						onclick={() => removeTimeline(timeline.id)}
						class="-mr-2 flex h-9 w-9 items-center justify-center p-0 text-red-500 hover:text-red-700"
					>
						&times;
					</button>
				</div>
			</div>
			<Collapsible.Content class="space-y-2">
				<timeline.component {...timeline.props} />
			</Collapsible.Content>
		</Collapsible.Root>
	{/each}
	{#if timelines.length === 0}
		<p class="text-center text-gray-500">
			No timelines added yet. Add a new timeline by clicking the button above.
		</p>
	{/if}
</div>
