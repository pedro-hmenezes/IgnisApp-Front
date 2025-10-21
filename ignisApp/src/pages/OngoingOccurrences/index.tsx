// src/pages/OngoingOccurrences/index.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiClock } from 'react-icons/fi';
import './style.css';

// SIMULAÇÃO DE DADOS: Ocorrências recebidas da central (via BasicForm)
const mockOccurrences = [
  {
    id: 'OCC-001',
    naturezaInicial: 'Incêndio em Residência',
    endereco: 'Rua Augusta, 123 - Casa Amarela, Recife',
    status: 'Em Deslocamento',
    horaRecebimento: '14:52',
  },
  {
    id: 'OCC-002',
    naturezaInicial: 'Atropelamento',
    endereco: 'Av. Boa Viagem, 456 - Boa Viagem, Recife',
    status: 'Aguardando Equipe',
    horaRecebimento: '15:10',
  },
  {
    id: 'OCC-003',
    naturezaInicial: 'Queda de Altura',
    endereco: 'Rua da Moeda, 789 - Recife Antigo, Recife',
    status: 'Aguardando Equipe',
    horaRecebimento: '15:21',
  }
];

export default function OngoingOccurrences() {
  return (
    <div className="ongoing-container">
      <h1>Ocorrências em Andamento</h1>
      <p>Ocorrências atribuídas à sua viatura. Clique em uma para iniciar o atendimento.</p>

      <div className="occurrences-list">
        {mockOccurrences.map((occurrence) => (
          // Cada item da lista é um link para a página de detalhes
          <Link to={`/ongoing/${occurrence.id}`} key={occurrence.id} className="occurrence-card">
            <div className="card-content">
              <span className={`status-badge status-${occurrence.status.toLowerCase().replace(' ', '-')}`}>
                {occurrence.status}
              </span>
              <h2>{occurrence.naturezaInicial}</h2>
              <p className="address">{occurrence.endereco}</p>
              <div className="time-info">
                <FiClock size={14} />
                <span>Recebido às {occurrence.horaRecebimento}</span>
              </div>
            </div>
            <div className="card-action">
              <FiChevronRight size={24} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}