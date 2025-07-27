import { EventFactory } from 'applesauce-factory';
import { ExtensionSigner } from 'applesauce-signers';

// Create a signer that uses the browser extension (like Alby or nos2x)
const signer = new ExtensionSigner();

// Create the event factory with the signer
export const eventFactory = new EventFactory({
	signer
});
