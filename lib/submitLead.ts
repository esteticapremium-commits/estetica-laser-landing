import { funnelConfig } from '@/config/funnel';

export type LeadData = {
  nome: string;
  cognome: string;
  telefono: string;
  email: string;
  /** Slug della sede scelta: 'corticella' | 'casalecchio' | 'castel-maggiore'. */
  sede: string;
  privacyConsent: true;
  source: 'landing-video-training';
};

export type SubmitLeadResult = { ok: true };

function normalizeItalianPhone(value: string) {
  const compact = value.replace(/[\s().-]/g, '');
  if (compact.startsWith('+39')) return compact;
  if (compact.startsWith('0039')) return `+39${compact.slice(4)}`;
  return `+39${compact}`;
}

function readCookie(name: string) {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

/**
 * Identificatori scritti dal Pixel nel browser: `_fbc` contiene l'ID del click
 * sull'inserzione, `_fbp` identifica il browser. Servono al CRM per dire a Meta
 * "questo contatto è poi diventato cliente" e alimentare l'ottimizzazione sui
 * contatti qualificati. Se non vengono salvati ora, quel collegamento è perso
 * per sempre.
 */
function metaIdentifiers() {
  const fbc = readCookie('_fbc');
  const fbp = readCookie('_fbp');
  // Al primo caricamento il cookie `_fbc` può non essere ancora stato scritto:
  // in quel caso il valore si ricostruisce dal parametro fbclid nell'indirizzo.
  const fbclid =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('fbclid')
      : null;

  return {
    fbc: fbc || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : ''),
    fbp,
  };
}

export async function submitLead(data: LeadData): Promise<SubmitLeadResult> {
  const endpoint = funnelConfig.leadEndpoint;
  if (!endpoint) {
    throw new Error('Destinazione dei contatti non configurata.');
  }

  const { fbc, fbp } = metaIdentifiers();
  const payload = {
    ...data,
    telefono: normalizeItalianPhone(data.telefono),
    sedeName: funnelConfig.locations.find((l) => l.slug === data.sede)?.name ?? '',
    fbc,
    fbp,
    pagina: typeof window !== 'undefined' ? window.location.href : '',
    inviatoIl: new Date().toISOString(),
  };

  // Il sito è statico, quindi la chiamata parte dal browser: Google Apps Script
  // non risponde alla richiesta di preflight CORS, e `text/plain` è l'unico
  // tipo che la evita. Lo script legge comunque il corpo come JSON.
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'follow',
  });

  const result = (await response.json().catch(() => null)) as
    | { ok?: boolean; error?: string }
    | null;

  if (!response.ok || result?.ok !== true) {
    throw new Error('Non è stato possibile inviare la richiesta.');
  }

  return { ok: true };
}
