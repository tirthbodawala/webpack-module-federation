import { App } from './app';
import { createRoot } from 'react-dom/client';

const container = document.getElementById("app");
if (!container) {
  throw new Error("Cannot render app!")
}
const root = createRoot(container);
root.render(<App />);

