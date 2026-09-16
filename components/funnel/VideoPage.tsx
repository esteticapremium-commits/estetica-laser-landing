'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';

import { SiteFooter } from '@/components/funnel/SiteFooter';
import { VslPlayer } from '@/components/funnel/VslPlayer';
import {
  advisorName,
  findLocation,
  funnelConfig,
  locationsSentence,
  toPhoneHref,
} from '@/config/funnel';
import { trackEvent, trackEventWhenMetaReady } from '@/lib/tracking';

const method = funnelConfig.methodName;
const offer = funnelConfig.offerName;
/** 'LA CONSULENZA METICOLOSA È GRATUITA', lo stesso gancio della landing. */
const offerHeadline = `LA ${offer.toUpperCase()} È GRATUITA`;
const pendingLeadKey = 'pendingMetaLeadEvent';

declare global {
  interface Window {
    __metaLeadDispatching?: boolean;
  }
}

export function VideoPage() {
  const [firstName, setFirstName] = useState('');
  const [sede, setSede] = useState('');

  useEffect(() => {
    trackEvent('VslView', { page: 'video' });

    // Il flag viene creato solo dopo che il foglio ha confermato il salvataggio.
    // Rimane in sessione finché Meta non accetta l'evento, così un refresh non
    // perde la conversione e l'evento non viene inviato due volte.
    const pendingLead = sessionStorage.getItem(pendingLeadKey);
    if (pendingLead && !window.__metaLeadDispatching) {
      try {
        const parsed = JSON.parse(pendingLead) as {
          eventId?: string;
          payload?: Record<string, unknown>;
        };
        window.__metaLeadDispatching = true;
        void trackEventWhenMetaReady('Lead', parsed.payload ?? {}, {
          eventId: parsed.eventId,
        }).then((sent) => {
          if (sent) sessionStorage.removeItem(pendingLeadKey);
          window.__metaLeadDispatching = false;
        });
      } catch {
        sessionStorage.removeItem(pendingLeadKey);
      }
    }

    // sessionStorage esiste solo dopo il mount: la lettura va fatta qui per non
    // rompere l'idratazione con dati presenti solo lato client.
    // oxlint-disable-next-line react/react-compiler
    setFirstName(sessionStorage.getItem('leadFirstName') ?? '');
    // oxlint-disable-next-line react/react-compiler
    setSede(sessionStorage.getItem('leadSede') ?? '');
  }, []);

  const bookingLabel = 'PRENOTA LA CONSULENZA METICOLOSA GRATUITA';
  // Ogni sede ha la propria linea: se la lead ne ha scelta una, mostriamo quella.
  const chosenLocation = findLocation(sede);
  const callNumber = chosenLocation?.phone ?? funnelConfig.phone;

  return (
    <main className="thank-you-page">
      <header className="site-header">
        <Link href="/" className="brand" aria-label={funnelConfig.centerName || 'Torna alla landing'}>
          <span className="brand-name">{funnelConfig.brandName || 'Il centro'}</span>
          {funnelConfig.brandDetail && (
            <span className="brand-detail">{funnelConfig.brandDetail}</span>
          )}
        </Link>
      </header>

      <section className="headline-section thank-you-hero" aria-labelledby="thank-you-title">
        <div className="headline-inner thank-you-inner">
          <div className="event-note">Richiesta ricevuta · {offerHeadline}</div>
          <h1 id="thank-you-title">
            {firstName ? (
              <>
                Perfetto <span>{firstName}</span>. Ora guarda il video.
              </>
            ) : (
              'Perfetto. Ora guarda il video.'
            )}
          </h1>
          <p className="thank-you-intro">
            {funnelConfig.ownerFirstName ? `${advisorName} ti spiega` : 'Ti spieghiamo'} cosa
            valutare prima di scegliere un centro laser e come capire se il {method} è adatto alla
            tua pelle.
          </p>
          <div className="thank-you-player">
            <VslPlayer />
          </div>
        </div>
      </section>

      <section className="vsl-cta-section" aria-labelledby="vsl-cta-title">
        <div className="vsl-cta-copy">
          <h2 id="vsl-cta-title">
            Vuoi capire se l’epilazione laser definitiva è adatta anche a te?
          </h2>
          <p className="appointment-highlight">
            {offerHeadline}
            {funnelConfig.scarcityNote ? ` · ${funnelConfig.scarcityNote}` : ''}
          </p>
          <p className="booking-guarantee">
            {funnelConfig.guaranteeName}: se non sei soddisfatta ripetiamo gratis fino a{' '}
            {funnelConfig.guaranteeSessions} sedute sulla stessa zona.
          </p>

          <div className="booking-actions">
            {funnelConfig.bookingUrl ? (
              <a
                href={funnelConfig.bookingUrl}
                className="primary-cta"
                onClick={() => trackEvent('BookingClick', { location: '/video', channel: 'booking' })}
              >
                {bookingLabel}<ArrowRight aria-hidden="true" />
              </a>
            ) : callNumber ? (
              <a
                href={toPhoneHref(callNumber)}
                className="primary-cta"
                onClick={() =>
                  trackEvent('BookingClick', { location: '/video', channel: 'phone', sede })
                }
              >
                <Phone aria-hidden="true" />
                {chosenLocation
                  ? `CHIAMA ${chosenLocation.name.toUpperCase()}: ${callNumber}`
                  : `CHIAMA IL ${callNumber}`}
              </a>
            ) : (
              <Link href="/" className="primary-cta">
                TORNA ALLA LANDING<ArrowRight aria-hidden="true" />
              </Link>
            )}

            {funnelConfig.whatsappEnabled && callNumber && (
              <a
                href={`https://wa.me/39${callNumber.replace(/[^0-9]/g, '')}`}
                className="secondary-cta on-dark"
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  trackEvent('BookingClick', { location: '/video', channel: 'whatsapp', sede })
                }
              >
                <MessageCircle aria-hidden="true" />
                Scrivi su WhatsApp
              </a>
            )}
          </div>

          <p className="booking-note">
            Ti richiamiamo negli orari di apertura
            {funnelConfig.openingHours ? ` (${funnelConfig.openingHours})` : ''}.{' '}
            {chosenLocation
              ? `${chosenLocation.name}, ${chosenLocation.address}.`
              : locationsSentence && `Sedi di ${locationsSentence}.`}
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
