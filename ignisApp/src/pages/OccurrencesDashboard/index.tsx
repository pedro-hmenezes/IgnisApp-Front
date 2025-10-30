import { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { FiPlus, FiChevronRight, FiClock, FiAlertCircle, FiLoader } from 'react-icons/fi'; // Import icons
import { getOccurrences, updateOccurrence, cancelOccurrence } from '../../api/occurrenceService'; // API services
import './style.css';

// Interface para o resumo da ocorrência (conforme API real)
interface OccurrenceSummary {
  _id: string; 
  naturezaInicial: string;
  endereco?: { municipio?: string; bairro?: string; rua?: string }; 
  statusGeral?: string; // Campo real que vem da API
  timestampRecebimento?: string; // ISO String da API
}

export default function OccurrencesDashboard() {
  // Estados para dados, carregamento e erro
  const [occurrences, setOccurrences] = useState<OccurrenceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, 'finalize' | 'cancel' | undefined>>({});

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
  const ongoing = occurrences.filter(occ => (occ.statusGeral || '').toLowerCase() !== 'finalizada' && (occ.statusGeral || '').toLowerCase() !== 'cancelada');
  const finished = occurrences.filter(occ => (occ.statusGeral || '').toLowerCase() === 'finalizada' || (occ.statusGeral || '').toLowerCase() === 'cancelada');

  // Helper para formatar endereço (opcional)
  const formatAddress = (endereco: OccurrenceSummary['endereco']): string => {
    if (!endereco) return 'Endereço não informado';
    const parts = [endereco.rua, endereco.bairro, endereco.municipio].filter(Boolean); 
    return parts.join(', ') || 'Endereço não informado';
  };
  
  // Helper para formatar hora
  const formatTime = (isoTimestamp?: string): string => {
      if (isoTimestamp) {
          try {
              const timePart = isoTimestamp.split('T')[1].substring(0, 5); 
              return timePart;
          } catch { /* Ignora erro de formatação */ }
      }
      return '--:--';
  }

  // --- Ações ---
  const handleFinalize = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Deseja marcar esta ocorrência como Finalizada?')) return;
    try {
      setActionLoading(prev => ({ ...prev, [id]: 'finalize' }));
      // Atualiza via PATCH /occurrences/:id
  await updateOccurrence(id, { statusGeral: 'finalizada', status: 'finalizada' });
      setOccurrences(prev => prev.map(o => (o._id === id ? { ...o, statusGeral: 'finalizada' } : o)));
      alert('Ocorrência finalizada com sucesso!');
    } catch (err) {
      console.error('Erro ao finalizar ocorrência:', err);
      alert('Falha ao finalizar a ocorrência.');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const handleCancel = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Deseja cancelar esta ocorrência?')) return;
    try {
      setActionLoading(prev => ({ ...prev, [id]: 'cancel' }));
    await cancelOccurrence(id);
    setOccurrences(prev => prev.map(o => (o._id === id ? { ...o, statusGeral: 'cancelada' } : o)));
      alert('Ocorrência cancelada com sucesso!');
    } catch (err) {
      console.error('Erro ao cancelar ocorrência:', err);
      alert('Falha ao cancelar a ocorrência.');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: undefined }));
    }
  };

  return (
    <div className="occurrences-dashboard">
      <div className="dashboard-header">
        <h1>Painel de Ocorrências</h1>
        <Link to="/occurrences/new" className="new-occurrence-button">
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
                        <span className={`status-badge status-${(occurrence.statusGeral || 'recebida').toLowerCase().replace(/ /g, '-')}`}>
                          {occurrence.statusGeral || 'Recebida'}
                        </span>
                        <h3>{occurrence.naturezaInicial}</h3>
                        <p className="address">{formatAddress(occurrence.endereco)}</p> 
                        <div className="time-info">
                          <FiClock size={14} />
                          <span>Recebido às {formatTime(occurrence.timestampRecebimento)}</span> 
                        </div>
                      </div>
                      <div className="card-actions">
                        <button
                          className="occ-btn occ-btn-finish"
                          disabled={actionLoading[occurrence._id] === 'finalize'}
                          onClick={(e) => handleFinalize(e, occurrence._id)}
                          title="Marcar como Finalizada"
                        >
                          {actionLoading[occurrence._id] === 'finalize' ? 'Finalizando...' : 'Finalizar'}
                        </button>
                        <button
                          className="occ-btn occ-btn-cancel"
                          disabled={actionLoading[occurrence._id] === 'cancel'}
                          onClick={(e) => handleCancel(e, occurrence._id)}
                          title="Cancelar ocorrência"
                        >
                          {actionLoading[occurrence._id] === 'cancel' ? 'Cancelando...' : 'Cancelar'}
                        </button>
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
                         <span className={`status-badge status-${(occurrence.statusGeral || 'finalizada').toLowerCase().replace(/ /g, '-')}`}>
                          {occurrence.statusGeral || 'Finalizada'}
                        </span>
                        <h3>{occurrence.naturezaInicial}</h3>
                         <p className="address">{formatAddress(occurrence.endereco)}</p>
                        <div className="time-info">
                          <FiClock size={14} />
                          <span>Recebido às {formatTime(occurrence.timestampRecebimento)}</span>
                        </div>
                      </div>
                      <div className="card-actions">
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