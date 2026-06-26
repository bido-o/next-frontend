'use client';

import { useEffect } from 'react';

// Înlocuiește root layout-ul când o eroare apare chiar în layout.
// Trebuie să-și definească propriile <html> și <body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ro">
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          background: '#FAF3E1',
          color: '#222222',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '0 1.5rem',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Ceva nu a mers bine</h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.6, maxWidth: '24rem' }}>
          A apărut o eroare neașteptată. Încearcă din nou.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: '0.5rem',
            borderRadius: '9999px',
            background: '#FF6D1F',
            color: '#fff',
            border: 'none',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Reîncearcă
        </button>
      </body>
    </html>
  );
}
