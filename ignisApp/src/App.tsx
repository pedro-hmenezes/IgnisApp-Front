import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { useAuth } from './contexts/AuthContext'; // Verifique se o caminho está correto
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterOccurrence from './pages/RegisterOccurrence';
import BasicForm from './pages/BasicForm';
import OngoingOccurrenceDetail from './pages/OngoingOccurrenceDetail';
import OccurrencesDashboard from './pages/OccurrencesDashboard'; // 1. Importe a nova página
import RegisterUser from './pages/RegisterUser';

import './App.css';

// --- ProtectedRoutesLayout ---
const ProtectedRoutesLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) { return <div>Verificando autenticação...</div>; }
  if (!isAuthenticated) { return <Navigate to="/login" replace />; }
  return ( <MainLayout><Outlet /></MainLayout> );
};
// --- FIM ProtectedRoutesLayout ---

function App() {
  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas */}
      <Route element={<ProtectedRoutesLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/occurrences" element={<OccurrencesDashboard />} /> 
        <Route path="/register" element={<RegisterOccurrence />} />
        <Route path="/register/new/:typeId" element={<BasicForm />} />
        <Route path="/users/new" element={<RegisterUser />} />

        {/* Futuramente: Rota para listar usuários /users */}
        
        {/* <Route path="/ongoing" element={<OngoingOccurrences />} />  */} {/* <--- 2. REMOVA ESTA ROTA */}
        
        {/* A rota de detalhes continua válida, acessada a partir do Dashboard */}
        <Route path="/ongoing/:occurrenceId" element={<OngoingOccurrenceDetail />} /> 

        {/* ... (outras rotas) ... */}
      </Route>

      {/* Rota Padrão */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;