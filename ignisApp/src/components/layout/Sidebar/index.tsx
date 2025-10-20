// src/components/layout/Sidebar/index.tsx
import { useState } from 'react';
import './style.css';
import { FiHome, FiFileText, FiMap, FiBarChart2, FiSettings, FiLogOut, FiChevronDown, FiChevronUp, FiClipboard, FiChevronLeft } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [isOccurrencesOpen, setOccurrencesOpen] = useState(true);

  return (
    <aside className={isOpen ? 'sidebar open' : 'sidebar'}>
      <div className="sidebar-header">
        {/* O botão foi removido daqui */}
        <span className={isOpen ? 'logo-text' : 'logo-text hidden'}>Ignis Group</span>
      </div>

      <nav className="nav-menu">
        {/* Botão X para fechar a sidebar (visível quando onToggle é fornecido) */}
        {onToggle && (
          <button className="sidebar-close-btn" onClick={onToggle} aria-label="Fechar sidebar">
            <FiChevronLeft />
          </button>
        )}
        <a href="#" className="nav-item"><FiHome /> <span>Início</span></a>
        <a href="#" className="nav-item"><FiFileText /> <span>Relatórios</span></a>

        <div className="nav-item-container">
          <div className={isOccurrencesOpen ? "nav-item active" : "nav-item"} onClick={() => isOpen && setOccurrencesOpen(!isOccurrencesOpen)}>
            <div className="submenu-toggle">
              <FiClipboard /> <span>Registro de Ocorrências</span>
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

        <a href="#" className="nav-item"><FiMap /> <span>Mapa de Ocorrências</span></a>
        <a href="#" className="nav-item"><FiBarChart2 /> <span>Dashboard</span></a>
      </nav>

      <div className="sidebar-footer">
        <a href="#" className="nav-item"><FiSettings /> <span>Configurações</span></a>
        <a href="#" className="nav-item"><FiLogOut /> <span>Sair</span></a>
      </div>
    </aside>
  );
}