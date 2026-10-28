import { useEffect, useState } from 'react';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/session', { credentials: 'same-origin' })
      .then(async response => {
        if (!response.ok) return { authenticated: false };
        return response.json();
      })
      .then(data => {
        if (!active) return;
        if (!data.authenticated) {
          window.location.replace('/login');
          return;
        }
        setReady(true);
      })
      .catch(() => {
        if (active) window.location.replace('/login');
      });
    return () => { active = false; };
  }, []);

  if (!ready) {
    return (
      <main className="min-h-screen bg-gray-950 text-gray-300 flex items-center justify-center">
        Checking Query Dog session…
      </main>
    );
  }
  return <>{children}</>;
}
