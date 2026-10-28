import { useEffect, useState } from 'react';
import { Dog, Database, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [environments, setEnvironments] = useState<{ index: number; name: string }[]>([]);
  const [environmentIndex, setEnvironmentIndex] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/auth/environments')
      .then(async response => {
        if (!response.ok) throw new Error('Unable to load environments.');
        return response.json();
      })
      .then(data => {
        if (!active) return;
        const items = Array.isArray(data.environments) ? data.environments : [];
        setEnvironments(items);
        if (items.length) setEnvironmentIndex(String(items[0].index));
      })
      .catch(() => {
        if (active) setMessage('Unable to load environments. Check the Query Dog server.');
      });
    return () => { active = false; };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          username,
          password,
          environmentIndex: Number(environmentIndex),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Sign-in failed.');
      window.location.replace('/');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/30 mb-4">
            <Dog className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Query Dog</h1>
          <p className="text-gray-400 mt-2">
            Sign in to your ClickHouse workspace
          </p>
        </div>

        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Welcome back</h2>
              <p className="text-sm text-gray-400">
                Enter your ClickHouse account details
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="environment" className="block text-sm font-medium text-gray-300 mb-2">
                ClickHouse environment
              </label>
              <select
                id="environment"
                name="environment"
                required
                value={environmentIndex}
                onChange={(event) => setEnvironmentIndex(event.target.value)}
                disabled={environments.length === 0 || busy}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                {environments.length === 0 && <option value="">Loading environments…</option>}
                {environments.map((environment) => (
                  <option key={environment.index} value={String(environment.index)}>
                    {environment.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                ClickHouse username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setMessage('');
                }}
                placeholder="Enter your username"
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                ClickHouse password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setMessage('');
                  }}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 pr-12 text-white placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy || !environmentIndex}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-3 font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </button>

            {message && (
              <p role="status" className="text-sm text-amber-300">
                {message}
              </p>
            )}
          </form>

          <div className="flex items-start gap-2 border-t border-gray-800 mt-6 pt-5 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400" />
            <p>
              Your database permissions will depend on your ClickHouse account.
              Sign-in is validated by the Query Dog server.
            </p>
          </div>
        </section>

        <p className="text-center text-xs text-gray-500 mt-6">
          Query Dog · ClickHouse Query Explorer
        </p>
      </div>
    </main>
  );
}
