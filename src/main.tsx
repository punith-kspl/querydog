import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { LoginPage } from './components/LoginPage';
import { AuthGate } from './components/AuthGate';

const isLoginRoute =
  window.location.pathname.replace(/\/+$/, '') === '/login';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isLoginRoute ? <LoginPage /> : <AuthGate><App /></AuthGate>}
  </StrictMode>,
);
