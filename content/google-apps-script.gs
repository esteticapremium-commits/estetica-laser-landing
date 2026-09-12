/**
 * Riceve i contatti della landing e li scrive sul foglio.
 *
 * COME INSTALLARLO
 * 1. Apri il foglio → Estensioni → Apps Script
 * 2. Cancella tutto e incolla questo file
 * 3. Salva
 * 4. Distribuisci → Gestisci distribuzioni → matita → Versione: "Nuova versione"
 *    (se è la prima volta: Distribuisci → Nuova distribuzione → App web)
 *      - Esegui come: Me stesso
 *      - Chi ha accesso: Chiunque          <-- indispensabile
 * 5. Autorizza quando lo chiede
 *
 * ATTENZIONE: dopo ogni modifica al codice serve una NUOVA VERSIONE della
 * distribuzione, altrimenti l'indirizzo continua a eseguire il codice vecchio.
 * È l'errore più comune con Apps Script.
 *
 * PER VERIFICARE: apri l'indirizzo /exec nel browser. Se risponde
 * "foglio: raggiungibile" il collegamento è a posto.
 */

/** ID del foglio, preso dal suo indirizzo. Puntare per ID invece che al foglio
 *  "attivo" evita l'errore che si presenta quando lo script non è legato al
 *  documento: in quel caso getActiveSpreadsheet() è vuoto e la scrittura fallisce. */
const ID_FOGLIO = '1ADj0pLDaMn08QMr-1xgfpDycqsxaV8nZtpOWzyiPd4Q';

/** ID della scheda indicata nel link del cliente (`gid=0`, cioè Foglio1). */
const ID_SCHEDA = 0;

const COLONNE = [
  'Data e ora',
  'Nome',
  'Cognome',
  'Telefono',
  'Email',
  'Sede',
  'Consenso privacy',
  'Origine',
  'Pagina',
  'fbc',
  'fbp',
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return risposta({ ok: false, error: 'Richiesta vuota' });
    }

    const dati = JSON.parse(e.postData.contents);

    // Validazione minima: lo script è raggiungibile pubblicamente, quindi
    // scartiamo le richieste che non hanno la forma di un contatto.
    const nome = testo(dati.nome, 80);
    const telefono = testo(dati.telefono, 30);
    const email = testo(dati.email, 160).toLowerCase();
    if (!nome) return risposta({ ok: false, error: 'Nome mancante' });
    if (telefono.replace(/\D/g, '').length < 8) {
      return risposta({ ok: false, error: 'Telefono non valido' });
    }
    if (!/.+@.+\..+/.test(email)) {
      return risposta({ ok: false, error: 'Email non valida' });
    }

    scheda().appendRow([
      new Date(),
      nome,
      testo(dati.cognome, 120),
      "'" + telefono, // l'apostrofo impedisce a Sheets di mangiare il + iniziale
      email,
      testo(dati.sedeName, 60) || testo(dati.sede, 60),
      dati.privacyConsent === true ? 'Sì' : 'No',
      testo(dati.source, 60),
      testo(dati.pagina, 300),
      testo(dati.fbc, 255),
      testo(dati.fbp, 255),
    ]);

    return risposta({ ok: true });
  } catch (err) {
    // Il messaggio vero dell'errore torna al chiamante: senza, diagnosticare
    // un problema di scrittura o di permessi diventa impossibile.
    return risposta({ ok: false, error: 'Errore dello script: ' + String(err) });
  }
}

/** Aperto nel browser dice subito se il foglio è raggiungibile. */
function doGet() {
  try {
    const foglio = scheda();
    return risposta({
      ok: true,
      service: 'Estetic@Laser lead receiver',
      foglio: 'raggiungibile',
      scheda: foglio.getName(),
      righe: foglio.getLastRow(),
    });
  } catch (err) {
    return risposta({ ok: false, foglio: 'NON raggiungibile', error: String(err) });
  }
}

function scheda() {
  const file = SpreadsheetApp.openById(ID_FOGLIO);
  const foglio = file.getSheetById(ID_SCHEDA);
  if (!foglio) {
    throw new Error('La scheda gid=' + ID_SCHEDA + ' non esiste nel foglio configurato.');
  }
  if (foglio.getLastRow() === 0) {
    foglio.appendRow(COLONNE);
    foglio.getRange(1, 1, 1, COLONNE.length).setFontWeight('bold');
    foglio.setFrozenRows(1);
  }
  return foglio;
}

function testo(valore, lunghezzaMax) {
  return typeof valore === 'string' ? valore.trim().slice(0, lunghezzaMax) : '';
}

function risposta(oggetto) {
  return ContentService.createTextOutput(JSON.stringify(oggetto)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
