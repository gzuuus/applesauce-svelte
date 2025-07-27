import { defaultRelays, relayPool } from './relay';
import { eventStore } from './eventStore';
import type { PublishResponse } from 'applesauce-relay';
import type { NostrEvent } from 'nostr-tools';

// Publish an event to multiple relays
export async function publishEvent(event: NostrEvent) {
	try {
		const responses = relayPool.publish(defaultRelays, event);
		responses.forEach((response: PublishResponse) => {
			if (response.ok) {
				console.log(`Event published successfully to ${response.from}`);
			} else {
				console.log(`Failed to publish event to ${response.from}: ${response.message}`);
			}
		});

		// Add the event to the event store after successful publish
		eventStore.add(event);

		return responses;
	} catch (error) {
		console.error('Error publishing event:', error);
		throw error;
	}
}

// Publish an event to a single relay
export async function publishEventToRelay(event: NostrEvent, relayUrl: string) {
	try {
		const responses = relayPool.relay(relayUrl).publish(event);
		responses.forEach((response: PublishResponse) => {
			if (response.ok) {
				console.log(`Event published successfully to ${response.from}`);
				// Add the event to the event store after successful publish
				eventStore.add(event);
			} else {
				console.log(`Failed to publish event to ${response.from}: ${response.message}`);
			}
			return response;
		});
	} catch (error) {
		console.error('Error publishing event:', error);
		throw error;
	}
}
