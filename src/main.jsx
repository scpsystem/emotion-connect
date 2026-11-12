import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './AuthContext';
import './styles.css';

// HashRouter: URL seperti /#/daftar tidak menyebabkan ralat 404 apabila dimuat semula di GitHub Pages.
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
