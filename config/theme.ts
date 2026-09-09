/**
 * Palette derivata dal logo Estetic@Laser (#E4007F).
 *
 * Il magenta puro del logo è tenuto per i dettagli piccoli (`logoMagenta`),
 * mentre pulsanti e superfici grandi usano `magenta`: stesso colore scurito e
 * leggermente desaturato, così su schermo non risulta fluo e regge il contrasto
 * del testo bianco.
 */
export const brandTheme = {
  /** Magenta esatto del logo, per accenti e dettagli. */
  logoMagenta: '#E4007F',

  canvas: '#FCF8F9',
  ink: '#2E0C1E',
  body: '#6B5860',
  magenta: '#C4056F',
  magentaInk: '#9C0057',
  magentaDeep: '#5C0A37',
  night: '#230815',
  blushLight: '#F7DCE9',
  line: '#ECD9E2',
} as const;

// Le variabili CSS corrispondenti stanno in cima ad app/globals.css: l'identità
// visiva si cambia da lì, senza toccare i singoli componenti.
// Titoli in Playfair Display (serif), testo in Hanken Grotesk (sans).
