import { createAddressLoader, createReactionsLoader } from 'applesauce-loaders/loaders';
import { relayPool } from './relay';
import { eventStore } from './eventStore';

// Create address loader
export const addressLoader = createAddressLoader(relayPool, { eventStore });

export const reactionsLoader = createReactionsLoader(relayPool, { eventStore });
