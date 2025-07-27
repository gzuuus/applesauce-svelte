import type { Filter } from 'nostr-tools';
import { defaultRelays } from './relay';

const defaultFilter: Filter = {
	kinds: [30023],
	limit: 1,
	authors: undefined,
	since: undefined,
	until: undefined,
	ids: undefined
};

export const config = $state({
	loadReactions: false,
	kinds: [30023],
	limit: 1,
	timelineRelays: defaultRelays,
	timelineFilter: defaultFilter
});
