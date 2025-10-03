/**
 * Global type declarations for MFE projects
 * This file provides TypeScript declarations for assets and modules
 * that are processed by webpack loaders
 */

// ============================= CSS/SCSS =============================

/**
 * CSS Modules - Named exports pattern
 * Used with CSS/SCSS files that have .module.css or .module.scss extension
 */
declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>;
  export = classes;
}

declare module '*.module.scss' {
  const classes: Readonly<Record<string, string>>;
  export = classes;
}

/**
 * Global CSS/SCSS - Default export pattern
 * Used with regular CSS/SCSS files without .module extension
 */
declare module '*.css' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module '*.scss' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

// ============================= Images =============================

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.avif' {
  const src: string;
  export default src;
}

// ============================= SVG =============================

/**
 * SVG as React component (default import)
 * Processed by @svgr/webpack loader
 */
declare module '*.svg' {
  import * as React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>;
  export default ReactComponent;
  export { ReactComponent };
}

/**
 * SVG as URL string
 * Use: import icon from './icon.svg?url'
 */
declare module '*.svg?url' {
  const url: string;
  export default url;
}

/**
 * SVG as raw string content
 * Use: import iconContent from './icon.svg?raw'
 */
declare module '*.svg?raw' {
  const raw: string;
  export default raw;
}

// ============================= Fonts =============================

declare module '*.woff' {
  const src: string;
  export default src;
}

declare module '*.woff2' {
  const src: string;
  export default src;
}

declare module '*.eot' {
  const src: string;
  export default src;
}

declare module '*.ttf' {
  const src: string;
  export default src;
}

declare module '*.otf' {
  const src: string;
  export default src;
}

// ============================= Media =============================

declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.webm' {
  const src: string;
  export default src;
}

declare module '*.ogg' {
  const src: string;
  export default src;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.wav' {
  const src: string;
  export default src;
}

declare module '*.flac' {
  const src: string;
  export default src;
}

declare module '*.aac' {
  const src: string;
  export default src;
}
