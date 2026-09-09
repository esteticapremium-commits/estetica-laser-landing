'use client';

export type FunnelEvent =
  | 'PageView'
  | 'ViewContent'
  | 'Lead'
  | 'VslView'
  | 'CTAClick'
  | 'BookingClick';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Meta accetta `track` solo per i suoi eventi standard: tutto il resto va inviato
 * con `trackCustom`, altrimenti l'evento viene scartato e non è usabile per
 * ottimizzare le campagne.
 */
const META_STANDARD_EVENTS = new Set<FunnelEvent>(['PageView', 'ViewContent', 'Lead']);

export function trackEvent(
  name: FunnelEvent,
  payload: Record<string, unknown> = {},
) {
  if (typeof window === 'undefined') return;

  window.dataLayer?.push({ event: name, ...payload });
  window.fbq?.(META_STANDARD_EVENTS.has(name) ? 'track' : 'trackCustom', name, payload);
  window.gtag?.('event', name, payload);
}
