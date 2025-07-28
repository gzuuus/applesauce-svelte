import type { EventFactory } from 'applesauce-factory';

interface Config {
	eventFactory: EventFactory | undefined;
}

export const config = $state<Config>({
	eventFactory: undefined
});
