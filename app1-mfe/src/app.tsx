import { useContext } from 'react';
import { context } from 'shared/Context';
import { Demo } from "design/Demo";

export const App = () => {
  useContext(context);
  return (
    <main>
      <Demo />
    </main>
  );
};