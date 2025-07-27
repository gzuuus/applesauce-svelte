import type { Filter } from 'nostr-tools';
import { defaultRelays } from './relay';

const defaultFilter: Filter = {
	kinds: [30023],
	limit: 10,
	authors: undefined,
	since: undefined,
	until: undefined,
	ids: undefined
};

export const config = $state({
	loadReactions: false,
	timelineRelays: defaultRelays,
	timelineFilter: defaultFilter
});
