"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, LogIn, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 rounded-full hover:bg-[var(--background)] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Secure Login</h1>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Operator Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-status-online)] focus:border-transparent transition-all"
              placeholder="e.g. operator@gridwatch.com"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-status-online)] focus:border-transparent transition-all"
              placeholder="Enter your secure password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-[var(--color-status-online)] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? "Authenticating..." : <><LogIn className="w-5 h-5" /> Sign In</>}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          Need access to the GridWatch platform?{" "}
          <Link href="/register" className="font-semibold text-[var(--color-status-online)] hover:underline">
            Request an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
