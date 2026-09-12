/**
 * Dati del centro. Tutto quello che è verificato viene dal sito ufficiale
 * estetica-laser.net; i campi ancora da confermare sono segnati VERIFY_WITH_CLIENT.
 *
 * Ogni campo lasciato vuoto non stampa un segnaposto: il blocco che lo usa
 * semplicemente non viene reso.
 */
export const funnelConfig = {
  // --- Identità del centro -------------------------------------------------
  centerName: 'Estetica Laser Bologna',
  brandName: 'Estetic@Laser',
  brandDetail: 'Epilazione laser · Bologna',
  vatNumber: '03687451207',
  /** VERIFY_WITH_CLIENT — nome di battesimo del titolare, usato nei testi. */
  ownerFirstName: '',
  /** VERIFY_WITH_CLIENT — nome e cognome, per la presentazione in prima persona. */
  ownerFullName: '',
  /** VERIFY_WITH_CLIENT — anni di esperienza, certificazioni, formazione. */
  ownerCredential: '',

  /**
   * Numero generico, usato finché non si sa quale sede ha scelto la lead.
   * È quello che il centro mette sulle proprie inserzioni (in realtà è la linea
   * di Castel Maggiore).
   */
  phone: '051 4117847',
  /** VERIFY_WITH_CLIENT — non pubblicata sul sito. */
  email: '',

  // --- Sedi ----------------------------------------------------------------
  /**
   * `slug` viaggia nel lead: è il valore che arriva al CRM.
   * Ogni sede ha la propria linea telefonica (fonte: pagina "Le sedi").
   */
  locations: [
    {
      slug: 'corticella',
      name: 'Bologna Corticella',
      address: 'Via Amedeo Lipparini, 4/E',
      phone: '051 4984620',
    },
    {
      slug: 'casalecchio',
      name: 'Casalecchio di Reno',
      address: 'Via Del Guercino, 2/C',
      phone: '051 4111609',
    },
    {
      slug: 'castel-maggiore',
      name: 'Castel Maggiore',
      address: 'Via Bondanello, 10',
      phone: '051 4117847',
    },
  ],
  /** Orari uguali per tutte e tre le sedi. */
  openingHours: 'Mar-Ven 11:00-20:00 · Sab 09:00-13:00',

  // --- Offerta -------------------------------------------------------------
  /** Metodo su cui è costruita tutta la comunicazione. */
  methodName: 'Metodo Meticoloso',
  /** L'offerta si chiama con il nome del centro, non con un'etichetta nostra. */
  offerName: 'Consulenza Meticolosa',
  /** Lo stack dell'offerta, tutto ricavato da quanto il centro dichiara. */
  offerIncludes: [
    '60 minuti dedicati solo a te, sulla zona che scegli tu',
    'Check-up del fototipo e analisi del pelo',
    'Test di efficacia millimetrica sulla tua pelle',
    'Preventivo scritto, con i tempi indicativi del percorso',
  ],
  /** Bonus dichiarato sul sito per chi inizia il percorso. Vuoto = non mostrato. */
  offerBonus: 'In omaggio il Manuale Tecnico Esclusivo quando inizi il percorso',
  /**
   * Arco di tempo dell'headline, ricavato da due dati pubblicati dal centro:
   * i prima/dopo sul profilo Google sono etichettati "5 sedute" e il metodo
   * prevede monitoraggio ogni 21 giorni (5 × 21 ≈ 3,5 mesi). "6 mesi" è quindi
   * una stima prudente. VERIFY_WITH_CLIENT: farlo confermare ad Alex.
   */
  provenTimeframe: '6 mesi',
  /** Urgenza già usata dal centro sulle proprie pagine. Svuotare per toglierla. */
  scarcityNote: 'Solo 7 posti disponibili questa settimana',
  /** Prezzo trasparente dichiarato sul sito. Vuoto = non mostrato. */
  pricePerZone: '35 €',
  /** Nome della garanzia scritta del centro. */
  guaranteeName: 'Soddisfatta o ritrattata',
  /** Sedute ripetute gratuitamente se il risultato non soddisfa. */
  guaranteeSessions: 5,
  guaranteeTerms:
    'La garanzia vale al termine del percorso definito in consulenza, se hai seguito alla lettera ogni indicazione tecnica.',

  // --- Video ---------------------------------------------------------------
  /**
   * VERIFY_WITH_CLIENT — per ora punta all'intervista televisiva già pubblicata
   * sul sito. Sostituire con la VSL dedicata quando è pronta.
   */
  vslUrl: 'https://www.youtube.com/embed/eosh40nn8K0',
  /** Fermo immagine della thank-you page (frame estratto dal video stesso). */
  vslPoster: '',
  /** Durata mostrata sul player finto della landing, formato mm:ss. */
  vslDuration: '',

  // --- Link e integrazioni -------------------------------------------------
  bookingUrl: '',
  privacyUrl: 'https://www.estetica-laser.net/index.php?p=privacy',
  cookieUrl: 'https://www.estetica-laser.net/index.php?p=privacy#cookies',
  /**
   * Web App di Google Apps Script collegata al foglio dei contatti.
   * Il sito è statico, quindi la chiamata parte dal browser e questo indirizzo
   * è visibile nel sorgente: lo script deve limitarsi a scrivere sul foglio.
   * Da compilare con l'URL che Apps Script restituisce al momento del deploy
   * (finisce con /exec).
   */
  leadEndpoint: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL ?? '',
  /** Attivare solo se il numero è un WhatsApp Business attivo. */
  whatsappEnabled: false,

  // --- Recensioni ----------------------------------------------------------
  /** VERIFY_WITH_CLIENT — Trustindex mostra "Eccellente" senza il voto numerico. */
  googleRating: 0,
  googleReviewsCount: 98,
  googleReviewsUrl: 'https://www.estetica-laser.net/index.php?p=opinioni',
};

export const trackingConfig = {
  // L'ID del Pixel è pubblico (finisce comunque nel sorgente della pagina): sta
  // qui come valore predefinito così il tracciamento funziona anche sulla build
  // di GitHub Pages, dove non ci sono variabili d'ambiente configurate.
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '3936545503321080',
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID ?? 'yg8m9om83h',
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID ?? '',
  googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID ?? '',
};

/**
 * '051 4117847' -> 'tel:+390514117847'. I numeri in config stanno in formato
 * nazionale, quindi il prefisso internazionale si aggiunge qui.
 */
export function toPhoneHref(phone: string) {
  const digits = phone.replace(/[^0-9]/g, '');
  return digits ? `tel:+39${digits}` : '#';
}

export const phoneHref = toPhoneHref(funnelConfig.phone);

/** wa.me vuole il numero senza + e senza spazi. */
export const whatsappHref = funnelConfig.phone
  ? `https://wa.me/39${funnelConfig.phone.replace(/[^0-9]/g, '')}`
  : '#';

/** La sede scelta dalla lead, altrimenti `undefined`. */
export function findLocation(slug: string | null | undefined) {
  if (!slug) return undefined;
  return funnelConfig.locations.find((location) => location.slug === slug);
}

/** 'Bologna Corticella, Casalecchio di Reno e Castel Maggiore'. */
export const locationsSentence = (() => {
  const names = funnelConfig.locations.map((location) => location.name);
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(', ')} e ${names.at(-1)}`;
})();

/** Come chiamare il titolare nei testi: il suo nome, oppure 'noi' finché manca. */
export const advisorName = funnelConfig.ownerFirstName || 'noi';

/** 'Alex' -> 'ad Alex', 'noi' -> 'a noi'. */
export const advisorWithPreposition = `${/^[aeiou]/i.test(advisorName) ? 'ad' : 'a'} ${advisorName}`;
