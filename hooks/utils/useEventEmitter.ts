import { useEffect, useRef } from 'react';

/**
 * A lightweight browser-native event emitter system.
 * Uses a module-level EventTarget so all components share the same bus.
 */

const eventBus = typeof window !== 'undefined' ? new EventTarget() : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventCallback = (data: any) => void;

/**
 * Emit a named event with optional payload.
 */
export function emitEvent(eventName: string, data?: unknown) {
  if (!eventBus) return;
  const event = new CustomEvent(eventName, { detail: data });
  eventBus.dispatchEvent(event);
}

/**
 * Subscribe to a named event. Automatically cleans up on unmount.
 * @param eventName - The name of the event to listen for
 * @param callback  - Function called with the event payload
 */
export default function useEventEmitter(eventName: string, callback: EventCallback) {
  const callbackRef = useRef<EventCallback>(callback);

  // Keep the ref up to date without re-subscribing
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!eventBus) return;

    const handler = (e: Event) => {
      callbackRef.current((e as CustomEvent).detail);
    };

    eventBus.addEventListener(eventName, handler);

    return () => {
      eventBus.removeEventListener(eventName, handler);
    };
  }, [eventName]);
}
