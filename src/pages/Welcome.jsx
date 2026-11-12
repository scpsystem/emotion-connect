import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ASSETS } from '../assets-config';

// Halaman sementara. Akan diganti dengan pemilihan tema pada fasa seterusnya.
export default function Welcome() {
  const { state } = useLocation();
  const nav = useNavigate();
  const { logout } = useAuth();
  const keluar = async () => { await logout(); nav('/', { replace: true }); };
  return (
    <main className="page home">
      <img className="mascot small" src={ASSETS.maskot} alt="" />
      {state?.baru && <p className="success banner" role="status">Pendaftaran berjaya!</p>}
      <h1 className="h2">Selamat Datang ke Emotion Connect</h1>
      <button className="btn btn-ghost" onClick={keluar}>LOG KELUAR</button>
    </main>
  );
}
