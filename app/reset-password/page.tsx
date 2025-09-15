"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPasswordPage() {
  const [pwd, setPwd] = useState('');
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
    });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) setErr(error.message);
    else setOk(true);
  };

  if (!hasSession) {
    return <p>Ton lien de réinitialisation a expiré ou est invalide. Relance la procédure.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm space-y-3">
      <h1 className="text-xl font-semibold">Définir un nouveau mot de passe</h1>
      <input
        type="password"
        required
        minLength={8}
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
        placeholder="Nouveau mot de passe"
        className="w-full border rounded p-2"
      />
      <button className="w-full rounded p-2 border">Valider</button>
      {ok && <p className="text-green-700">Mot de passe mis à jour. Tu peux te reconnecter.</p>}
      {err && <p className="text-red-700">{err}</p>}
    </form>
  );
}

