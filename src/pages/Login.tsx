import { useState, type FormEvent } from 'react';
import { Building2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n';

export function Login() {
  const { signIn } = useAuth();
  const t = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signIn(email, password);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      const invalid =
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-email';
      setError(invalid ? t.auth.errorInvalid : t.auth.errorGeneric);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <span className="brand-logo">
          <Building2 size={26} />
        </span>
        <h1>{t.app.name}</h1>
        <p className="auth-subtitle">{t.auth.subtitle}</p>

        <form className="auth-form" onSubmit={onSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="field">
            <label htmlFor="email">{t.auth.email}</label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="password">{t.auth.password}</label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? (
              <>
                <Loader2 size={16} className="spin" />
                {t.auth.signingIn}
              </>
            ) : (
              t.auth.signIn
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
