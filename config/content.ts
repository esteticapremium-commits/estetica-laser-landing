/**
 * Prove reali del centro.
 *
 * Recensioni e casi studio vengono dal widget Trustindex pubblicato su
 * estetica-laser.net (98 recensioni verificate Google/Facebook). Sono estratti
 * verbatim: si può accorciare a fine frase, mai riscrivere.
 *
 * `proofImages` è ancora vuoto: finché il centro non consegna i propri
 * prima/dopo, la galleria non mostra nulla di inventato.
 */

export const googleReviews: Array<{ name: string; when: string; text: string }> = [
  { name: 'Irene Lombardo', when: '2 settimane fa', text: 'Ho avuto ottimi risultati dalle prime sedute, utile la prima seduta di prova dove mi è stato spiegato tutto, personale molto cortese e disponibile. Molto consigliato.' },
  { name: 'Elena Gnudi', when: '1 mese fa', text: 'Con Estetic@Laser mi sono liberata della schiavitù dei peli! Da quando ho iniziato il percorso qui mi sono fidata di loro e non ho più dovuto preoccuparmi della ricrescita! Le ragazze sono tutte gentilissime e super disponibili, centri pulitissimi, consigliato!' },
  { name: 'Vera Regus', when: '2 mesi fa', text: 'Sono molto contenta di aver conosciuto il vostro centro qui a Corticella che per me è molto comodo, qui ho incontrato Erica, ragazza molto professionale per suo lavoro, solare e sempre con un bel sorriso. Sono molto contenta dei risultati dell’epilazione, magari averlo fatto prima.' },
  { name: 'Cristina Degli Esposti', when: '2 mesi fa', text: 'Personale gentile e preparato, risultati visibili!!' },
  { name: 'Laura Romano', when: '2 mesi fa', text: 'Ho iniziato due anni fa e devo dire che sin dall’inizio mi sono trovata benissimo. Elena è davvero gentilissima e si vede che lavora con passione. Super consigliato.' },
  { name: 'Anna Terenzi', when: '3 mesi fa', text: 'Ho iniziato il percorso laser da inizio di quest’anno e mi ritengo molto soddisfatta finora: risultati incredibili già dopo la prima seduta, le ragazze sono TUTTE gentili e professionali, il prezzo è buono e sono davvero soddisfatta!' },
  { name: 'Martina Bergonzoni', when: '3 mesi fa', text: 'Frequento il centro da qualche anno e mi sono sempre trovata benissimo. I risultati sono stati evidenti fin da subito. Le ragazze sono competenti ed attente e sanno mettere a proprio agio. Consiglio assolutamente!' },
  { name: 'Angelica Ecolino', when: '4 mesi fa', text: 'Qualche mese fa ho iniziato la mia prima esperienza con il laser in questo centro. Sono super soddisfatta dei risultati che sto ottenendo. Trovo tanta precisione, professionalità e un ambiente accogliente in cui è sempre piacevole passare quell’ora insieme.' },
  { name: 'Jennifer Gesualdo', when: '4 mesi fa', text: 'Professionalità e competenza dello staff, pulizia del centro, risultati visibili soprattutto sui trattamenti corpo e laser, gentilezza e accoglienza.' },
  { name: 'Silvia Marchetti', when: '4 mesi fa', text: 'Ho iniziato per la prima volta circa due anni fa a Casalecchio. Mi sono trovata subito molto a mio agio grazie alla professionalità di Rosa, brava e competente! Consiglio assolutamente!! Sono stra soddisfatta! Top' },
];

/** Tre clienti reali, ricavate dalle recensioni qui sopra. */
export const caseStudies: Array<{
  client: string;
  context: string;
  action: string;
  quote: string;
}> = [
  {
    client: 'Elena Gnudi',
    context: 'Percorso completo',
    action: 'Ha iniziato il percorso laser affidandosi al centro e non ha più dovuto occuparsi della ricrescita.',
    quote: 'Con Estetic@Laser mi sono liberata della schiavitù dei peli!',
  },
  {
    client: 'Anna Terenzi',
    context: 'Prime sedute',
    action: 'Ha cominciato il percorso laser a inizio anno e ha visto la differenza fin dalla prima seduta.',
    quote: 'Risultati incredibili già dopo la prima seduta.',
  },
  {
    client: 'Irene Lombardo',
    context: 'Seduta di prova',
    action: 'È partita dalla seduta di prova, dove le è stato spiegato tutto prima di iniziare il percorso.',
    quote: 'Ho avuto ottimi risultati dalle prime sedute.',
  },
];

/**
 * Prima/dopo presi dal profilo Google Business del centro (scheda di Castel
 * Maggiore, foto pubblicate dal proprietario), già marchiate E@L.
 *
 * Sul profilo erano immagini uniche con "prima" sopra e "dopo" sotto: le ho
 * separate, così in pagina stanno affiancate — prima a sinistra, dopo a destra.
 * Escluso il prima/dopo sulle ascelle: nel "dopo" c'è una zona scura che sembra
 * un livido.
 */
export const proofPairs: Array<{
  zone: string;
  before: string;
  after: string;
  afterLabel: string;
}> = [
  {
    zone: 'Gambe',
    before: '/images/prima-1.webp',
    after: '/images/dopo-1.webp',
    afterLabel: 'Dopo',
  },
  {
    zone: 'Gambe',
    before: '/images/prima-2.webp',
    after: '/images/dopo-2.webp',
    // Nessun numero di sedute nelle didascalie: solo il prima/dopo.
    afterLabel: 'Dopo',
  },
];

/**
 * Testimonianze video già pubblicate su estetica-laser.net (pagina Opinioni).
 * Non sono ancora montate in pagina: pronte se si vuole affiancarle ai casi studio.
 */
export const videoTestimonials = [
  { name: 'Intervista televisiva', youtubeId: 'eosh40nn8K0' },
  { name: 'Fernando', youtubeId: 'QoH-okfBZUU' },
  { name: 'Serena', youtubeId: 'Wo1K9swg5Hk' },
  { name: 'Valentina Petrillo', youtubeId: 'OBSK-vNQxgw' },
  { name: 'Laura', youtubeId: 'Cszf4eyU-6Q' },
  { name: 'Gladis', youtubeId: 's-q7hq7MeAw' },
  { name: 'Francesca', youtubeId: '2yfQur1gBOg' },
];
