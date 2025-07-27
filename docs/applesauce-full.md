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
accounts/
  accounts.md
  manager.md
  package.md
actions/
  action-hub.md
  actions.md
  package.md
content/
  markdown.md
  package.md
  text.md
core/
  event-store.md
  helpers.md
  models.md
factory/
  blueprints.md
  event-factory.md
  event-operations.md
  package.md
  tag-operations.md
introduction/
  getting-started.md
  glossary.md
  packages.md
loaders/
  address-loader.md
  event-loader.md
  package.md
  reactions-loader.md
  tag-value-loader.md
  timeline-loader.md
  zaps-loader.md
relays/
  operators.md
  package.md
  pool.md
  relays.md
signers/
  nostr-connect.md
  package.md
  signers.md
tutorial/
  00-introduction.md
  01-event-store.md
  02-helpers.md
  03-models.md
  04-relays.md
  05-loaders.md
  06-event-factory.md
  07-publishing.md
  08-actions.md
wallet/
  actions.md
  models.md
  package.md
```

# Files

## File: accounts/accounts.md

````markdown
# Accounts

The [account classes](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-accounts.Accounts.html) are simple wrappers around various [Signers](../signers/signers.md) and expose a `toJSON` and `fromJSON` method to let you save them to localStorage or indexeddb databases

## Built-in account types

- [ExtensionAccount](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-accounts.Accounts.ExtensionAccount.html) is a wrapper around [ExtensionSigner](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-signers.ExtensionSigner.html)
- [PasswordAccount](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-accounts.Accounts.PasswordAccount.html) is a wrapper around [PasswordSigner](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-signers.PasswordSigner.html)
- [NostrConnectAccount](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-accounts.Accounts.NostrConnectAccount.html) is a wrapper around [NostrConnectSigner](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-signers.NostrConnectSigner.html)
- [SimpleAccount](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-accounts.Accounts.SimpleAccount.html) is a wrapper around [SimpleSigner](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-signers.SimpleSigner.html)
- [SerialPortAccount](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-accounts.Accounts.SerialPortAccount.html) is a wrapper around [SerialPortSigner](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-signers.SerialPortSigner.html)
- [ReadonlyAccount](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-accounts.Accounts.ReadonlyAccount.html) is a wrapper around [ReadonlySigner](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-signers.ReadonlySigner.html)
- [AmberClipboardAccount](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-accounts.Accounts.AmberClipboardAccount.html) is a wrapper around [AmberClipboardSigner](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-signers.AmberClipboardSigner.html)

## Creating new accounts

All account classes require the signer to be created and setup first

```ts
import { SimpleSigner } from 'applesauce-signers/signers';
import { SimpleAccount } from 'applesauce-accounts/accounts';

// create the signer first
const signer = new SimpleSigner();

// setup signer
const pubkey = await signer.getPublicKey();

// create account
const account = new SimpleAccount(pubkey, signer);
```

For a nostr connect signer it would look something like

```ts
import { NostrConnectSigner } from 'applesauce-signers/signers';
import { NostrConnectAccount } from 'applesauce-accounts/accounts';

const signer = await NostrConnectSigner.fromBunkerURI('bunker://....');

const pubkey = await signer.getPublicKey();

const account = new NostrConnectAccount(pubkey, signer);
```

## Request queue

By default all accounts use a request queue, so the signer only gets on sign/encrypt/decrypt request at a time. This should make it safe to make a bunch of requests to the account without overloading the user

```ts
import { ExtensionSigner } from 'applesauce-signers/signers';
import { ExtensionAccount } from 'applesauce-accounts/accounts';

const signer = new ExtensionSigner();
const pubkey = await signer.getPublicKey();

const account = new ExtensionAccount(pubkey, signer);

// make requests
account.signEvent({ kind: 1, content: 'hello world', created_at: 0, tags: [] }).then((signed) => {
	console.log(signed);
});

// make another without waiting
account.signEvent({ kind: 1, content: 'creating spam', created_at: 0, tags: [] }).then((signed) => {
	console.log(signed);
});

account.nip04
	.decrypt('3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d', 'encrypted-text')
	.then((plaintext) => {
		console.log(plaintext);
	});
```

All the requests will be made one at a time in order, if any request fails (user rejects, signer timeout) then the queue will continue

The `account.abortQueue(reason?: Error)` method can be used to abort all pending requests. this will cause all promises to throw with `undefined` or `reason` if it was passed to the `abortQueue` method

To disable the request queue set `account.disableQueue = false` directly after creating the account. it can also be disabled on the `AccountManager` before any accounts are added

## Custom account types

To create your own account type first your going to need to create a new signer class that implements [Nip07Interface](https://hzrd149.github.io/applesauce/typedoc/types/applesauce-signers.Nip07Interface.html)

### Create a new signer class

```ts
class ApiSigner implements Nip07Interface {
	nip04: {
		encrypt: (pubkey: string, plaintext: string) => Promise<string> | string;
		decrypt: (pubkey: string, ciphertext: string) => Promise<string> | string;
	};
	nip44: {
		encrypt: (pubkey: string, plaintext: string) => Promise<string> | string;
		decrypt: (pubkey: string, ciphertext: string) => Promise<string> | string;
	};

	constructor(public api: string) {
		// extra boilerplate to make sure encryption methods are nested under .nip04 and .nip44
		this.nip04 = {
			encrypt: this.nip04Encrypt.bind(this),
			decrypt: this.nip04Decrypt.bind(this)
		};
		this.nip44 = {
			encrypt: this.nip44Encrypt.bind(this),
			decrypt: this.nip44Decrypt.bind(this)
		};
	}

	async getPublicKey(): Promise<string> {
		const res = await fetch(this.api + '/get-public-key');
		const json = await res.json();
		return json.pubkey;
	}

	async signEvent(template: EventTemplate): Promise<NostrEvent> {
		const res = await fetch(this.api + '/sign', { body: template, method: 'POST' });
		const json = await res.json();
		return json.event;
	}

	nip04Encrypt(): string {
		throw new Error('Not implemented yet');
	}
	nip04Decrypt(): string {
		throw new Error('Not implemented yet');
	}
	nip44Encrypt(): string {
		throw new Error('Not implemented yet');
	}
	nip44Decrypt(): string {
		throw new Error('Not implemented yet');
	}
}
```

### Create a new account class

Next create a new account class that extends `BaseAccount` to wrap the signer

```ts
import { SerializedAccount, BaseAccount } from 'applesauce-accounts';

type ApiAccountSignerData = {
	api: string;
};

// Its good practice to make the class have a generic type for metadata
export default class ApiAccount<Metadata extends unknown> extends BaseAccount<
	ApiSigner,
	ApiAccountSignerData,
	Metadata
> {
	// NOTE: you must set the static type, otherwise it cant be used in the AccountManager
	static type = 'api-account';

	// add a toJSON method that saves all relevant information for the account
	toJSON() {
		return {
			// save basic account information
			type: ApiAccount.type,
			id: this.id,
			pubkey: this.pubkey,
			metadata: this.metadata,

			// save important signer data
			signer: {
				api: this.signer.api
			}
		};
	}

	// add a static fromJSON method so it can be re-created when the app loads again
	static fromJSON<Metadata extends unknown>(
		json: SerializedAccount<ApiAccountSignerData, Metadata>
	): ApiAccount<Metadata> {
		// create signer with saved data
		const signer = new ApiSigner(json.signer.api);

		// create new account class
		const account = new ApiAccount(json.pubkey, signer);

		// don't forget to call loadCommonFields, it sets the id and metadata
		return super.loadCommonFields(account);
	}
}
```

### Add account type to account manager

Next you need to register the account type

Now you can create a new `ApiSigner` and add it to the account manager

```ts
const signer = new ApiSigner('https://api.example.com');
const pubkey = await signer.getPublicKey();
const account = new ApiAccount(pubkey, signer);

accountManager.addAccount(account);
accountManager.setActive(account);
```
````

## File: accounts/manager.md

````markdown
# Account Manager

The [AccountManager](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-accounts.AccountManager.html) class is the core of the library, as its name suggests its used to manage multiple accounts

## Account types

By default the account manager comes with no account types. you have to manually add them when you create the instance. luckily there is a handy method to add the most common types [registerCommonAccountTypes](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-accounts.registerCommonAccountTypes.html)

```ts
import {
	AccountManager,
	registerCommonAccountTypes,
	AmberClipboardAccount
} from 'applesauce-accounts';

// create an account manager instance
const manager = new AccountManager();

// register common account types
registerCommonAccountTypes(manager);

// manually add account type
manager.registerType(AmberClipboardAccount);
```

## Adding and removing accounts

```ts
import { AccountManager, registerCommonAccountTypes, SimpleAccount } from 'applesauce-accounts';

// create an account manager instance
const manager = new AccountManager();

// register common account types
registerCommonAccountTypes(manager);

// subscribe to the active account
manager.active$.subscribe((account) => {
	if (account) console.log(`${account.id} is now active`);
	else console.log('no account is active');

	updateUI();
});

// create an account
const account = SimpleAccount.fromKey(
	'788229e1801c4576391d39a03610293ea7e6645c9d39aca54c62fc6d71cbc385'
);

// add it to the manager
manager.addAccount(account);

// set it as active
manager.setActive(account);

// later, remove the account and the active account will also update
manager.removeAccount(account.id);
```

## Active account

The `AccountManager` class exposes a set of methods to track which account is active and switch the active account

- `AccountManager.active` gets the currently active account
- `AccountManager.active$` an observable of the active account, can be used to subscribe to changes
- `AccountManager.setActive(id: string | Account)` set the active account

## Persisting accounts

The account manager exposes two methods that can be used to persist accounts between app reloads. `toJSON` and `fromJSON`

```ts
import { AccountManager, registerCommonAccountTypes, SimpleAccount } from 'applesauce-accounts';

// create an account manager instance
const manager = new AccountManager();

// register common account types
registerCommonAccountTypes(manager);

// first load all accounts from
const json = JSON.parse(localStorage.getItem('accounts') || '[]');
await manager.fromJSON(json);

// next, subscribe to any accounts added or removed
manager.accounts$.subscribe((accounts) => {
	// save all the accounts into the "accounts" field
	localStorage.setItem('accounts', JSON.stringify(manager.toJSON()));
});

// load active account from storage
if (localStorage.hasItem('active')) {
	manger.setActive(localStorage.getItem('active'));
}

// subscribe to active changes
manager.active$.subscribe((account) => {
	if (account) localStorage.setItem('active', account.id);
	else localStorage.clearItem('active');
});
```
````

## File: accounts/package.md

````markdown
# Accounts

The `applesauce-accounts` package provides a set of classes for managing accounts and their associated signers.

## Features

- Full account manager class
- Support for saving and loading accounts from JSON
- Integrated with the `applesauce-signers` package
- Suports custom account types
- Custom account metadata (name, icon, etc)

## Installation

:::code-group

```sh [npm]
npm install applesauce-accounts
```

```sh [yarn]
yarn install applesauce-accounts
```

```sh [pnpm]
pnpm install applesauce-accounts
```

:::
````

## File: actions/action-hub.md

````markdown
# Action Hub

The [ActionHub](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-actions.ActionHub.html) class is the central orchestrator for running actions in your Nostr application. It combines an event store, event factory, and optional publish method into a unified interface, making it simple to execute actions that read from your local event store and publish new events to the Nostr network.

## Creating an Action Hub

### Basic Setup

To create an ActionHub, you need an event store and event factory. Optionally, you can provide a publish method to automatically handle event publishing.

```ts
import { ActionHub } from 'applesauce-actions';
import { NostrEvent } from 'nostr-tools';

// Create a basic ActionHub without automatic publishing
const hub = new ActionHub(eventStore, eventFactory);

// Or create one with automatic publishing
const publish = async (event: NostrEvent) => {
	console.log('Publishing event:', event.kind);
	await relayPool.publish(event, defaultRelays);
};

const hub = new ActionHub(eventStore, eventFactory, publish);
```

### With Custom Publishing Logic

You can provide sophisticated publishing logic when creating your ActionHub:

```ts
const publish = async (event: NostrEvent) => {
	// Log the event
	console.log('Publishing', event);

	// Publish to relays
	await app.relayPool.publish(event, app.defaultRelays);

	// Save to local backup
	await localBackup.save(event);

	// Notify UI of new event
	eventBus.emit('eventPublished', event);
};

const hub = new ActionHub(eventStore, eventFactory, publish);
```

:::info
For performance reasons, it's recommended to create only one `ActionHub` instance for your entire application and reuse it across all action executions.
:::

## Configuration Options

### Save to Store

By default, the ActionHub will automatically save all events created by actions to your event store. You can disable this behavior:

```ts
const hub = new ActionHub(eventStore, eventFactory, publish);
hub.saveToStore = false; // Disable automatic saving to event store
```

## Running Actions

The ActionHub provides two primary methods for executing actions: `.run()` for fire-and-forget execution with automatic publishing, and `.exec()` for fine-grained control over event handling.

### Using `.run()` - Automatic Publishing

The [ActionHub.run](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-actions.ActionHub.html#run) method executes an action and automatically publishes all generated events using the publish method provided during ActionHub creation.

:::warning
`ActionHub.run()` will throw an error if no `publish` method was provided when creating the ActionHub.
:::

```ts
import { FollowUser, NewContacts } from 'applesauce-actions/actions';

// Create a new contact list (throws if one already exists)
try {
	await hub.run(NewContacts);
	console.log('Contact list created successfully');
} catch (err) {
	console.error('Failed to create contact list:', err.message);
}

// Follow a user - events are automatically published
await hub.run(
	FollowUser,
	'3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
	'wss://pyramid.fiatjaf.com/'
);

// Unfollow a user
await hub.run(UnfollowUser, '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d');
```

### Using `.exec()` - Manual Event Handling

The [ActionHub.exec](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-actions.ActionHub.html#exec) method executes an action and returns an RxJS Observable of events, giving you complete control over how events are handled and published.

#### Using RxJS forEach for Simple Cases

The RxJS [Observable.forEach](https://rxjs.dev/api/index/class/Observable#foreach) method provides a clean way to handle all events with a single function:

```ts
import { FollowUser } from 'applesauce-actions/actions';

// Custom publishing logic for this specific action
const customPublish = async (event: NostrEvent) => {
	// Publish to specific relays
	await relayPool.publish(event, ['wss://relay.damus.io', 'wss://nos.lol']);

	// Save to local database with custom metadata
	await localDatabase.saveContactListUpdate(event, { source: 'user_action' });
};

// Execute action and handle each event
await hub.exec(NewContacts).forEach(customPublish);

// Follow user with custom handling
await hub
	.exec(
		FollowUser,
		'3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
		'wss://pyramid.fiatjaf.com/'
	)
	.forEach(customPublish);
```

#### Using RxJS Subscriptions for Advanced Control

For more complex scenarios, you can manually subscribe to the observable:

```ts
import { tap, catchError, finalize } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

const subscription = hub
	.exec(FollowUser, userPubkey, relayUrl)
	.pipe(
		tap((event) => console.log('Generated event:', event.kind)),
		catchError((err) => {
			console.error('Action failed:', err);
			return EMPTY; // Handle errors gracefully
		}),
		finalize(() => console.log('Action completed'))
	)
	.subscribe({
		next: async (event) => {
			try {
				await customPublish(event);
				console.log('Event published successfully');
			} catch (err) {
				console.error('Failed to publish event:', err);
			}
		},
		complete: () => {
			console.log('All events processed');
			subscription.unsubscribe();
		},
		error: (err) => {
			console.error('Observable error:', err);
			subscription.unsubscribe();
		}
	});
```

#### Collecting Events Before Publishing

You can collect all events from an action before publishing them:

```ts
import { toArray, lastValueFrom } from 'rxjs';

// Collect all events into an array
const events = await lastValueFrom(hub.exec(NewContacts).pipe(toArray()));

console.log(`Action generated ${events.length} events`);

// Publish them in a specific order or with delays
for (const event of events) {
	await publish(event);
	await delay(100); // Small delay between publishes
}
```

## Error Handling

### Action Validation Errors

Actions will throw errors for various validation failures:

```ts
try {
	await hub.run(NewContacts);
} catch (err) {
	if (err.message.includes('contact list already exists')) {
		console.log('User already has a contact list');
	} else {
		console.error('Unexpected error:', err);
	}
}
```

### Publishing Errors

When using `.exec()`, you can handle publishing errors independently:

```ts
await hub.exec(FollowUser, userPubkey).forEach(async (event) => {
	try {
		await publish(event);
	} catch (publishError) {
		console.error('Failed to publish event:', publishError);
		// Could retry, save for later, or notify user
		await saveForRetry(event);
	}
});
```

## Best Practices

### Single ActionHub Instance

Create one ActionHub instance per application and reuse it:

```ts
// app.ts
export const actionHub = new ActionHub(eventStore, eventFactory, publish);

// other-file.ts
import { actionHub } from './app.js';
await actionHub.run(FollowUser, pubkey);
```

### Conditional Event Store Saving

For actions that generate many events, you might want to control when events are saved to the store:

```ts
const hub = new ActionHub(eventStore, eventFactory, publish);

// Disable automatic saving for bulk operations
hub.saveToStore = false;

// Run bulk action
const events = await lastValueFrom(hub.exec(BulkFollowUsers, userList).pipe(toArray()));

// Manually save only successful events
for (const event of events) {
	try {
		await publish(event);
		await eventStore.add(event); // Save only after successful publish
	} catch (err) {
		console.error('Skipping failed event:', err);
	}
}

// Re-enable automatic saving
hub.saveToStore = true;
```
````

## File: actions/actions.md

````markdown
# Actions

Actions are the core building blocks for creating and modifying Nostr events in a structured way. An [Action](https://hzrd149.github.io/applesauce/typedoc/types/applesauce-actions.Action.html) is an [AsyncIterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncIterator) that reads from the `EventStore` and yields signed Nostr events ready for publishing.

## What is an Action?

An action is a function that returns an async generator. The generator has access to:

- `events` - The event store for reading existing events
- `factory` - The event factory for creating and signing new events
- `self` - The current user's public key

Actions follow this basic pattern:

```ts
import { Action } from 'applesauce-actions';

function MyAction(param1: string, param2?: boolean): Action {
	return async function* ({ events, factory, self }) {
		// Read existing events from the store
		const existingEvent = events.getReplaceable(kind, self);

		// Create or modify events using the factory
		const draft = await factory.modify(existingEvent, ...operations);

		// Sign and yield the event for publishing
		yield await factory.sign(draft);
	};
}
```

:::warning
To avoid overriding replaceable events, actions should throw if an existing replaceable event can't be found when expected.
:::

## Pre-built Actions

The `applesauce-actions` package comes with many pre-built actions for common social client operations. You can find the complete list in the [reference](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-actions.Actions.html).

Some examples include:

- `CreateProfile` / `UpdateProfile` - Managing user profiles
- `FollowUser` / `UnfollowUser` - Managing contact lists
- `BookmarkEvent` / `UnbookmarkEvent` - Managing bookmarks
- `MuteUser` / `UnmuteUser` - Managing mute lists
- `PinNote` / `UnpinNote` - Managing pinned notes

## Action Patterns

### Creating New Events

When creating a new replaceable event, actions typically check if one already exists:

```ts
export function CreateProfile(content: ProfileContent): Action {
	return async function* ({ events, factory, self }) {
		const metadata = events.getReplaceable(kinds.Metadata, self);
		if (metadata) throw new Error('Profile already exists');

		const draft = await factory.build({ kind: kinds.Metadata }, setProfileContent(content));
		yield await factory.sign(draft);
	};
}
```

### Updating Existing Events

When updating events, actions verify the event exists before modifying:

```ts
export function UpdateProfile(content: Partial<ProfileContent>): Action {
	return async function* ({ events, factory, self }) {
		const metadata = events.getReplaceable(kinds.Metadata, self);
		if (!metadata) throw new Error('Profile does not exist');

		const draft = await factory.modify(metadata, updateProfileContent(content));
		yield await factory.sign(draft);
	};
}
```

### Modifying Tags

Many actions work by adding or removing tags from existing events:

```ts
export function FollowUser(pubkey: string, relay?: string, hidden = false): Action {
	return async function* ({ events, factory, self }) {
		const contacts = events.getReplaceable(kinds.Contacts, self);
		if (!contacts) throw new Error('Missing contacts event');

		const pointer = { pubkey, relays: relay ? [relay] : undefined };
		const operation = addPubkeyTag(pointer);
		const draft = await factory.modifyTags(contacts, hidden ? { hidden: operation } : operation);
		yield await factory.sign(draft);
	};
}
```

### Complex Operations

Some actions perform multiple operations or create multiple events:

```ts
export function CreateBookmarkSet(
	title: string,
	description: string,
	additional: { image?: string; hidden?: NostrEvent[]; public?: NostrEvent[] }
): Action {
	return async function* ({ events, factory, self }) {
		const existing = getBookmarkEvent(events, self);
		if (existing) throw new Error('Bookmark list already exists');

		const draft = await factory.build(
			{ kind: kinds.BookmarkList },
			setListTitle(title),
			setListDescription(description),
			additional.image ? setListImage(additional.image) : undefined,
			additional.public
				? modifyPublicTags(...additional.public.map(addEventBookmarkTag))
				: undefined,
			additional.hidden
				? modifyHiddenTags(...additional.hidden.map(addEventBookmarkTag))
				: undefined
		);
		yield await factory.sign(draft);
	};
}
```

## Creating Custom Actions

To create your own action, define a function that returns an async generator that yields signed events:

```ts
import { Action } from 'applesauce-actions';
import { kinds } from 'nostr-tools';

function SetDisplayName(displayName: string): Action {
	return async function* ({ events, factory, self }) {
		// Get the current profile
		const profile = events.getReplaceable(kinds.Metadata, self);
		if (!profile) throw new Error('Profile not found');

		// Parse existing content
		const content = JSON.parse(profile.content || '{}');

		// Update the display name
		content.display_name = displayName;

		// Create a new profile event with updated content
		const draft = await factory.modify(profile, (event) => {
			event.content = JSON.stringify(content);
			return event;
		});

		// Sign and yield the event
		yield await factory.sign(draft);
	};
}
```

### Multi-Event Actions

Actions can yield multiple events if needed:

```ts
function CreateUserSetup(profile: ProfileContent, initialFollows: string[]): Action {
	return async function* ({ events, factory, self }) {
		// Create profile
		const profileDraft = await factory.build({ kind: kinds.Metadata }, setProfileContent(profile));
		yield await factory.sign(profileDraft);

		// Create contacts list
		const contactsDraft = await factory.build({
			kind: kinds.Contacts,
			tags: initialFollows.map((pubkey) => ['p', pubkey])
		});
		yield await factory.sign(contactsDraft);
	};
}
```

## Best Practices

1. **Validate inputs** - Check that required events exist before attempting modifications
2. **Use factory operations** - Leverage the event factory's built-in operations for common tasks
3. **Handle errors gracefully** - Throw descriptive errors when preconditions aren't met
4. **Keep actions focused** - Each action should have a single, clear responsibility
5. **Document parameters** - Use JSDoc comments to describe action parameters and behavior

The async generator pattern allows actions to be composable, testable, and easy to reason about while providing a clean interface for event creation and modification.
````

## File: actions/package.md

````markdown
# Actions

The `applesauce-actions` package provides pre-built actions for common actions a nostr app might need.

## Features

- Built on `applesauce-factory` to create and modify events
- Compatible with any NIP-07 signer ( and `applesauce-signers` )
- Works with any nostr SDK for publishing events

## Installation

:::code-group

```sh [npm]
npm install applesauce-actions
```

```sh [yarn]
yarn install applesauce-actions
```

```sh [pnpm]
pnpm install applesauce-actions
```

:::
````

## File: content/markdown.md

```markdown
# Markdown

The `applesauce-content` package exports some [remark](https://www.npmjs.com/package/remark) transformers. see remark [docs](https://remark.js.org/) to see how to add additional transformers

## Nostr Mentions

The [`remarkNostrMentions`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-content.Markdown.remarkNostrMentions.html) transformer can be used to linkify [NIP-21](https://github.com/nostr-protocol/nips/blob/master/21.md) `nostr:` URIs
```

## File: content/package.md

````markdown
# Text content

The `applesauce-content` package provides tools for parsing and rendering the text `content` of nostr events.

## Installation

:::code-group

```sh [npm]
npm install applesauce-content
```

```sh [yarn]
yarn install applesauce-content
```

```sh [pnpm]
pnpm install applesauce-content
```

:::
````

## File: content/text.md

```markdown
# Text Content

## Parsing content

The [`getParsedContent`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-content.Text.getParsedContent.html) method can be used to parse and transform an event into the content syntax tree

## Cashing

Because parsing and transforming content is an expensive operation `getParsedContent` method will cache the results on the event under a [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), by default this is the [`TextNoteContentSymbol`](https://hzrd149.github.io/applesauce/typedoc/variables/applesauce-content.Text.TextNoteContentSymbol.html)

If your parsing or transforming different event kinds than kind 1, its recommended to create a new `Symbol` to and pass to `getParsedContent` to avoid cache collisions with the default kind 1 processor

## Links

The [`links`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-content.Text.links.html) transformer can be used to parse URLs and add [`Link`](https://hzrd149.github.io/applesauce/typedoc/interfaces/applesauce-content.Nast.Link.html) nodes to the tree

## Mentions

The [`nostrMentions`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-content.Text.nostrMentions.html) transformer can be used to add [`Mention`](https://hzrd149.github.io/applesauce/typedoc/interfaces/applesauce-content.Nast.Mention.html) nodes to the tree

## Hashtags

The [`hashtags`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-content.Text.hashtags.html) transformer can be used to add [`Hashtag`](https://hzrd149.github.io/applesauce/typedoc/interfaces/applesauce-content.Nast.Hashtag.html) nodes to the tree

## Emojis

The [`emojis`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-content.Text.emojis.html) transformer will add [`Emoji`](https://hzrd149.github.io/applesauce/typedoc/interfaces/applesauce-content.Nast.Emoji.html) tags for any [NIP-30](https://github.com/nostr-protocol/nips/blob/master/30.md) emojis

## Galleries

The [`galleries`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-content.Text.galleries.html) transformer will group image URLs into a [`Gallery`](https://hzrd149.github.io/applesauce/typedoc/interfaces/applesauce-content.Nast.Gallery.html) node

## Lightning invoices

The [`lightningInvoices`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-content.Text.lightningInvoices.html) transformer can be used to parse bolt11 lightning invoices in the content

## Cashu tokens and payment requests

The [`cashuTokens`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-content.Text.cashuTokens.html) transformer can be used to parse cashu tokens in the content
```

## File: core/event-store.md

````markdown
# Managing events

The `EventStore` is a reactive in-memory event database

At its core the event store uses the [`Database`](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-core.Database.html) class to store and index events

## Creating an event store

```ts
import { EventStore } from 'applesauce-core';

const eventStore = new EventStore();
```

> [!INFO]
> Its recommended to only create a single event store for your app

## Adding events

To add events to the event store you can use the [`eventStore.add`](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-core.EventStore.html#add) method

Adding events to the event store will update any subscriptions that match that event

```ts
eventStore.timeline({kinds: [1]}).subscribe(events => {
  console.log(`timeline updated (${events.length})`)
})

const event = { kind: 1, ... }
eventStore.add(event)
```

### Duplicate an replaceable events

The event store understands to to handle replaceable (`1xxxx`) and parameterized replaceable events (`3xxxx`)

If the event store already has the event (same `id`) or if its a replaceable event and it already has newer version of it. `eventStore.add` will returning the **existing** instance of the event

This allows you to easily deduplicate events from multiple relays

```ts
const incoming = [
	{
		id: 'f177c37f...',
		kind: 1,
		content: '',
		pubkey: 'c3ae4ad8...',
		created_at: 1733345284,
		tags: [],
		sig: '...'
	},
	{
		id: 'efd33141...',
		kind: 1,
		content: '',
		pubkey: '20d29810...',
		created_at: 1733343882,
		tags: [],
		sig: '...'
	},
	// duplicate of #1
	{
		id: 'f177c37f...',
		kind: 1,
		content: '',
		pubkey: 'c3ae4ad8...',
		created_at: 1733345284,
		tags: [],
		sig: '...'
	}
];

const sub = eventStore.stream({ kinds: [1] }).subscribe((event) => {
	console.log('new event', event);
});

// add first event
eventStore.add(incoming[0]);

// add second event
eventStore.add(incoming[1]);

// add duplicate event
const event = eventStore.add(incoming[2]);

// since the event f177c37f has already been added
// the subscription will not update and the returned event is the original
console.log(event !== incoming[2]);
```

## Subscribing

Subscriptions are rxjs [observables](https://rxjs.dev/guide/observable) that update when new events are added to the event store

### Single events

Subscribing to a single event will notify you when the event has been added to the event store or when it is deleted

```ts
const event = {
	content: 'Hashtags are useless.',
	created_at: 1733153425,
	id: '000021ba6f5f4da9d1f913c73dcf8fc8347052b4e74e14a2e41101c0f40792c8',
	kind: 1,
	pubkey: '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
	sig: '6f197e399d1ebae054fbc20570fc8ef113a79afaa6057125170ba81afcecea2449969c9d1dbc61ff50328cae7166e9981734ba29672d9ae45acb675ff45ebd84',
	tags: [['nonce', '8002', '16']]
};

const sub = eventStore
	.event('000021ba6f5f4da9d1f913c73dcf8fc8347052b4e74e14a2e41101c0f40792c8')
	.subscribe((event) => {
		// value maybe undefined when the event is not in the event store
		// or if it has been deleted
		if (event) {
			console.log('event has been found', event);
		}
	});

eventStore.add(event);
```

### Replaceable events

Subscribing to a replaceable event will notify you when there is a newer version or when it is deleted

```ts
const original = {
	id: '7607adc3934f368bf1a00cb1023e455707a90af94a29c2acf877dffb0ec4c0cb',
	pubkey: 'd8dd41ef1e287dfc668d2473fbef8fa9deea5c2ef03947105ef568e68827e7e4',
	created_at: 1733346633,
	kind: 0,
	tags: [],
	content: '{ "name": "john" }',
	sig: 'b706636043a64c5d1a07cabf66db08b1374d6efa4558e8832f5b90becb5cba190215a2ec1303e11dac494977801600b012959daa7145fba6d96ae3fcb629759e'
};

const updated = {
	id: '2f54a4491a31451cbe0d296297649af458d89df2f24d7f86d2474fd0607e29a1',
	pubkey: 'd8dd41ef1e287dfc668d2473fbef8fa9deea5c2ef03947105ef568e68827e7e4',
	created_at: 1733346633,
	kind: 0,
	tags: [],
	content: '{ "name": "john smith" }',
	sig: 'd66ecc0fb2b9170818defb593150563061716bce82d276d07b4b68be9ab542b2d14bb1335eb62971a84be5f315ecf32bdf53000e780a20330f63d7803a1fd95c'
};

eventStore.add(original);

// get the original and listen for any updates
const sub = eventStore
	.replaceable(0, 'd8dd41ef1e287dfc668d2473fbef8fa9deea5c2ef03947105ef568e68827e7e4')
	.subscribe((event) => {
		// first event will be the original
		if (event) console.log('Profile Updated', event);
	});

// this will trigger the subscription
eventStore.add(updated);
```

### Streams

A stream subscription takes a filter(s) and returns all events that match and notifies you when there are new events

```ts
const sub = eventStore.stream({ kinds: [1] }).subscribe((event) => {
	console.log('Found text note', event);
});

// or if you only want to subscribe to future events
const sub = eventStore.stream({ kinds: [1] }, true).subscribe((event) => {
	console.log('Found new text note', event);
});
```

### Timelines

A timeline subscription takes a filter(s) and returns a sorted array of events that match the filter(s)

```ts
const timeline = eventStore.timeline({ kinds: [1] }).subscribe((events) => {
	console.log(events);
});

// fetch some events using another library
fetchEvents({ kinds: [1, 0] }, (event) => {
	// timeline will update for each new event
	eventStore.add(event);
});
```

## Static Methods

The event store provides several methods to directly access events without creating subscriptions. These methods are useful when you need to check for or retrieve events synchronously.

### Event Management

- `add(event)`: Add a new event to the store
- `remove(event)`: Remove an event from the store
- `update(event)`: Notify the store that an event has been updated

### Checking Event Existence

- `hasEvent(id)`: Check if an event with a specific ID exists in the store
- `hasReplaceable(kind, pubkey, identifier?)`: Check if a replaceable event exists for the given kind and pubkey combination

### Retrieving Events

- `getEvent(id)`: Get a single event by its ID
- `getReplaceable(kind, pubkey, identifier?)`: Get the latest version of a replaceable event
- `getReplaceableHistory(kind, pubkey, identifier?)`: Get the history of all versions of a replaceable event
- `getByFilters(filters)`: Get a set of all events that match the given filter(s)
- `getTimeline(filters)`: Get a sorted array of events that match the given filter(s)

Example usage:

```ts
// Check if an event exists
const exists = eventStore.hasEvent('000021ba6f5f...');

// Get an event by ID
const event = eventStore.getEvent('000021ba6f5f...');

// Get events matching filters
const events = eventStore.getByFilters({ kinds: [1], authors: ['000021ba6f5f...'] });

// Get a timeline of events
const timeline = eventStore.getTimeline({ kinds: [1] });

// Check and get replaceable events
const hasProfile = eventStore.hasReplaceable(0, '000021ba6f5f...');
const profile = eventStore.getReplaceable(0, '000021ba6f5f...');
```
````

## File: core/helpers.md

```markdown
# Helpers

`applesauce-core` and other packages export helper methods for working with events.

> [!WARNING]
> Some helper methods may throw errors. make sure your app can handle errors correctly.

## Core helpers

The [`applesauce-core`](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-core.Helpers.html) package contains the majority of the helper methods

### Events

- [`isEvent`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.isEvent.html) Checks if an object is a nostr event
- [`markFromCache`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.markFromCache.html) Marks an event as being from the cache
- [`isFromCache`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.isFromCache.html) Checks if an event is marked from cache
- [`getTagValue`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getTagValue.html) Gets the value of the first tag matching the name
- [`getIndexableTags`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getIndexableTags.html) Get a `Set` of all indexable tags on the event

### Profiles

- [`getProfileContent`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getProfileContent.html) Returns the parsed profile content for a kind 0 event
- [`isValidProfile`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.isValidProfile.html) Checks if the content of the kind 0 event is valid JSON

### Mailboxes

- [`getInboxes`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getInboxes.html) Gets the inbox relays from a `10002` event
- [`getOutboxes`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getOutboxes.html) Gets the outbox relays from a `10002` event

### Comments

- [`getCommentRootPointer`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getCommentRootPointer.html) Get the root pointer for a NIP-22 comment
- [`getCommentReplyPointer`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getCommentReplyPointer.html) Get the reply pointer for a NIP-22 comment

### Event relays

- [`addSeenRelay`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.addSeenRelay.html) Adds a relay to the list of relay the event was seen on
- [`getSeenRelays`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getSeenRelays.html) Get the list of relays this event was seen on

### Zaps

- [`isValidZap`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.isValidZap.html) Checks if an event is a valid zap and can be parsed
- [`getZapSender`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getZapSender.html) Gets the senders pubkey
- [`getZapRecipient`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getZapRecipient.html) Gets the pubkey of the user who received the zap
- [`getZapPayment`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getZapPayment.html) Gets the parsed bolt11 invoice
- [`getZapAddressPointer`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getZapAddressPointer.html) Gets the address pointer of the zap
- [`getZapEventPointer`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getZapEventPointer.html) Gets the event pointer of the zap
- [`getZapRequest`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getZapRequest.html) Gets the zap request event inside the zap event

### Lightning

- [`parseBolt11`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.parseBolt11.html) Parses a bolt11 lightning invoice
- [`parseLNURLOrAddress`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.parseLNURLOrAddress.html) Parses a LNURL or lightning address into a LNURLp

### Pointers

- [`getEventPointerFromETag`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getEventPointerFromETag.html) Creates an `EventPointer` from a standard "e" tag
- [`getEventPointerFromQTag`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getEventPointerFromQTag.html) Creates an `EventPointer` from a standard "q" tag
- [`getAddressPointerFromATag`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getAddressPointerFromATag.html) Creates an `AddressPointer` from a standard "a" tag
- [`getProfilePointerFromPTag`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getProfilePointerFromPTag.html) Creates an `ProfilePointer` from a standard "p" tag
- [`getAddressPointerForEvent`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getAddressPointerForEvent.html) Returns an `AddressPointer` for a replaceable event

### Delete events

- [`getDeleteIds`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getDeleteIds.html) Gets a list of referenced event ids
- [`getDeleteCoordinates`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getDeleteCoordinates.html) Get the list of replaceable event coordinates the event is referencing

### Emojis

- [`getPackName`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getPackName.html) Gets the emoji pack name
- [`getEmojis`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getEmojis.html) Get all emojis in an emoji pack
- [`getEmojiTag`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getEmojiTag.html) CGets an "emoji" tag that matches an emoji code

### URLs

- [`getURLFilename`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getURLFilename.html) returns the filename part fo the path in a URL
- [`isAudioURL`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.isAudioURL.html) Checks if the URL ends with a audio file extension
- [`isVideoURL`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.isVideoURL.html) Checks if the URL ends with a video file extension
- [`isImageURL`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.isImageURL.html) Checks if the URL ends with a image file extension
- [`isStreamURL`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.isStreamURL.html) Checks if the URL ends with a stream file extension

### Tags

- [`isETag`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.isETag.html) Checks if tag is an "e" tag and has at least one value
- [`isATag`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.isATag.html) Checks if tag is an "a" tag and has at least one value
- [`isPTag`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.isPTag.html) Checks if tag is an "p" tag and has at least one value
- [`isDTag`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.isDTag.html) Checks if tag is an "d" tag and has at least one value
- [`isRTag`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.isRTag.html) Checks if tag is an "r" tag and has at least one value
- [`isTTag`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.isTTag.html) Checks if tag is an "t" tag and has at least one value

### Hidden Tags

Hidden tags are used in [NIP-51](https://github.com/nostr-protocol/nips/blob/master/51.md) lists and [NIP-60](https://github.com/nostr-protocol/nips/blob/master/60.md) wallets

- [`canHaveHiddenTags`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.canHaveHiddenTags.html) Checks if a given event kind can have hidden tags
- [`hasHiddenTags`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.hasHiddenTags.html) Checks if an event has hidden tags
- [`getHiddenTags`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.getHiddenTags.html) Returns the hidden tags for an event if they are unlocked
- [`isHiddenTagsLocked`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.isHiddenTagsLocked.html) Checks if the hidden tags are locked
- [`unlockHiddenTags`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.unlockHiddenTags.html) Unlocks the hidden tags using a `signer`
- [`modifyEventTags`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.modifyEventTags.html) Modifies an events public or hidden tags

### Filters

- [`isFilterEqual`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.isFilterEqual.html) Check if two filters are equal

### Time

- [`unixNow`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-core.Helpers.unixNow.html) Returns the current unix timestamp

## Factory Helpers

The [`applesauce-factory`](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-factory.Helpers.html) package exports some helpers for building events and tags

Some of the most useful ones are

- [`fillAndTrimTag`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-factory.Helpers.fillAndTrimTag.html) Replaces `undefined` or `null` in tags with `""` and trims to tag down to a set length if it ends with `""`
- [`createQTagFromEventPointer`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-factory.Helpers.createQTagFromEventPointer.html) Creates a `"q"` tag for from an `EventPointer` to tag quoted events
- [`createPTagFromProfilePointer`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-factory.Helpers.createPTagFromProfilePointer.html) Creates a `"p"` tag for from a `ProfilePointer` to tag mentioned pubkeys
```

## File: core/models.md

````markdown
# Models

Models are pre-built methods for subscribing to computed state from the `EventStore`.

:::info
Models do not fetch any events from relays, they only subscribe to the events that are already in the event store.
:::

## Using models

The [`eventStore.model`](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-core.EventStore.html#model) method can be used to create a model and returns a rxjs observable that can be subscribed to.

```ts
import { TimelineModel } from "applesauce-core/models";

// The first argument is the model constructor and the remaining are passed to the model
const observable = eventStore.model(TimelineModel, { kinds: [1] });

// start the query by subscribing to it
observable.subscribe((events) => {
  console.log(events);
});

// adding events to the event store will update the timeline query
eventStore.add({kind: 1, content: 'new note', ...})
```

## Performance

Models with similar arguments are cached in the event store and reused for performance reasons. This can help with multiple UI components subscribing to the same model.

```ts
import { ProfileModel } from 'applesauce-core/models';

// Create the first model
const first = eventStore.model(ProfileModel, { pubkey: 'pubkey' });

// Create the second model
const second = eventStore.model(ProfileModel, { pubkey: 'pubkey' });

// Both will be the same observable
console.log(first === second); // true
```

## Prebuilt Models

There are some common prebuilt models that come with `applesauce-core`

- [`ProfileModel`](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-core.Models.ProfileModel.html) subscribes to a single pubkey's profile (kind 0)
- [`TimelineModel`](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-core.Models.TimelineModel.html) subscribes to a sorted array of events that match filters
- [`RepliesQuery`](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-core.Models.RepliesModel.html) subscribes to all NIP-10 and NIP-22 replies to an event

And there are a lot more in [the docs](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-core.Models.html)

## Custom Models

A custom model is simply a function that returns a [`Model`](https://hzrd149.github.io/applesauce/typedoc/types/applesauce-core.Model.html) function.

```ts
import { Model } from 'applesauce-core';

function CustomModel(arg: string): Model<string> {
	return (eventStore) =>
		new Observable((observer) => {
			// observable code here
			observer.next('testing');
		});
}
```

As an example here is a custom model that will parse a [NIP-78](https://github.com/nostr-protocol/nips/blob/master/78.md) app event that contains JSON

```ts
import { map } from 'rxjs/operators';
import { Model } from 'applesauce-core';

/** A model that gets JSON from a app data event */
function AppSettingsModel<T>(pubkey: string): Model<T> {
	return (eventStore) =>
		eventStore.replaceable(30078, pubkey, 'app-settings').pipe(
			map((event) => {
				if (!event) return undefined;
				return JSON.parse(event.content) as T;
			})
		);
}

// Create the model and subscribe to it
const sub = eventStore
	.model(AppSettingsModel, '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d')
	.subscribe((json) => {
		// json will either be undefined or { theme: string }
		if (json) console.log('updated data', json);
	});

// Add an event to the event store to trigger the model
eventStore.add({
	kind: 30078,
	content: '{"theme": "dark"}'
	// rest of event
});
```
````

## File: factory/blueprints.md

````markdown
# Event Blueprints

Blueprints are pre-configured templates for creating common Nostr events. They encapsulate the logic for setting the correct event kind, content, and tags for specific event types, making it easy to create well-formed Nostr events.

## Using Blueprints

### With EventFactory

The most common way to use blueprints is through an `EventFactory` instance. This allows you to reuse the same context (signer, relay hints, etc.) across multiple events.

```typescript
import { EventFactory } from 'applesauce-factory';
import { NoteBlueprint, ReactionBlueprint } from 'applesauce-factory/blueprints';

// Create a factory with your context
const factory = new EventFactory({
	signer: mySigner,
	client: { name: 'MyApp', address: { identifier: 'myapp', pubkey: 'pubkey...' } }
});

// Create events using the factory's helper methods
const note = await factory.note('Hello, Nostr!');
const reaction = await factory.reaction(someEvent, '🔥');

// Or use the generic create method with any blueprint
const customNote = await factory.create(NoteBlueprint, 'Custom note content #nostr', {
	zapSplit: [{ pubkey: 'pubkey...', weight: 100 }]
});
```

### With One-off Context

For one-time event creation, you can use the `create` function with a context and blueprint:

```typescript
import { create } from 'applesauce-factory';
import { NoteBlueprint, CommentBlueprint } from 'applesauce-factory/blueprints';

// Create a single event with a one-off context
const note = await create(
	{ signer: mySigner }, // context
	NoteBlueprint, // blueprint constructor
	'Hello, world!' // blueprint arguments
);

// Create a comment on an existing event
const comment = await create({ signer: mySigner }, CommentBlueprint, parentEvent, 'Great post!');
```

## Available Blueprints

- `NoteBlueprint(content, options?)`
- `CommentBlueprint(parent, content, options?)`
- `NoteReplyBlueprint(parent, content, options?)`
- `ReactionBlueprint(event, emoji?)`
- `ShareBlueprint(event, options?)`
- `PicturePostBlueprint(pictures, content, options?)`
- `FileMetadataBlueprint(file, options?)`
- `DeleteBlueprint(events)`
- `LiveStreamBlueprint(title, options?)`

And a lot more in the [reference](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-factory.Blueprints.html).

## Custom Blueprints

You can create your own custom blueprints by following the same pattern used by the built-in blueprints. A blueprint is a function that returns a call to the `blueprint()` helper function.

### Basic Custom Blueprint

```typescript
import { kinds } from 'nostr-tools';
import { blueprint } from 'applesauce-factory';
import { includeSingletonTag, MetaTagOptions } from 'applesauce-factory/operations';

/** Custom event blueprint */
export function AppConfigBlueprint(config: Record<string, any>) {
	return blueprint(
		kinds.AplicationData, // or your custom kind number
		// Add your operations here
		setContent(JSON.stringify(config)),
		includeSingletonTag(['d', 'app-config'])
	);
}
```

### Using Your Custom Blueprint

Once created, use your custom blueprint just like the built-in ones:

```typescript
// With EventFactory
const customEvent = await factory.create(AppConfigBlueprint, { theme: 'light' });

// With one-off context
const advancedEvent = await create({ signer: mySigner }, AppConfigBlueprint, { theme: 'light' });
```

## Blueprint Patterns

### Common Patterns

1. **Type Safety**: Always define TypeScript types for your blueprint options
2. **Conditional Operations**: Use ternary operators to conditionally apply operations
3. **Reusable Operations**: Extract common logic into reusable operation functions
4. **Context Usage**: Leverage the context for relay hints, custom emojis, and other shared data

### Best Practices

- Keep blueprints focused on a single event type
- Use descriptive names and comprehensive JSDoc comments
- Validate inputs when necessary (like the `PicturePostBlueprint` does for image types)
- Combine multiple operations for complex event structures
- Always handle optional parameters gracefully
````

## File: factory/event-factory.md

````markdown
# EventFactory

The `EventFactory` class is the main interface for creating, building, and modifying Nostr events. It provides a convenient wrapper around event operations and blueprints, making it easy to work with different types of Nostr events.

## Creating an EventFactory

The `EventFactory` is initialized with an `EventFactoryContext` that contains configuration options including signers, relay hints, and client information.

### Basic Usage

```typescript
import { EventFactory } from 'applesauce-factory';

// Create with empty context (minimal setup)
const factory = new EventFactory();

// Create with signer
const factory = new EventFactory({
	signer: mySigner // Any NIP-07 compatible signer
});
```

### With Full Context

```typescript
import { EventFactory } from 'applesauce-factory';

const factory = new EventFactory({
	// Required for signing events
	signer: {
		getPublicKey: () => 'your-pubkey',
		signEvent: (template) => signedEvent,
		nip04: { encrypt, decrypt }, // Optional NIP-04 support
		nip44: { encrypt, decrypt } // Optional NIP-44 support
	},

	// Optional: Add client tag to events
	client: {
		name: 'My Nostr App',
		address: { identifier: 'my-app', pubkey: 'app-pubkey' }
	},

	// Optional: Provide relay hints for tags
	getEventRelayHint: (eventId) => 'wss://relay.example.com',
	getPubkeyRelayHint: (pubkey) => 'wss://relay.example.com',

	// Optional: Custom emojis for text content
	emojis: [{ name: 'custom', url: 'https://example.com/emoji.png' }]
});
```

## Core Methods

### `create()` - Using Blueprints

The `create()` method uses pre-built blueprints to create common event types. Blueprints are pre-built sets of operations that can be used to create events.

```typescript
// Create a short text note (kind 1)
const noteEvent = await factory.create(NoteBlueprint, 'Hello Nostr!');

// Create a reaction event (kind 7)
const reactionEvent = await factory.create(ReactionBlueprint, eventToReactTo, '+');

// Create a reply to a note
const replyEvent = await factory.create(NoteReplyBlueprint, noteToReplyTo, 'Hello back!');

// Create a comment (NIP-22)
const commentEvent = await factory.create(CommentBlueprint, articleToCommentOn, 'Great article!');
```

### `build()` - Build an event using operations

The `build()` method takes a starting template and builds an event using operations.

```typescript
const customEvent = await factory.build(
	// Start with a template
	{ kind: 30023 },
	setContent('# My Article\n\nThis is my article content...'),
	// Include the "title" and "published_at" tags
	includeNameValueTag(['title', 'My Article Title']),
	includeNameValueTag(['published_at', '1234567890']),
	// Include only one "d" tag
	includeSingletonTag(['d', 'article-id'])
);
```

### `modify()` - Updating Existing Events

The `modify()` method updates an existing event with a new `created_at` timestamp and operations.

```typescript
// Modify an existing event
const modifiedEvent = await factory.modify(
	existingEvent,
	// Replace the "title" and "published_at" tags
	includeNameValueTag(['title', 'My Article Title']),
	includeNameValueTag(['published_at', '1234567890'])
);

// Modify tags specifically
const updatedEvent = await factory.modifyTags(existingEvent, addPubkeyTag('user_pubkey'));
```

## Event Lifecycle

### 1. Template → Signed

```typescript
// 1. Create template
const draft = await factory.build({
	kind: 1,
	content: 'Hello Nostr!'
});

// 2. Sign the event (creates NostrEvent)
const signed = await factory.sign(draft);
```

### 2. Working with Operations

Operations are functions that modify events during creation or modification:

```typescript
import {
	setContent,
	addHashtags,
	addMentions,
	includeClientTag
} from 'applesauce-factory/operations';

const event = await factory.build(
	{ kind: 1 },
	setContent('My post content'),
	addHashtags(['nostr', 'bitcoin']),
	addMentions(['npub1...']),
	includeClientTag('My App', 'naddr1...')
);
```

## Helper Methods

The `EventFactory` includes convenient helper methods for common event types:

```typescript
// Short text note
const note = await factory.note('Hello World!', {
	hashtags: ['greeting']
});

// Reply to a note
const reply = await factory.noteReply(noteToReplyTo, 'Great post!');

// Reaction
const reaction = await factory.reaction(eventToReactTo, '🔥');

// Delete event
const deleteEvent = await factory.delete(
	[eventToDelete, ...eventsToDelete],
	"I didn't mean to post my nsec1..."
);

// Share/repost
const share = await factory.share(eventToShare);

// Comment (NIP-22)
const comment = await factory.comment(articleToCommentOn, 'Interesting perspective!');
```

## Advanced Features

### Encrypted Content

When working with encrypted content in events, the factory preserves plaintext content so the app wont need to decrypt it later:

```typescript
// Create a draft NIP-04 message
const draft = await factory.build(
	{ kind: 4 },
	setEncryptedContent('other_pubkey', 'Hello how have you been?'),
	includeNameValueTag(['p', 'other_pubkey'])
);

// Signe the event
const signed = await factory.sign(draft);

// The plaintext content is still available for the app to use
const content = getEncryptedContent(signed);
```

### Replaceable Events

For replaceable events (kinds 10000-19999 and 30000-39999), the factory automatically includes required `d` tags:

```typescript
// Automatically adds "d" tag for addressable events
const profileEvent = await factory.build({
	kind: 30023, // Long-form content
	content: 'Article content...'
	// "d" tag will be automatically added if missing
});
```

### Relay Hints

When relay hint functions are provided in the context, they're automatically used for `e` and `p` tags:

```typescript
const factory = new EventFactory({
	signer: mySigner,
	getEventRelayHint: (eventId) => 'wss://relay.example.com',
	getPubkeyRelayHint: (pubkey) => 'wss://relay.example.com'
});

// Tags will automatically include relay hints
const reply = await factory.noteReply('Great post!', 'event-id');
// Results in: ["e", "event-id", "wss://relay.example.com"]
```

## Error Handling

```typescript
try {
	const event = await factory.create(NoteBlueprint, 'Hello World!');
	console.log('Event created:', event);
} catch (error) {
	if (error.message.includes('signer')) {
		console.error('Signer not available or failed');
	} else {
		console.error('Event creation failed:', error);
	}
}
```
````

## File: factory/event-operations.md

````markdown
# Event Operations

Event operations are the core building blocks of the event factory system. They provide a composable, functional approach to creating and modifying Nostr events by focusing on single-responsibility transformations.

## Overview

An event operation is a function that takes an event template and returns a modified version of that event. Operations are designed to be:

- **Composable**: Multiple operations can be chained together using `eventPipe()`
- **Pure**: Operations don't mutate the input, they return new objects
- **Focused**: Each operation handles one specific aspect of event creation/modification
- **Async-aware**: Operations can be synchronous or asynchronous

See all avaliable event operations in the [reference](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-factory.Operations.EventOperations.html).

## Type Definition

```typescript
type EventOperation = (
	draft: EventTemplate,
	context: EventFactoryContext
) => EventTemplate | Promise<EventTemplate>;
```

Every event operation receives:

- **`draft`**: The current event template/draft to transform
- **`context`**: An `EventFactoryContext` containing optional signer, relay hints, emojis, and client information

## Core Patterns

### 1. Simple Property Operations

These operations modify basic event properties like content or timestamps:

```typescript
// Set event content
export function setContent(content: string): EventOperation {
	return async (draft) => {
		return { ...draft, content };
	};
}

// Update created_at timestamp
export function updateCreatedAt(): EventOperation {
	return (draft) => ({ ...draft, created_at: unixNow() });
}
```

### 2. Tag Manipulation Operations

These operations modify the event's tags array using the [`modifyPublicTags`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-factory.Operations.EventOperations.modifyPublicTags.html) and [`modifyHiddenTags`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-factory.Operations.EventOperations.modifyHiddenTags.html) event operations and some [tag operations](./tag-operations.md):

```typescript
// Include a singleton tag (only one instance allowed)
export function includeSingletonTag(tag: [string, ...string[]], replace = true): EventOperation {
	return modifyPublicTags(setSingletonTag(tag, replace));
}

// Include NIP-31 alt tag
export function includeAltTag(description: string): EventOperation {
	return modifyPublicTags(setSingletonTag(['alt', description]));
}
```

### 3. Context-Aware Operations

These operations use the context to make decisions or fetch additional data:

```typescript
// Include reaction tags with relay hints
export function includeReactionTags(event: NostrEvent): EventOperation {
	return async (draft, ctx) => {
		let tags = Array.from(draft.tags);

		const eventHint = await ctx?.getEventRelayHint?.(event.id);
		const pubkeyHint = await ctx?.getPubkeyRelayHint?.(event.pubkey);

		// Add tags with relay hints if available
		tags = ensureEventPointerTag(tags, {
			id: event.id,
			relays: eventHint ? [eventHint] : undefined
		});

		return { ...draft, tags };
	};
}
```

### 4. Composite Operations

These operations can combine multiple smaller operations using `eventPipe()` for example:

```typescript
// Set text content with automatic processing
export function setShortTextContent(content: string, options?: TextContentOptions): EventOperation {
	return eventPipe(
		setContent(content), // Set the content
		repairContentNostrLinks(), // Fix @mentions
		tagPubkeyMentionedInContent(), // Add "p" tags for mentions
		includeQuoteTags(), // Add "q" tags for quotes
		includeContentHashtags(), // Add "t" tags for hashtags
		options?.emojis ? includeContentEmojiTags(options.emojis) : skip(),
		options?.contentWarning !== undefined ? setContentWarning(options.contentWarning) : skip()
	);
}
```

## Custom Operations

### Basic Custom Operation

Here's how to create a simple operation that adds a "title" tag:

```typescript
export function setTitle(title: string): EventOperation {
	return (draft) => {
		let tags = Array.from(draft.tags);

		// Remove existing title tags
		tags = tags.filter((tag) => tag[0] !== 'title');

		// Add new title tag
		tags.push(['title', title]);

		return { ...draft, tags };
	};
}
```

### JSON Content Merger Operation

Here's an example of a more complex operation that merges JSON data into existing JSON content:

```typescript
export function mergeJsonContent(jsonData: Record<string, any>): EventOperation {
	return (draft) => {
		let existingContent: Record<string, any> = {};

		// Try to parse existing content as JSON
		if (draft.content) {
			try {
				existingContent = JSON.parse(draft.content);
			} catch (error) {
				// If parsing fails, treat as empty object
				existingContent = {};
			}
		}

		// Merge the new data with existing content
		const mergedContent = { ...existingContent, ...jsonData };

		// Return draft with updated JSON content
		return { ...draft, content: JSON.stringify(mergedContent) };
	};
}

// Usage example:
const draft = await factory.modify(
	existingEvent,
	mergeJsonContent({
		version: '1.0',
		author: 'Alice',
		tags: ['music', 'art']
	})
);
```

### Context-Aware Custom Operation

Here's an operation that uses the context to conditionally add client information:

```typescript
export function includeClientTag(): EventOperation {
	return (draft, ctx) => {
		// Only add client tag if client info is available in context
		if (!ctx.client?.name) return draft;

		let tags = Array.from(draft.tags);

		// Remove existing client tags
		tags = tags.filter((tag) => tag[0] !== 'client');

		// Add client tag with optional address
		const clientTag = ['client', ctx.client.name];
		if (ctx.client.address) {
			const { kind, pubkey, identifier } = ctx.client.address;
			clientTag.push(`${kind}:${pubkey}:${identifier}`);
		}

		tags.push(clientTag);

		return { ...draft, tags };
	};
}
```

### Async Custom Operation

Operations can be asynchronous when they need to perform I/O or complex computations:

```typescript
export function includeHashOfContent(): EventOperation {
	return async (draft) => {
		// Simulate async hash computation
		const hash = await computeHash(draft.content);

		let tags = Array.from(draft.tags);
		tags = tags.filter((tag) => tag[0] !== 'content-hash');
		tags.push(['content-hash', hash]);

		return { ...draft, tags };
	};
}

async function computeHash(content: string): Promise<string> {
	// Your hash implementation here
	return 'sha256:' + content.length.toString(); // Simplified example
}
```

## Best Practices

### 1. Single Responsibility

Each operation should focus on one specific transformation:

```typescript
// Good: Focused on one thing
export function setTitle(title: string): EventOperation {
	/* ... */
}

// Avoid: Doing too many things
export function setTitleAndContentAndTags(/* ... */) {
	/* ... */
}
```

### 2. Immutability

Always return new objects, never mutate the input:

```typescript
// Good: Creates new objects
return { ...draft, content: newContent };

// Bad: Mutates input
draft.content = newContent;
return draft;
```

### 3. Array Copying

When modifying tags, always copy the array first:

```typescript
// Good: Copy first
let tags = Array.from(draft.tags);
tags.push(newTag);

// Bad: Direct mutation
draft.tags.push(newTag);
```

### 4. Conditional Operations

Use `skip()` for conditional operations in pipes:

```typescript
eventPipe(
	setContent(content),
	shouldAddTitle ? setTitle(title) : skip()
	// ... other operations
);
```

### 5. Error Handling

Handle errors gracefully if there error isn't critical, especially in async operations:

```typescript
export function safeJsonOperation(data: any): EventOperation {
	return (draft) => {
		try {
			const content = JSON.stringify(data);
			return { ...draft, content };
		} catch (error) {
			console.warn('Failed to serialize JSON data:', error);
			return draft; // Return unchanged on error
		}
	};
}
```

## Composition

The `eventPipe()` function allows you to compose multiple operations into a single operation:

```typescript
function setArticleContent(content: string): EventOperation {
	return eventPipe(
		// Set the content
		setShortTextContent(content),
		// Add an alt tag for accessibility
		includeAltTag('A long form article'),
		// Update the created_at timestamp
		updateCreatedAt(),
		// Add a client tag
		includeClientTag()
	);
}

// Use in event factory
const event = await factory.build({ kind: 300023 }, setArticleContent('...content'));
```

Operations in a pipe are executed sequentially, with each operation receiving the result of the previous operation. The `eventPipe()` function handles both synchronous and asynchronous operations seamlessly.
````

## File: factory/package.md

````markdown
# Factory

The `applesauce-factory` package provides the `EventFactory` and operations for creating and modifying Nostr events.

## Features

- Works with any NIP-07 signer ( `applesauce-signers` )
- Tons of pre-built operations for creating and modifying events
- Support for encrypted tags in NIP-51 events
- Pre-built operations for NIP-59 gift wrapping
- Blueprints for common event types
- Relays hints for `e` and `p` tags

## Installation

:::code-group

```sh [npm]
npm install applesauce-factory
```

```sh [yarn]
yarn install applesauce-factory
```

```sh [pnpm]
pnpm install applesauce-factory
```

:::
````

## File: factory/tag-operations.md

````markdown
# Tag Operations

Tag operations are specialized functions designed to modify arrays of Nostr event tags. Unlike [event operations](./event-operations.md) which work on entire events, tag operations focus exclusively on transforming tag arrays. This makes them perfect for use with [`modifyPublicTags`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-factory.Operations.EventOperations.modifyPublicTags.html) and [`modifyHiddenTags`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-factory.Operations.EventOperations.modifyHiddenTags.html) event operations, allowing precise control over both public event tags and hidden encrypted tags on NIP-51 lists.

## Overview

A tag operation is a function that takes an array of tags and returns a modified version of that array. Tag operations are designed to be:

- **Composable**: Multiple tag operations can be chained together using `tagPipe()`
- **Pure**: Operations don't mutate the input array, they return new arrays
- **Focused**: Each operation handles one specific type of tag transformation
- **Async-aware**: Operations can be synchronous or asynchronous
- **Context-aware**: Operations can use relay hints and other context information

See all available tag operations in the [reference](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-factory.Operations.TagOperations.html).

## Type Definition

```typescript
type TagOperation = (
	tags: string[][],
	context: EventFactoryContext
) => string[][] | Promise<string[][]>;
```

Every tag operation receives:

- **`tags`**: The current array of tags to transform
- **`context`**: An `EventFactoryContext` containing optional signer, relay hints, emojis, and client information

## Usage with Event Operations

Tag operations are typically used within event operations via `modifyPublicTags` and `modifyHiddenTags`:

```typescript
// Modify public tags
const eventOp = modifyPublicTags(
	addPubkeyTag('npub1...'),
	setSingletonTag(['title', 'My List']),
	removeEventTag('event-id')
);

// Modify hidden tags (requires signer)
const hiddenOp = modifyHiddenTags(addEventTag('secret-event-id'), addPubkeyTag('secret-pubkey'));

// Use both in event creation
const event = await factory.build(
	{ kind: 30000 }, // Follow set
	eventOp,
	hiddenOp
);
```

## Core Patterns

### 1. Simple Tag Manipulation

These operations add, remove, or modify basic tags:

```typescript
// Add a pubkey tag with relay hint
export function addPubkeyTag(pubkey: string | ProfilePointer, replace = true): TagOperation {
	return async (tags, { getPubkeyRelayHint }) => {
		const pointer = typeof pubkey === 'string' ? { pubkey: pubkey } : { ...pubkey };

		// Add relay hint if available
		if (getPubkeyRelayHint && pointer.relays?.[0] === undefined) {
			const hint = await getPubkeyRelayHint(pointer.pubkey);
			if (hint) pointer.relays = [hint];
		}

		// Remove existing matching tags if replace is true
		if (replace) tags = tags.filter((t) => !(t[0] === 'p' && t[1] === pointer.pubkey));

		// Add new tag
		return [...tags, createPTagFromProfilePointer(pointer)];
	};
}

// Remove all matching tags
export function removePubkeyTag(pubkey: string): TagOperation {
	return (tags) => tags.filter((t) => !(t[0] === 'p' && t[1] === pubkey));
}
```

### 2. Singleton Tag Operations

These operations ensure only one instance of a tag type exists using the [`ensureSingletonTag`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-factory.Helpers.ensureSingletonTag.html) helper function:

```typescript
// Set a singleton tag (only one allowed)
export function setSingletonTag(tag: [string, ...string[]], replace = true): TagOperation {
	return (tags) => ensureSingletonTag(tags, tag, replace);
}

// Remove all instances of a singleton tag
export function removeSingletonTag(tag: string): TagOperation {
	return (tags) => tags.filter((t) => !(t[0] === tag));
}
```

### 3. Name/Value Tag Operations

These operations handle tags with name-value pairs:

```typescript
// Add a name/value tag with optional custom matcher
export function addNameValueTag(
	tag: [string, string, ...string[]],
	replace = true,
	matcher?: (a: string, b: string) => boolean
): TagOperation {
	return (tags) => {
		if (replace) return ensureNamedValueTag(tags, tag, true, matcher);
		else return [...tags, tag];
	};
}

// Remove matching name/value tags
export function removeNameValueTag(tag: string[]): TagOperation {
	return (tags) => tags.filter((t) => !(t[0] === tag[0] && t[1] === tag[1]));
}
```

### 4. Context-Aware Operations

These operations use the context to fetch relay hints or other information:

```typescript
// Add event tag with automatic relay hint
export function addEventTag(id: string | EventPointer, replace = true): TagOperation {
	return async (tags, { getEventRelayHint }) => {
		const pointer = typeof id === 'string' ? { id } : id;

		// Fetch relay hint from context if available
		if (getEventRelayHint && pointer.relays?.[0] === undefined) {
			const hint = await getEventRelayHint(pointer.id);
			if (hint) pointer.relays = [hint];
		}

		// Remove existing tags if replace is true
		if (replace) tags = tags.filter((t) => !(t[0] === 'e' && t[1] === pointer.id));

		return [...tags, createETagFromEventPointer(pointer)];
	};
}
```

### 5. Specialized Operations

These operations handle specific use cases like bookmarks or relays:

```typescript
// Add relay tag with URL normalization
export function addRelayTag(url: string | URL, tagName = 'relay', replace = true): TagOperation {
	url = normalizeURL(url).toString();
	return addNameValueTag([tagName, url], replace, (a, b) => isSameURL(a, b));
}

// Add bookmark tag (handles both events and articles)
export function addEventBookmarkTag(event: NostrEvent): TagOperation {
	if (event.kind !== kinds.ShortTextNote && event.kind !== kinds.LongFormArticle)
		throw new Error(`Event kind (${event.kind}) cannot be added to bookmarks`);

	return isReplaceable(event.kind)
		? addCoordinateTag(getAddressPointerForEvent(event))
		: addEventTag(event.id);
}
```

## Custom Operations

### Basic Custom Operation

Here's how to create a simple operation that adds a custom tag:

```typescript
export function addCustomTag(value: string): TagOperation {
	return (tags) => {
		// Remove existing custom tags
		const filtered = tags.filter((tag) => tag[0] !== 'custom');

		// Add new custom tag
		return [...filtered, ['custom', value]];
	};
}
```

### Conditional Tag Operation

Create operations that conditionally modify tags:

```typescript
export function addConditionalTag(condition: boolean, tag: [string, ...string[]]): TagOperation {
	return (tags) => {
		if (!condition) return tags;

		// Remove existing tags of this type
		const filtered = tags.filter((t) => t[0] !== tag[0]);

		// Add the new tag
		return [...filtered, tag];
	};
}
```

### Async Tag Operation with Context

Operations can be asynchronous and use context:

```typescript
export function addTagWithRelayHint(eventId: string): TagOperation {
	return async (tags, { getEventRelayHint }) => {
		// Fetch relay hint asynchronously
		const relayHint = await getEventRelayHint?.(eventId);

		// Create tag with or without relay hint
		const tag = relayHint ? ['e', eventId, relayHint] : ['e', eventId];

		return [...tags, tag];
	};
}
```

### Bulk Tag Operation

Handle multiple items at once:

```typescript
export function addMultiplePubkeyTags(pubkeys: string[]): TagOperation {
	return async (tags, context) => {
		let result = [...tags];

		// Add each pubkey tag
		for (const pubkey of pubkeys) {
			result = await addPubkeyTag(pubkey)(result, context);
		}

		return result;
	};
}
```

## Best Practices

### 1. Immutability

Always return new arrays, never mutate the input:

```typescript
// Good: Creates new array
return [...tags, newTag];

// Bad: Mutates input
tags.push(newTag);
return tags;
```

### 2. Filtering Before Adding

When replacing tags, filter first:

```typescript
// Good: Filter then add
const filtered = tags.filter((t) => t[0] !== 'title');
return [...filtered, ['title', newTitle]];

// Avoid: Complex logic
return tags.map((t) => (t[0] === 'title' ? ['title', newTitle] : t));
```

### 3. Handle Edge Cases

Check for invalid inputs:

```typescript
export function safeAddTag(tag: [string, ...string[]]): TagOperation {
	// Validate tag format
	if (!tag || tag.length < 2 || !tag[0] || !tag[1]) {
		throw new Error('Invalid tag format');
	}

	return (tags) => {
		return [...tags, tag];
	};
}
```

### 4. Use Helper Functions

Leverage existing helper functions:

```typescript
import { ensureSingletonTag } from 'applesauce-factory/helpers/tag';

export function addUniqueTag(tag: [string, ...string[]]): TagOperation {
	// Replace any existing tags with the same name to ensure only one instance of the tag exists
	return (tags) => ensureSingletonTag(tags, tag, true);
}
```

## Composition

The `tagPipe()` function allows you to compose multiple tag operations into a single operation:

```typescript
function setupListTags(title: string, pubkeys: string[]): TagOperation {
	return tagPipe(
		// Set the title
		setSingletonTag(['title', title]),
		// Add all pubkeys
		...pubkeys.map((pubkey) => addPubkeyTag(pubkey)),
		// Remove any old description
		removeSingletonTag('description')
	);
}

// Use in event operation
const eventOp = factory.build(
	{ kind: 30000 },
	// Use the modifyPublicTags to modify the public tags on the event
	modifyPublicTags(setupListTags('My Friends', ['npub1...', 'npub2...']))
);
```

## Integration with Hidden Tags

Tag operations work seamlessly with both public and hidden tags using the [`modifyPublicTags`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-factory.Operations.EventOperations.modifyPublicTags.html) and [`modifyHiddenTags`](https://hzrd149.github.io/applesauce/typedoc/functions/applesauce-factory.Operations.EventOperations.modifyHiddenTags.html) event operations:

```typescript
// Create operations for both public and hidden tags
const publicTags = tagPipe(setSingletonTag(['title', 'Public List']), addPubkeyTag('public-user'));

const hiddenTags = tagPipe(addPubkeyTag('secret-user'), addPubkeyTag('other-user'));

// Apply to event
const event = await factory.build(
	{ kind: 30000 },
	modifyPublicTags(publicTags),
	modifyHiddenTags(hiddenTags)
);
```

This separation allows you to maintain public metadata while keeping sensitive information encrypted in hidden tags, perfect for NIP-51 lists and other privacy-focused applications.
````

## File: introduction/getting-started.md

````markdown
# Getting Started

Ready to build reactive Nostr applications with applesauce? Follow our step-by-step tutorial that will teach you everything you need to know.

## 📚 [Complete Tutorial](../tutorial/00-introduction)

Our beginner-friendly tutorial covers:

1. **[Event Store](../tutorial/01-event-store.md)** - The reactive database at the heart of applesauce
2. **[Helpers](../tutorial/02-helpers.md)** - Extract and parse data from Nostr events
3. **[Models](../tutorial/03-models.md)** - Build reactive UI components
4. **[Relay Pool](../tutorial/04-relays.md)** - Connect to Nostr relays and receive events
5. **[Loaders](../tutorial/05-loaders.md)** - Load specific events on-demand
6. **[Event Factory](../tutorial/06-event-factory.md)** - Create and sign events
7. **[Publishing](../tutorial/07-publishing.md)** - Publish events to relays
8. **[Actions](../tutorial/08-actions.md)** - Run complex actions like following users

Each section includes complete code examples and builds toward a working social media application.

## Quick Overview

Applesauce consists of several key components that work together:

### EventStore

A reactive in-memory database that stores Nostr events and notifies your UI when data changes.

```ts
import { EventStore } from 'applesauce-core';

const eventStore = new EventStore();

// Subscribe to timeline updates
eventStore.timeline({ kinds: [1] }).subscribe((notes) => {
	console.log(`Timeline updated with ${notes.length} notes`);
});
```

### Helpers

Utility functions that extract useful data from raw Nostr events.

```ts
import { getProfileContent, getDisplayName } from 'applesauce-core/helpers';

const profile = getProfileContent(profileEvent);
const name = getDisplayName(profile);
```

### Models

Pre-built subscriptions that combine EventStore with helpers for reactive UI components.

```ts
import { ProfileModel } from 'applesauce-core/models';

// Automatically parses and updates when profile changes
eventStore.model(ProfileModel, pubkey).subscribe((profile) => {
	console.log('Profile updated:', profile);
});
```

### RelayPool

Manages connections to Nostr relays and provides reactive subscriptions.

```ts
import { RelayPool, onlyEvents } from 'applesauce-relay';

const pool = new RelayPool();

pool
	.relay('wss://relay.damus.io')
	.subscription({ kinds: [1] })
	.pipe(onlyEvents())
	.subscribe((event) => {
		eventStore.add(event);
	});
```

### EventFactory

Creates and signs Nostr events using pre-built blueprints.

```ts
import { EventFactory } from 'applesauce-factory';
import { NoteBlueprint } from 'applesauce-factory/blueprints';

const factory = new EventFactory({ signer });

const note = await factory.create(NoteBlueprint, 'Hello Nostr!');
const signed = await factory.sign(note);
```

## Next Steps

- **Start with the [tutorial](../tutorial/00-introduction.md)** to learn step-by-step
- **Browse the [examples](https://hzrd149.github.io/applesauce/examples)** to see whats possible
- **Check the [API documentation](https://hzrd149.github.io/applesauce/typedoc/)** for detailed reference
````

## File: introduction/glossary.md

```markdown
# Glossary

## Event

A nostr event defined in [NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)

## Signer

A class that follows the [NIP-07](https://github.com/nostr-protocol/nips/blob/master/07.md) API

## Helper method

A function that takes an event and returns some computed value from it.

## Event store

A in-memory database of events that can be subscribed to. (see [Event Store](../core/event-store.md))

## Observable

A lazy stream of values that is active when subscribed to. (see [Observables](https://rxjs.dev/guide/observable))

## Model

Computed state from the event store that can be subscribed to. (see [Models](../core/models.md))

## Encrypted content

The `content` field of an event that is encrypted using NIP-04 or NIP-44.

## Hidden content

The `content` field that is encrypted by the signer to its own pubkey. primary used in NIP-51 lists.

## Hidden tags

An array of event tags that is in the **hidden content**
```

## File: introduction/packages.md

````markdown
# Applesauce packages

## Core

The `applesauce-core` package contains the `EventStore` and the majority of the helpers, and models. [see more](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-core.html)

:::code-group

```sh [npm]
npm install applesauce-core
```

```sh [yarn]
yarn install applesauce-core
```

```sh [pnpm]
pnpm install applesauce-core
```

:::

## Content

The `applesauce-content` package contains helpers for parsing text content and markdown. [see more](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-content.html)

:::code-group

```sh [npm]
npm install applesauce-content
```

```sh [yarn]
yarn install applesauce-content
```

```sh [pnpm]
pnpm install applesauce-content
```

:::

## Signers

The `applesauce-signers` package contains a bunch of NIP-07 compatible signer classes. [see more](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-signers.html)

:::code-group

```sh [npm]
npm install applesauce-signers
```

```sh [yarn]
yarn install applesauce-signers
```

```sh [pnpm]
pnpm install applesauce-signers
```

:::

## Accounts

The `applesauce-accounts` package contains the main `AccountManager` class and various types of common nostr account types. [see more](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-accounts.html)

:::code-group

```sh [npm]
npm install applesauce-accounts
```

```sh [yarn]
yarn install applesauce-accounts
```

```sh [pnpm]
pnpm install applesauce-accounts
```

:::

## Factory

The `applesauce-factory` package contains the main `EventFactory` class and a lot of [Blueprints](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-factory.Blueprints.html) and [Operations](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-factory.Operations.html) for creating an modifying nostr events. [see more](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-factory.html)

:::code-group

```sh [npm]
npm install applesauce-factory
```

```sh [yarn]
yarn install applesauce-factory
```

```sh [pnpm]
pnpm install applesauce-factory
```

:::

## Loaders

The `applesauce-loaders` package provides loaders that simplify fetching nostr events from multiple relays. These loaders can be integrated with any nostr connection framework of your choice. [see more](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-loaders.html)

:::code-group

```sh [npm]
npm install applesauce-loaders
```

```sh [yarn]
yarn install applesauce-loaders
```

```sh [pnpm]
pnpm install applesauce-loaders
```

:::

:::

## Actions

The `applesauce-actions` package provides prebuilt actions that apps can use. [see more](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-actions.html)

:::code-group

```sh [npm]
npm install applesauce-actions
```

```sh [yarn]
yarn install applesauce-actions
```

```sh [pnpm]
pnpm install applesauce-actions
```

:::

## Relays

The `applesauce-relay` package provides a flexible api for communicating with Nostr relays, built on top of [RxJS](https://rxjs.dev/).

:::code-group

```sh [npm]
npm install applesauce-relay
```

```sh [yarn]
yarn install applesauce-relay
```

```sh [pnpm]
pnpm install applesauce-relay
```

:::

## React

The `applesauce-react` package contains a bunch of useful react hooks for working with other applesauce packages. [see more](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-react.html)

:::code-group

```sh [npm]
npm install applesauce-react
```

```sh [yarn]
yarn install applesauce-react
```

```sh [pnpm]
pnpm install applesauce-react
```

:::

## Wallet

The `applesauce-wallet` package provides queries and actions for [NIP-60](https://github.com/nostr-protocol/nips/blob/master/60.md) cashu wallets.

:::code-group

```sh [npm]
npm install applesauce-wallet
```

```sh [yarn]
yarn install applesauce-wallet
```

```sh [pnpm]
pnpm install applesauce-wallet
```

:::
````

## File: loaders/address-loader.md

````markdown
# Address Loader

The Address Loader is a specialized loader for fetching Nostr replaceable events by their address (kind, pubkey, and optional identifier). It provides an efficient way to batch and deduplicate requests, cache results, and handle relay hints.

:::warning
The observable returned by the Address Loader MUST be subscribed to in order for the request to be made. No request will be sent until you call `.subscribe()` on the returned observable.
:::

## Basic Usage

```ts
import { createAddressLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';

// Create a relay pool
const pool = new RelayPool();

// Create an address loader (do this once at the app level)
const addressLoader = createAddressLoader(pool);

// Later, use the loader to fetch events by address
addressLoader({
	kind: 0,
	pubkey: 'user_pubkey',
	relays: ['wss://relay.example.com']
}).subscribe((event) => {
	console.log('Loaded profile:', event);
});
```

## Configuration Options

The `createAddressLoader` function accepts these options:

- `bufferTime`: Time interval to buffer requests in ms (default 1000)
- `bufferSize`: Max buffer size (default 200)
- `eventStore`: An event store used to deduplicate events
- `cacheRequest`: A method used to load events from a local cache
- `followRelayHints`: Whether to follow relay hints (default true)
- `lookupRelays`: Fallback lookup relays to check when event can't be found
- `extraRelays`: An array of relays to always fetch from

:::warning
If an event store is not provided, the loader will not be able to deduplicate events.
:::

## Working with Relay Pools

The Address Loader requires a request method for loading Nostr events from relays. You can provide this in multiple ways:

### Using a RelayPool instance

The simplest approach is to pass a RelayPool instance directly:

```ts
import { createAddressLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';

const pool = new RelayPool();
const addressLoader = createAddressLoader(pool, {
	eventStore,
	cacheRequest
});
```

### Using a custom request method

You can also provide a custom request method, such as one from nostr-tools:

```ts
import { createAddressLoader } from 'applesauce-loaders/loaders';
import { SimplePool } from 'nostr-tools';
import { Observable } from 'rxjs';

const pool = SimplePool();

// Create a custom request function using nostr-tools
function customRequest(relays, filters) {
	return new Observable((observer) => {
		const sub = pool.subscribeMany(relays, filters, {
			onevent: (event) => observer.next(event),
			eose: () => observer.complete()
		});

		return () => sub.close();
	});
}

// Create address loader with custom request
const addressLoader = createAddressLoader(customRequest, options);
```

## Loading from cache

For improved performance, you can configure the loader to use a local cache:

```ts
import { createAddressLoader } from 'applesauce-loaders/loaders';
import { openDB, getEventsForFilters } from 'nostr-idb';

// Setup a local event cache
const cache = await openDB();

function cacheRequest(filters) {
	return getEventsForFilters(cache, filters);
}

const addressLoader = createAddressLoader(pool, {
	cacheRequest,
	eventStore
});

// Events from cache are automatically marked using markFromCache
addressLoader({ kind: 0, pubkey: 'user_pubkey' }).subscribe((event) => {
	if (!isFromCache(event)) {
		// This is a new event from the network
		addEvents(cache, [event]);
	}
});
```

## Real-World Example

Here's how you might use the Address Loader in a React application to load user profiles:

```tsx
import { EventStore } from 'applesauce-core';
import { createAddressLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';
import { kinds } from 'nostr-tools';
import { useEffect, useState } from 'react';
import { EMPTY, ignoreElements, merge } from 'rxjs';

// Setup at app level
const eventStore = new EventStore();
const pool = new RelayPool();
const addressLoader = createAddressLoader(pool, {
	eventStore,
	lookupRelays: ['wss://purplepag.es/']
});

function ProfileComponent({ pubkey, relays }) {
	const [profile, setProfile] = useState(null);

	// Load the profile when component mounts
	useEffect(() => {
		// Check if we already have the profile
		if (eventStore.hasReplaceable(kinds.Metadata, pubkey)) {
			setProfile(eventStore.getLatestReplaceable(kinds.Metadata, pubkey));
			return;
		}

		// Load profile from the network
		const subscription = addressLoader({
			kind: kinds.Metadata,
			pubkey,
			relays
		}).subscribe((event) => {
			setProfile(JSON.parse(event.content));
		});

		return () => subscription.unsubscribe();
	}, [pubkey]);

	if (!profile) return <div>Loading profile...</div>;

	return (
		<div>
			<h2>{profile.name || 'Anonymous'}</h2>
			{profile.picture && <img src={profile.picture} alt="Profile" />}
			<p>{profile.about}</p>
		</div>
	);
}
```

## Loading Sequence

The Address Loader follows this sequence when loading events:

1. Attempt to load from cache (if configured)
2. Use relay hints from address pointers (if enabled)
3. Fetch from additional relays (if configured)
4. Try fallback lookup relays (if configured)

This approach ensures efficient event loading with minimal network requests while providing good fallback options for retrieving replaceable events.
````

## File: loaders/event-loader.md

````markdown
# Event Loader

The Event Loader is a specialized loader for fetching Nostr events by their IDs. It provides an efficient way to batch and deduplicate requests, cache results, and handle relay hints.

:::warning
The observable returned by the Event Loader MUST be subscribed to in order for the request to be made. No request will be sent until you call `.subscribe()` on the returned observable.
:::

## Basic Usage

```ts
import { createEventLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';

// Create a relay pool
const pool = new RelayPool();

// Create an event loader (do this once at the app level)
const eventLoader = createEventLoader(pool);

// Later, use the loader to fetch events
eventLoader({
	id: 'event_id',
	relays: ['wss://relay.example.com']
}).subscribe((event) => {
	console.log('Loaded event:', event);
});
```

## Configuration Options

The `createEventLoader` function accepts these options:

- `bufferTime`: Time interval to buffer requests in ms (default 1000)
- `bufferSize`: Max buffer size (default 200)
- `eventStore`: An event store used to deduplicate events
- `cacheRequest`: A method used to load events from a local cache
- `followRelayHints`: Whether to follow relay hints (default true)
- `extraRelays`: An array of relays to always fetch from

:::warning
If an event store is not provided, the loader will not be able to deduplicate events.
:::

## Working with Relay Pools

The Event Loader requires a request method for loading Nostr events from relays. You can provide this in multiple ways:

### Using a RelayPool instance

The simplest approach is to pass a RelayPool instance directly:

```ts
import { createEventLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';

const pool = new RelayPool();
const eventLoader = createEventLoader(pool, {
	eventStore,
	cacheRequest
});
```

### Using a custom request method

You can also provide a custom request method, such as one from nostr-tools:

```ts
import { createEventLoader } from 'applesauce-loaders/loaders';
import { SimplePool } from 'nostr-tools';

const pool = SimplePool();

// Create a custom request function using nostr-tools
function customRequest(relays, filters) {
	return new Observable((observer) => {
		const sub = pool.subscribeMany(relays, filters, {
			onevent: (event) => observer.next(event),
			eose: () => observer.complete()
		});

		return () => sub.close();
	});
}

// Create event loader with custom request
const eventLoader = createEventLoader(customRequest, options);
```

## Loading from cache

For improved performance, you can configure the loader to use a local cache:

```ts
import { createEventLoader } from 'applesauce-loaders/loaders';
import { openDB, getEventsForFilters } from 'nostr-idb';

// Setup a local event cache
const cache = await openDB();

function cacheRequest(filters) {
	return getEventsForFilters(cache, filters);
}

const eventLoader = createEventLoader(pool, {
	cacheRequest,
	eventStore
});

// Events from cache are automatically marked using markFromCache
eventLoader(pointer).subscribe((event) => {
	if (!isFromCache(event)) {
		// This is a new event from the network
		addEvents(cache, [event]);
	}
});
```

## Real-World Example

Here's how you might use the Event Loader in a React application:

```tsx
import { createEventLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';
import { EventStore } from 'applesauce-core';
import { useEffect } from 'react';

// Setup at app level
const eventStore = new EventStore();
const pool = new RelayPool();
const eventLoader = createEventLoader(pool, { eventStore });

function EventComponent({ eventId, relays }) {
	const [event, setEvent] = useState<Event | null>(null);

	// Load the event when component mounts
	useEffect(() => {
		const subscription = eventLoader({
			id: eventId,
			relays
		}).subscribe((event) => setEvent(event));

		return () => subscription.unsubscribe();
	}, [eventId]);

	if (!event) return <div>Loading...</div>;

	return <div>{event.content}</div>;
}
```

## Loading Sequence

The Event Loader follows this sequence when loading events:

1. Attempt to load from cache (if configured)
2. Use relay hints from event pointers (if enabled)
3. Fetch from additional relays (if configured)

This approach ensures efficient event loading with minimal network requests.
````

## File: loaders/package.md

````markdown
# Loaders

The `applesauce-loaders` package provides a set of pre-built loaders for common methods of loading events from a relay pool.

## Features

- Easy to setup and use
- Built-in request batching
- Built-in event deduplication (using an event store)
- Flexible enough to work with any relay connection pool

## Installation

:::code-group

```sh [npm]
npm install applesauce-loaders
```

```sh [yarn]
yarn install applesauce-loaders
```

```sh [pnpm]
pnpm install applesauce-loaders
```

:::
````

## File: loaders/reactions-loader.md

````markdown
# Reactions Loader

The Reactions Loader is a specialized loader for fetching [NIP-25](https://github.com/nostr-protocol/nips/blob/master/25.md) reaction events for any given Nostr event. It is built on top of the [Tag Value Loader](./tag-value-loader.md) and automatically handles both regular events and addressable events.

:::warning
The observable returned by the Reactions Loader MUST be subscribed to in order for the request to be made. No request will be sent until you call `.subscribe()` on the returned observable.
:::

## Basic Usage

```ts
import { createReactionsLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';

// Create a relay pool
const pool = new RelayPool();

// Create a reactions loader (do this once at the app level)
const reactionsLoader = createReactionsLoader(pool);

// Later, use the loader to fetch reactions for any event
const someEvent = { id: 'event_id', kind: 1 /* ... */ };

reactionsLoader(someEvent, ['wss://relay.example.com']).subscribe((reactionEvent) => {
	console.log('Received reaction:', reactionEvent);
});
```

## How It Works

The Reactions Loader automatically:

- Determines if the target event is addressable (replaceable) or a regular event
- Uses the appropriate tag (`a` for addressable events, `e` for regular events) to fetch reactions
- Merges relay hints from the event's seen relays (if `useSeenRelays` is enabled)
- Filters results to only return NIP-25 reaction events (kind 7)

## Configuration Options

The `createReactionsLoader` function accepts these options:

- `useSeenRelays`: Whether to include relays where the event was seen (default `true`)
- All other options from Tag Value Loader: `bufferTime`, `bufferSize`, `authors`, `since`, `cacheRequest`, `extraRelays`, `eventStore`

```ts
const reactionsLoader = createReactionsLoader(pool, {
	useSeenRelays: true,
	bufferTime: 500,
	eventStore,
	cacheRequest
});
```

## Example with React

```tsx
import { createReactionsLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';
import { useEffect, useState } from 'react';

// Setup at app level
const pool = new RelayPool();
const reactionsLoader = createReactionsLoader(pool);

function ReactionsComponent({ event }) {
	const [reactions, setReactions] = useState([]);

	useEffect(() => {
		const subscription = reactionsLoader(event).subscribe((reactionEvent) => {
			setReactions((prev) => [...prev, reactionEvent]);
		});

		return () => subscription.unsubscribe();
	}, [event.id]);

	// Group reactions by content
	const reactionCounts = reactions.reduce((acc, reaction) => {
		const content = reaction.content || '+';
		acc[content] = (acc[content] || 0) + 1;
		return acc;
	}, {});

	return (
		<div>
			<h3>Reactions ({reactions.length})</h3>
			<div className="reactions-list">
				{Object.entries(reactionCounts).map(([emoji, count]) => (
					<span key={emoji} className="reaction-pill">
						{emoji} {count}
					</span>
				))}
			</div>
		</div>
	);
}
```

## Understanding Reaction Events

NIP-25 reaction events have the following structure:

- **Kind**: 7 (reaction)
- **Content**: Usually an emoji (👍, ❤️, etc.) or "+" for likes, "-" for dislikes
- **Tags**: Include `e` or `a` tags referencing the reacted-to event

Example reaction event:

```json
{
	"kind": 7,
	"content": "🔥",
	"tags": [
		["e", "event_id_being_reacted_to"],
		["p", "pubkey_of_event_author"]
	],
	"created_at": 1234567890,
	"pubkey": "reactor_pubkey"
}
```

## Addressable vs Regular Events

The loader automatically handles both types of events:

- **Regular events** (kind 0, 1, etc.): Uses `e` tags to find reactions
- **Addressable events** (kind 30000 to 39999): Uses `a` tags with the replaceable address

This abstraction means you don't need to worry about the event type - just pass any event to the loader.

## Advanced Example: Reaction Analytics

```tsx
import { createReactionsLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';
import { useEffect, useState } from 'react';

const pool = new RelayPool();
const reactionsLoader = createReactionsLoader(pool);

function ReactionAnalytics({ event }) {
	const [reactions, setReactions] = useState([]);
	const [uniqueReactors, setUniqueReactors] = useState(new Set());

	useEffect(() => {
		const subscription = reactionsLoader(event).subscribe((reaction) => {
			setReactions((prev) => [...prev, reaction]);
			setUniqueReactors((prev) => new Set([...prev, reaction.pubkey]));
		});

		return () => subscription.unsubscribe();
	}, [event.id]);

	const positiveReactions = reactions.filter(
		(r) => r.content === '+' || r.content === '👍' || r.content === '❤️'
	);

	const negativeReactions = reactions.filter((r) => r.content === '-' || r.content === '👎');

	return (
		<div>
			<h3>Reaction Summary</h3>
			<p>Total reactions: {reactions.length}</p>
			<p>Unique reactors: {uniqueReactors.size}</p>
			<p>Positive: {positiveReactions.length}</p>
			<p>Negative: {negativeReactions.length}</p>
		</div>
	);
}
```

## Performance Considerations

The Reactions Loader is optimized for performance through:

- **Batching**: Multiple reaction requests are automatically batched together
- **Deduplication**: Events are deduplicated when an event store is provided
- **Caching**: Local cache integration prevents unnecessary network requests
- **Relay optimization**: Uses seen relays from the target event for better discovery

For best performance, ensure you provide an `eventStore` and `cacheRequest` when creating the loader.
````

## File: loaders/tag-value-loader.md

````markdown
# Tag Value Loader

The Tag Value Loader is a specialized loader for fetching Nostr events by their tag values. It provides an efficient way to batch and deduplicate requests, cache results, and handle relay hints.

:::warning
The observable returned by the Tag Value Loader MUST be subscribed to in order for the request to be made. No request will be sent until you call `.subscribe()` on the returned observable.
:::

## Basic Usage

```ts
import { createTagValueLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';

// Create a relay pool
const pool = new RelayPool();

// Create a tag value loader for a specific tag (do this once at the app level)
const eTagLoader = createTagValueLoader(pool, 'e');

// Later, use the loader to fetch events by tag value
eTagLoader({
	value: 'event_id',
	relays: ['wss://relay.example.com']
}).subscribe((event) => {
	console.log('Loaded event:', event);
});
```

## Configuration Options

The `createTagValueLoader` function accepts these options:

- `bufferTime`: Time interval to buffer requests in ms (default 1000)
- `bufferSize`: Max buffer size (default 200)
- `kinds`: Restrict queries to specific kinds
- `authors`: Restrict queries to specific authors
- `since`: Restrict queries since timestamp
- `cacheRequest`: A method used to load events from a local cache
- `extraRelays`: An array of relays to always fetch from
- `eventStore`: An event store used to deduplicate events

:::warning
If an event store is not provided, the loader will not be able to deduplicate events.
:::

## Working with Relay Pools

The Tag Value Loader requires a request method for loading Nostr events from relays. You can provide this in multiple ways:

### Using a RelayPool instance

The simplest approach is to pass a RelayPool instance directly:

```ts
import { createTagValueLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';

const pool = new RelayPool();
const eTagLoader = createTagValueLoader(pool, 'e', {
	eventStore,
	cacheRequest
});
```

### Using a custom request method

You can also provide a custom request method, such as one from nostr-tools:

```ts
import { createTagValueLoader } from 'applesauce-loaders/loaders';
import { SimplePool } from 'nostr-tools';
import { Observable } from 'rxjs';

const pool = SimplePool();

// Create a custom request function using nostr-tools
function customRequest(relays, filters) {
	return new Observable((observer) => {
		const sub = pool.subscribeMany(relays, filters, {
			onevent: (event) => observer.next(event),
			eose: () => observer.complete()
		});

		return () => sub.close();
	});
}

// Create tag value loader with custom request
const eTagLoader = createTagValueLoader(customRequest, 'e', options);
```

## Loading from cache

For improved performance, you can configure the loader to use a local cache:

```ts
import { createTagValueLoader } from 'applesauce-loaders/loaders';
import { openDB, getEventsForFilters } from 'nostr-idb';

// Setup a local event cache
const cache = await openDB();

function cacheRequest(filters) {
	return getEventsForFilters(cache, filters);
}

const eTagLoader = createTagValueLoader(pool, 'e', {
	cacheRequest,
	eventStore
});

// Events from cache are automatically marked using markFromCache
eTagLoader({ value: 'event_id' }).subscribe((event) => {
	if (!isFromCache(event)) {
		// This is a new event from the network
		addEvents(cache, [event]);
	}
});
```

## Creating Specialized Loaders

The Tag Value Loader can be used to create specialized loaders for specific use cases:

### Reactions Loader

```ts
import { createTagValueLoader } from 'applesauce-loaders/loaders';
import { kinds } from 'nostr-tools';
import {
	getReplaceableAddress,
	isReplaceable,
	getSeenRelays,
	mergeRelaySets
} from 'applesauce-core/helpers';

function createReactionsLoader(pool, options) {
	// Create tag value loaders for both events and addressable events
	const eventLoader = createTagValueLoader(pool, 'e', { ...options, kinds: [kinds.Reaction] });
	const addressableLoader = createTagValueLoader(pool, 'a', {
		...options,
		kinds: [kinds.Reaction]
	});

	// Return a function that uses the appropriate loader based on event type
	return (event, relays) => {
		// Use addressable loader for replaceable events, otherwise use event loader
		return isReplaceable(event.kind)
			? addressableLoader({ value: getReplaceableAddress(event), relays })
			: eventLoader({ value: event.id, relays });
	};
}
```

### Zaps Loader

```ts
import { createTagValueLoader } from 'applesauce-loaders/loaders';
import { kinds } from 'nostr-tools';
import {
	getReplaceableAddress,
	isReplaceable,
	getSeenRelays,
	mergeRelaySets
} from 'applesauce-core/helpers';

function createZapsLoader(pool, options) {
	// Create tag value loaders for both events and addressable events
	const eventLoader = createTagValueLoader(pool, 'e', { ...options, kinds: [kinds.Zap] });
	const addressableLoader = createTagValueLoader(pool, 'a', { ...options, kinds: [kinds.Zap] });

	// Return a function that uses the appropriate loader based on event type
	return (event, relays) => {
		// Use addressable loader for replaceable events, otherwise use event loader
		return isReplaceable(event.kind)
			? addressableLoader({ value: getReplaceableAddress(event), relays })
			: eventLoader({ value: event.id, relays });
	};
}
```

## Real-World Example

Here's how you might use the Tag Value Loader in a React application to fetch replies to a note:

```tsx
import { EventStore } from 'applesauce-core';
import { createTagValueLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';
import { useEffect, useState } from 'react';

// Setup at app level
const eventStore = new EventStore();
const pool = new RelayPool();
const eTagLoader = createTagValueLoader(pool, 'e', { eventStore });

function RepliesComponent({ noteId, relays }) {
	const [replies, setReplies] = useState([]);

	// Load replies when component mounts
	useEffect(() => {
		const subscription = eTagLoader({
			value: noteId,
			relays
		}).subscribe((event) => {
			// Only add replies that reference this note in the root tag
			if (event.tags.some((tag) => tag[0] === 'e' && tag[1] === noteId && tag[3] === 'root')) {
				setReplies((prev) => [...prev, event]);
			}
		});

		return () => subscription.unsubscribe();
	}, [noteId]);

	return (
		<div>
			<h3>Replies ({replies.length})</h3>
			{replies.map((reply) => (
				<div key={reply.id}>
					<p>{reply.content}</p>
				</div>
			))}
		</div>
	);
}
```

## Loading Sequence

The Tag Value Loader follows this sequence when loading events:

1. Attempt to load from cache (if configured)
2. Fetch from specified relays and any additional relays
3. Deduplicate events (if an event store is configured)

This approach ensures efficient event loading with minimal network requests.
````

## File: loaders/timeline-loader.md

````markdown
# Timeline Loader

The Timeline Loader is designed for fetching paginated Nostr events in chronological order. It maintains state between calls, allowing you to efficiently load timeline events in blocks until you reach a specific timestamp or exhaust available events.

:::warning
The observable returned by the Timeline Loader MUST be subscribed to in order for the request to be made. No request will be sent until you call `.subscribe()` on the returned observable.
:::

## Basic Usage

```ts
import { createTimelineLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';

// Create a relay pool
const pool = new RelayPool();

// Create a timeline loader
const timelineLoader = createTimelineLoader(
	pool,
	['wss://relay.example.com'],
	{ kinds: [1] } // Load text notes
);

// Initial load - gets the most recent events
timelineLoader().subscribe((event) => {
	console.log('Loaded event:', event);
});

// Later, load older events by calling the loader again
// Each call continues from where the previous one left off
timelineLoader().subscribe((event) => {
	console.log('Loaded older event:', event);
});

// Load events until a specific timestamp
const oneWeekAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
timelineLoader(oneWeekAgo).subscribe((event) => {
	console.log('Event from last week:', event);
});
```

## Configuration Options

The `createTimelineLoader` function accepts these options:

- `limit`: Maximum number of events to request per filter
- `cache`: A method used to load events from a local cache
- `eventStore`: An event store to pass all events to

:::warning
If an event store is not provided, the loader will not be able to deduplicate events.
:::

## Working with Relay Pools

The Timeline Loader requires a request method for loading Nostr events from relays. You can provide this in multiple ways:

### Using a RelayPool instance

The simplest approach is to pass a RelayPool instance directly:

```ts
import { createTimelineLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';
import { EventStore } from 'applesauce-core';

const eventStore = new EventStore();
const pool = new RelayPool();

const timelineLoader = createTimelineLoader(
	pool,
	['wss://relay.example.com'],
	{ kinds: [1], authors: ['user_pubkey'] },
	{ eventStore }
);
```

### Using a custom request method

You can also provide a custom request method, such as one from nostr-tools:

```ts
import { createTimelineLoader } from 'applesauce-loaders/loaders';
import { SimplePool } from 'nostr-tools';
import { Observable } from 'rxjs';

const pool = SimplePool();

// Create a custom request function using nostr-tools
function customRequest(relays, filters) {
	return new Observable((observer) => {
		const sub = pool.subscribeMany(relays, filters, {
			onevent: (event) => observer.next(event),
			eose: () => observer.complete()
		});

		return () => sub.close();
	});
}

// Create a function that matches the UpstreamPool interface
const customPool = {
	request: customRequest
};

// Create timeline loader with custom pool
const timelineLoader = createTimelineLoader(customPool, ['wss://relay.example.com'], filters);
```

## Loading from cache

For improved performance, you can configure the loader to use a local cache:

```ts
import { createTimelineLoader } from 'applesauce-loaders/loaders';
import { openDB, getEventsForFilters } from 'nostr-idb';

// Setup a local event cache
const cache = await openDB();

function cacheRequest(filters) {
	return getEventsForFilters(cache, filters);
}

const timelineLoader = createTimelineLoader(
	pool,
	['wss://relay.example.com'],
	{ kinds: [1] },
	{ cache: cacheRequest, eventStore }
);
```

## Real-World Example

Here's how you might use the Timeline Loader in a React application for an infinite scrolling feed:

```tsx
import { createTimelineLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';
import { EventStore } from 'applesauce-core';
import { useEffect, useState } from 'react';

// Setup at app level
const eventStore = new EventStore();
const pool = new RelayPool();

function Feed() {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(false);
	const [timelineLoader, setTimelineLoader] = useState(null);

	// Initialize the timeline loader
	useEffect(() => {
		const loader = createTimelineLoader(
			pool,
			['wss://relay.example.com'],
			{ kinds: [1] }, // Load text notes
			{ eventStore }
		);

		setTimelineLoader(() => loader);

		// Load initial events
		loadMoreEvents(loader);
	}, []);

	// Function to load more events
	const loadMoreEvents = (loader) => {
		if (!loader || loading) return;

		setLoading(true);

		const subscription = loader().subscribe({
			next: (event) => {
				setEvents((prev) => [...prev, event]);
			},
			complete: () => {
				setLoading(false);
			}
		});

		return () => subscription.unsubscribe();
	};

	return (
		<div>
			{events.map((event) => (
				<div key={event.id} className="event">
					{event.content}
				</div>
			))}

			<button onClick={() => loadMoreEvents(timelineLoader)} disabled={loading}>
				{loading ? 'Loading...' : 'Load More'}
			</button>
		</div>
	);
}
```

## Loading Sequence

The Timeline Loader follows this sequence when loading events:

1. Start with a cursor at Infinity (most recent events)
2. Attempt to load from cache (if configured)
3. Fetch from specified relays in parallel
4. Update the cursor to the oldest event's timestamp
5. Each subsequent call starts from the updated cursor
6. Stop when no more events are returned or the specified timestamp is reached

This stateful approach allows efficient pagination through chronological timelines with minimal code complexity.
````

## File: loaders/zaps-loader.md

````markdown
# Zaps Loader

The Zaps Loader is a specialized loader for fetching [NIP-57](https://github.com/nostr-protocol/nips/blob/master/57.md) zap events for any given Nostr event. It is built on top of the [Tag Value Loader](./tag-value-loader.md) and automatically handles both regular events and addressable events.

:::warning
The observable returned by the Zaps Loader MUST be subscribed to in order for the request to be made. No request will be sent until you call `.subscribe()` on the returned observable.
:::

## Basic Usage

```ts
import { createZapsLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';

// Create a relay pool
const pool = new RelayPool();

// Create a zaps loader (do this once at the app level)
const zapsLoader = createZapsLoader(pool);

// Later, use the loader to fetch zaps for any event
const someEvent = { id: 'event_id', kind: 1 /* ... */ };

zapsLoader(someEvent, ['wss://relay.example.com']).subscribe((zapEvent) => {
	console.log('Received zap:', zapEvent);
});
```

## How It Works

The Zaps Loader automatically:

- Determines if the target event is addressable (replaceable) or a regular event
- Uses the appropriate tag (`a` for addressable events, `e` for regular events) to fetch zaps
- Merges relay hints from the event's seen relays (if `useSeenRelays` is enabled)
- Filters results to only return NIP-57 zap events (kind 9735)

## Configuration Options

The `createZapsLoader` function accepts these options:

- `useSeenRelays`: Whether to include relays where the event was seen (default `true`)
- All other options from Tag Value Loader: `bufferTime`, `bufferSize`, `authors`, `since`, `cacheRequest`, `extraRelays`, `eventStore`

```ts
const zapsLoader = createZapsLoader(pool, {
	useSeenRelays: true,
	bufferTime: 500,
	eventStore,
	cacheRequest
});
```

## Example with React

```tsx
import { createZapsLoader } from 'applesauce-loaders/loaders';
import { RelayPool } from 'applesauce-relay';
import { useEffect, useState } from 'react';

// Setup at app level
const pool = new RelayPool();
const zapsLoader = createZapsLoader(pool);

function ZapsComponent({ event }) {
	const [zaps, setZaps] = useState([]);

	useEffect(() => {
		const subscription = zapsLoader(event).subscribe((zapEvent) => {
			setZaps((prev) => [...prev, zapEvent]);
		});

		return () => subscription.unsubscribe();
	}, [event.id]);

	return (
		<div>
			<h3>Zaps ({zaps.length})</h3>
			{zaps.map((zap) => (
				<div key={zap.id}>
					<p>Zap amount: {/* parse zap amount from event */}</p>
				</div>
			))}
		</div>
	);
}
```

## Addressable vs Regular Events

The loader automatically handles both types of events:

- **Regular events** (kind 0, 1, etc.): Uses `e` tags to find zaps
- **Addressable events** (kind 30000+): Uses `a` tags with the replaceable address

This abstraction means you don't need to worry about the event type - just pass any event to the loader.
````

## File: relays/operators.md

````markdown
# RxJS Operators

The `applesauce-relay` package provides several RxJS operators to help process and transform streams of events from Nostr relays.

## onlyEvents

The `onlyEvents` operator filters the subscription response stream to only emit Nostr events, removing any "EOSE" (End Of Stored Events) messages.

```typescript
import { onlyEvents } from 'applesauce-relay/operators';

// Subscribe to events and only receive Nostr events (no EOSE messages)
relay
	.req({
		kinds: [1],
		limit: 10
	})
	.pipe(onlyEvents())
	.subscribe((event) => {
		// This will only receive events, not "EOSE" strings
		console.log(event.id);
	});
```

## markFromRelay

The `markFromRelay` operator adds metadata to events indicating which relay they were received from. This is useful for tracking event propagation across the network.

```typescript
import { markFromRelay } from 'applesauce-relay/operators';
import { getSeenRelays } from 'applesauce-core/helpers';

// Create a new relay instance
const relay = new Relay('wss://relay.example.com');

// Subscribe to events and mark them as coming from this relay
relay
	.req({
		kinds: [1],
		limit: 10
	})
	.pipe(markFromRelay(relay.url))
	.subscribe((response) => {
		if (typeof response !== 'string') {
			// Check which relays this event has been seen on
			console.log(getSeenRelays(response));
		}
	});
```

## completeOnEose

The `completeOnEose` operator completes the subscription stream when an "EOSE" (End Of Stored Events) message is received. This is particularly useful for one-off requests where you want to collect all events and then process them together.

```typescript
import { completeOnEose } from 'applesauce-relay/operators';
import { lastValueFrom } from 'rxjs';
import { toArray } from 'rxjs/operators';

// Method 1: Complete the stream when EOSE is received
relay
	.req({
		kinds: [1],
		limit: 10
	})
	.pipe(completeOnEose())
	.subscribe({
		next: (event) => console.log(event.id),
		complete: () => console.log('All stored events received')
	});

// Method 2: Collect all events into an array
const events = await lastValueFrom(
	relay
		.req({
			kinds: [1],
			limit: 10
		})
		.pipe(completeOnEose(), toArray())
);

// Method 3: Include the EOSE message in the stream
relay
	.req({
		kinds: [1],
		limit: 10
	})
	.pipe(completeOnEose(true))
	.subscribe((response) => {
		if (response === 'EOSE') {
			console.log('End of stored events');
		} else {
			console.log('Event:', response.id);
		}
	});
```

## storeEvents

The `storeEvents` operator adds all events from the subscription stream to an `EventStore` without filtering or removing duplicates. The stream continues to emit all original messages.

```typescript
import { storeEvents } from 'applesauce-relay/operators';
import { EventStore } from 'applesauce-core';

// Create an event store
const eventStore = new EventStore();

// Subscribe to events and add them to the store
relay
	.req({
		kinds: [1],
		limit: 10
	})
	.pipe(storeEvents(eventStore))
	.subscribe((response) => {
		if (response === 'EOSE') {
			// Access all events from the store
			const allEvents = eventStore.getAll();
			console.log(`Received ${allEvents.length} events`);
		}
	});
```

## toEventStore

The `toEventStore` operator adds all events to an `EventStore`, removes duplicates, and returns a sorted array of events when the EOSE message is received. This is perfect for fetching and processing a complete set of events.

:::warning
This operator is deprecated. It's recommended to use the `mapEventsToStore` and `mapEventsToTimeline` operators from `applesauce-core/observable` instead.
:::

```typescript
import { toEventStore } from 'applesauce-relay/operators';
import { EventStore } from 'applesauce-core';
import { lastValueFrom } from 'rxjs';

// Create an event store
const eventStore = new EventStore();

// Fetch events, deduplicate, and sort them
const timeline = await lastValueFrom(
	relay
		.req({
			kinds: [1],
			limit: 10
		})
		.pipe(toEventStore(eventStore))
);

console.log(`Received ${timeline.length} unique events`);
```

### Recommended alternative

```typescript
import { mapEventsToStore, mapEventsToTimeline } from 'applesauce-core/observable';
import { completeOnEose } from 'applesauce-relay/operators';
import { EventStore } from 'applesauce-core';
import { lastValueFrom } from 'rxjs';

// Create an event store
const eventStore = new EventStore();

// Fetch events, deduplicate, and sort them
const timeline = await lastValueFrom(
	relay
		.req({
			kinds: [1],
			limit: 10
		})
		.pipe(completeOnEose(), mapEventsToStore(eventStore, true), mapEventsToTimeline())
);

console.log(`Received ${timeline.length} unique events`);
```

## Combining Operators

These operators can be combined to create powerful data processing pipelines:

```typescript
import { markFromRelay, onlyEvents, completeOnEose } from 'applesauce-relay/operators';
import { mapEventsToStore, mapEventsToTimeline } from 'applesauce-core/observable';
import { EventStore } from 'applesauce-core';
import { lastValueFrom } from 'rxjs';

// Create an event store
const eventStore = new EventStore();

// Create a relay pool
const pool = new RelayPool();

// Define relay URLs
const relays = ['wss://relay1.example.com', 'wss://relay2.example.com'];

// Fetch events from multiple relays, track where they came from,
// deduplicate, and sort them
const timeline = await lastValueFrom(
	pool
		.req(relays, {
			kinds: [1],
			limit: 10
		})
		.pipe(
			// Mark each event with its source relay
			markFromRelay(relays[0]),
			// Filter out EOSE messages
			onlyEvents(),
			// Complete when all events are received
			completeOnEose(),
			// Store events and remove duplicates
			mapEventsToStore(eventStore, true),
			// Create a sorted timeline
			mapEventsToTimeline()
		)
);

console.log(`Received ${timeline.length} unique events`);
```
````

## File: relays/package.md

````markdown
# Relays

The `applesauce-relay` package contains a few classes to make connecting to relays easier.

## Features

- Simple to setup
- Automatic connection management
- NIP-42 auth support
- Negentrapy support

## Installation

:::code-group

```sh [npm]
npm install applesauce-relay
```

```sh [yarn]
yarn install applesauce-relay
```

```sh [pnpm]
pnpm install applesauce-relay
```

:::
````

## File: relays/pool.md

````markdown
# Relay Pool

The `RelayPool` class in `applesauce-relay` provides a powerful way to manage multiple relay connections, allowing you to interact with multiple relays as if they were a single entity.

## Features

- Connect to multiple relays
- Create and manage groups of relays
- Send requests and events to multiple relays simultaneously
- Maintain a blacklist of relays to avoid

## Relay Management

The RelayPool provides methods to create and manage relay connections:

```typescript
// Get or create a relay connection
const relay = pool.relay('wss://relay.example.com');

// Create a group of relays
const group = pool.group(['wss://relay1.example.com', 'wss://relay2.example.com']);
```

## Making Requests

The RelayPool provides several methods to interact with relays. These methods mirror those found in the `Relay` class, allowing you to use familiar patterns while working with multiple relays simultaneously.

### REQ Method

The `req` method sends a subscription request to multiple relays:

```typescript
// Send a REQ to multiple relays
pool
	.req(relays, {
		kinds: [1],
		limit: 10
	})
	.subscribe({
		next: (response) => {
			if (response === 'EOSE') {
				console.log('End of stored events from all relays');
			} else {
				console.log('Event from relay:', response.from);
				console.log('Event content:', response.content);
			}
		},
		error: (error) => {
			console.error('Subscription error:', error);
		}
	});
```

### Event Method

The `event` method sends an `EVENT` message to multiple relays and returns an observable of the responses from each relay.

```typescript
const event = {
	kind: 1,
	content: 'Hello from RelayPool!',
	created_at: Math.floor(Date.now() / 1000),
	tags: []
	// ... other required fields
};

// Subscribe to a stream of responses
pool.event(relays, event).subscribe({
	next: (response) => {
		console.log(`Published to ${response.from}:`, response.ok);
		if (!response.ok) console.log(`Error message: ${response.message}`);
	},
	complete: () => {
		console.log('Publishing complete');
	}
});
```

### Publish Method

The `publish` method is a wrapper around the `event` method that returns a `Promise` and automatically handles reconnecting and retrying:

```typescript
// Publish with retries (defaults to 3 retries)
const responses = await pool.publish(relays, event);
for (const response of responses) {
	console.log(`Published to ${response.from}:`, response.ok, response.message);
}
```

### Request Method

The `request` method allows you to make one-off requests with automatic retries:

```typescript
// Request with automatic retries
pool
	.request(
		relays,
		{
			kinds: [1],
			authors: ['pubkey1', 'pubkey2'],
			limit: 50
		},
		{
			retries: 2,
			timeout: 5000 // 5 seconds
		}
	)
	.subscribe({
		next: (event) => console.log('Received event:', event.id),
		complete: () => console.log('Request complete')
	});
```

### Subscription Method

The `subscription` method creates persistent subscriptions that automatically reconnect:

```typescript
// Create persistent subscription
const subscription = pool
	.subscription(
		relays,
		{
			kinds: [1, 7],
			'#t': ['nostr']
		},
		{
			id: 'custom-sub-id', // optional custom subscription ID
			retries: Infinity // retry forever
		}
	)
	.subscribe({
		next: (response) => {
			if (response === 'EOSE') {
				console.log('End of stored events');
			} else {
				console.log('Subscription update:', response);
			}
		}
	});

// Later, you can unsubscribe
subscription.unsubscribe();
```

All of these methods accept the same parameters as their counterparts in the `Relay` class, making it easy to transition between working with individual relays and relay pools.

## Relay Groups

The `RelayGroup` class is used internally by RelayPool to manage collections of relays. You can access relay groups directly through the pool:

```typescript
// Create a group of relays
const group = pool.group(['wss://relay1.example.com', 'wss://relay2.example.com']);

// Make requests to the group
group.req({ kinds: [1] }).subscribe((response) => console.log(response));

// Send events to the group
group.event(event).subscribe((response) => console.log(response));

// Use other group methods
group.publish(event).subscribe((response) => console.log(response));
group.request({ kinds: [1] }).subscribe((event) => console.log(event));
group.subscription({ kinds: [1] }).subscribe((response) => console.log(response));
```

The RelayGroup intelligently merges responses from multiple relays, emitting EOSE only when all relays have sent their EOSE signals.

## Observable Properties

The RelayPool provides observables for tracking relays and groups:

```typescript
// Subscribe to changes in the relays map
pool.relays$.subscribe((relaysMap) => {
	console.log('Relays updated:', Array.from(relaysMap.keys()));
});

// Subscribe to changes in the relay groups map
pool.groups$.subscribe((groupsMap) => {
	console.log('Groups updated:', Array.from(groupsMap.keys()));
});
```
````

## File: relays/relays.md

````markdown
# Relay Class

The `Relay` class provides a reactive interface for connecting to and communicating with Nostr relays using RxJS observables.

## Creating a Relay Connection

```typescript
import { Relay } from 'applesauce-relay';

// Create a new relay instance
const relay = new Relay('wss://relay.example.com');

// Access relay state observables
relay.connected$.subscribe((connected) => console.log('Connection status:', connected));

relay.notices$.subscribe((notices) => console.log('Relay notices:', notices));
```

## Subscribing to Events

The `req` or `subscription` methods returns an observable that emits events from the relay.

:::info
The `subscription` method is a wrapper around the `req` method that automatically handles reconnection and retries.
:::

```typescript
// Subscribe to specific kinds of events
relay
	.req({
		kinds: [1],
		authors: ['pubkey1', 'pubkey2']
	})
	.subscribe({
		next: (response) => {
			if (response === 'EOSE') {
				console.log('End of stored events');
			} else {
				console.log('Event:', response);
			}
		},
		error: (err) => console.error('Subscription error:', err)
	});
```

## Publishing Events

Send events to the relay using the `event` or `publish` methods.

:::info
The `publish` method is a wrapper around the `event` method that returns a `Promise` and automatically handles reconnecting and retrying.
:::

```typescript
import { generatePrivateKey, getPublicKey, getEventHash, signEvent } from 'nostr-tools';

const sk = generatePrivateKey();
const pk = getPublicKey(sk);

const event = {
	kind: 1,
	pubkey: pk,
	created_at: Math.floor(Date.now() / 1000),
	tags: [],
	content: 'Hello Nostr!'
};

event.id = getEventHash(event);
event.sig = signEvent(event, sk);

// Use the observable method
relay.event(event).subscribe((response) => {
	console.log(`Published: ${response.ok}`, response.message);
});

// Or use the publish method with await
const response = await relay.publish(event);
console.log(`Published: ${response.ok}`, response.message);
```

## Making One-time Requests

Use the `request` method for one-time queries that complete after receiving `EOSE`.

```typescript
import { lastValueFrom } from 'rxjs';
import { getProfileContent } from 'applesauce-core/helpers';

// Get latest user profile
async function getProfile(pubkey) {
	const events = await lastValueFrom(
		relay.request({
			kinds: [0],
			authors: [pubkey],
			limit: 1
		})
	);

	return getProfileContent(events[0]);
}
```

## Authentication

The `Relay` class supports [NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md) authentication and keeps track of the authentication state and challenge.

- `challenge$` - An observable that tracks the authentication challenge from the relay.
- `authenticated$` - An observable that tracks the authentication state of the relay.
- `authenticate` - An async method that can be used to authenticate the relay.

More information about authentication can be found in the [typedocs](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-relay.Relay).

```typescript
// Listen for authentication challenges
relay.challenge$.subscribe((challenge) => {
	if (!challenge) return;

	// Using browser extension as signer
	relay
		.authenticate(window.nostr)
		.then(() => {
			console.log('Authentication successful');
		})
		.catch((err) => {
			console.error('Authentication failed:', err);
		});
});
```

If you want to manually build the authentication event you can use the `auth` method to send the event to the relay.

```typescript
import { makeAuthEvent } from 'nostr-tools/nip42';

// Listen for authentication challenges
relay.challenge$.subscribe(async (challenge) => {
	if (!challenge) return;

	// Create a new auth event and sign it
	const auth = await window.nostr.signEvent(makeAuthEvent(relay.url, challenge));

	// Send it to the relay and wait for the response
	relay.auth(auth).subscribe({
		next: (response) => {
			console.log('Authentication response:', response);
		},
		error: (err) => {
			console.error('Authentication failed:', err);
		}
	});
});
```

## Persistent Subscriptions

The `subscription` method can be used to create persistent subscriptions that automatically reconnect after connection issues.

```typescript
// Create a persistent subscription
const subscription = relay
	.subscription({ kinds: [1, 6], since: Math.floor(Date.now() / 1000) }, { id: 'feed', retries: 3 })
	.subscribe({
		next: (response) => {
			if (response !== 'EOSE') {
				console.log('New event:', response.content);
			}
		}
	});

// Later, to unsubscribe
subscription.unsubscribe();
```

## Dynamic Filters

The `req`, and `subscription` methods can accept an observable for the filters. this allows for you to set the filters later or update them dynamically.

:::warning
Make sure to use a `ReplaySubject`, `BehaviorSubject`, or the `shareReplay(1)` operator to keep the last filters in case the relay disconnects and needs to resubscribe.
:::

```typescript
import { BehaviorSubject } from 'rxjs';
import { onlyEvents } from 'applesauce-relay/operators';

// Create a subject with initial filters
const filters = new BehaviorSubject({
	kinds: [1],
	limit: 20
});

// Subscribe using dynamic filters
relay
	.req(filters)
	.pipe(onlyEvents())
	.subscribe((event) => console.log(event.content));

// Update filters later
setTimeout(() => {
	filters.next({
		kinds: [1],
		'#t': ['nostr'],
		limit: 20
	});
}, 5000);
```

## Relay Information

The `Relay` class keeps track of the relay information and emits it as an observable from the `information$` property.

```typescript
// Get relay information
relay.information$.subscribe((info) => {
	if (info) {
		console.log('Relay name:', info.name);
		console.log('Supported NIPs:', info.supported_nips);
		console.log('Software:', info.software);

		if (info.limitation) {
			console.log('Max message size:', info.limitation.max_message_length);
		}
	}
});
```
````

## File: signers/nostr-connect.md

````markdown
# Nostr Connect

The [`NostrConnectSigner`](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-signers.NostrConnectSigner.html) is a client side implementation of a [NIP-46](https://github.com/nostr-protocol/nips/blob/master/46.md) remote signer.

## Relay Communication

The `NostrConnectSigner` requires two methods for communicating with relays: a subscription method for receiving events and a publish method for sending events.

These methods can be set either through the constructor or globally on the class. At least one of these approaches must be used before creating a `NostrConnectSigner` instance.

```typescript
import { Observable } from 'rxjs';

function subscriptionMethod(relays, filters) {
	return new Observable((observer) => {
		// Create subscription to relays
		const cleanup = subscribeToRelays(relays, filters, (event) => {
			observer.next(event);
		});

		return () => cleanup();
	});
}

async function publishMethod(relays, event) {
	for (const relay of relays) {
		await publishToRelay(relay, event);
	}
}

// Set methods globally once at app initialization
NostrConnectSigner.subscriptionMethod = subscriptionMethod;
NostrConnectSigner.publishMethod = publishMethod;

// Or pass them as options when creating a signer
const signer = new NostrConnectSigner({
	relays: ['wss://relay.example.com'],
	subscriptionMethod,
	publishMethod
	// ... other options
});
```

### Using the relay pool

The simplest way to set these methods is to use the `RelayPool` from the `applesauce-relay` package.

```typescript
import { RelayPool } from 'applesauce-relay';

const pool = new RelayPool();

// Set methods using arrow functions
NostrConnectSigner.subscriptionMethod = (relays, filters) => pool.subscription(relays, filters);
NostrConnectSigner.publishMethod = (relays, event) => pool.publish(relays, event);

// Or using .bind
NostrConnectSigner.subscriptionMethod = pool.subscription.bind(pool);
NostrConnectSigner.publishMethod = pool.publish.bind(pool);
```

## Connecting to a remote signer

```js
import { NostrConnectSigner } from 'applesauce-signers';

const signer = new NostrConnectSigner({
	remote: '<remote signer pubkey>',
	// Optional: Users pubkey
	pubkey: '<user pubkey>',
	// Optional: Custom subscription method
	subscriptionMethod: customSubMethod,
	// Optional: Custom publish method
	publishMethod: customPubMethod,
	// Optional: Custom auth handler
	onAuth: async (url) => {
		// Handle auth requests
	}
});

// start the connection process
await signer.connect();
console.log('Connected!');

// get the users pubkey
const pubkey = await signer.getPublicKey();
console.log('Users pubkey is', pubkey);
```

## Initiating connection from client

To start a connection from the client side, you can use the `getNostrConnectURI` and `waitForSigner` methods:

```js
const signer = new NostrConnectSigner({
	subscriptionMethod: customSubMethod,
	publishMethod: customPubMethod,
	relays: ['wss://relay.example.com']
	// ... other options
});

// get the nostrconnect:// URI with optional metadata
const uri = signer.getNostrConnectURI({
	name: 'My App',
	url: 'https://example.com',
	image: 'https://example.com/icon.png',
	permissions: NostrConnectSigner.buildSigningPermissions([0, 1, 3, 10002])
});
console.log(uri);

// Create an optional AbortSignal to cancel the waiting process if needed
const controller = new AbortController();
const signal = controller.signal;

try {
	// wait for the remote signer to connect, optionally passing an AbortSignal
	await signer.waitForSigner(signal);
	console.log('Connected!');

	const pubkey = await signer.getPublicKey();
	console.log('Users pubkey is', pubkey);
} catch (error) {
	console.error('Connection was aborted:', error);
}

// Later, if you need to abort the waiting process:
setTimeout(() => {
	controller.abort();
}, 10_000);
```

## Handling bunker URIs

You can use `NostrConnectSigner.fromBunkerURI` to create a new signer from a bunker URI:

```js
const signer = await NostrConnectSigner.fromBunkerURI(
	'bunker://266815e0c9210dfa324c6cba3573b14bee49da4209a9456f9484e5106cd408a5?relay=wss://relay.nsec.app&secret=d9aa70',
	{
		permissions: NostrConnectSigner.buildSigningPermissions([0, 1, 3, 10002])
		// ... other options
	}
);
```

You can also parse a bunker URI separately using `NostrConnectSigner.parseBunkerURI`:

```js
const { remote, relays, secret } = NostrConnectSigner.parseBunkerURI(uri);
```

## Permissions

The `NostrConnectSigner` uses a set of predefined permissions that can be requested from the remote signer:

```typescript
enum Permission {
	GetPublicKey = 'get_pubic_key',
	SignEvent = 'sign_event',
	Nip04Encrypt = 'nip04_encrypt',
	Nip04Decrypt = 'nip04_decrypt',
	Nip44Encrypt = 'nip44_encrypt',
	Nip44Decrypt = 'nip44_decrypt'
}
```

Use the static `NostrConnectSigner.buildSigningPermissions` method to create an array of signing permissions for specific event kinds:

```js
const permissions = NostrConnectSigner.buildSigningPermissions([0, 1, 3, 10002]);
```

These permissions can be passed when:

- Connecting to a remote signer via `connect(secret, permissions)`
- Creating a nostr connect URI via `getNostrConnectURI({ permissions })`
- Creating a signer from a bunker URI via `fromBunkerURI(uri, { permissions })`

## App Metadata

When creating a nostr connect URI, you can provide metadata about your application:

```typescript
type NostrConnectAppMetadata = {
	name?: string;
	image?: string;
	url?: string | URL;
	permissions?: string[];
};
```

This metadata is used to display information about your application to the user when they connect their signer.

## Encryption Methods

The `NostrConnectSigner` supports both NIP-04 and NIP-44 encryption through the `nip04` and `nip44` properties:

```typescript
// NIP-04 encryption
const encrypted = await signer.nip04.encrypt(pubkey, plaintext);
const decrypted = await signer.nip04.decrypt(pubkey, ciphertext);

// NIP-44 encryption
const encrypted = await signer.nip44.encrypt(pubkey, plaintext);
const decrypted = await signer.nip44.decrypt(pubkey, ciphertext);
```
````

## File: signers/package.md

````markdown
# Signers

All signers in the `applesauce-signers` package are compatible with the [NIP-07](https://github.com/nostr-protocol/nips/blob/master/07.md) API

## Features

- All signers follow the [NIP-07](https://github.com/nostr-protocol/nips/blob/master/07.md) API
- [NIP-46](https://github.com/nostr-protocol/nips/blob/master/46.md) `bunker://` URI support
- Support for client initinated NIP-46 connection (`nostrconnect://` URIs)
- [NIP-49](https://github.com/nostr-protocol/nips/blob/master/49.md) encrypted password signer
- Support for [nostr-signing-device](https://github.com/lnbits/nostr-signing-device) on chrome based browsers
- Support for [Amber](https://github.com/greenart7c3/Amber) clipboard signer (deprecated)

## Installation

:::code-group

```sh [npm]
npm install applesauce-signers
```

```sh [yarn]
yarn install applesauce-signers
```

```sh [pnpm]
pnpm install applesauce-signers
```

:::
````

## File: signers/signers.md

````markdown
## Password Signer

The [PasswordSigner](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-signers.PasswordSigner.html) is a [NIP-49](https://github.com/nostr-protocol/nips/blob/master/49.md) (Private Key Encryption) signer

To reuse an existing `ncryptsec` you can set the `signer.ncryptsec` field

```ts
// create a new password signer
const signer = new PasswordSigner();

// use a pre-existing ncryptsec
signer.ncryptsec = 'ncryptsec1q...';
```

To create a new ncryptsec you can set the `signer.key` field on the signer

```ts
// create a new password signer
const signer = new PasswordSigner();

// or create a new one using a key and password
const randomBytes = new Uint8Array(64);
window.crypto.getRandomValues(randomBytes);

signer.key = randomBytes;
signer.setPassword('changeme');

// new ncryptset
console.log(signer.ncryptsec);
```

### Locking and Unlocking

To unlock the signer so it can sign events you have to call the [`unlock`](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-signers.PasswordSigner.html#unlock) method

```ts
try {
	const password = prompt('Enter Password');
	await signer.unlock(password);
} catch (err) {
	console.log('Failed to unlock signer. maybe incorrect password?');
}
```

### Changing the password

To change the password you can simply unlock the signer then call [`setPassword`](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-signers.PasswordSigner.html#setPassword)

```ts
try {
	const unlockPassword = prompt('Enter current password');
	await signer.unlock(unlockPassword);

	// set new password
	const unlockPassword = prompt('Enter new password');
	await signer.setPassword(unlockPassword);
} catch (err) {
	console.log('Failed to unlock signer. maybe incorrect password?');
}
```

### Additional fields and methods

- [`unlocked`](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-signers.PasswordSigner.html#unlocked) a boolean field whether the signer is unlocked
- [`testPassword`](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-signers.PasswordSigner.html#testPassword) will return a promise that resolves or rejects based on if can decrypt the ncryptsec

## Simple Signer

The [`SimpleSigner`](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-signers.SimpleSigner.html) class is a standard signer that holds the secret key in memory and supports NIP-04 and NIP-44 encryption

You can create a new signer and secret key by not passing anything into the constructor

```ts
const signer = new SimpleSigner();
```

Or you can import and existing secret key

```ts
const key = new Uint8Array();
window.crypto.getRandomValues(key);

// pass the key into constructor
const signer = new SimpleSigner(key);
// or set it manually
signer.key = key;
```

## Serial Port Signer

The [SerialPortSigner](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-signers.SerialPortSigner.html) is a that supports the [nostr-signing-device](https://github.com/lnbits/nostr-signing-device)

> [!WARNING]
> This signer only works on chrome browsers and does not support NIP-44 encryption

### Checking support

The signer exposes a static property [`SerialPortSigner.SUPPORTED`](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-signers.SerialPortSigner.html#SUPPORTED) that will test if `navigator.serial` is supported

## Amber Clipboard Signer

The [`AmberClipboardSigner`](https://hzrd149.github.io/applesauce/typedoc/classes/applesauce-signers.AmberClipboardSigner.html) class can be used to connect to the [Amber web api](https://github.com/greenart7c3/Amber/blob/master/docs/web-apps.md)

> [!WARNING]
> This signer can NOT work in the background and always requires direct user approval
````

## File: tutorial/00-introduction.md

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

## File: tutorial/01-event-store.md

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

## File: tutorial/02-helpers.md

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

## File: tutorial/03-models.md

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

## File: tutorial/04-relays.md

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

## File: tutorial/05-loaders.md

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

## File: tutorial/06-event-factory.md

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

## File: tutorial/07-publishing.md

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

## File: tutorial/08-actions.md

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

## File: wallet/actions.md

````markdown
# Wallet Actions

The `applesauce-wallet` package provides a set of [Actions](https://hzrd149.github.io/applesauce/typedoc/modules/applesauce-wallet.Actions.html) for common wallet operations.

## CreateWallet

Creates a new NIP-60 wallet event and wallet backup.

```typescript
import { CreateWallet } from 'applesauce-wallet/actions';

await hub.run(CreateWallet, ['wss://mint.example.com'], privateKey);
```

## WalletAddPrivateKey

Adds a private key to an existing wallet event.

```typescript
import { WalletAddPrivateKey } from 'applesauce-wallet/actions';

await hub.run(WalletAddPrivateKey, privateKey);
```

## UnlockWallet

Unlocks the wallet event and optionally unlocks tokens and history events.

```typescript
import { UnlockWallet } from 'applesauce-wallet/actions';

// Unlock just the wallet
await hub.run(UnlockWallet);

// Unlock wallet and associated tokens/history
await hub.run(UnlockWallet, { tokens: true, history: true });
```

## ReceiveToken

Adds a Cashu token to the wallet and optionally marks nutzaps as redeemed.

```typescript
import { ReceiveToken } from 'applesauce-wallet/actions';

await hub.run(ReceiveToken, token, redeemedEventIds);
```

## RolloverTokens

Deletes old tokens and creates a new consolidated token.

```typescript
import { RolloverTokens } from 'applesauce-wallet/actions';

await hub.run(RolloverTokens, oldTokenEvents, newToken);
```

## CompleteSpend

Finalizes a spend operation by deleting spent tokens and creating a history entry.

```typescript
import { CompleteSpend } from 'applesauce-wallet/actions';

await hub.run(CompleteSpend, spentTokenEvents, changeToken);
```

## ConsolidateTokens

Combines all unlocked token events into a single event per mint.

```typescript
import { ConsolidateTokens } from 'applesauce-wallet/actions';

// Consolidate all unlocked tokens
await hub.run(ConsolidateTokens);

// Ignore locked tokens during consolidation
await hub.run(ConsolidateTokens, { ignoreLocked: true });
```

:::warning
Actions will throw errors if preconditions are not met (e.g., trying to add a private key to a locked wallet)
:::
````

## File: wallet/models.md

````markdown
# Models

The `applesauce-wallet` package provides a few pre-built models for subscribing to the state of the wallet.

## WalletModel

The `WalletModel` subscribes to the state of a NIP-60 wallet, providing information about whether it's locked and its associated mints.

```typescript
import { WalletModel } from 'applesauce-wallet/models';

const wallet = eventStore.model(WalletModel, pubkey).subscribe((info) => {
	if (!info) return console.log('No wallet found');

	if (info.locked) {
		console.log('Wallet is locked');
	} else {
		console.log('Wallet mints:', info.mints);
		console.log('Has private key:', !!info.privateKey);
	}
});
```

## WalletTokensQuery

The `WalletTokensQuery` subscribes to all token events for a wallet, with optional filtering by locked status.

```typescript
import { WalletTokensModel } from 'applesauce-wallet/models';

// Get all tokens
const allTokens = eventStore.model(WalletTokensModel, pubkey);

// Get only unlocked tokens
const unlockedTokens = eventStore.model(WalletTokensModel, pubkey, false);
```

## WalletBalanceQuery

The `WalletBalanceQuery` returns the visible balance of a wallet for each mint.

```typescript
import { WalletBalanceModel } from 'applesauce-wallet/models';

eventStore.model(WalletBalanceModel, pubkey).subscribe((balances) => {
	for (const [mint, amount] of Object.entries(balances)) {
		console.log(`Balance for ${mint}: ${amount}`);
	}
});
```
````

## File: wallet/package.md

````markdown
# Wallet

The `applesauce-wallet` package provides a set of actions and queries for managing [NIP-60](https://github.com/nostr-protocol/nips/blob/master/60.md) wallets and [Cashu](https://github.com/cashubtc/cashu) tokens.

:::warning
The `applesauce-wallet` package is still a work-in-progress and is still missing many features.
:::

## Installation

:::code-group

```sh [npm]
npm install applesauce-wallet
```

```sh [yarn]
yarn install applesauce-wallet
```

```sh [pnpm]
pnpm install applesauce-wallet
```

:::
````
