import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../AuthContext';
import { calcAge, friendlyError, saveProfile, validateStep } from '../lib/helpers';
import Field from '../components/Field';

const LABELS = ['Murid', 'Penjaga', 'Akaun'];
const EMPTY = { studentName: '', dob: '', diagnosis: '', guardianName: '', guardianAge: '', phone: '', email: '', password: '', confirm: '', consent: false };

// profileOnly = true: pengguna sudah ada akaun, hanya melengkapkan profil (tiada e-mel/kata laluan).
export default function Register({ profileOnly = false, draft = null, notice = '' }) {
  const nav = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [f, setF] = useState({ ...EMPTY, ...(draft || {}) }); // disimpan di sini supaya tidak hilang antara langkah
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const err = (k) => errors[k];

  const next = () => {
    const e = validateStep(step, f, profileOnly);
    setErrors(e);
    if (Object.keys(e).length === 0) setStep(step + 1);
  };
  const back = () => { setErrors({}); setFormError(''); setStep(step - 1); };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validateStep(3, f, profileOnly);
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true); setFormError('');

    let uid = user?.uid;
    if (!profileOnly) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, f.email.trim(), f.password);
        uid = cred.user.uid;
      } catch (ex) { setFormError(friendlyError(ex)); setBusy(false); return; }
    }
    try {
      await saveProfile(uid, f);
      await refreshProfile();
      nav('/selamat-datang', { replace: true, state: { baru: true } });
    } catch {
      // Akaun sudah dicipta tetapi profil gagal disimpan.
      if (profileOnly) { setFormError('Profil belum berjaya disimpan. Sila cuba lagi.'); setBusy(false); return; }
      const { password, confirm, email, ...safeDraft } = f; // jangan bawa kata laluan
      nav('/lengkapkan-profil', { replace: true, state: { gagal: true, draft: safeDraft } });
    }
  };

  const age = calcAge(f.dob);

  return (
    <main className="page">
      <form className="card" onSubmit={submit} noValidate>
        <h1 className="h2">{profileOnly ? 'Lengkapkan Profil' : 'Daftar Akaun'}</h1>
        {notice && <p className="error banner" role="alert">{notice}</p>}

        <ol className="progress" aria-label={`Langkah ${step} daripada 3`}>
          {LABELS.map((l, i) => (
            <li key={l} className={i + 1 === step ? 'on' : i + 1 < step ? 'done' : ''} aria-current={i + 1 === step ? 'step' : undefined}>
              <span className="dot">{i + 1 < step ? '✓' : i + 1}</span>{l}
            </li>
          ))}
        </ol>

        {step === 1 && (<>
          <Field id="studentName" label="Nama penuh murid" error={err('studentName')}>
            <input id="studentName" value={f.studentName} onChange={set('studentName')} autoComplete="off" />
          </Field>
          <Field id="dob" label="Tarikh lahir" error={err('dob')}>
            <input id="dob" type="date" max={new Date().toISOString().slice(0, 10)} value={f.dob} onChange={set('dob')} />
          </Field>
          <Field id="age" label="Umur (dikira automatik)">
            <input id="age" value={age === '' ? '' : `${age} tahun`} readOnly tabIndex={-1} />
          </Field>
          <Field id="diagnosis" label="Diagnosis (jika ada, pilihan)" hint="Boleh dikosongkan.">
            <input id="diagnosis" value={f.diagnosis} onChange={set('diagnosis')} maxLength={200} autoComplete="off" />
          </Field>
        </>)}

        {step === 2 && (<>
          <Field id="guardianName" label="Nama ibu/bapa/penjaga" error={err('guardianName')}>
            <input id="guardianName" value={f.guardianName} onChange={set('guardianName')} autoComplete="name" />
          </Field>
          <Field id="guardianAge" label="Umur penjaga" error={err('guardianAge')}>
            <input id="guardianAge" type="number" inputMode="numeric" min="18" max="100" value={f.guardianAge} onChange={set('guardianAge')} />
          </Field>
          <Field id="phone" label="Nombor telefon penjaga" error={err('phone')} hint="Contoh: 012-3456789">
            <input id="phone" type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" />
          </Field>
        </>)}

        {step === 3 && (<>
          {!profileOnly && (<>
            <Field id="email" label="E-mel penjaga" error={err('email')}>
              <input id="email" type="email" value={f.email} onChange={set('email')} autoComplete="email" />
            </Field>
            <Field id="password" label="Kata laluan" error={err('password')} hint="Sekurang-kurangnya 8 aksara.">
              <input id="password" type="password" value={f.password} onChange={set('password')} autoComplete="new-password" />
            </Field>
            <Field id="confirm" label="Sahkan kata laluan" error={err('confirm')}>
              <input id="confirm" type="password" value={f.confirm} onChange={set('confirm')} autoComplete="new-password" />
            </Field>
          </>)}
          <details className="privacy">
            <summary>Baca notis privasi</summary>
            <p>[GANTIKAN DENGAN NOTIS PRIVASI SEBENAR] Kami menyimpan nama murid, tarikh lahir, diagnosis (jika diisi), maklumat penjaga, tema pilihan dan rekod emosi murid. Data digunakan untuk aplikasi pembelajaran ini sahaja, disimpan dalam Google Firebase, dan hanya boleh dicapai oleh akaun penjaga ini.</p>
          </details>
          <div className="check">
            <input id="consent" type="checkbox" checked={f.consent} onChange={set('consent')} aria-describedby="consent-err" />
            <label htmlFor="consent">Saya ialah ibu/bapa/penjaga murid ini. Saya bersetuju data yang dinyatakan dalam notis privasi disimpan dan diproses.</label>
          </div>
          {err('consent') && <p className="error" id="consent-err" role="alert">{err('consent')}</p>}
        </>)}

        {formError && <p className="error banner" role="alert">{formError}</p>}
        {busy && <p className="hint" role="status">Sedang menyimpan…</p>}

        <div className="nav-row">
          {step > 1 && <button type="button" className="btn btn-ghost" onClick={back} disabled={busy}>KEMBALI</button>}
          {step < 3
            ? <button type="button" className="btn" onClick={next}>SETERUSNYA</button>
            : <button className="btn" disabled={busy}>{busy ? 'SILA TUNGGU…' : profileOnly ? 'SIMPAN' : 'DAFTAR'}</button>}
        </div>
        {!profileOnly && <p className="links"><Link to="/log-masuk">Sudah ada akaun? Log masuk</Link></p>}
      </form>
    </main>
  );
}
