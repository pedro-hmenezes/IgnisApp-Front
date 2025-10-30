import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; 
import { useNavigate } from 'react-router-dom';     
import './style.css';
import logo from '../../assets/ignis-logo.png'; 

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const loginSuccess = await login(username, password);

      if (loginSuccess) {
        navigate('/home');
      } else {
        setError('Email ou senha inválidos. Verifique suas credenciais e tente novamente.');
      }
    } catch (err) {
      console.error("Erro durante o login:", err);
      setError('Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="brand-header">
          <img src={logo} alt="Ignis Group" className="login-logo" />
          <h1 className="brand-title">Ignis Group</h1>
          <p className="brand-subtitle">Sistema de Ocorrências • CBMPE</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Email</label>
            <input
              type="email"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Digite seu email corporativo"
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <p>Esqueceu o email ou a senha? Entre em contato com o seu superior técnico. <a href="#">Saiba Mais</a></p>
        </div>
      </div>
    </div>
  );
}