import type { Filter } from 'nostr-tools';
import { defaultRelays } from './relay';
import type { EventFactory } from 'applesauce-factory';

const defaultFilter: Filter = {
	kinds: [30023],
	limit: 10,
	authors: undefined,
	since: undefined,
	until: undefined,
	ids: undefined
};

interface Config {
	loadReactions: boolean;
	timelineRelays: string[];
	timelineFilter: Filter;
	eventFactory: EventFactory | undefined;
}

export const config = $state<Config>({
	loadReactions: false,
	timelineRelays: defaultRelays,
	timelineFilter: defaultFilter,
	eventFactory: undefined
});
