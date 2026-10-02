import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/theme.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/features.css';
import App from './App.tsx';
import { SettingsProvider } from './context/SettingsContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { ToastProvider } from './components/ui/Toast.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </SettingsProvider>
  </StrictMode>,
);
