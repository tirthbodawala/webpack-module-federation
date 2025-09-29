import { red } from './app.module.scss';
import AtyantikLogo from './images/atyantik_logo.webp';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// @ts-ignore
const RemoteApp = lazy(() => import("app2/App").then(d => d.default));
// @ts-ignore
const ConfigProvider = lazy(() => import("config/Provider").then(d => d.default))


const App = () => {
  const text = "Crisil <> Atyantik";
  return (
    <main>
      <ConfigProvider>
        <h1>The Host App</h1>
        <h2 className={red}>{text}</h2>
        <img src={AtyantikLogo} />
        <hr />
        <ErrorBoundary fallback="Am error occurred...">
          <Suspense fallback={"loading..."}>
            <RemoteApp/>
          </Suspense>
        </ErrorBoundary>
      </ConfigProvider>
    </main>
  );
};

export default App;