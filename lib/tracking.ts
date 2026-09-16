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

function sendMetaEvent(
  name: FunnelEvent,
  payload: Record<string, unknown>,
  eventId?: string,
) {
  if (!window.fbq) return false;

  const method = META_STANDARD_EVENTS.has(name) ? 'track' : 'trackCustom';
  if (eventId) {
    window.fbq(method, name, payload, { eventID: eventId });
  } else {
    window.fbq(method, name, payload);
  }

  return true;
}

export function trackEvent(
  name: FunnelEvent,
  payload: Record<string, unknown> = {},
) {
  if (typeof window === 'undefined') return;

  window.dataLayer?.push({ event: name, ...payload });
  sendMetaEvent(name, payload);
  window.gtag?.('event', name, payload);
}

/**
 * Le conversioni che avvengono durante un cambio pagina devono aspettare che lo
 * snippet Meta sia pronto. In caso contrario il browser può perdere l'evento
 * prima ancora che venga inserito nella coda del Pixel.
 */
export async function trackEventWhenMetaReady(
  name: FunnelEvent,
  payload: Record<string, unknown> = {},
  options: { eventId?: string; timeoutMs?: number } = {},
) {
  if (typeof window === 'undefined') return false;

  const deadline = Date.now() + (options.timeoutMs ?? 5000);
  while (!window.fbq && Date.now() < deadline) {
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  }

  if (!sendMetaEvent(name, payload, options.eventId)) return false;

  window.dataLayer?.push({ event: name, event_id: options.eventId, ...payload });
  window.gtag?.('event', name, { event_id: options.eventId, ...payload });
  return true;
}
