import { createRoot } from 'react-dom/client';
import type { FC } from 'react';
import './styles.css';

const App: FC = () => {
  return (
    <div>
      <h1>Test MFE</h1>
      <p>Testing @crisil/mfe-build-tools</p>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;
