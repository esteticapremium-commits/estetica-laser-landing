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

export type SubmitLeadResult = { ok: true; mode: 'mock' | 'webhook' };

function normalizeItalianPhone(value: string) {
  const compact = value.replace(/[\s().-]/g, '');
  if (compact.startsWith('+39')) return compact;
  if (compact.startsWith('0039')) return `+39${compact.slice(4)}`;
  return `+39${compact}`;
}

export async function submitLead(data: LeadData): Promise<SubmitLeadResult> {
  const payload = {
    ...data,
    telefono: normalizeItalianPhone(data.telefono),
    // Nome esteso della sede, per chi legge il lead senza conoscere gli slug.
    sedeName: funnelConfig.locations.find((location) => location.slug === data.sede)?.name ?? '',
    submittedAt: new Date().toISOString(),
    offer: funnelConfig.offerName,
  };

  // TODO: CONNECT N8N / CRM WEBHOOK
  if (!funnelConfig.leadWebhookUrl) {
    if (process.env.NODE_ENV === 'development') {
      console.info('[Lead mock mode]', payload);
    }
    await new Promise((resolve) => setTimeout(resolve, 650));
    return { ok: true, mode: 'mock' };
  }

  const response = await fetch(funnelConfig.leadWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Non è stato possibile inviare la richiesta.');
  }

  return { ok: true, mode: 'webhook' };
}
