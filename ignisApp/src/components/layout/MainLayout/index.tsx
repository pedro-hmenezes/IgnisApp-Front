// src/components/layout/MainLayout/index.tsx
import React, { useState, useEffect } from 'react';
import './style.css';
import { Sidebar } from '../Sidebar';
import { FiSearch, FiBell } from 'react-icons/fi';
// Vamos usar um avatar de placeholder por enquanto
// Você pode substituir por uma imagem sua na pasta assets
import userAvatar from '../../../assets/react.svg'; 

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // Estado para controlar a sidebar, iniciando com base no tamanho da tela
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Efeito para ajustar a sidebar com base no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    // Adiciona o listener quando o componente monta
    window.addEventListener('resize', handleResize);
    // Remove o listener quando o componente desmonta
    return () => window.removeEventListener('resize', handleResize);
  }, []); // O array vazio garante que isso rode apenas uma vez (na montagem/desmontagem)


  return (
    <div className="main-layout">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className={isSidebarOpen ? "content-area expanded" : "content-area"}>
        <header className="header">
          <div className="header-left">
            <div className="search-bar">
              <FiSearch />
              <input type="text" placeholder="Pesquise no Sistema" />
            </div>
          </div>
          <div className="header-right">
            <button className="icon-btn"><FiBell /></button>
            <img src={userAvatar} alt="Avatar do Usuário" className="user-avatar" />
          </div>
        </header>
        <main className="main-content">
          <div className="content-card">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}