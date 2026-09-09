import type { Metadata } from 'next';
import { Hanken_Grotesk, Playfair_Display } from 'next/font/google';

import { FunnelTracking } from '@/components/funnel/FunnelTracking';
import { funnelConfig, locationsSentence } from '@/config/funnel';
import './globals.css';

// High-contrast display serif for headlines, numbers and quotes (per design handoff).
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
});

// Grotesk sans for body copy, labels, inputs and buttons.
const hanken = Hanken_Grotesk({
  variable: '--font-hanken',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const title = `Epilazione laser definitiva a Bologna | ${funnelConfig.brandName}`;
const description = `Scopri come eliminare i peli per sempre con il ${funnelConfig.methodName}: protocollo millimetrico, garanzia scritta e ${funnelConfig.offerName} gratuita. Sedi di ${locationsSentence}.`;
/**
 * Indirizzo pubblico del sito: serve a costruire i link assoluti dell'anteprima
 * social. In build su GitHub Pages arriva da NEXT_PUBLIC_SITE_URL; il controllo
 * su 'https://' evita di rompere la build quando la variabile è vuota.
 */
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl =
  configuredUrl && configuredUrl !== 'https://'
    ? configuredUrl
    : vercelProductionHost
      ? `https://${vercelProductionHost}`
      : 'http://localhost:3000';

/**
 * Anteprima mostrata da WhatsApp, Messenger e simili quando si incolla il link.
 * WhatsApp scarta le immagini troppo pesanti: questa sta sotto i 100 KB.
 */
const ogImage = {
  url: '/images/og-cover.jpg',
  width: 1200,
  height: 630,
  type: 'image/jpeg',
  alt: `${funnelConfig.brandName} — Consulenza Meticolosa gratuita, 60 minuti a Bologna`,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'it_IT',
    siteName: funnelConfig.centerName || undefined,
    url: siteUrl,
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImage.url],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body className={`${playfair.variable} ${hanken.variable}`}>
        <FunnelTracking />
        {children}
      </body>
    </html>
  );
}
