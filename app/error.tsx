'use client'
import { useEffect } from 'react';
export default function GlobalError({ error, reset }: { error: Error, reset: () => void }) {
  useEffect(() => { console.error(error) }, [error]);
  return (
    <div>
      <h1>Un Erreur Survenu</h1>
      <pre>{error.message}</pre>
      <button onClick={() => reset()}>
        Réessayer
      </button>
    </div>
  );
}
