import type { Metadata } from 'next';

import { VideoPage } from '@/components/funnel/VideoPage';
import { funnelConfig } from '@/config/funnel';

export const metadata: Metadata = {
  title: `Guarda il video | ${funnelConfig.brandName}`,
  description: `Cosa valutare prima di scegliere un centro laser e come funziona il ${funnelConfig.methodName}.`,
  // Questa è la pagina che si vede DOPO aver lasciato i contatti: resta fuori da
  // Google, altrimenti la si raggiunge da ricerca saltando il modulo.
  robots: { index: false, follow: false },
};

export default function Page() {
  return <VideoPage />;
}
