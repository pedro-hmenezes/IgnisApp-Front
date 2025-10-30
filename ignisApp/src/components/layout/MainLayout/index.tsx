import React, { useState, useEffect } from 'react';
import './style.css';
import { Sidebar } from '../Sidebar';
import { FiMenu, FiBell } from 'react-icons/fi';
import userAvatar from '../../../assets/ignis-logo.png';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="main-layout">
  {/* A Sidebar só precisa saber se está aberta ou fechada e receber o handler para fechar */}
  <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      <div className="content-area">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle-btn" onClick={toggleSidebar}>
              <FiMenu />
            </button>
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