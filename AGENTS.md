# Applesauce-Svelte Project Guide

## About the Project

The 'applesauce-svelte' project is a demo implementation of Svelte and the Applesauce Nostr library. This project showcases how to integrate Svelte with the Applesauce library to build reactive and efficient nostr applications.

## Build & Test Commands

```sh
bun run dev        # Start development server
bun run build      # Build the project
bun run preview    # Preview the build
bun run check      # Check the project for errors
bun run check:watch # Watch for changes and check the project
bun run format     # Format the code
bun run lint       # Lint the code
```

## Code Style Guidelines

- **TypeScript**: Strict type checking, ES modules, explicit return types
- **Naming**: PascalCase for classes/types, camelCase for functions/variables
- **Files**: Lowercase with hyphens, test files with `.test.ts` suffix
- **Error Handling**: Use TypeScript's strict mode, explicit error checking in tests
- **Comments**: JSDoc for public APIs, inline comments for complex logic

## Svelte and Applesauce RxJS Integration

Svelte 5 supports integration with RxJS quite well, allowing RxJS observables to be used almost natively as stores in Svelte components. This enables leveraging RxJS's powerful reactive streams for complex asynchronous data flows alongside Svelte’s own reactivity model, including the new "runes" (signals) system introduced in Svelte 5.

Key points from recent resources and examples include:

- You can use RxJS observables directly with the `$` prefix in Svelte components, similar to how you use Svelte stores. This `$` automatically subscribes to the observable and updates reactively in the UI, making integration smooth.
- A common use case demonstrated involves connecting to a WebSocket (e.g., BitMEX trading API) via RxJS's `webSocket` operator, then using Svelte’s `$derived` rune to transform and display the data reactively in components.
- Svelte 5's new reactivity system around "runes" (signals) complements RxJS, though they serve somewhat different purposes: runes are simple reactive primitives primarily for UI state, whereas RxJS excels in handling complex asynchronous streams that need advanced operators like throttling, combining, or manual control. Thus, RxJS fits well for complex data flows, while runes are optimized for UI reactivity.
- You should disable SSR (`export const ssr = false;`) on pages that depend on RxJS-driven WebSocket connections to avoid server-side rendering issues.
- Community feedback notes that RxJS integration in Svelte 5 works well and is useful for scenarios like real-time data streams, but may require some understanding of the differences between runes, Svelte stores, and observables.

In summary, Svelte 5 can use RxJS observables almost as first-class reactive data sources, and this integration is beneficial for complex asynchronous data streams such as live WebSocket feeds. The `$` prefix subscription syntax simplifies their use in templates, and runes provide optimized reactivity for UI state within the same app.

If you want to see a practical example, a tutorial with full code that sets up a BitMEX WebSocket feed using RxJS and displays its data in a Svelte 5 app is available, offering a good starting point.
