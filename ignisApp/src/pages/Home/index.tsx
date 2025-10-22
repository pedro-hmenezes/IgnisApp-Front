// src/pages/Home/index.tsx
// import React from 'react';
import { useAuth } from '../../contexts/AuthContext'; // 1. Importe o hook
import './style.css'; 

function Home() {
  const { userProfile, isAuthenticated } = useAuth(); // 2. Use o hook

  return (
    <div className="home-container">
      <h1>Olá, Bom Dia!</h1>
      
      {/* 3. Use os valores para renderizar condicionalmente */}
      {isAuthenticated ? (
        <>
          <p>Bem-vindo ao painel de gestão de ocorrências Ignis.</p>
          {userProfile === 'op1' && <p><b>Perfil:</b> Operador da Central</p>}
          {userProfile === 'op2' && <p><b>Perfil:</b> Operador de Campo</p>}
          {userProfile === 'chefe' && <p><b>Perfil:</b> Chefe/Supervisor</p>}
          {userProfile === 'admin' && <p><b>Perfil:</b> Administrador</p>}
          {/* Adicione aqui conteúdo específico para cada perfil, se necessário */}
        </>
      ) : (
        <p>Por favor, faça login para acessar o sistema.</p> 
        // Teoricamente, essa mensagem nunca apareceria por causa das Rotas Protegidas,
        // mas é bom ter como fallback.
      )}
    </div>
  );
}

export default Home;