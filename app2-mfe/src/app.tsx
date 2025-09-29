import { useContext } from 'react';
import { context } from 'shared/Context';

export const App = () => {
  const { name } = useContext(context);
  return (
    <main>
      <h1>Manage Entities</h1>
      <h2>Managed by - {name}</h2>
      <ul>
        <li>Create Entity</li>
        <li>Manage Entity</li>
      </ul>
    </main>
  );
};