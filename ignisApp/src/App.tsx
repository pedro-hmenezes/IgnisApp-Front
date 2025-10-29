import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { useAuth } from './contexts/AuthContext'; // Verifique se o caminho está correto
import Home from './pages/Home';
import Login from './pages/Login';
import BasicForm from './pages/BasicForm';
import OngoingOccurrenceDetail from './pages/OngoingOccurrenceDetail';
import OccurrencesDashboard from './pages/OccurrencesDashboard';
import EditOccurrence from './pages/EditOccurrence';
import RegisterUser from './pages/RegisterUser';
import Reports from './pages/Reports';
import Map from './pages/Map';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

import './App.css';

// --- ProtectedRoutesLayout COM PROTEÇÃO ATIVA ---
const ProtectedRoutesLayout = () => {
 const { isAuthenticated, isLoading } = useAuth();

 // Se ainda estiver carregando a verificação inicial, mostre algo
 if (isLoading) {
  return <div>Verificando autenticação...</div>;
 }

 // Se não autenticado, redireciona para login
 if (!isAuthenticated) {
  console.log("ProtectedRoutes: Não autenticado, redirecionando para /login");
  return <Navigate to="/login" replace />;
 }

 // Renderiza o layout com as rotas filhas
 return (
  <MainLayout>
   <Outlet />
  </MainLayout>
 );
};
// --- FIM DA MODIFICAÇÃO ---

function App() {
 return (
  <Routes>
   {/* Rota pública */}
   <Route path="/login" element={<Login />} />

   {/* Rotas "protegidas" (agora acessíveis diretamente) */}
   <Route element={<ProtectedRoutesLayout />}>
    <Route path="/home" element={<Home />} />
    <Route path="/occurrences" element={<OccurrencesDashboard />} />
    <Route path="/register/new/:typeId" element={<BasicForm />} />
    <Route path="/ongoing/:occurrenceId" element={<OngoingOccurrenceDetail />} />
    <Route path="/occurrences/:occurrenceId/edit" element={<EditOccurrence />} />
    <Route path="/users/new" element={<RegisterUser />} />
    <Route path="/occurrences/new" element={<BasicForm />} />
    <Route path="/dashboard" element={<Dashboard />} />
    {/* Rotas com placeholder (funcionalidades a implementar) */}
    <Route path="/reports" element={<Reports />} />
    <Route path="/map" element={<Map />} />

    <Route path="/settings" element={<Settings />} />

   </Route>

   {/* Rota Raiz: Redireciona para login */}
   <Route path="/" element={<Navigate to="/login" replace />} />
   
   {/* Rota Padrão: Redireciona para login se nenhuma outra rota combinar */}
   <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
 );
}

export default App;