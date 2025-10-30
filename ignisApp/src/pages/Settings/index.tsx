import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

export default function Settings() {
  const navigate = useNavigate();

  useEffect(() => {
    alert('Funcionalidade a ser implementada: Configurações');
    navigate('/home');
  }, [navigate]);

  return (
    <div className="settings-container">
      <h1>Configurações</h1>
      <p>Redirecionando...</p>
    </div>
  );
}
