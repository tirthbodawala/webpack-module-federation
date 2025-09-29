import { useContext } from 'react';
import { red } from './app.module.scss';
import AtyantikLogo from './images/atyantik_logo.webp';
// @ts-ignore
import ConfigContext from 'config/Context';

const configContext = ConfigContext.default;

const App = () => {
  const text = "MFE";
  const { name } = useContext<{name: string}>(configContext);
  return (
    <main>
      <h1>The Client App</h1>
      <h2 className={red}>{text} - {name}</h2>
      {/* <h1>{text}</h1> */}
      <img src={AtyantikLogo} />
    </main>
  );
};

export default App;