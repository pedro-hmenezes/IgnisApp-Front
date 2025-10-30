import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

export default function Reports() {
  const navigate = useNavigate();

  useEffect(() => {
    alert('Funcionalidade a ser implementada: Relatórios');
    navigate('/home');
  }, [navigate]);

  return (
    <div className="reports-container">
      <h1>Relatórios</h1>
      <p>Redirecionando...</p>
    </div>
  );
}
