// src/components/layout/Sidebar/index.tsx
import { useState } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext'; // 1. Importe useAuth
import { FiHome, FiFileText, FiMap, FiBarChart2, FiSettings, FiLogOut, FiClipboard, FiChevronLeft, FiChevronUp, FiChevronDown } from 'react-icons/fi'; // Garanta todos os ícones

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void; // onToggle é opcional, só usado no mobile
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [isOccurrencesOpen, setOccurrencesOpen] = useState(true);
  const { logout } = useAuth(); // 2. Pegue a função logout do contexto

  return (
    <aside className={isOpen ? 'sidebar open' : 'sidebar'}>
      <div className="sidebar-header">
        <span className={isOpen ? 'logo-text' : 'logo-text hidden'}>Ignis Group</span>
        {/* Botão de fechar (X ou seta) para mobile */}
        {onToggle && (
         <button className="sidebar-close-btn" onClick={onToggle} aria-label="Fechar sidebar">
           <FiChevronLeft /> 
         </button>
        )}
      </div>

      <nav className="nav-menu">
        {/* Links de navegação */}
        <Link to="/" className="nav-item"><FiHome /> <span>Início</span></Link>
        <Link to="/reports" className="nav-item"><FiFileText /> <span>Relatórios</span></Link>

        <div className="nav-item-container">
          <div className={isOccurrencesOpen ? "nav-item active" : "nav-item"} onClick={() => isOpen && setOccurrencesOpen(!isOccurrencesOpen)}>
            <div className="submenu-toggle">
              <FiClipboard /> <span>Registro de Ocorrências</span>
            </div>
            {/* Ícones de chevron para o submenu */}
            {isOpen && (isOccurrencesOpen ? <FiChevronUp /> : <FiChevronDown />)}
          </div>
          {isOccurrencesOpen && (
            <div className={isOpen ? 'submenu active' : 'submenu'}>
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
        
        {/* 3. Troque o Link por um Button que chama logout */}
        <button onClick={logout} className="nav-item logout-btn"> 
          <FiLogOut /> <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}