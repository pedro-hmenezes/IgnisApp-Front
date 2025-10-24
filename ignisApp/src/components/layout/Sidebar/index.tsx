import './style.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext'; // Verifique se o caminho está correto
import { FiHome, FiFileText, FiMap, FiBarChart2, FiSettings, FiLogOut, FiClipboard, FiChevronLeft } from 'react-icons/fi'; // Ícones necessários

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  // Removido o estado 'isOccurrencesOpen' - não precisamos mais do submenu
  const { logout } = useAuth();

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
        <Link to="/" className="nav-item"><FiHome /> <span>Início</span></Link>
        <Link to="/reports" className="nav-item"><FiFileText /> <span>Relatórios</span></Link>

        {/* === MUDANÇA PRINCIPAL AQUI === */}
        {/* Item único para Ocorrências */}
        <Link to="/occurrences" className="nav-item"><FiClipboard /> <span>Ocorrências</span></Link>
        {/* ============================== */}

        <Link to="/map" className="nav-item"><FiMap /> <span>Mapa de Ocorrências</span></Link>
        <Link to="/dashboard" className="nav-item"><FiBarChart2 /> <span>Dashboard</span></Link>
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