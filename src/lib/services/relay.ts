import { RelayPool } from 'applesauce-relay';

// Create a single relay pool instance for the entire application
export const relayPool = new RelayPool();

export const defaultRelays = ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.nostr.band'];
export const metadataRelays = ['wss://0.kindpag.es/', 'wss://relay.nostr.band'];
