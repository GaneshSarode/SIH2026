"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Attempt actual Supabase login
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      // In a pure mock setting without Supabase configured, this will fail.
      // For a hackathon demo, you might want to hardcode a bypass here if Supabase is down, 
      // but we stick to the real implementation.
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/operator');
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full max-w-sm mx-auto p-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-medium tracking-tight mb-2">Operator Login</h2>
        <p className="text-sm text-gray-400">Sign in to manage the microgrid.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-gray-400">Email</label>
        <input 
          type="email" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2.5 rounded bg-[#0b0f19] border border-[var(--color-border)] text-white focus:outline-none focus:border-gray-400 transition-colors"
          placeholder="operator@gridwatch.local"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-gray-400">Password</label>
        <input 
          type="password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2.5 rounded bg-[#0b0f19] border border-[var(--color-border)] text-white focus:outline-none focus:border-gray-400 transition-colors"
          placeholder="••••••••"
        />
      </div>
      
      {error && <div className="text-sm text-[var(--color-status-critical)] p-3 bg-red-950/30 rounded border border-red-900/50">{error}</div>}
      
      <button 
        type="submit" 
        disabled={loading}
        className="mt-2 p-2.5 bg-white text-black font-medium rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {loading ? 'Authenticating...' : 'Log in'}
      </button>
    </form>
  );
}
