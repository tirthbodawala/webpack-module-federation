// Generic fallbacks
declare module '*.scss';
declare module '*.css';

// src/assets.d.ts

// ----------------------------- Images ---------------------------------
declare module '*.png'  { const src: string; export default src; }
declare module '*.jpg'  { const src: string; export default src; }
declare module '*.jpeg' { const src: string; export default src; }
declare module '*.gif'  { const src: string; export default src; }
declare module '*.webp' { const src: string; export default src; }
declare module '*.avif' { const src: string; export default src; }

// ------------------------------ SVG -----------------------------------
// Default: SVGR React component
declare module '*.svg' {
  import * as React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>;
  export default ReactComponent;
  export { ReactComponent };
}

// Resource-query variants you configured:
// ?url  -> handled as asset (string URL or data URL depending on size)
// ?raw  -> handled as asset/source (raw SVG text)
declare module '*.svg?url' {
  const url: string;
  export default url;
}
declare module '*.svg?raw' {
  const raw: string;
  export default raw;
}

// ------------------------------ Fonts ---------------------------------
declare module '*.woff'  { const src: string; export default src; }
declare module '*.woff2' { const src: string; export default src; }
declare module '*.eot'   { const src: string; export default src; }
declare module '*.ttf'   { const src: string; export default src; }
declare module '*.otf'   { const src: string; export default src; }

// ------------------------------ Media ---------------------------------
declare module '*.mp4'  { const src: string; export default src; }
declare module '*.webm' { const src: string; export default src; }
declare module '*.ogg'  { const src: string; export default src; }
declare module '*.mp3'  { const src: string; export default src; }
declare module '*.wav'  { const src: string; export default src; }
declare module '*.flac' { const src: string; export default src; }
declare module '*.aac'  { const src: string; export default src; }
