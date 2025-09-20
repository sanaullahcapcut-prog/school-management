import { useState } from "react";
import { supabase } from "../lib/supabase";

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    onLogin(); // tell App.tsx we’re logged in
  }

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={handleLogin} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border rounded px-3 py-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />
        <button className="w-full border rounded px-3 py-2" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        {err && <div className="text-red-600 text-sm">{err}</div>}
      </form>
    </div>
  );
}
