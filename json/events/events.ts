/**
 * Centralized event name constants used with the custom event emitter system.
 */

const events = {
  showNotification: 'showNotification',
  routerPush: 'routerPush',
} as const;

export type EventNames = (typeof events)[keyof typeof events];

export default events;
