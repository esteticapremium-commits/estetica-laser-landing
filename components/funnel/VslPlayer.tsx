'use client';

import { Maximize, Play, Volume2 } from 'lucide-react';

import { funnelConfig } from '@/config/funnel';

/** File video serviti direttamente da /public, non da un provider esterno. */
const VIDEO_FILE = /\.(mp4|webm|ogv|mov)(\?.*)?$/i;

function getEmbedUrl(url: string) {
  if (!url) return '';
  if (url.includes('player.vimeo.com/video/')) return url;
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  return url;
}

/**
 * Anteprima del video sulla landing. Si comporta come un player: l'utente clicca
 * play e al posto della riproduzione si apre il popup con il form. Il video vero
 * viene riprodotto sulla thank-you page.
 */
export function VslGate({ onUnlock }: { onUnlock: () => void }) {
  return (
    <button
      type="button"
      className="vsl-gate"
      onClick={onUnlock}
      aria-label={`Riproduci il video sul ${funnelConfig.methodName}`}
    >
      <span className="vsl-gate-poster" aria-hidden="true">
        <span className="vsl-gate-brand">
          <span className="vsl-gate-tv-badge">Intervista TV</span>
          <span>
            {funnelConfig.brandName ? `${funnelConfig.brandName} · ` : ''}
            {funnelConfig.methodName}
          </span>
        </span>
        <span className="vsl-gate-play">
          <Play fill="currentColor" aria-hidden="true" />
        </span>
        <span className="vsl-gate-title">
          Guarda l’intervista e scopri il {funnelConfig.methodName}
        </span>
        <span className="vsl-gate-bar">
          <span className="vsl-gate-progress"><span /></span>
          <span className="vsl-gate-time">
            0:00{funnelConfig.vslDuration ? ` / ${funnelConfig.vslDuration}` : ''}
          </span>
          <Volume2 aria-hidden="true" />
          <Maximize aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}

/** Player della thank-you page: riproduce il video una volta configurato `vslUrl`. */
export function VslPlayer() {
  const { vslUrl, vslPoster } = funnelConfig;

  if (VIDEO_FILE.test(vslUrl)) {
    return (
      <div className="vsl-embed">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption -- il video ha i sottotitoli impressi */}
        <video
          src={vslUrl}
          poster={vslPoster || undefined}
          controls
          playsInline
          preload="metadata"
        />
      </div>
    );
  }

  const embedUrl = getEmbedUrl(vslUrl);

  if (!embedUrl) {
    return (
      <div className="vsl-pending">
        <span className="vsl-gate-play">
          <Play fill="currentColor" aria-hidden="true" />
        </span>
        <strong>Il video sarà disponibile a breve.</strong>
        <span>
          Nel frattempo puoi già richiedere il tuo appuntamento per l’Open Day con il pulsante qui
          sotto.
        </span>
      </div>
    );
  }

  return (
    <div className="vsl-embed">
      <iframe
        src={embedUrl}
        title={`Video sul ${funnelConfig.methodName}`}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
