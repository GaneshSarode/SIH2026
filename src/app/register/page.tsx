"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus, AlertTriangle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("home_owner");
  const [resourceId, setResourceId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Register with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          resource_id: resourceId
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center p-8">
          <CheckCircle2 className="w-16 h-16 text-[var(--color-status-online)] mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Registration Successful</h1>
          <p className="text-gray-500">Your account has been securely created.</p>
          <p className="text-sm text-gray-400 mt-4">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/login" className="p-2 rounded-full hover:bg-[var(--background)] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Register Operator</h1>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Email Address</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Secure Password</label>
            <input
              type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Role</label>
            <select
              value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
            >
              <option value="home_owner">Home Owner</option>
              <option value="microgrid_operator">Microgrid Operator</option>
              <option value="bess_operator">BESS Operator</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Assigned Resource ID <span className="text-gray-400 font-normal">(Optional)</span></label>
            <input
              type="text" value={resourceId} onChange={(e) => setResourceId(e.target.value)}
              placeholder="e.g. H1, M1, BESS-01"
              className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--color-border)] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? "Creating Account..." : <><UserPlus className="w-5 h-5" /> Register Account</>}
          </button>
        </form>
      </div>
    </div>
  );
}
