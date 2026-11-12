import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ASSETS } from '../assets-config';

export default function Home() {
  const nav = useNavigate();
  const { user, loading, profileComplete } = useAuth();

  const mula = () => {
    if (!user) nav('/log-masuk');
    else if (profileComplete) nav('/selamat-datang');
    else nav('/lengkapkan-profil');
  };

  return (
    <main className="page home">
      <img className="mascot" src={ASSETS.maskot} alt="Maskot Emotion Connect" />
      <h1 className="title">EMOTION CONNECT</h1>
      <p className="subtitle">My Feelings, My World</p>
      <button className="btn btn-big" onClick={mula} disabled={loading}>
        {loading ? 'SILA TUNGGU…' : 'MULA'}
      </button>
    </main>
  );
}
