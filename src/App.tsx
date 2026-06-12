import { BrowserRouter, Routes } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthContext';
import AppContent from './components/AppContent';
import { CityProvider } from './components/Shared/CityContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CityProvider>
          <AppContent />
        </CityProvider>
      </AuthProvider>
    </BrowserRouter >
  );
}