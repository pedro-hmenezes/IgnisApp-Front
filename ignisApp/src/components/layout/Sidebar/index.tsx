// src/components/layout/Sidebar/index.tsx
import './style.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext'; // Importe useAuth
import { FiHome, FiFileText, FiMap, FiBarChart2, FiSettings, FiLogOut, FiClipboard, FiChevronLeft, FiUsers } from 'react-icons/fi'; 

interface SidebarProps {
 isOpen: boolean;
 onToggle?: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { logout, userProfile } = useAuth(); // 2. Pegue userProfile do contexto

 return (
  <aside className={isOpen ? 'sidebar open' : 'sidebar'}>
    <div className="sidebar-header">
      <span className={isOpen ? 'logo-text' : 'logo-text hidden'}>Ignis Group</span>
      {onToggle && (
       <button className="sidebar-close-btn" onClick={onToggle} aria-label="Fechar sidebar">
         <FiChevronLeft />
       </button>
      )}
    </div>

    <nav className="nav-menu">
      <Link to="/home" className="nav-item"><FiHome /> <span>Início</span></Link>
      
      {/* Exemplo: Mostrar Relatórios apenas para Chefe e Admin */}
      {(userProfile === 'chefe' || userProfile === 'admin') && (
        <Link to="/reports" className="nav-item"><FiFileText /> <span>Relatórios</span></Link>
      )}

      {/* Ocorrências visível para a maioria (ajuste a lógica se necessário) */}
      <Link to="/occurrences" className="nav-item"><FiClipboard /> <span>Ocorrências</span></Link>

      {/* Exemplo: Mapa/Dashboard apenas para Chefe e Admin */}
       {(userProfile === 'chefe' || userProfile === 'admin') && (
         <>
            <Link to="/map" className="nav-item"><FiMap /> <span>Mapa de Ocorrências</span></Link>
            <Link to="/dashboard" className="nav-item"><FiBarChart2 /> <span>Dashboard</span></Link>
         </>
       )}
       
       {/* Link para Gestão de Usuários (apenas admin) */}
       {userProfile === 'admin' && (
          <Link to="/users" className="nav-item">
            <FiUsers /> <span>Gestão de Usuários</span>
          </Link>
       )}

    </nav>

    <div className="sidebar-footer">
      <Link to="/settings" className="nav-item"><FiSettings /> <span>Configurações</span></Link>
      <button onClick={logout} className="nav-item logout-btn">
        <FiLogOut /> <span>Sair</span>
      </button>
    </div>
  </aside>
 );
}