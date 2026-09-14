'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Check, ShieldCheck, Star } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LeadForm } from '@/components/funnel/LeadForm';
import { SiteFooter } from '@/components/funnel/SiteFooter';
import { VslGate } from '@/components/funnel/VslPlayer';
import { caseStudies, googleReviews, proofPairs } from '@/config/content';
import { funnelConfig, locationsSentence } from '@/config/funnel';
import { trackEvent } from '@/lib/tracking';

const method = funnelConfig.methodName;
const offer = funnelConfig.offerName;
/** 'LA CONSULENZA METICOLOSA È GRATUITA', il gancio ripetuto in tutta la pagina. */
const offerHeadline = `LA ${offer.toUpperCase()} È GRATUITA`;

/** Etichetta unica per tutti i pulsanti che aprono il percorso video. */
const videoCtaLabel = 'SCOPRI COME DIRE ADDIO PER SEMPRE AI TUOI PELI';

// La decisione nasce dal voler smettere di subire qualcosa: ogni voce è la
// scocciatura concreta di oggi, non il beneficio di domani.
const problems = [
  'Ogni mese lo stesso appuntamento per la ceretta, con il dolore che sai già di dover sopportare.',
  'Il rasoio quasi tutti i giorni, e comunque irritazione, puntini rossi e peli incarniti.',
  'Ti guardi le gambe prima di uscire e decidi cosa metterti in base a quanto sono ricresciuti.',
  'Inguine e ascelle che ti mettono a disagio proprio quando vorresti pensarci di meno.',
  'Hai già speso in sedute laser da un’altra parte e dopo qualche mese i peli sono tornati come prima.',
];

const credentials = [
  `Tre centri specializzati in epilazione laser: ${locationsSentence}.`,
  'Protocollo Cryo-Laser calibrato su fototipo, spessore del pelo e fase di crescita.',
  'Operatrici formate costantemente, con la Carta dei Diritti del Cliente messa per iscritto.',
];

// Cosa copre la garanzia scritta del centro ("Soddisfatta o ritrattata").
const guaranteedResults = [
  `Fino a ${funnelConfig.guaranteeSessions} sedute ripetute gratuitamente`,
  'Sulla stessa zona del percorso concordato',
  'Con le condizioni messe per iscritto prima di iniziare',
];

// I tre pilastri tecnici del Metodo Meticoloso, come descritti dal centro.
const secrets = [
  {
    title: 'Colpire il pelo nella sua fase di crescita',
    copy: 'Il laser agisce solo quando il pelo è in fase Anagen, cioè collegato alla papilla dermica. Negli altri momenti il passaggio è inutile: per questo la ricrescita viene monitorata ogni 21 giorni e le sedute vengono sincronizzate sul tuo ritmo biologico.',
  },
  {
    title: 'Sovrapporre gli impulsi millimetro per millimetro',
    copy: 'Per esaurire il bulbo senza scottare la pelle il manipolo va mosso con una sovrapposizione millimetrica, senza saltare nessuna zona. È il motivo per cui su gambe intere servono 90 minuti e non 20.',
  },
  {
    title: 'Dare alla pelle il tempo di raffreddarsi',
    copy: 'La tecnologia Cryo raffredda la pelle mentre il laser lavora e il ritmo della seduta viene rallentato per far dissipare il calore tra un impulso e l’altro: massima sicurezza e nessuna sofferenza.',
  },
];

// `proof` resta opzionale: finché il centro non fornisce una prova reale per il
// singolo errore, la colonna non viene renderizzata (nessun placeholder a video).
const mistakes: Array<{ mistake: string; instead: string; proof?: string }> = [
  {
    mistake: 'Pensare che tutti i centri laser facciano la stessa identica cosa.',
    instead: 'Chiedere quanto tempo viene dedicato alla singola zona: un protocollo millimetrico su gambe intere richiede 90 minuti, non 20.',
  },
  {
    mistake: 'Scegliere il centro guardando solo il prezzo della singola seduta.',
    instead: 'Guardare cosa include la seduta — analisi del fototipo, calibrazione, tempo effettivo — e quanto dura indicativamente il percorso sulla tua zona.',
  },
  {
    mistake: 'Prenotare la seduta senza sapere in che fase è la tua ricrescita.',
    instead: 'Farsi dare un calendario: il pelo si elimina solo se viene colpito in fase di crescita attiva, che non è uguale per tutte.',
  },
  {
    mistake: 'Pensare che, siccome hai già provato il laser senza risultati, sulla tua pelle non funzioni.',
    instead: 'Capire perché non ha funzionato: fototipo mai valutato, potenza troppo bassa o sedute fatte fuori dalla fase giusta.',
  },
  {
    mistake: 'Giudicare tutto il percorso dalla prima seduta.',
    instead: 'Seguire il protocollo indicato e valutare la ricrescita seduta dopo seduta, che è il modo in cui il risultato si costruisce.',
  },
];

type FormVariant = 'video' | 'appointment';

/**
 * È il momento di massimo attrito: si chiedono i dati. Qui il testo non deve
 * spiegare la procedura ma ricordare perché vale la pena — il fastidio da cui
 * si scappa, il risultato che si vede e quello che si sente. Le istruzioni
 * vengono dopo.
 */
const formCopy: Record<FormVariant, { title: string; description: string; cta: string }> = {
  video: {
    title: 'Niente più ceretta, rasoio e ricrescita',
    description: `Una pelle liscia tutto l’anno e la libertà di non pensarci più. Inserisci i tuoi dati e scegli la sede: ti portiamo subito al video sul ${method} e ti richiamiamo per fissare il tuo appuntamento.`,
    cta: 'SCOPRI COME DIRE ADDIO PER SEMPRE AI TUOI PELI',
  },
  appointment: {
    title: offerHeadline,
    description: `Basta ceretta e rasoio: una pelle liscia tutto l’anno e la libertà di non pensarci più. Inserisci i tuoi dati e scegli la sede: ti richiamiamo per fissare la tua ${offer}, 60 minuti sulla zona che vuoi.`,
    cta: 'PRENOTA IL MIO APPUNTAMENTO',
  },
};

function formatRating(value: number) {
  return value.toLocaleString('it-IT', { minimumFractionDigits: 1 });
}

/** 'Anna' -> 'ad Anna', 'Elena' -> 'ad Elena', 'Silvia' -> 'a Silvia'. */
function withPreposition(name: string) {
  return `${/^[aeiou]/i.test(name) ? 'ad' : 'a'} ${name}`;
}

export function LandingPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [formVariant, setFormVariant] = useState<FormVariant>('video');
  const [showStickyCta, setShowStickyCta] = useState(false);
  // In swipe l'animazione va fermata, altrimenti combatte con lo scroll del dito.
  const [marqueePaused, setMarqueePaused] = useState(false);
  useEffect(() => {
    trackEvent('ViewContent', { page: 'landing' });
  }, []);

  // La barra segue la direzione dello scroll: compare scendendo, sparisce
  // risalendo, e resta nascosta finché si è in cima alla pagina.
  useEffect(() => {
    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY;
      // Soglia anti-rimbalzo: sotto gli 8px la direzione non è affidabile.
      if (Math.abs(delta) < 8) return;
      lastY = y;
      setShowStickyCta(delta > 0 && y > 320);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function openForm(location: string, variant: FormVariant = 'appointment') {
    trackEvent('CTAClick', { location, variant });
    setFormVariant(variant);
    setFormOpen(true);
  }

  function openVideoForm(location: string) {
    trackEvent('VslView', { location, gated: true });
    openForm(location, 'video');
  }

  const copy = formCopy[formVariant];

  return (
    <main className="landing-page">
      <section id="top" className="headline-section" aria-labelledby="main-headline">
        <div className="headline-inner">
          <div className="event-note">
            {offerHeadline}
            {funnelConfig.scarcityNote ? ` · ${funnelConfig.scarcityNote}` : ''}
          </div>
          {/* Formula: beneficio interno + esterno, arco temporale e obiezione di mercato. */}
          <h1 id="main-headline">
            Scopri come è possibile{' '}
            <span>avere una pelle liscia tutto l’anno e smettere di pensare ai peli</span> in meno di{' '}
            {funnelConfig.provenTimeframe}, anche se hai già provato il laser altrove ma senza
            risultati.
          </h1>
          <p className="headline-sub">
            Noi te li <strong>GARANTIAMO al 100%</strong>
          </p>
          <div className="hero-vsl">
            <div className="hero-vsl-label">
              <span>Il {method} in video</span>
            </div>
            <VslGate onUnlock={() => openVideoForm('hero-video')} />
            <button
              type="button"
              className="primary-cta hero-cta"
              onClick={() => openVideoForm('hero-cta')}
            >
              {videoCtaLabel}
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section className="problems-section" aria-labelledby="problems-title">
        <span className="section-eyebrow">Il punto di partenza</span>
        <h2 id="problems-title">Ti riconosci in una di queste situazioni?</h2>
        <ul className="problems-list">
          {problems.map((problem) => (
            <li key={problem}>
              <span className="check-mark"><Check aria-hidden="true" /></span>
              <span>{problem}</span>
            </li>
          ))}
        </ul>
        <div className="right-place">
          <h3>Se ti riconosci anche solo in una di queste situazioni, allora sei nel posto giusto.</h3>
          <p>
            Continua a leggere, perché quasi sempre il motivo per cui la ricrescita torna non è la
            tua pelle: è il modo in cui vengono fatte le sedute. E puoi verificarlo di persona prima
            di spendere un euro.
          </p>
          <button
            type="button"
            className="primary-cta"
            onClick={() => openVideoForm('problems')}
          >
            {videoCtaLabel}
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="guarantee-section" aria-labelledby="guarantee-title">
        <div className="guarantee-card">
          <div className="guarantee-seal" aria-hidden="true">
            <ShieldCheck />
            <strong>100%</strong>
            <span>Garantito</span>
          </div>
          <div className="guarantee-copy">
            <span className="section-eyebrow">La garanzia scritta</span>
            <h2 id="guarantee-title">{funnelConfig.guaranteeName}.</h2>
            <p>
              Se al termine del percorso il risultato non ti soddisfa, non ti lasciamo con il
              problema:
            </p>
            <ul className="guarantee-list">
              {guaranteedResults.map((result) => (
                <li key={result}>
                  <span className="check-mark"><Check aria-hidden="true" /></span>
                  <span>{result}</span>
                </li>
              ))}
            </ul>
            {funnelConfig.guaranteeTerms && (
              <p className="guarantee-terms">{funnelConfig.guaranteeTerms}</p>
            )}
            <button
              type="button"
              className="primary-cta"
              onClick={() => openVideoForm('guarantee')}
            >
              {videoCtaLabel}
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section className="credentials-section" aria-labelledby="credentials-title">
        <div className="credentials-copy">
          <span className="section-eyebrow on-dark">Chi ti parla</span>
          <h2 id="credentials-title">
            Ecco perché dovresti prestare attenzione a quello che sto per mostrarti.
          </h2>
          {funnelConfig.ownerFullName && (
            <p>
              Mi chiamo {funnelConfig.ownerFullName} e sono il titolare di {funnelConfig.brandName} a
              Bologna.
            </p>
          )}
        </div>
        <ul className="credentials-list">
          {credentials.map((credential) => (
            <li key={credential}>
              <span className="credential-mark"><Check aria-hidden="true" /></span>
              <span>{credential}</span>
            </li>
          ))}
          {funnelConfig.ownerCredential && (
            <li>
              <span className="credential-mark"><Check aria-hidden="true" /></span>
              <span>{funnelConfig.ownerCredential}</span>
            </li>
          )}
        </ul>
      </section>

      <section className="case-study-section" aria-label="Casi studio">
        {caseStudies.length > 0 && (
          <>
            <div className="case-studies-heading">
              <span className="section-eyebrow">Esperienze reali</span>
              <h2>Tre casi di successo raccontati dalle clienti.</h2>
            </div>
            <div className="case-studies-list">
              {caseStudies.map((study, index) => (
                <article className="case-study-story" key={study.client}>
                  <div className="case-study-details">
                    <span className="case-study-index">Caso studio 0{index + 1}</span>
                    <h2>Guarda cosa è successo {withPreposition(study.client)}.</h2>
                    <div className="case-study-action">
                      <span>Cosa ha fatto</span>
                      <p>{study.action}</p>
                    </div>
                    <blockquote className="case-study-review">
                      <span>{study.context}</span>
                      <p>“{study.quote}”</p>
                      <cite>{study.client} · Recensione verificata</cite>
                    </blockquote>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {proofPairs.length > 0 && (
          <div className="results-gallery-section">
            <span className="section-eyebrow">Prima e dopo</span>
            <h2>Ecco i risultati che puoi ottenere anche tu!</h2>
            <div className="results-gallery" aria-label="Prima e dopo reali del centro">
              {proofPairs.map((pair) => (
                <div className="results-pair" key={pair.before}>
                  <figure>
                    {/* oxlint-disable-next-line no-img-element -- immagini statiche già ottimizzate in webp */}
                    <img
                      src={pair.before}
                      alt={`${pair.zone} prima del percorso laser`}
                      loading="lazy"
                      decoding="async"
                    />
                    <figcaption>Prima</figcaption>
                  </figure>
                  <figure>
                    {/* oxlint-disable-next-line no-img-element -- immagini statiche già ottimizzate in webp */}
                    <img
                      src={pair.after}
                      alt={`${pair.zone} dopo il percorso laser`}
                      loading="lazy"
                      decoding="async"
                    />
                    <figcaption>{pair.afterLabel}</figcaption>
                  </figure>
                </div>
              ))}
            </div>
            <div className="section-cta">
              <button
                type="button"
                className="primary-cta"
                onClick={() => openVideoForm('results')}
              >
                {videoCtaLabel}
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {googleReviews.length > 0 && (
          <div className="verified-reviews">
            <div className="verified-reviews-heading">
              <div>
                <div className="reviews-score" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} fill="currentColor" />
                  ))}
                </div>
                <h3>
                  Oltre {funnelConfig.googleReviewsCount} recensioni{' '}
                  {funnelConfig.googleRating > 0
                    ? `${formatRating(funnelConfig.googleRating)} stelle `
                    : 'verificate '}
                  per tutte le nostre clienti!
                </h3>
              </div>
              {funnelConfig.googleReviewsUrl && (
                <a href={funnelConfig.googleReviewsUrl} target="_blank" rel="noreferrer">
                  Leggi tutte le recensioni
                </a>
              )}
            </div>
            <div
              className={`reviews-marquee${marqueePaused ? ' is-paused' : ''}`}
              aria-label="Recensioni verificate delle clienti"
              onTouchStart={() => setMarqueePaused(true)}
              onTouchEnd={() => setMarqueePaused(false)}
              onTouchCancel={() => setMarqueePaused(false)}
            >
              <div
                className="reviews-track"
                /* ~6 secondi a recensione: la velocità resta la stessa
                   qualunque sia il numero di recensioni caricate. */
                style={{ animationDuration: `${googleReviews.length * 6}s` }}
              >
                {googleReviews.map((review) => (
                  <article key={review.name}>
                    <blockquote>“{review.text}”</blockquote>
                    <cite>{review.name} · Recensione verificata</cite>
                  </article>
                ))}
                {googleReviews.map((review) => (
                  <article className="duplicate-review" key={`${review.name}-duplicate`} aria-hidden="true">
                    <blockquote>“{review.text}”</blockquote>
                    <cite>{review.name} · Recensione verificata</cite>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="secrets-section" aria-labelledby="secrets-title">
        <div className="secrets-heading">
          <span className="section-eyebrow">Il metodo</span>
          <h2 id="secrets-title">I 3 punti che fanno la differenza in un percorso laser.</h2>
        </div>
        <div className="secrets-list">
          {secrets.map((secret, index) => (
            <article key={secret.title}>
              <span className="secret-number">0{index + 1}</span>
              <div>
                <h3>Segreto {index + 1} — {secret.title}</h3>
                <p>{secret.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mistakes-section" aria-labelledby="mistakes-title">
        <div className="mistakes-heading">
          <span className="section-eyebrow">Da evitare</span>
          <h2 id="mistakes-title">5 errori da non fare.</h2>
        </div>
        <div className="mistakes-list">
          {mistakes.map((item, index) => (
            <article
              className="mistake-card"
              data-proof={item.proof ? 'true' : 'false'}
              key={item.mistake}
            >
              <div className="mistake-index">Errore {index + 1}</div>
              <div className="mistake-step">
                <span>Errore</span>
                <p>{item.mistake}</p>
              </div>
              <ArrowDown className="mistake-arrow" aria-hidden="true" />
              <div className="mistake-step instead-step">
                <span>Cosa devi fare invece</span>
                <p>{item.instead}</p>
              </div>
              {item.proof && (
                <>
                  <ArrowDown className="mistake-arrow" aria-hidden="true" />
                  <div className="mistake-step proof-step">
                    <span>Riprova sociale</span>
                    <p>{item.proof}</p>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="appuntamento" className="appointment-section" aria-labelledby="appointment-title">
        <div className="appointment-copy">
          <h2 id="appointment-title">
            Vuoi smettere di ricominciare da capo ogni mese?
          </h2>
          <p className="appointment-highlight">
            {offerHeadline}
            {funnelConfig.scarcityNote ? ` · ${funnelConfig.scarcityNote}` : ''}
          </p>
          {/* Lo stack dell'offerta: stessa lista usata nel blocco credenziali,
              perché anche questa sezione è su fondo scuro. */}
          <ul className="credentials-list">
            {funnelConfig.offerIncludes.map((item) => (
              <li key={item}>
                <span className="credential-mark"><Check aria-hidden="true" /></span>
                <span>{item}</span>
              </li>
            ))}
            <li>
              <span className="credential-mark"><ShieldCheck aria-hidden="true" /></span>
              <span>
                <strong>{funnelConfig.guaranteeName}</strong>: se non sei soddisfatta ripetiamo
                gratis fino a {funnelConfig.guaranteeSessions} sedute sulla stessa zona.
              </span>
            </li>
            {funnelConfig.offerBonus && (
              <li>
                <span className="credential-mark"><Check aria-hidden="true" /></span>
                <span>{funnelConfig.offerBonus}</span>
              </li>
            )}
          </ul>
          <p>
            Nessun pacchetto da firmare per iniziare
            {funnelConfig.pricePerZone
              ? `: se poi decidi di partire, il prezzo è ${funnelConfig.pricePerZone} a zona a seduta, scritto prima di iniziare.`
              : '. Il preventivo ti viene messo per iscritto prima di iniziare.'}
          </p>
          <button type="button" className="primary-cta" onClick={() => openForm('appointment')}>
            PRENOTA LA CONSULENZA METICOLOSA GRATUITA
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </section>

      <SiteFooter />

      <div className={`sticky-cta${showStickyCta ? ' is-visible' : ''}`} aria-hidden={!showStickyCta}>
        <p className="sticky-cta-copy">
          <span>Elimina</span> i peli per sempre — la Consulenza Meticolosa è{' '}
          <span>gratuita</span>
        </p>
        <button
          type="button"
          className="primary-cta"
          tabIndex={showStickyCta ? undefined : -1}
          onClick={() => openVideoForm('sticky')}
        >
          {videoCtaLabel}
          <ArrowRight aria-hidden="true" />
        </button>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="lead-dialog">
          <DialogHeader>
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>{copy.description}</DialogDescription>
          </DialogHeader>
          <LeadForm ctaLabel={copy.cta} />
        </DialogContent>
      </Dialog>
    </main>
  );
}
