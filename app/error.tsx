'use client'
export default function GlobalError({ error, reset }: { error: Error, reset: () => void }) {
  
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
