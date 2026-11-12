import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Register from './Register';

export default function CompleteProfile() {
  const { state } = useLocation();
  const { profileComplete } = useAuth();
  if (profileComplete) return <Navigate to="/selamat-datang" replace />;
  return (
    <Register
      profileOnly
      draft={state?.draft}
      notice={state?.gagal ? 'Akaun anda sudah dicipta, tetapi profil belum berjaya disimpan. Sila semak maklumat dan tekan SIMPAN.' : ''}
    />
  );
}
