// Mock import.meta for Jest
// Jest doesn't support import.meta, so we need to provide a polyfill
if (typeof (globalThis as any).import === 'undefined') {
  (globalThis as any).import = {};
}

if (typeof (globalThis as any).import?.meta === 'undefined') {
  (globalThis as any).import.meta = {
    url: 'file://' + __filename,
  };
}
