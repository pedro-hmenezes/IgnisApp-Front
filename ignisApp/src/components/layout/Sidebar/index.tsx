// src/components/layout/Sidebar/index.tsx
import { useState } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import { FiHome, FiFileText, FiMap, FiBarChart2, FiSettings, FiLogOut, FiClipboard, FiChevronLeft } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [isOccurrencesOpen, setOccurrencesOpen] = useState(true);

  return (
    <aside className={isOpen ? 'sidebar open' : 'sidebar'}>
      {/* ... seu sidebar-header ... */}
      <nav className="nav-menu">
        {onToggle && (
          <button className="sidebar-close-btn" onClick={onToggle} aria-label="Fechar sidebar">
            <FiChevronLeft />
          </button>
        )}
        
        {/* 2. Troque <a> por <Link> */}
        <Link to="/" className="nav-item"><FiHome /> <span>Início</span></Link>
        <Link to="/reports" className="nav-item"><FiFileText /> <span>Relatórios</span></Link>

        <div className="nav-item-container">
          <div className={isOccurrencesOpen ? "nav-item active" : "nav-item"} onClick={() => isOpen && setOccurrencesOpen(!isOccurrencesOpen)}>
            <div className="submenu-toggle">
              <FiClipboard /> <span>Registro de Ocorrências</span>
            </div>
            {/* ... ícones do submenu ... */}
          </div>
          {isOccurrencesOpen && (
            <div className={isOpen ? 'submenu active' : 'submenu'}>
              {/* 3. Este é o link principal para a nova tela */}
              <Link to="/register" className="submenu-item">Registrar Ocorrência</Link>
              <Link to="/ongoing" className="submenu-item">Ocorrência em Andamento</Link>
              <Link to="/history" className="submenu-item">Histórico de Ocorrências</Link>
            </div>
          )}
        </div>

        <Link to="/map" className="nav-item"><FiMap /> <span>Mapa de Ocorrências</span></Link>
        <Link to="/dashboard" className="nav-item"><FiBarChart2 /> <span>Dashboard</span></Link>
      </nav>

      <div className="sidebar-footer">
        <Link to="/settings" className="nav-item"><FiSettings /> <span>Configurações</span></Link>
        <Link to="/logout" className="nav-item"><FiLogOut /> <span>Sair</span></Link>
      </div>
    </aside>
  );
}