// src/pages/Dashboard/index.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    alert('Funcionalidade a ser implementada: Dashboard');
    navigate('/home');
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>Redirecionando...</p>
    </div>
  );
}
