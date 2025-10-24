// src/pages/OccurrencesDashboard/index.tsx
import { useState, useEffect } from 'react'; // Import useState and useEffect
import { Link } from 'react-router-dom';
import { FiPlus, FiChevronRight, FiClock, FiAlertCircle, FiLoader } from 'react-icons/fi'; // Import icons
import { getOccurrences } from '../../api/occurrenceService'; // Import the API service function
import './style.css';

// Interface para o resumo da ocorrência (ajuste conforme a API)
interface OccurrenceSummary {
  _id: string; 
  naturezaInicial: string;
  endereco?: { municipio?: string; bairro?: string; rua?: string }; 
  status: string;
  timestampRecebimento?: string; // Esperamos ISO String da API
  // Adicione outros campos se a API retornar
  horaRecebimento?: string; // Mantém se a simulação retornar
}

export default function OccurrencesDashboard() {
  // Estados para dados, carregamento e erro
  const [occurrences, setOccurrences] = useState<OccurrenceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect para buscar os dados na montagem
  useEffect(() => {
    const fetchOccurrences = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getOccurrences(); // Chama a função do service
        setOccurrences(data); 
      } catch (err) {
        setError("Falha ao carregar ocorrências. Tente recarregar a página.");
        console.error("Erro buscando ocorrências:", err);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchOccurrences();
  }, []); // Roda apenas uma vez

  // Filtrar os dados do estado
  const ongoing = occurrences.filter(occ => occ.status !== 'Finalizada');
  const finished = occurrences.filter(occ => occ.status === 'Finalizada');

  // Helper para formatar endereço (opcional)
  const formatAddress = (endereco: OccurrenceSummary['endereco']): string => {
    if (!endereco) return 'Endereço não informado';
    const parts = [endereco.rua, endereco.bairro, endereco.municipio].filter(Boolean); 
    return parts.join(', ') || 'Endereço não informado';
  };
  
  // Helper para formatar hora (opcional, ajuste conforme formato da API)
  const formatTime = (isoTimestamp?: string, fallbackTime?: string): string => {
      if (isoTimestamp) {
          try {
              // Extrai a hora do ISO string (YYYY-MM-DDTHH:mm:ss.sssZ)
              const timePart = isoTimestamp.split('T')[1].substring(0, 5); 
              return timePart;
          } catch { /* Ignora erro de formatação */ }
      }
      return fallbackTime || '--:--'; // Retorna o mock ou um placeholder
  }

  return (
    <div className="occurrences-dashboard">
      <div className="dashboard-header">
        <h1>Painel de Ocorrências</h1>
        <Link to="/register" className="new-occurrence-button">
          <FiPlus /> Nova Ocorrência
        </Link>
      </div>

      <div className="occurrences-content">

        {/* Renderização Condicional */}
        {isLoading && (
          <div className="loading-state">
            <FiLoader className="spinner" size={30} />
            <p>Carregando ocorrências...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <FiAlertCircle size={30} />
            <p>{error}</p>
            {/* Poderia ter um botão "Tentar Novamente" */}
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Seção Em Andamento */}
            <section className="occurrence-section">
              <h2>Em Andamento ({ongoing.length})</h2>
              {ongoing.length > 0 ? (
                <div className="occurrences-list">
                  {ongoing.map((occurrence) => (
                    <Link to={`/ongoing/${occurrence._id}`} key={occurrence._id} className="occurrence-card">
                       <div className="card-content">
                        <span className={`status-badge status-${occurrence.status.toLowerCase().replace(/ /g, '-')}`}>
                          {occurrence.status}
                        </span>
                        <h3>{occurrence.naturezaInicial}</h3>
                        <p className="address">{formatAddress(occurrence.endereco)}</p> 
                        <div className="time-info">
                          <FiClock size={14} />
                          <span>Recebido às {formatTime(occurrence.timestampRecebimento, occurrence.horaRecebimento)}</span> 
                        </div>
                      </div>
                      <div className="card-action">
                        <FiChevronRight size={24} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="no-occurrences">Nenhuma ocorrência em andamento no momento.</p>
              )}
            </section>

            {/* Seção Finalizadas (Histórico) */}
            <section className="occurrence-section">
              <h2>Finalizadas ({finished.length})</h2>
               {finished.length > 0 ? (
                <div className="occurrences-list">
                  {finished.map((occurrence) => (
                    <Link to={`/ongoing/${occurrence._id}`} key={occurrence._id} className="occurrence-card finished">
                       <div className="card-content">
                         <span className={`status-badge status-${occurrence.status.toLowerCase().replace(/ /g, '-')}`}>
                          {occurrence.status}
                        </span>
                        <h3>{occurrence.naturezaInicial}</h3>
                         <p className="address">{formatAddress(occurrence.endereco)}</p>
                        <div className="time-info">
                          <FiClock size={14} />
                          <span>Recebido às {formatTime(occurrence.timestampRecebimento, occurrence.horaRecebimento)}</span>
                        </div>
                      </div>
                      <div className="card-action">
                        <FiChevronRight size={24} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                 <p className="no-occurrences">Nenhuma ocorrência finalizada registrada.</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}