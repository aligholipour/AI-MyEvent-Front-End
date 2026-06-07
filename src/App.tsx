import { BrowserRouter, Routes } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthContext';
import AppContent from './components/AppContent';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter >
  );
}