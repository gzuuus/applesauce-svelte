import { ActionHub } from 'applesauce-actions';
import { eventStore } from './eventStore';
import { eventFactory } from './eventFactory';

// Create ActionHub without automatic publishing
export const actionHub = new ActionHub(eventStore, eventFactory);
