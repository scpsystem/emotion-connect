import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../AuthContext';
import { friendlyError, validEmail } from '../lib/helpers';
import Field from '../components/Field';

export default function Login() {
  const nav = useNavigate();
  const { refreshProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!validEmail(email) || !pw) return setError('Sila isi e-mel yang betul dan kata laluan.');
    setBusy(true); setError('');
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pw);
      await refreshProfile();
      nav('/selamat-datang', { replace: true }); // laluan ini akan menghala ke lengkapkan-profil jika belum lengkap
      void cred;
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  };

  return (
    <main className="page">
      <form className="card" onSubmit={submit} noValidate>
        <h1 className="h2">Selamat Kembali!</h1>
        <Field id="email" label="E-mel">
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field id="pw" label="Kata laluan">
          <input id="pw" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </Field>
        {error && <p className="error banner" role="alert">{error}</p>}
        <button className="btn btn-big" disabled={busy}>{busy ? 'SILA TUNGGU…' : 'LOG MASUK'}</button>
        <p className="links">
          <Link to="/lupa-kata-laluan">Lupa Kata Laluan?</Link>
          <Link to="/daftar">Belum Ada Akaun? Daftar Sekarang</Link>
          <Link to="/">Kembali ke halaman utama</Link>
        </p>
      </form>
    </main>
  );
}
