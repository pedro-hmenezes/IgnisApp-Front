// src/pages/Login/index.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // 1. Importe o hook useAuth
import { useNavigate } from 'react-router-dom';     // 2. Importe useNavigate para redirecionar após login
import './style.css';
import logo from '../../assets/react.svg'; // Placeholder logo

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth(); // 3. Use o hook para pegar a função login e o estado isLoading
  const navigate = useNavigate();       // 4. Hook para navegação

  const handleLogin = async (e: React.FormEvent) => { // 5. Tornar a função async
    e.preventDefault();
    setError(''); // Limpa erros locais

    try {
      // 6. Chame a função login do contexto
      const loginSuccess = await login(username, password);

      if (loginSuccess) {
        // 7. Se o login no contexto foi sucesso, navega para a home
        navigate('/');
      } else {
        // 8. Se falhou (no contexto), mostra mensagem de erro
        setError('Credenciais institucionais inválidas.');
        // Futuro: Lógica de bloqueio por tentativas pode vir do contexto/API
      }
    } catch (err) {
      // Captura erros inesperados (ex: falha na rede no futuro)
      console.error("Erro durante o login:", err);
      setError('Ocorreu um erro ao tentar fazer login. Tente novamente.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src={logo} alt="Ignis Group Logo" className="login-logo" />

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Login</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Digite o seu nº de matrícula"
              disabled={isLoading} // 9. Desabilita inputs durante o carregamento
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
              disabled={isLoading} // 9. Desabilita inputs durante o carregamento
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          {/* 10. Mostra texto "Entrando..." no botão se estiver carregando */}
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <p>Esqueceu o nº matrícula ou a senha? Entre em contato com o seu superior técnico. <a href="#">Saiba Mais</a></p>
        </div>
      </div>
    </div>
  );
}