// src/components/layout/Sidebar/index.tsx
import { useState } from 'react';
import './style.css';
import { FiHome, FiFileText, FiMap, FiBarChart2, FiSettings, FiLogOut, FiChevronDown, FiChevronUp, FiClipboard, FiMenu } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [isOccurrencesOpen, setOccurrencesOpen] = useState(true);

  return (
    <aside className={isOpen ? 'sidebar open' : 'sidebar'}>
      <div className="sidebar-header">
        <button className="menu-toggle-btn" onClick={onToggle} aria-label="Abrir/fechar menu">
          <FiMenu />
        </button>
        <span className={isOpen ? 'logo-text' : 'logo-text hidden'}>Ignis Group</span>
      </div>

      <nav className="nav-menu">
        <a href="#" className="nav-item"><FiHome /> <span className={isOpen ? '' : 'hidden'}>Início</span></a>
        <a href="#" className="nav-item"><FiFileText /> <span className={isOpen ? '' : 'hidden'}>Relatórios</span></a>

        <div className="nav-item-container">
          <div className={isOccurrencesOpen ? "nav-item active" : "nav-item"} onClick={() => setOccurrencesOpen(!isOccurrencesOpen)}>
            <div className="submenu-toggle">
              <FiClipboard /> <span className={isOpen ? '' : 'hidden'}>Registro de Ocorrências</span>
            </div>
            {isOpen && (isOccurrencesOpen ? <FiChevronUp /> : <FiChevronDown />)}
          </div>
          {isOccurrencesOpen && (
            <div className={isOpen ? 'submenu active' : 'submenu'}>
              <a href="#" className="submenu-item">Registrar Ocorrência</a>
              <a href="#" className="submenu-item">Ocorrência em Andamento</a>
              <a href="#" className="submenu-item">Histórico de Ocorrências</a>
            </div>
          )}
        </div>

        <a href="#" className="nav-item"><FiMap /> <span className={isOpen ? '' : 'hidden'}>Mapa de Ocorrências</span></a>
        <a href="#" className="nav-item"><FiBarChart2 /> <span className={isOpen ? '' : 'hidden'}>Dashboard</span></a>
      </nav>

      <div className="sidebar-footer">
        <a href="#" className="nav-item"><FiSettings /> <span className={isOpen ? '' : 'hidden'}>Configurações</span></a>
        <a href="#" className="nav-item"><FiLogOut /> <span className={isOpen ? '' : 'hidden'}>Sair</span></a>
      </div>
    </aside>
  );
}