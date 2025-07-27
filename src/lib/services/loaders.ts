import {
	createEventLoader,
	createAddressLoader,
	createTimelineLoader,
	createReactionsLoader
} from 'applesauce-loaders/loaders';
import { relayPool } from './relay';
import { eventStore } from './eventStore';
import type { Filter } from 'nostr-tools';

// Create event loader
export const eventLoader = createEventLoader(relayPool, {
	eventStore
});

// Create address loader
export const addressLoader = createAddressLoader(relayPool, { eventStore });

export const reactionsLoader = createReactionsLoader(relayPool, { eventStore });

export const timelineFactory = (relays: string[], filter: Filter) =>
	createTimelineLoader(relayPool, relays, filter, { eventStore })();
