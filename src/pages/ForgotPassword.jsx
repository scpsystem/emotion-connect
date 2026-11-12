import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { friendlyError, validEmail } from '../lib/helpers';
import Field from '../components/Field';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!validEmail(email)) return setError('Format e-mel tidak betul.');
    setBusy(true); setError(''); setMsg('');
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err) {
      // Elak mendedahkan sama ada e-mel wujud; hanya paparkan ralat rangkaian/format.
      if (err.code !== 'auth/user-not-found') { setError(friendlyError(err)); setBusy(false); return; }
    }
    setMsg('Jika e-mel itu berdaftar, pautan tetapan semula kata laluan telah dihantar. Sila semak peti masuk dan folder spam.');
    setBusy(false);
  };

  return (
    <main className="page">
      <form className="card" onSubmit={submit} noValidate>
        <h1 className="h2">Tetapkan Semula Kata Laluan</h1>
        <Field id="email" label="E-mel penjaga" hint="Kami akan hantar pautan ke e-mel ini.">
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        {error && <p className="error banner" role="alert">{error}</p>}
        {msg && <p className="success banner" role="status">{msg}</p>}
        <button className="btn btn-big" disabled={busy}>{busy ? 'SILA TUNGGU…' : 'HANTAR PAUTAN'}</button>
        <p className="links"><Link to="/log-masuk">Kembali ke log masuk</Link></p>
      </form>
    </main>
  );
}
