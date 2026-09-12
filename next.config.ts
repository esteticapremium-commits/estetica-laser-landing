import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // GitHub Pages serve solo file statici: l'export li genera in `out/`.
  output: 'export',
  // Con lo slash finale ogni pagina diventa una cartella con dentro index.html:
  // è l'unico modo perché /video/ funzioni su Pages invece di dare 404.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
