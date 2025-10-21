// src/App.tsx
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { useAuth } from './contexts/AuthContext'; // 1. Importe useAuth
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterOccurrence from './pages/RegisterOccurrence';
import BasicForm from './pages/BasicForm';
import OngoingOccurrences from './pages/OngoingOccurrences';
import OngoingOccurrenceDetail from './pages/OngoingOccurrenceDetail';
import './App.css';

// --- ProtectedRoutesLayout ATUALIZADO ---
const ProtectedRoutesLayout = () => {
  // 2. Use o hook para pegar os valores reais do contexto
  const { isAuthenticated, isLoading } = useAuth();

  // 3. Se ainda estiver carregando a verificação inicial, mostre algo (ou nada)
  if (isLoading) {
    // Pode ser um spinner de carregamento global aqui
    return <div>Verificando autenticação...</div>;
  }

  // 4. Se não estiver autenticado (após o carregamento), redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 5. Se estiver autenticado, renderiza o MainLayout com as rotas filhas
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
// --- FIM DA ATUALIZAÇÃO ---

function App() {
  // O restante do App (definição das rotas) permanece o mesmo
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoutesLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterOccurrence />} /> {/* Está usando aqui? */}
        <Route path="/register/new/:typeId" element={<BasicForm />} /> {/* Está usando aqui? */}
        <Route path="/ongoing" element={<OngoingOccurrences />} /> {/* Está usando aqui? */}
        <Route path="/ongoing/:occurrenceId" element={<OngoingOccurrenceDetail />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;