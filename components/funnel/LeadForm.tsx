'use client';

import { SyntheticEvent, useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

import { funnelConfig } from '@/config/funnel';
import { submitLead, type LeadData } from '@/lib/submitLead';
import { trackEvent } from '@/lib/tracking';

type FormStatus = 'idle' | 'loading' | 'error';

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const nome = parts.shift() ?? '';
  return { nome, cognome: parts.join(' ') };
}

export function LeadForm({ ctaLabel = 'GUARDA IL VIDEO ORA' }: { ctaLabel?: string }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  // Con una sola sede la scelta non ha senso: viene preselezionata e nascosta.
  const [sede, setSede] = useState(
    funnelConfig.locations.length === 1 ? funnelConfig.locations[0].slug : '',
  );
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function clearError() {
    setErrorMessage('');
    if (status === 'error') setStatus('idle');
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const validEmail = /.+@.+\..+/.test(email.trim());
    const validPhone = phone.replace(/[^0-9]/g, '').length >= 6;
    if (name.trim().length < 2 || !validEmail || !validPhone) {
      setErrorMessage('Controlla i campi e riprova.');
      return;
    }
    if (funnelConfig.locations.length > 1 && !sede) {
      setErrorMessage('Scegli la sede più comoda per te.');
      return;
    }
    if (!consent) {
      setErrorMessage('Per continuare devi accettare l’informativa sulla privacy.');
      return;
    }

    const { nome, cognome } = splitFullName(name);
    const lead: LeadData = {
      nome,
      cognome,
      telefono: phone.trim(),
      email: email.trim(),
      sede,
      privacyConsent: true,
      source: 'landing-video-training',
    };

    try {
      setStatus('loading');
      setErrorMessage('');
      await submitLead(lead);
      sessionStorage.setItem('leadFirstName', nome);
      // La thank-you page usa la sede per mostrare il numero giusto.
      sessionStorage.setItem('leadSede', sede);
      trackEvent('Lead', { source: lead.source });
      window.location.assign('/video');
    } catch {
      setStatus('error');
      setErrorMessage('Non è stato possibile inviare i dati. Riprova.');
    }
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      {errorMessage && <div className="form-alert" role="alert">{errorMessage}</div>}

      <label>
        <span>Nome</span>
        <input name="name" autoComplete="name" value={name} onChange={(event) => { setName(event.target.value); clearError(); }} disabled={status === 'loading'} required />
      </label>
      <label>
        <span>Telefono</span>
        <input name="phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => { setPhone(event.target.value); clearError(); }} disabled={status === 'loading'} required />
      </label>
      <label>
        <span>Email</span>
        <input name="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); clearError(); }} disabled={status === 'loading'} required />
      </label>

      {funnelConfig.locations.length > 1 && (
        <label>
          <span>Sede più comoda</span>
          <select
            name="sede"
            value={sede}
            onChange={(event) => { setSede(event.target.value); clearError(); }}
            disabled={status === 'loading'}
            required
          >
            <option value="">Scegli la sede</option>
            {funnelConfig.locations.map((location) => (
              <option key={location.slug} value={location.slug}>{location.name}</option>
            ))}
          </select>
        </label>
      )}

      <label className="consent-field">
        <input
          name="consent"
          type="checkbox"
          checked={consent}
          onChange={(event) => { setConsent(event.target.checked); clearError(); }}
          disabled={status === 'loading'}
          required
        />
        <span>
          {funnelConfig.privacyUrl ? (
            <>
              Ho letto e accetto l’
              <a href={funnelConfig.privacyUrl} target="_blank" rel="noreferrer">informativa sul trattamento dei dati personali</a>
              {' '}e acconsento a essere ricontattata dal centro.
            </>
          ) : (
            'Acconsento a essere ricontattata. Il link all’informativa privacy deve ancora essere configurato.'
          )}
        </span>
      </label>

      <p className="form-guarantee">
        <ShieldCheck aria-hidden="true" />
        {funnelConfig.guaranteeName}: fino a {funnelConfig.guaranteeSessions} sedute ripetute gratis
      </p>

      <button type="submit" className="primary-cta dialog-cta" disabled={status === 'loading'}>
        {status === 'loading' ? 'INVIO IN CORSO…' : ctaLabel}
        {status !== 'loading' && <ArrowRight aria-hidden="true" />}
      </button>

      <p className="privacy-copy">
        I tuoi dati vengono usati solo per ricontattarti. Nessuno spam.
      </p>
    </form>
  );
}
