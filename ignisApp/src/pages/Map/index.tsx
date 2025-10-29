// src/pages/Map/index.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

export default function Map() {
  const navigate = useNavigate();

  useEffect(() => {
    alert('Funcionalidade a ser implementada: Mapa de Ocorrências');
    navigate('/home');
  }, [navigate]);

  return (
    <div className="map-container">
      <h1>Mapa de Ocorrências</h1>
      <p>Redirecionando...</p>
    </div>
  );
}
