import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export function calcAge(dob) {
  if (!dob) return '';
  const b = new Date(dob), t = new Date();
  if (isNaN(b) || b > t) return '';
  let a = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
  return a;
}

export function friendlyError(e) {
  const map = {
    'auth/invalid-credential': 'E-mel atau kata laluan tidak betul. Sila cuba lagi.',
    'auth/invalid-email': 'Format e-mel tidak betul.',
    'auth/user-not-found': 'E-mel atau kata laluan tidak betul. Sila cuba lagi.',
    'auth/wrong-password': 'E-mel atau kata laluan tidak betul. Sila cuba lagi.',
    'auth/email-already-in-use': 'E-mel ini sudah didaftarkan. Sila log masuk.',
    'auth/weak-password': 'Kata laluan terlalu lemah. Gunakan sekurang-kurangnya 8 aksara.',
    'auth/too-many-requests': 'Terlalu banyak percubaan. Sila tunggu sebentar dan cuba lagi.',
    'auth/network-request-failed': 'Tiada sambungan internet. Sila semak rangkaian anda.',
    'auth/user-disabled': 'Akaun ini telah dinyahaktifkan.',
  };
  return map[e?.code] || 'Maaf, sesuatu tidak berjaya. Sila cuba lagi.';
}

export const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
export const cleanPhone = (v) => v.replace(/[\s-]/g, '');
export const validPhone = (v) => /^(\+?60|0)1\d{8,9}$/.test(cleanPhone(v));

export function validateStep(step, f, profileOnly) {
  const e = {};
  if (step === 1) {
    if (f.studentName.trim().length < 2) e.studentName = 'Sila isi nama penuh murid.';
    const age = calcAge(f.dob);
    if (!f.dob) e.dob = 'Sila pilih tarikh lahir.';
    else if (age === '') e.dob = 'Tarikh lahir tidak boleh pada masa hadapan.';
    else if (age < 2 || age > 18) e.dob = 'Umur murid mesti antara 2 hingga 18 tahun.';
  }
  if (step === 2) {
    if (f.guardianName.trim().length < 2) e.guardianName = 'Sila isi nama ibu/bapa/penjaga.';
    const ga = Number(f.guardianAge);
    if (!Number.isInteger(ga) || ga < 18 || ga > 100) e.guardianAge = 'Umur penjaga mesti antara 18 hingga 100.';
    if (!validPhone(f.phone)) e.phone = 'Nombor telefon tidak sah. Contoh: 012-3456789';
  }
  if (step === 3) {
    if (!profileOnly) {
      if (!validEmail(f.email)) e.email = 'Format e-mel tidak betul.';
      if (f.password.length < 8) e.password = 'Kata laluan mesti sekurang-kurangnya 8 aksara.';
      if (f.confirm !== f.password) e.confirm = 'Kata laluan tidak sepadan.';
    }
    if (!f.consent) e.consent = 'Persetujuan diperlukan untuk meneruskan.';
  }
  return e;
}

// Tiada kata laluan disimpan dalam Firestore.
export async function saveProfile(uid, f) {
  await setDoc(doc(db, 'users', uid), {
    student: { fullName: f.studentName.trim(), dateOfBirth: f.dob, diagnosis: f.diagnosis.trim() },
    guardian: { name: f.guardianName.trim(), age: Number(f.guardianAge), phone: cleanPhone(f.phone) },
    consent: { accepted: true, at: new Date().toISOString() },
    themeChoice: null,
    profileComplete: true,
    createdAt: serverTimestamp(),
  });
}
