import App from './app';
import { createRoot } from 'react-dom/client';

import './resources/css/reset.css';

const container = document.getElementById("app");
if (!container) {
  throw new Error("Cannot render app!")
}
const root = createRoot(container);
root.render(<App />);

