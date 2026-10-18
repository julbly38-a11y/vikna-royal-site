"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function useSession() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  return session;
}

export function LogoutButton() {
  const session = useSession();
  if (!session) return null;
  return (
    <button type="button" className="logout" onClick={() => supabase.auth.signOut()}>
      Вийти ({session.user.email})
    </button>
  );
}

export default function AuthGate({ children }) {
  const session = useSession();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  if (session === undefined) return <div className="auth-loading">Завантаження…</div>;
  if (session) return <>{children}</>;

  return (
    <form
      className="auth-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setMsg("");
        setBusy(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) setMsg(error.message);
        setBusy(false);
      }}
    >
      <h1>ROYAL</h1>
      <input type="email" placeholder="Email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Пароль" autoComplete="current-password" required value={pw} onChange={(e) => setPw(e.target.value)} />
      <button disabled={busy}>{busy ? "Вхід…" : "Увійти"}</button>
      <p className="auth-msg">{msg}</p>
    </form>
  );
}
