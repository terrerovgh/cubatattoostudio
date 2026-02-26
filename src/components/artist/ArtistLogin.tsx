import { useState } from 'react';

export function ArtistLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json() as any;

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      if (data.user.role !== 'artist') {
        setError('This login is for artists only');
        await fetch('/api/auth/logout', { method: 'POST' });
        setLoading(false);
        return;
      }

      window.location.href = '/artist';
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-[#C8956C] flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">CT</span>
            </div>
            <h1 className="text-xl font-bold text-[#1a1a2e]">Artist Portal</h1>
            <p className="text-sm text-gray-500 mt-1">Cuba Tattoo Studio</p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-[#1a1a2e] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8956C]/30 focus:border-[#C8956C]"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-[#1a1a2e] text-sm focus:outline-none focus:ring-2 focus:ring-[#C8956C]/30 focus:border-[#C8956C]"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#C8956C] text-white font-semibold text-sm hover:bg-[#b8855c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  );
}
