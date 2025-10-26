// src/App.tsx
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { useAuth } from './contexts/AuthContext'; // Verifique se o caminho está correto
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterOccurrence from './pages/RegisterOccurrence';
import BasicForm from './pages/BasicForm';
import OngoingOccurrenceDetail from './pages/OngoingOccurrenceDetail';
import OccurrencesDashboard from './pages/OccurrencesDashboard';
import RegisterUser from './pages/RegisterUser'; // Importe a página de cadastro de usuário

import './App.css';

// Layout para rotas protegidas que requerem autenticação
const ProtectedRoutesLayout = () => {
 const { isLoading } = useAuth();

 // Mostra tela de carregamento durante a verificação inicial
 if (isLoading) {
  return <div>Verificando autenticação...</div>;
 }

 // TODO: Para habilitar autenticação, descomente o bloco abaixo e adicione isAuthenticated no useAuth
 // const { isAuthenticated } = useAuth();
 // if (!isAuthenticated) {
 //   return <Navigate to="/login" replace />;
 // }

 // Se autenticado (ou autenticação desativada), renderiza o layout com as rotas // Renderiza o layout com as rotas filhas (agora sempre acessível)
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
    <Route path="/" element={<Home />} />
    <Route path="/occurrences" element={<OccurrencesDashboard />} />
    <Route path="/register" element={<RegisterOccurrence />} />
    <Route path="/register/new/:typeId" element={<BasicForm />} />
    <Route path="/ongoing/:occurrenceId" element={<OngoingOccurrenceDetail />} />
    <Route path="/users/new" element={<RegisterUser />} />

    {/* Adicione outras rotas que estavam protegidas aqui */}
    {/* Ex: <Route path="/reports" element={<ReportsPage />} /> */}
    {/* Ex: <Route path="/map" element={<MapPage />} /> */}
    {/* Ex: <Route path="/dashboard" element={<DashboardPage />} /> */}
    {/* Ex: <Route path="/settings" element={<SettingsPage />} /> */}

   </Route>

   {/* Rota Padrão: Redireciona para home se nenhuma outra rota combinar */}
   <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
 );
}

export default App;