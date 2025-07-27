This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where content has been compressed (code blocks are separated by ⋮---- delimiter).

# File Summary

## Purpose

This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format

The content is organized as follows:

1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
   a. A header with the file path (## File: path/to/file)
   b. The full contents of the file in a code block

## Usage Guidelines

- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes

- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure

```
00-introduction.md
01-event-store.md
02-helpers.md
03-models.md
04-relays.md
05-loaders.md
06-event-factory.md
07-publishing.md
08-actions.md
```

# Files

## File: 00-introduction.md

```markdown
# Beginner's Tutorial

Welcome to the Applesauce tutorial! This step-by-step guide will teach you how to build reactive Nostr applications using the applesauce library ecosystem.

## What You'll Learn

By the end of this tutorial, you'll understand how to:

- Set up an in-memory reactive database for Nostr events
- Parse and display user profiles and content
- Create reactive UI components that respond to data changes
- Connect to Nostr relays and subscribe to events
- Create and publish new Nostr events

## Tutorial Structure

This tutorial is broken down into digestible sections:

1. **[Introduction to EventStore](./01-event-store.md)** - Learn about the reactive database at the heart of applesauce
2. **[Working with Helpers](./02-helpers.md)** - Parse profiles and extract data from events
3. **[Building Reactive UI with Models](./03-models.md)** - Create React components that respond to data changes
4. **[Connecting to Relays](./04-relays.md)** - Subscribe to Nostr relays and receive events
5. **[Loading Specific Events with Loaders](./05-loaders.md)** - Load specific events from relays
6. **[Creating Events with EventFactory](./06-event-factory.md)** - Set up event creation and signing
7. **[Publishing Events](./07-publishing.md)** - Publish events to relays and handle responses
8. **[Using Actions](./08-actions.md)** - Run complex actions like following users

## Prerequisites

- Basic knowledge of JavaScript/TypeScript
- Familiarity with React hooks (`useState`, `useEffect`)
- Understanding of RxJS observables (helpful but not required)
- A Nostr extension wallet (like [Alby](https://getalby.com/) or [nos2x](https://github.com/fiatjaf/nos2x))

## Getting Started

Let's begin with [Introduction to EventStore](./01-event-store.md) to learn about the foundation of applesauce applications.
```

## File: 01-event-store.md

````markdown
# 1. Introduction to EventStore

The `EventStore` is the heart of every applesauce application. Its a reactive in-memory database specifically designed for Nostr events. Instead of constantly fetching data from relays, your UI components subscribe to the EventStore and automatically update when new events arrive.

## What is the EventStore?

The EventStore is a reactive database that:

- **Stores events in memory** for fast access
- **Deduplicates events** automatically
- **Handles replaceable events** (like profiles) by keeping only the latest version
- **Notifies subscribers** when relevant events are added, updated, or removed
- **Works with RxJS observables** for reactive programming

## Creating an EventStore

Creating an EventStore is simple:

```typescript
import { EventStore } from 'applesauce-core';

// Create a single event store for your entire app
const eventStore = new EventStore();
```

> 💡 **Best Practice**: Create only one EventStore instance for your entire application and share it across components.

## Adding Events

You can add events to the store using the `add()` method:

```typescript
const event = {
	content: 'These numbers are so kind.',
	created_at: 1745847253,
	id: '621233a1ad1b91620f0b4a308c2113243a98925909cdb7b26284cbb4d835a18c',
	kind: 1,
	pubkey: '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
	sig: 'eb8f30f7c44d031bfe315d476165f5cf29c21f1eaf07128f5a673cdb3b69ebf7902dacc06987f8d764b17225aefecdbc91992165e03372e40f57639a41203a1c',
	tags: []
};

// Add the event to the store
eventStore.add(event);
```

The EventStore automatically:

- **Deduplicates** - Won't add the same event twice
- **Replaces** - Updates replaceable events (kind 0 profiles, kind 3 contacts, etc.) with newer versions
- **Notifies** - Triggers updates for any components subscribed to this event

## Checking for Events

You can check if events exist in the store:

```typescript
// Check if a specific event exists
const hasEvent = eventStore.hasEvent('abc123...');

// Check if a user has a profile
const hasProfile = eventStore.hasReplaceable(0, 'userPubkey');

// Get an event directly
const event = eventStore.getEvent('abc123...');

// Get a user's latest profile
const profile = eventStore.getReplaceable(0, 'userPubkey');
```

## Subscribing to Events

The real power of the EventStore comes from its reactive subscriptions. Here are the main subscription types:

### Single Event Subscription

```typescript
// Subscribe to a specific event
eventStore.event('abc123...').subscribe((event) => {
	if (event) {
		console.log('Event found:', event);
	} else {
		console.log('Event not in store or was deleted');
	}
});
```

### Replaceable Event Subscription

```typescript
// Subscribe to a user's profile (kind 0)
eventStore.replaceable(0, 'userPubkey').subscribe((profile) => {
	if (profile) {
		console.log('User profile:', profile);
	}
});
```

### Stream Subscription

```typescript
// Subscribe to all text notes as they're added
eventStore.stream({ kinds: [1] }).subscribe((event) => {
	console.log('New text note:', event);
});
```

### Timeline Subscription

```typescript
// Subscribe to a sorted timeline of text notes
eventStore.timeline({ kinds: [1] }).subscribe((events) => {
	console.log(`Timeline updated with ${events.length} notes`);
	// events is a sorted array (newest first)
});
```

## A Simple Example

Let's see how this works in practice:

```typescript
import { EventStore } from 'applesauce-core';

// Create the store
const eventStore = new EventStore();

// Subscribe to all text notes
eventStore.timeline({ kinds: [1] }).subscribe((timeline) => {
	console.log(`Timeline has ${timeline.length} notes`);
});

// Add some events
eventStore.add({
	content: 'I just wish LLMs would stop saying their solutions are "comprehensive" or "powerful"',
	created_at: 1749596768,
	id: '77941979d4c04283fd9b2f0a280749248cbd41babe3a0731c1597a6d54ae7874',
	kind: 1,
	pubkey: '97c70a44366a6535c145b333f973ea86dfdc2d7a99da618c40c64705ad98e322',
	sig: 'a0884549f09ef805d3ffa917c3d9e189882295f1b819c038e5d28ea1a668f4455f66ada40749dbdb6dfd48c323f507889330a2a4742b0cb66d8997afb31ff47e',
	tags: [
		[
			'client',
			'Coracle',
			'31990:97c70a44366a6535c145b333f973ea86dfdc2d7a99da618c40c64705ad98e322:1685968093690'
		]
	]
});

eventStore.add({
	content: 'These numbers are so kind.',
	created_at: 1745847253,
	id: '621233a1ad1b91620f0b4a308c2113243a98925909cdb7b26284cbb4d835a18c',
	kind: 1,
	pubkey: '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
	sig: 'eb8f30f7c44d031bfe315d476165f5cf29c21f1eaf07128f5a673cdb3b69ebf7902dacc06987f8d764b17225aefecdbc91992165e03372e40f57639a41203a1c',
	tags: []
});

// The timeline subscription will fire twice:
// First: "Timeline has 1 notes"
// Then: "Timeline has 2 notes"
```

## Key Concepts

- **Reactive**: Changes to the EventStore automatically update your UI
- **In-memory**: Events are stored in RAM for fast access (not persisted)
- **Deduplication**: The same event won't be added twice
- **Replaceable events**: Newer versions replace older ones automatically
- **Filters**: Use Nostr filters to subscribe to specific types of events

## Why Use EventStore?

Without EventStore, you'd need to:

- Manually track which events you've already received
- Handle event deduplication yourself
- Manually update UI components when new events arrive
- Deal with replaceable event logic

With EventStore, all of this is handled automatically, letting you focus on building your application logic.
````

## File: 02-helpers.md

````markdown
# 2. Using Helper Methods

Helper methods are the Swiss Army knife of applesauce. They extract useful information from raw Nostr events, making it easy to display user profiles, parse content, and work with different event types.

## What are Helpers?

Helpers are utility functions that:

- **Parse event content** - Extract structured data from JSON or text
- **Handle different event types** - Kind 0 profiles, kind 1 notes, kind 3 contacts, etc.
- **Provide fallbacks** - Return sensible defaults when data is missing
- **Validate data** - Ensure the extracted data is properly formatted

## Essential Profile Helpers

Let's start with the most commonly used helpers for working with user profiles.

### Getting Profile Content

The `getProfileContent` helper extracts and parses a user's profile from a kind 0 event:

```typescript
import { getProfileContent } from 'applesauce-core/helpers';

// A raw kind 0 profile event
const profileEvent = {
	content:
		'{"name":"fiatjaf","about":"~","picture":"https://fiatjaf.com/static/favicon.jpg","nip05":"_@fiatjaf.com","lud16":"fiatjaf@zbd.gg","website":"https://nostr.technology"}',
	created_at: 1738588530,
	id: 'c43be8b4634298e97dde3020a5e6aeec37d7f5a4b0259705f496e81a550c8f8b',
	kind: 0,
	pubkey: '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
	relays: [''],
	sig: '202a1bf6a58943d660c1891662dbdda142aa8e5bca9d4a3cb03cde816ad3bdda6f4ec3b880671506c2820285b32218a0afdec2d172de9694d83972190ab4f9da',
	tags: []
};

// Extract the profile content
const profile = getProfileContent(profileEvent);

console.log(profile);
// Output:
// {
//   name: "fiatjaf",
//   about: "~",
//   picture: "https://fiatjaf.com/static/favicon.jpg",
//   nip05: "_@fiatjaf.com",
//   lud16: "fiatjaf@zbd.gg",
//   website: "https://nostr.technology",
// }
```

If the profile content is invalid JSON or missing, `getProfileContent` returns `undefined` rather than throwing an error.

### Getting Display Names

The `getDisplayName` helper provides a user-friendly name with intelligent fallbacks:

```typescript
import { getDisplayName } from 'applesauce-core/helpers';

// Profile with a name
const profile1 = { name: 'Alice', display_name: 'Alice in Nostrland' };
console.log(getDisplayName(profile1)); // "Alice in Nostrland"

// Profile with only a name
const profile2 = { name: 'Bob' };
console.log(getDisplayName(profile2)); // "Bob"

// Profile with no name
const profile3 = { about: 'Just a user' };
console.log(getDisplayName(profile3)); // "Unknown"

// Can also pass a pubkey as fallback
console.log(getDisplayName(profile3, 'npub1...')); // "npub1..."
```

The helper checks for names in this order:

1. `display_name` field
2. `name` field
3. Provided fallback
4. "Unknown"

### Getting Profile Pictures

Similar to display names, `getProfilePicture` provides intelligent fallbacks for profile images:

```typescript
import { getProfilePicture } from 'applesauce-core/helpers';

// Profile with picture
const profile1 = { picture: 'https://example.com/alice.jpg' };
console.log(getProfilePicture(profile1)); // "https://example.com/alice.jpg"

// Profile without picture - provide fallback
const profile2 = { name: 'Bob' };
const fallbackUrl = 'https://robohash.org/bob.png';
console.log(getProfilePicture(profile2, fallbackUrl)); // "https://robohash.org/bob.png"
```

## Putting It Together: Profile Component

Let's create a React component that uses these helpers:

```tsx
import React from 'react';
import { getDisplayName, getProfilePicture } from 'applesauce-core/helpers';

function ProfileCard({ profile }: { profile: NostrEvent }) {
	// Get the profile content
	const content = getProfileContent(profile);

	// Get display name with pubkey fallback
	const displayName = getDisplayName(content, profile.pubkey.slice(0, 8) + '...');

	// Get profile picture with robohash fallback
	const profilePicture = getProfilePicture(content, `https://robohash.org/${profile.pubkey}.png`);

	return (
		<div className="profile-card">
			<img src={profilePicture} alt={displayName} className="profile-avatar" />
			<h3>{displayName}</h3>
			{content?.about && <p>{content.about}</p>}
		</div>
	);
}
```

## Other Useful Helpers

There are many more helpers available. Checkout the [typedocs](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-core.Helpers.html#addrelayhintstopointer) to see all the helpers.

Here are some commonly used ones:

### Content Helpers

```typescript
import {
	getArticleTitle,
	getArticleSummary,
	getHashtags,
	getMentions
} from 'applesauce-core/helpers';

// Extract article title from long-form content (kind 30023)
const title = getArticleTitle(articleEvent);

// Get the users in a NIP-51 user list
const people = getEventPointersFromList(listEvent); // [{pubkey: "pubkey1"}, {pubkey: "pubkey2"}]

// Get outbox relays from a kind 10002 relay list event
const outboxes = getOutboxes(relayListEvent);
// ["wss://relay1.com", "wss://relay2.com"]

// Get inbox relays
const inboxes = getInboxes(relayListEvent);
// ["wss://inbox1.com", "wss://inbox2.com"]
```

## Key Concepts

- **Helpers parse raw events** into usable data
- **Fallbacks** prevent your UI from breaking
- **Composable** - combine helpers with EventStore subscriptions
- **Type-safe** - TypeScript definitions help catch errors

## Real-World Example

Here's a complete example showing helpers in action:

```typescript
import { EventStore } from 'applesauce-core';
import { getProfileContent, getDisplayName, getProfilePicture } from 'applesauce-core/helpers';

const eventStore = new EventStore();

function displayUserInfo(pubkey: string) {
	// Get the user's profile from the store
	const profileEvent = eventStore.getReplaceable(0, pubkey);

	if (profileEvent) {
		const profile = getProfileContent(profileEvent);
		const name = getDisplayName(profile, pubkey.slice(0, 8) + '...');
		const picture = getProfilePicture(profile, `https://robohash.org/${pubkey}.png`);

		console.log(`Name: ${name}`);
		console.log(`Picture: ${picture}`);
		console.log(`About: ${profile?.about || 'No bio available'}`);
	} else {
		console.log('Profile not found in store');
	}
}
```
````

## File: 03-models.md

````markdown
# 3. Building Reactive UI with Models

Models are pre-built subscriptions that combine the EventStore with helpers to provide computed state. Instead of manually subscribing to events and parsing them, models give you clean, reactive data that automatically updates when relevant events change.

## What are Models?

Models are functions that:

- **Combine EventStore subscriptions with helpers** - No manual parsing needed
- **Provide computed state** - Transform raw events into useful data structures
- **Cache results** - Same model with same parameters reuses the same observable
- **Handle complex logic** - Like loading missing data or combining multiple event types
- **Return RxJS observables** - Can be subscribed to or used with operators

## Using Models with EventStore

The `eventStore.model()` method is how you create and subscribe to models:

```typescript
import { ProfileModel } from 'applesauce-core/models';

// Create a model subscription
const profileSubscription = eventStore
	.model(ProfileModel, '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d')
	.subscribe((profile) => {
		if (profile) {
			console.log('Profile:', profile);
			// Profile is already parsed and ready to use
			console.log('Name:', profile.name);
			console.log('About:', profile.about);
		} else {
			console.log('Profile not found');
		}
	});

// Don't forget to unsubscribe when done
// profileSubscription.unsubscribe();
```

## ProfileModel Example

The `ProfileModel` automatically handles profile events (kind 0) and parses their content:

```typescript
import { EventStore } from 'applesauce-core';
import { ProfileModel } from 'applesauce-core/models';

const eventStore = new EventStore();
const pubkey = '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d';

// Subscribe to profile updates
eventStore.model(ProfileModel, pubkey).subscribe((profile) => {
	if (profile) {
		console.log('User profile updated:');
		console.log('- Name:', profile.name || 'No name');
		console.log('- About:', profile.about || 'No bio');
		console.log('- Picture:', profile.picture || 'No picture');
		console.log('- Website:', profile.website || 'No website');
	}
});

// Add a profile event to see the model in action
eventStore.add({
	content:
		'{"name":"fiatjaf","about":"~","picture":"https://fiatjaf.com/static/favicon.jpg","nip05":"_@fiatjaf.com","lud16":"fiatjaf@zbd.gg","website":"https://nostr.technology"}',
	created_at: 1738588530,
	id: 'c43be8b4634298e97dde3020a5e6aeec37d7f5a4b0259705f496e81a550c8f8b',
	kind: 0,
	pubkey: '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
	relays: [''],
	sig: '202a1bf6a58943d660c1891662dbdda142aa8e5bca9d4a3cb03cde816ad3bdda6f4ec3b880671506c2820285b32218a0afdec2d172de9694d83972190ab4f9da',
	tags: []
});

// The subscription will fire with the parsed profile data
```

## TimelineModel Example

The `TimelineModel` provides a sorted, reactive timeline of events:

```typescript
import { TimelineModel } from 'applesauce-core/models';

// Subscribe to all text notes (kind 1)
eventStore.model(TimelineModel, { kinds: [1] }).subscribe((timeline) => {
	console.log(`Timeline updated: ${timeline.length} notes`);

	timeline.forEach((note, index) => {
		console.log(`${index + 1}. ${note.content.slice(0, 50)}...`);
		console.log(`   By: ${note.pubkey.slice(0, 8)}`);
		console.log(`   At: ${new Date(note.created_at * 1000).toLocaleString()}`);
	});
});

// Add some notes to see the timeline update
eventStore.add({
	content: 'I just wish LLMs would stop saying their solutions are "comprehensive" or "powerful"',
	created_at: 1749596768,
	id: '77941979d4c04283fd9b2f0a280749248cbd41babe3a0731c1597a6d54ae7874',
	kind: 1,
	pubkey: '97c70a44366a6535c145b333f973ea86dfdc2d7a99da618c40c64705ad98e322',
	sig: 'a0884549f09ef805d3ffa917c3d9e189882295f1b819c038e5d28ea1a668f4455f66ada40749dbdb6dfd48c323f507889330a2a4742b0cb66d8997afb31ff47e',
	tags: [
		[
			'client',
			'Coracle',
			'31990:97c70a44366a6535c145b333f973ea86dfdc2d7a99da618c40c64705ad98e322:1685968093690'
		]
	]
});

eventStore.add({
	content: 'These numbers are so kind.',
	created_at: 1745847253,
	id: '621233a1ad1b91620f0b4a308c2113243a98925909cdb7b26284cbb4d835a18c',
	kind: 1,
	pubkey: '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
	sig: 'eb8f30f7c44d031bfe315d476165f5cf29c21f1eaf07128f5a673cdb3b69ebf7902dacc06987f8d764b17225aefecdbc91992165e03372e40f57639a41203a1c',
	tags: []
});

// Timeline will update twice, showing 1 note then 2 notes
```

## Model Caching

Models with the same parameters are cached and reused:

```typescript
// These two subscriptions share the same underlying model
const subscription1 = eventStore
	.model(ProfileModel, '621233a1ad1b91620f0b4a308c2113243a98925909cdb7b26284cbb4d835a18c')
	.subscribe(console.log);
const subscription2 = eventStore
	.model(ProfileModel, '621233a1ad1b91620f0b4a308c2113243a98925909cdb7b26284cbb4d835a18c')
	.subscribe(console.log);

// Both subscriptions will receive the same data
// Only one actual subscription is created internally

// Always unsubscribe when done
subscription1.unsubscribe();
subscription2.unsubscribe();
```

## Combining Models with RxJS Operators

Since models return RxJS observables, you can use operators to transform the data:

```typescript
import { map, filter } from 'rxjs/operators';

// Only get profiles that have names
eventStore
	.model(ProfileModel, pubkey)
	.pipe(
		filter((profile) => profile && profile.name),
		map((profile) => profile.name.toUpperCase())
	)
	.subscribe((name) => {
		console.log('Profile name in caps:', name);
	});

// Get timeline length
eventStore
	.model(TimelineModel, { kinds: [1] })
	.pipe(map((timeline) => timeline.length))
	.subscribe((count) => {
		console.log('Timeline has', count, 'notes');
	});
```

## Other Useful Models

### MailboxesModel

Gets a user's inbox and outbox relays from their relay list (kind 10002):

```typescript
import { MailboxesModel } from 'applesauce-core/models';

eventStore.model(MailboxesModel, pubkey).subscribe((mailboxes) => {
	if (mailboxes) {
		console.log('Outbox relays:', mailboxes.outboxes);
		console.log('Inbox relays:', mailboxes.inboxes);
	}
});
```

### RepliesModel

Gets all replies to a specific event:

```typescript
import { RepliesModel } from 'applesauce-core/models';

const noteId = 'abc123...';

eventStore.model(RepliesModel, noteId).subscribe((replies) => {
	console.log(`Found ${replies.length} replies to note ${noteId}`);

	replies.forEach((reply) => {
		console.log(`- ${reply.content.slice(0, 50)}...`);
	});
});
```

### ContactsModel

Gets a user's contact list (kind 3):

```typescript
import { ContactsModel } from 'applesauce-core/models';

eventStore.model(ContactsModel, pubkey).subscribe((contacts) => {
	if (contacts) {
		console.log('Following', contacts.length, 'people:');
		contacts.forEach((contact) => {
			console.log(`- ${contact.pubkey.slice(0, 8)}`);
		});
	}
});
```

## Working with Multiple Models

You can combine multiple models using the `combineLatest` operator from RxJS to build complex views:

```typescript
import { combineLatest } from 'rxjs';

const pubkey = '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d';

// Combine profile and timeline data
combineLatest([
	eventStore.model(ProfileModel, pubkey),
	eventStore.model(TimelineModel, { kinds: [1], authors: [pubkey] })
]).subscribe(([profile, timeline]) => {
	const name = profile?.name || 'Unknown';
	const noteCount = timeline.length;

	console.log(`${name} has posted ${noteCount} notes`);
});
```

## Missing Event Handling

Models handle missing events gracefully and typically return `undefined` when events aren't available:

```typescript
eventStore.model(ProfileModel, 'nonexistent-pubkey').subscribe((profile) => {
	if (profile === undefined) {
		console.log('Profile not found or still loading');
	} else {
		console.log('Profile loaded:', profile);
	}
});
```

## Model Performance

Models are designed for performance:

- **Cached** - Models with the same parameters are reused
- **Lazy** - Only created when subscribed to
- **Efficient** - Use internal EventStore subscriptions
- **Memory-safe** - Automatically cleaned up when no subscribers

```typescript
// This is efficient - only one ProfileModel created
const model = eventStore.model(ProfileModel, pubkey);

const sub1 = model.subscribe(handleProfile1);
const sub2 = model.subscribe(handleProfile2);
const sub3 = model.subscribe(handleProfile3);

// Clean up all subscriptions
sub1.unsubscribe();
sub2.unsubscribe();
sub3.unsubscribe();
```

## Key Concepts

- **Models transform raw events** into useful data structures
- **Use `eventStore.model()`** to create model subscriptions
- **Models return observables** - can be used with RxJS operators
- **Models handle parsing** - no need to use helper methods manually
- **Models are reactive** - automatically update when events change

## Example: React user profile

For React applications, you can use the `useObservableMemo` hook from `applesauce-react` to easily integrate models:

```tsx
import React from 'react';
import { useObservableMemo } from 'applesauce-react/hooks';
import { ProfileModel, TimelineModel } from 'applesauce-core/models';
import { getDisplayName, getProfilePicture } from 'applesauce-core/helpers';

function UserProfile({ pubkey }: { pubkey: string }) {
	// Create a new model for the user's profile and subscribe to it
	const profile = useObservableMemo(() => eventStore.model(ProfileModel, pubkey), [pubkey]);

	// Create a new model for the user's notes and subscribe to it
	const timeline = useObservableMemo(
		() => eventStore.model(TimelineModel, { kinds: [1], authors: [pubkey] }),
		[pubkey]
	);

	const displayName = getDisplayName(profile, pubkey.slice(0, 8) + '...');
	const avatar = getProfilePicture(profile, `https://robohash.org/${pubkey}.png`);

	return (
		<div className="user-profile">
			<header>
				<img src={avatar} alt={displayName} />
				<h1>{displayName}</h1>
				{profile?.about && <p>{profile.about}</p>}
			</header>

			<main>
				<h2>Notes ({timeline?.length || 0})</h2>
				{timeline?.map((note) => (
					<article key={note.id}>
						<p>{note.content}</p>
						<time>{new Date(note.created_at * 1000).toLocaleString()}</time>
					</article>
				))}
			</main>
		</div>
	);
}
```
````

## File: 04-relays.md

````markdown
# 4. Connecting to Relays

The `RelayPool` class is your gateway to the Nostr network. It manages connections to multiple relays and provides a reactive interface for subscribing to events and publishing. Let's learn how to connect to relays and feed real events into your EventStore.

## What is RelayPool?

RelayPool is a connection manager that:

- **Manages WebSocket connections** to multiple Nostr relays
- **Handles reconnection** automatically when connections drop
- **Provides subscription methods** that return RxJS observables
- **Deduplicates subscriptions** across multiple relays
- **Handles relay-specific logic** like authentication and rate limiting

## Creating a RelayPool

```typescript
import { RelayPool } from 'applesauce-relay';

// Create a relay pool
const pool = new RelayPool();
```

> 💡 **Best Practice**: Create one RelayPool instance for your entire application, just like EventStore.

## Basic Relay Subscription

Here's how to subscribe to events from a single relay:

```typescript
import { RelayPool, onlyEvents } from 'applesauce-relay';
import { EventStore, mapEventsToStore } from 'applesauce-core';

const pool = new RelayPool();
const eventStore = new EventStore();

// Subscribe to text notes from a specific relay
pool
	.relay('wss://relay.damus.io')
	.subscription({ kinds: [1], limit: 20 })
	.pipe(
		// Filter out non-event messages (EOSE, NOTICE, etc.)
		onlyEvents(),
		// Add events to the EventStore (deduplicates automatically)
		mapEventsToStore(eventStore)
	)
	.subscribe((event) => {
		console.log('New event added to store:', event.id);
	});
```

## Multiple Relays

The relay pool also provides a `subscription` method that can take an array of relays and opens the same subscription on all relays.

```typescript
const relays = ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.nostr.band'];

// Subscribe to all relays simultaneously
pool
	.subscription(relays, { kinds: [1], limit: 20 })
	.pipe(onlyEvents(), mapEventsToStore(eventStore))
	.subscribe((event) => {
		console.log(event);
	});
```

## Duplicate Event Handling

The relay pool will return all events from all relays. this means that you get some duplicate events. to solve this you can use the `mapEventsToStore` operator.

```typescript
const eventStore = new EventStore();
const relays = ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.nostr.band'];

pool
	.subscription(relays, { kinds: [1], limit: 20 })
	.pipe(onlyEvents(), mapEventsToStore(eventStore))
	.subscribe((event) => {
		console.log(event);
		// Only logs unique events
	});
```

## Handling Relay Responses

RelayPool subscriptions will emit events and the `"EOSE"` message when the relay has sent all events. Use the `onlyEvents()` operator to ignore the `"EOSE"` message:

```typescript
pool
	.relay('wss://relay.damus.io')
	.subscription({ kinds: [1] })
	.subscribe((message) => {
		console.log(message);
		// Logs: [event1, event2, event3, "EOSE"]
	});

// vs with onlyEvents()

pool
	.relay('wss://relay.damus.io')
	.subscription({ kinds: [1] })
	.pipe(onlyEvents())
	.subscribe((event) => {
		console.log('Event only:', event);
		// Logs: [event1, event2, event3]
	});
```

## Error Handling

The returned observable will error if the relay connection fails. make sure to handle errors gracefully.

```typescript
pool
	.relay('wss://relay.damus.io')
	.subscription({ kinds: [1] })
	.pipe(onlyEvents())
	.subscribe({
		next: (event) => {
			// Handle successful event
			eventStore.add(event);
		},
		error: (error) => {
			console.error('Relay subscription error:', error);
			// Maybe try connecting to a different relay
		}
	});
```

## Key Concepts

- **RelayPool manages connections** to multiple Nostr relays
- **Use onlyEvents()** to filter subscription messages
- **mapEventsToStore()** automatically adds events to EventStore
- **Subscriptions are reactive** - they automatically update your UI
- **Handle errors gracefully** - relay connections can fail
- **Deduplicate across relays** - same event from multiple relays is only added once

## Common Patterns

### Auto-reconnecting Timeline

```typescript
function createAutoReconnectingSubscription(relayUrl: string) {
	return pool
		.relay(relayUrl)
		.subscription({ kinds: [1], limit: 100 })
		.pipe(
			onlyEvents(),
			mapEventsToStore(eventStore),
			// Retry on error
			retry({ count: 3, delay: 1000 })
		);
}
```

## Example: React Timeline

Here's a complete react example using the RelayPool and EventStore to display a live timeline:

```tsx
import React, { useEffect } from 'react';
import { RelayPool, onlyEvents } from 'applesauce-relay';
import { EventStore, mapEventsToStore, mapEventsToTimeline } from 'applesauce-core';
import { ProfileModel, TimelineModel } from 'applesauce-core/models';
import { getDisplayName, getProfilePicture } from 'applesauce-core/helpers';
import { useObservableMemo } from 'applesauce-react/hooks';

// Create global instances
const eventStore = new EventStore();
const pool = new RelayPool();

function NoteCard({ note }: { note: any }) {
	const profile = useObservableMemo(
		() => eventStore.model(ProfileModel, note.pubkey),
		[note.pubkey]
	);

	const name = getDisplayName(profile, note.pubkey.slice(0, 8) + '...');
	const avatar = getProfilePicture(profile, `https://robohash.org/${note.pubkey}.png`);

	return (
		<div className="note-card">
			<div className="note-header">
				<img src={avatar} alt={name} className="avatar" />
				<strong>{name}</strong>
				<span>{new Date(note.created_at * 1000).toLocaleString()}</span>
			</div>
			<p>{note.content}</p>
		</div>
	);
}

function LiveFeed() {
	// This timeline will automatically update as new events arrive
	const timeline = useObservableMemo(() => eventStore.model(TimelineModel, { kinds: [1] }), []);

	return (
		<div className="feed">
			<h2>Latest Notes ({timeline?.length || 0})</h2>
			{timeline?.map((note) => (
				<NoteCard key={note.id} note={note} />
			))}
		</div>
	);
}

function App() {
	useEffect(() => {
		// Start subscription when component mounts
		const subscription = pool
			.relay('wss://relay.damus.io')
			.subscription({ kinds: [1], limit: 50 })
			.pipe(
				// Filter out non-event messages (EOSE, NOTICE, etc.)
				onlyEvents(),
				// Add events to the EventStore and deduplicate them
				mapEventsToStore(eventStore)
			)
			.subscribe({
				next: (event) => console.log('Added event:', event.id),
				error: (err) => console.error('Relay error:', err),
				complete: () => console.log('Subscription complete')
			});

		// Cleanup subscription on unmount
		return () => subscription.unsubscribe();
	}, []);

	return (
		<div className="app">
			<h1>Live Nostr Feed</h1>
			<LiveFeed />
		</div>
	);
}

export default App;
```
````

## File: 05-loaders.md

````markdown
# 5. Loading Specific Events with Loaders

Loaders are specialized utilities that help you fetch specific events from relays efficiently. While RelayPool subscriptions are great for real-time feeds, loaders are perfect for loading individual events, user profiles, or addressable events on-demand.

## What are Loaders?

Loaders are functions that:

- **Use the relay pool** to fetch events from multiple relays
- **Load specific events** by ID, address, or other criteria
- **Handle multiple relays** automatically for better reliability
- **Return observables** that complete when the request is complete
- **Integrate with EventStore** to automatically store loaded events

## Event Loader

The `createEventLoader` function creates a loader for fetching events by their IDs.

### Setting up Event Loader

```typescript
import { createEventLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';
import { EventStore } from 'applesauce-core';

const pool = new RelayPool();
const eventStore = new EventStore();

// Create an event loader
const eventLoader = createEventLoader(pool, {
	// Add events to the EventStore and deduplicate them
	eventStore,
	// Always check these relays for events
	extraRelays: ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.nostr.band']
});
```

### Loading Events by ID

```typescript
// Make a request and subscribe to the result
eventLoader({
	id: '621233a1ad1b91620f0b4a308c2113243a98925909cdb7b26284cbb4d835a18c',
	relays: ['wss://relay.damus.io']
}).subscribe((event) => {
	console.log('Loaded event:', event.id);
	console.log('Content:', event.content);
	// Event is automatically added to EventStore
});
```

### Loading Multiple Events

Since the event loader returns an observable, you can use the `merge` operator from RxJS to make multiple requests at once.

```typescript
// Make two requests at once and subscribe to the results
merge(
	eventLoader({ id: '621233a1ad1b91620f0b4a308c2113243a98925909cdb7b26284cbb4d835a18c' }),
	eventLoader({ id: '77941979d4c04283fd9b2f0a280749248cbd41babe3a0731c1597a6d54ae7874' })
).subscribe({
	next: (event) => {
		console.log('Loaded event:', event.id);
	},
	complete: () => {
		console.log('Both requested completed');
	}
});
```

## Address Loader

The `createAddressLoader` function creates a loader for fetching addressable events (kinds 30000-39999) by their `kind`, `pubkey` and optional `identifier`.

### Setting up Address Loader

```typescript
import { createAddressLoader } from 'applesauce-loaders/loaders';

// Create an address loader
const addressLoader = createAddressLoader(pool, { eventStore });
```

### Loading Addressable Events

```typescript
// Load a specific addressable event
const pointer = {
	kind: 30023, // Long-form content
	pubkey: '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
	identifier: 'my-article',
	relays: ['wss://relay.damus.io', 'wss://nos.lol']
};

// Create the request and subscribe to the result
addressLoader(pointer).subscribe((event) => {
	console.log('Loaded article:', event.id);
	console.log('Title:', getArticleTitle(event));
});
```

### Loading Multiple

Again, same as the event loader. the address loader returns an observable, so you can use the `merge` operator from RxJS to make multiple requests at once.

```typescript
// Make two requests at once and subscribe to the results
merge(
	addressLoader({ kind: 30023, pubkey: 'pubkey1', identifier: 'article-1' }),
	addressLoader({ kind: 30023, pubkey: 'pubkey2', identifier: 'article-2' })
).subscribe({
	next: (event) => {
		console.log('Loaded addressable event:', event.id);
	},
	complete: () => {
		console.log('All addressable events loaded');
	}
});
```

## Practical Examples

### Loading a User's Profile

```typescript
const addressLoader = createAddressLoader(pool, { eventStore });

function loadUserProfile(pubkey: string, relays: string[]) {
	return addressLoader({ kind: 0, pubkey, relays }).pipe(
		// Take only the first (most recent) profile
		take(1),
		map((event) => getProfileContent(event))
	);
}

// Usage
loadUserProfile(
	// Pass pubkey
	'3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
	// And the relays to load from
	['wss://relay.damus.io', 'wss://nos.lol']
).subscribe((profile) => {
	if (profile) {
		console.log('Profile loaded:', profile.name);
	}
});
```

## Loader Configuration

### Custom Relays

The event loader and address loader both take an `extraRelays` option. This is an array of relays that will always be checked for events.

```typescript
const addressLoader = createEventLoader(pool, {
	eventStore,
	extraRelays: ['wss://relay.damus.io', 'wss://nos.lol']
});
const articleLoader = createAddressLoader(pool, {
	eventStore,
	extraRelays: ['wss://relay.nostr.band', 'wss://relay.damus.io']
});
```

### Timeout Configuration

The event loader and address loader both take a `timeout` option which can be used to configure the timeout for the requests.

```typescript
// Create loader with custom timeout
const eventLoader = createEventLoader(pool, {
	eventStore,
	extraRelays: ['wss://relay.damus.io'],
	timeout: 10000 // 10 second timeout
});
```

### Cache Configuration

The event loader and address loader both take a `cacheRequest` option which is used to load events from a local cache first.

```typescript
// A method to load events from a local cache
async function cacheRequest(filters: Filter[]) {
	// Make a request to your custom local cache
	const events = await localCache.getEventsForFilters(filters);

	// Return the events as an array of events
	return events;
}

// Create the loader with the cache request option
const eventLoader = createEventLoader(pool, { eventStore, cacheRequest });
```

## Key Concepts

- **Loaders fetch specific events** on-demand, unlike subscriptions
- **Results are added to the EventStore** automatically
- **Observables complete** when the request is complete

## Best Practices

### 1. Check EventStore First

```typescript
// Always check if the event is already loaded
const existingEvent = eventStore.getEvent(eventId);
if (existingEvent) {
	// Use existing event
	console.log('Event already loaded:', existingEvent.content);
} else {
	// Load from relays
	eventLoader({ ids: [eventId] }).subscribe(/* ... */);
}
```

### 2. Use Relays in requests

Its better to pass the relays to the request than to use the `extraRelays` option.

```typescript
// Use multiple relays for better reliability
const eventLoader = createEventLoader(pool, { eventStore });

eventLoader({ id: eventId, relays: ['wss://relay.damus.io', 'wss://nos.lol'] }).subscribe(
	(event) => {
		console.log('Loaded event:', event.id);
	}
);
```
````

## File: 06-event-factory.md

````markdown
# 6. Creating Events with EventFactory

The `EventFactory` class is your tool for creating, signing, and modifying Nostr events. It provides a clean API with pre-built blueprints for common event types and handles the complexities of event creation for you.

## What is the EventFactory?

The `EventFactory` is a builder that:

- **Creates events using blueprints** - Pre-built templates for common event types
- **Handles signing** - Integrates with signers to sign events
- **Manages metadata** - Automatically adds client tags, relay hints, etc.
- **Provides operations** - Composable functions to modify events
- **Ensures validity** - Creates properly formatted Nostr events

## Setting up the EventFactory

First, you'll need a signer. For browser apps, the `ExtensionSigner` works with Nostr browser extensions:

```typescript
import { EventFactory } from 'applesauce-factory';
import { ExtensionSigner } from 'applesauce-signers';

// Create a signer that uses the browser extension (like Alby or nos2x)
const signer = new ExtensionSigner();

// Create the event factory with the signer
const factory = new EventFactory({
	signer,
	// Optional: Add client information to events
	client: {
		name: 'My Nostr App',
		address: { identifier: 'my-app', pubkey: 'app-pubkey' }
	}
});
```

> 💡 **Best Practice**: Create one `EventFactory` instance at the top level of your app and pass it down or use a context.

## Creating a Text Note

Let's create a simple text note using the `NoteBlueprint`:

```typescript
import { NoteBlueprint } from 'applesauce-factory/blueprints';

async function createNote() {
	try {
		// Use the NoteBlueprint to create a draft event
		const draft = await factory.create(
			NoteBlueprint,
			'Hello Nostr! This is my first note. #introductions'
		);

		// Sign the draft event with the signer
		const signed = await factory.sign(draft);

		console.log('Created note:', signed);
		return signed;
	} catch (error) {
		console.error('Failed to create note:', error);
	}
}
```

## Different Event Types with Blueprints

EventFactory comes with blueprints for many common event types:

### Text Note with Hashtags

The `NoteBlueprint` is setup to automatically handle hashtags and mentions.

```typescript
import { NoteBlueprint } from 'applesauce-factory/blueprints';

// Simple note
const hashtagsNote = await factory.create(
	NoteBlueprint,
	'Just posted my first note! #introductions'
);
console.log(hashtagsNote.tags);
// Output: [["t", "introductions"]]

// Note with hashtags (automatically parsed)
const mentionsNote = await factory.create(
	NoteBlueprint,
	'GM nostr:npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6'
);
console.log(mentionsNote.tags);
// Output: [["p", "3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d"]]
```

### Reply to Another Note

The `NoteReplyBlueprint` can be used to create a reply event to another kind 1 note.

```typescript
import { NoteReplyBlueprint } from 'applesauce-factory/blueprints';

// Reply to an existing note
const originalNote = {
	/* some note event */
};

const reply = await factory.create(
	NoteReplyBlueprint,
	originalNote,
	'Great point! I totally disagree.'
);
```

### Reaction (Like)

The `ReactionBlueprint` can be used to create a reaction event to any nostr event.

```typescript
import { ReactionBlueprint } from 'applesauce-factory/blueprints';

// React to a note with a like
const reaction = await factory.create(ReactionBlueprint, originalNote, '+');

// React with a heart
const heartReaction = await factory.create(ReactionBlueprint, originalNote, '❤️');
```

### Repost/Share

The `ShareBlueprint` can be used to create a repost/share event of any nostr event.

```typescript
import { ShareBlueprint } from 'applesauce-factory/blueprints';

// Share/repost a note
const repost = await factory.create(ShareBlueprint, originalNote);
```

## Custom Event Creation

For more complex events, you can use the `build()` method with [operations](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-factory.Operations.EventOperations.html):

```typescript
import { setContent, includeHashtags, includeAltTag } from 'applesauce-factory/operations';

// Build a custom note with specific operations
const customNote = await factory.build(
	{ kind: 1 }, // Start with a kind 1 note
	setContent('Check out this amazing project!'),
	includeHashtags(['nostr', 'project']),
	includeAltTag('A short text note')
);

const signed = await factory.sign(customNote);
```

## Error Handling Best Practices

Any step in the event creation process can fail. You should handle these errors gracefully.

```typescript
async function createNoteWithErrorHandling(content: string) {
	try {
		// Try to create the note
		const draft = await factory.create(NoteBlueprint, content);
		const signed = await factory.sign(draft);

		return signed;
	} catch (error) {
		console.error('Failed to create note:', error);
		return null;
	}
}
```

## Key Concepts

- **EventFactory creates events** using blueprints and operations
- **Signers handle cryptography** - you don't need to manage keys directly
- **Blueprints are templates** for common event types
- **Always sign events** before using them or publishing them
- **Handle errors gracefully** - users might cancel signing or
- **Add events to EventStore** to see them in your UI
````

## File: 07-publishing.md

````markdown
# 7. Publishing Events

The final step in building a Nostr app is publishing your events to relays so other users can see them. The `RelayPool` provides methods for publishing events and handling the responses from relays.

## What is Publishing?

Publishing is the process of:

- **Sending signed events to relays** - Broadcasting your content to the network
- **Handling relay responses** - Success, errors, or rejection messages
- **Managing multiple relays** - Publishing to several relays for redundancy
- **Providing user feedback** - Showing publication status to users

## Basic Event Publishing

Here's how to publish a single event to a relay using the `pool.relay` method to select a single relay and the `publish` method to publish the event.

```typescript
const pool = new RelayPool();

const event: NostrEvent = {
	// ...signed nostr event
};

try {
	const response = await pool.relay('wss://relay.damus.io').publish(event);
	if (response.ok) {
		console.log(`Event published successfully to ${response.from}`);
	} else {
		console.log(`Failed to publish event to ${response.from}: ${response.message}`);
	}
} catch (error) {
	console.error('Error publishing event:', error);
}
```

:::info
The `publish` method now returns a `Promise<PublishResponse>` directly, so you can use `await` or `.then()` instead of subscribing to an Observable.
:::

## Publishing to Multiple Relays

For better reach and redundancy the `pool.publish` method can be used with multiple relays.

```typescript
const relays = ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.nostr.band'];
const event: NostrEvent = {
	// ...signed nostr event
};

try {
	const responses = await pool.publish(relays, event);
	responses.forEach((response) => {
		if (response.ok) {
			console.log(`Event published successfully to ${response.from}`);
		} else {
			console.log(`Failed to publish event to ${response.from}: ${response.message}`);
		}
	});
} catch (error) {
	console.error('Error publishing to relays:', error);
}
```

## Adding Events to the EventStore

Once the event is published to relays, its good to add it to the event store so your UI can see it without needing to load it from the relay again.

```typescript
try {
	const response = await pool.relay('wss://relay.damus.io').publish(event);
	if (response.ok) {
		eventStore.add(event);
	}
} catch (error) {
	console.error('Error publishing event:', error);
}
```

## Using with .then() instead of async/await

If you prefer using `.then()` instead of async/await:

```typescript
pool
	.relay('wss://relay.damus.io')
	.publish(event)
	.then((response) => {
		if (response.ok) {
			console.log(`Event published successfully to ${response.from}`);
			eventStore.add(event);
		} else {
			console.log(`Failed to publish event to ${response.from}: ${response.message}`);
		}
	})
	.catch((error) => {
		console.error('Error publishing event:', error);
	});
```

## Key Concepts

- **Publishing sends events to relays** so others can see them
- **Handle relay responses** - success, errors, or rejections
- **Publish to multiple relays** for better reach and redundancy
- **Add published events to EventStore** to see them in your UI
- **Provide user feedback** about publishing status
- **Handle errors gracefully** with try/catch or .catch()

## Best Practices

1. **Always publish to multiple relays** for redundancy
2. **Handle rate limiting** with delays and retries
3. **Provide clear user feedback** about publishing status
4. **Add published events to EventStore** after successful publish
5. **Don't spam relays** - use reasonable delays between publishes
6. **Use try/catch blocks** to handle errors gracefully
````

## File: 08-actions.md

````markdown
# 8. Running Actions with ActionHub

The `ActionHub` is the central orchestrator for running actions in your Nostr application. It combines your EventStore, EventFactory, and publishing logic into a unified interface, making it simple to execute complex actions that read from your local data and publish new events to the network.

## What is ActionHub?

ActionHub is a class that:

- **Executes pre-built actions** - Like following users, creating contact lists, etc.
- **Handles event creation and publishing** - Automatically creates, signs, and publishes events
- **Provides error handling** - Gracefully handles validation and publishing errors
- **Offers flexible execution modes** - Automatic publishing or manual control

## Setting up ActionHub

### Basic Setup

To create an ActionHub, you need your `EventStore` and `EventFactory` instances:

```typescript
import { ActionHub } from 'applesauce-actions';
import { EventStore } from 'applesauce-core';
import { EventFactory } from 'applesauce-factory';
import { ExtensionSigner } from 'applesauce-factory/signers';

// Your existing instances
const eventStore = new EventStore();
const signer = new ExtensionSigner();
const eventFactory = new EventFactory({ signer });

// Create ActionHub without automatic publishing
const actionHub = new ActionHub(eventStore, eventFactory);
```

### With Custom Publishing Logic

For most applications, you'll want to provide a publish method that handles how events are sent to relays:

```typescript
import { RelayPool } from 'applesauce-relay';
import { NostrEvent } from 'nostr-tools';

const pool = new RelayPool();
const defaultRelays = ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.nostr.band'];

// Create a custom publish function
function publish(event: NostrEvent) {
	return pool.publish(event, defaultRelays);
}

// Create ActionHub with automatic publishing
const actionHub = new ActionHub(eventStore, eventFactory, publish);
```

## Running Actions

### Using `hub.run()` - Automatic Publishing

The `hub.run()` method executes an action and automatically publishes all generated events:

```typescript
import { FollowUser, UnfollowUser, NewContacts } from 'applesauce-actions/actions';

// Create a new contact list (if one doesn't exist)
try {
	await actionHub.run(NewContacts);
	console.log('Contact list created successfully');
} catch (error) {
	if (error.message.includes('contact list already exists')) {
		console.log('User already has a contact list');
	} else {
		console.error('Failed to create contact list:', error);
	}
}

// Follow a user - events are automatically published
const userToFollow = '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d';
const relayHint = 'wss://relay.damus.io';

try {
	await actionHub.run(FollowUser, userToFollow, relayHint);
	console.log('Successfully followed user');
} catch (error) {
	console.error('Failed to follow user:', error);
}

// Unfollow a user
try {
	await actionHub.run(UnfollowUser, userToFollow);
	console.log('Successfully unfollowed user');
} catch (error) {
	console.error('Failed to unfollow user:', error);
}
```

### Using `hub.exec()` for Manual Control

For more control over event handling, you can use `hub.exec()` which returns an observable:

```typescript
import { tap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

// Execute action with manual event handling
actionHub.exec(FollowUser, userPubkey, relayHint).subscribe({
	next: async (event) => {
		try {
			// Custom publishing logic for this specific action
			await customPublish(event);
			console.log('Event published successfully');
		} catch (error) {
			console.error('Failed to publish event:', error);
		}
	},
	error: (error) => {
		console.error('Action failed:', error);
	},
	complete: () => {
		console.log('Action completed');
	}
});
```

## Available Actions

There are a lot of pre-built [actions](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-actions.Actions.html), but here are a few common ones that are worth mentioning.

### Contact List Actions

```typescript
import { NewContacts, FollowUser, UnfollowUser } from 'applesauce-actions/actions';

// Create a new contact list
await actionHub.run(NewContacts);

// Follow a user
await actionHub.run(FollowUser, pubkey, relayHint);

// Unfollow a user
await actionHub.run(UnfollowUser, pubkey);
```

### Profile Actions

```typescript
import { UpdateProfile } from 'applesauce-actions/actions';

// Update your profile
await actionHub.run(UpdateProfile, {
	name: 'Alice',
	about: 'Bitcoin developer',
	picture: 'https://example.com/alice.jpg',
	website: 'https://alice.dev'
});
```

## Error Handling

Actions can fail for various reasons. Always handle errors appropriately:

```typescript
async function safeFollowUser(pubkey, relayHint) {
	try {
		await actionHub.run(FollowUser, pubkey, relayHint);
		return { success: true };
	} catch (error) {
		console.error('Follow action failed:', error);

		if (error.message.includes('contact list')) {
			// Try to create contact list first
			try {
				await actionHub.run(NewContacts);
				await actionHub.run(FollowUser, pubkey, relayHint);
				return { success: true };
			} catch (retryError) {
				return { success: false, error: 'Failed to create contact list' };
			}
		}

		if (error.message.includes('signer')) {
			return { success: false, error: 'Please connect your Nostr extension' };
		}

		return { success: false, error: error.message };
	}
}

// Usage
const result = await safeFollowUser(pubkey, relayHint);
if (result.success) {
	console.log('User followed successfully');
} else {
	console.error('Failed to follow user:', result.error);
}
```

## Configuration Options

### Disable Automatic EventStore Saving

By default, `ActionHub` saves all generated events to your `EventStore`. You can disable this:

```typescript
const actionHub = new ActionHub(eventStore, eventFactory, publish);
actionHub.saveToStore = false; // Disable automatic saving

// Now events are only published, not saved to local store
await actionHub.run(FollowUser, pubkey, relayHint);
```

### Conditional Saving

You might want to save events only after successful publishing:

```typescript
const actionHub = new ActionHub(eventStore, eventFactory);
actionHub.saveToStore = false; // Disable automatic saving

// Manual event handling with conditional saving
await actionHub.exec(FollowUser, pubkey, relayHint).forEach(async (event) => {
	try {
		// Publish first
		await publish(event);

		// Save to store only after successful publish
		eventStore.add(event);
		console.log('Event published and saved');
	} catch (error) {
		console.error('Failed to publish, not saving to store:', error);
	}
});
```

## Best Practices

### 1. Single ActionHub Instance

Create one ActionHub instance for your entire application:

```typescript
// app.ts
export const actionHub = new ActionHub(eventStore, eventFactory, publish);

// other-file.ts
import { actionHub } from './app';
await actionHub.run(FollowUser, pubkey);
```

### 2. Error Handling

Actions can throw errors so many sure to handle them gracefully.

```typescript
try {
	await actionHub.run(FollowUser, pubkey);
} catch (error) {
	console.error('Failed to follow user:', error);
}
```

## Key Concepts

- **ActionHub orchestrates** EventStore, EventFactory, and publishing
- **Actions are pre-built** functions for common Nostr operations
- **`hub.run()` provides automatic** event creation and publishing
- **`hub.exec()` gives manual control** over event handling
- **Error handling is crucial** for good user experience
- **Single instance per app** is recommended for consistency

## Next Steps

You now know enough to build a Nostr application! Checkout some some of the examples apps in the [examples](https://hzrd149.github.io/applesauce/examples) directory to see whats possible.
````
