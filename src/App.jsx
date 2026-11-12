import { Routes, Route, Navigate } from 'react-router-dom';
import { firebaseReady } from './firebase';
import { useAuth } from './AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CompleteProfile from './pages/CompleteProfile';
import Welcome from './pages/Welcome';
import Loading from './components/Loading';

function Protected({ children, needComplete }) {
  const { user, loading, profileComplete } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/log-masuk" replace />;
  if (needComplete && !profileComplete) return <Navigate to="/lengkapkan-profil" replace />;
  return children;
}

export default function App() {
  if (!firebaseReady) {
    return (
      <main className="page"><div className="card">
        <h1 className="h2">Firebase belum disambungkan</h1>
        <p>Salin <code>.env.example</code> kepada <code>.env.local</code>, isi nilai Firebase, kemudian mulakan semula <code>npm run dev</code>.</p>
      </div></main>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/log-masuk" element={<Login />} />
      <Route path="/daftar" element={<Register />} />
      <Route path="/lupa-kata-laluan" element={<ForgotPassword />} />
      <Route path="/lengkapkan-profil" element={<Protected><CompleteProfile /></Protected>} />
      <Route path="/selamat-datang" element={<Protected needComplete><Welcome /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
