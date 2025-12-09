import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOccurrenceById, updateOccurrence, cancelOccurrence } from '../../api/occurrenceService'; 
import type { OccurrenceDetail } from '../../types/occurrence';
import './style.css';
import { 
  FiArrowLeft, FiMapPin, FiLoader, FiAlertCircle,
  FiEdit2, FiPhone, FiUser
} from 'react-icons/fi';

export default function OngoingOccurrenceDetail() {
    const { occurrenceId } = useParams<{ occurrenceId: string }>();
    const navigate = useNavigate();

    const [occurrence, setOccurrence] = useState<OccurrenceDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isUpdatingGps, setIsUpdatingGps] = useState(false);
    const [gpsError, setGpsError] = useState<string | null>(null);
    
  // === NOVO ESTADO para a ação de Cancelar ===
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

    useEffect(() => {
      if (!occurrenceId) {
        setError('ID da ocorrência inválido.');
        setIsLoading(false);
        navigate('/occurrences');
        return;
      }

      const fetchOccurrenceDetail = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getOccurrenceById(occurrenceId);
          setOccurrence(data);
        } catch (err) {
          console.error(err);
          // Mensagem específica para 404, quando a API não encontra a ocorrência
          const status = (typeof err === 'object' && err !== null && 'response' in err)
            ? (err as { response?: { status?: number } }).response?.status
            : undefined;
          if (status === 404) {
            setError('Ocorrência não encontrada (404).');
          } else {
            setError('Falha ao carregar detalhes da ocorrência.');
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchOccurrenceDetail();
    }, [occurrenceId, navigate]);

    const formatDetailedAddress = (addr: OccurrenceDetail['enderecoCompleto'], fallback?: string): string => {
      if (addr) return `${addr.rua}, ${addr.numero} - ${addr.bairro}, ${addr.municipio}`;
      return fallback || 'Endereço não disponível';
    };

    const handleGetGps = () => {
      if (!navigator.geolocation || !occurrenceId) {
        setGpsError('Geolocalização não suportada ou ID da ocorrência ausente.');
        return;
      }
      setIsUpdatingGps(true);
      setGpsError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const coordinatesPayload = { coordenadas: { latitude, longitude, precisao: accuracy, timestamp: new Date().toISOString() } };
          try {
            const updated = await updateOccurrence(occurrenceId, coordinatesPayload);
            setOccurrence(updated);
            alert('Localização GPS atualizada com sucesso!');
          } catch (apiError) {
            console.error('Erro ao salvar coordenadas GPS:', apiError);
            setGpsError('Falha ao salvar a localização. Tente novamente.');
          } finally {
            setIsUpdatingGps(false);
          }
        },
        (geoError) => {
          console.error('Erro ao obter GPS:', geoError);
          setGpsError(`Não foi possível obter a localização: ${geoError.message}`);
          setIsUpdatingGps(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    // Cancelar Ocorrência
    const handleCancelOccurrence = async () => {
      if (!occurrenceId) return;
      const confirmCancel = window.confirm('Tem certeza que deseja cancelar esta ocorrência? Esta ação não pode ser desfeita.');
      if (!confirmCancel) return;

      setIsCancelling(true);
      setCancelError(null);
      try {
        await cancelOccurrence(occurrenceId);
        alert('Ocorrência cancelada com sucesso!');
        navigate('/occurrences');
      } catch (apiError) {
        console.error(`Erro ao cancelar ocorrência ${occurrenceId}:`, apiError);
        setCancelError('Falha ao cancelar a ocorrência. Tente novamente.');
        alert('Erro ao cancelar a ocorrência.');
      } finally {
        setIsCancelling(false);
      }
    };

    if (isLoading) {
      return (
        <div className="detail-container loading">
          <FiLoader className="spinner" size={30} />
          <p>Carregando detalhes da ocorrência...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="detail-container error-state">
          <button onClick={() => navigate('/occurrences')} className="back-button" style={{ position: 'absolute', top: '20px', left: '20px' }}>
            <FiArrowLeft /> Voltar para Lista
          </button>
          <FiAlertCircle size={30} />
          <p>{error}</p>
        </div>
      );
    }

    if (!occurrence) {
      return (
        <div className="detail-container error-state">
          <button onClick={() => navigate('/occurrences')} className="back-button" style={{ position: 'absolute', top: '20px', left: '20px' }}>
            <FiArrowLeft /> Voltar para Lista
          </button>
          <FiAlertCircle size={30} />
          <p>Ocorrência não encontrada.</p>
        </div>
      );
    }

    // Determinar status e cor
    const status = occurrence.statusGeral || occurrence.status || 'recebida';
    const getStatusBadgeClass = (st: string) => {
      const s = st.toLowerCase();
      if (s.includes('finalizada')) return 'status-finalizada';
      if (s.includes('cancelada')) return 'status-cancelada';
      if (s.includes('andamento') || s.includes('atendimento')) return 'status-andamento';
      return 'status-recebida';
    };

    return (
      <div className="detail-container-modern">
        {/* Header com botão voltar */}
        <div className="detail-header-modern">
          <button onClick={() => navigate('/occurrences')} className="back-btn-modern">
            <FiArrowLeft size={20} />
          </button>
          <h1>Detalhes da Ocorrência</h1>
        </div>

        {/* Card Principal - Hero */}
        <div className="hero-card">
          <div className="hero-header">
            <span className={`status-badge-large ${getStatusBadgeClass(status)}`}>
              {status.toUpperCase()}
            </span>
            <span className="occurrence-number">#{occurrence.numAviso || occurrence._id?.slice(-6)}</span>
          </div>
          <h2 className="occurrence-title">{occurrence.naturezaInicial || 'Resgate de Vítima'}</h2>
          <p className="occurrence-address">
            <FiMapPin size={16} />
            {formatDetailedAddress(occurrence.enderecoCompleto, typeof occurrence.endereco === 'string' ? occurrence.endereco : undefined)}
          </p>
        </div>

        {/* Grid com dois painéis */}
        <div className="detail-grid-modern">
          {/* Painel Esquerdo - Informações */}
          <div className="detail-panel-left">
            
            {/* Dados da Operação */}
            <div className="info-section">
              <h3 className="section-title">Dados da Operação</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Viatura Empenhada:</span>
                  <span className="info-value">{occurrence.tipoViatura || 'ABT-45'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Equipe (Guarnição):</span>
                  <span className="info-value">Comandante e auxiliares...</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Descrição / Código de Encerramento:</span>
                  <span className="info-value">Relatar as ações tomadas...</span>
                </div>
              </div>
            </div>

            {/* Registro da Operação */}
            <div className="info-section">
              <h3 className="section-title">Registro da Operação</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Horário de Recebimento:</span>
                  <span className="info-value">
                    {occurrence.timestampRecebimento 
                      ? new Date(occurrence.timestampRecebimento).toLocaleString('pt-BR')
                      : 'N/A'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Forma de Acionamento:</span>
                  <span className="info-value">{occurrence.formaAcionamento || 'Telefone'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Situação:</span>
                  <span className="info-value">{occurrence.situacaoOcorrencia || 'Em Deslocamento'}</span>
                </div>
              </div>
            </div>

            {/* Dados da Vítima/Solicitante */}
            <div className="info-section">
              <h3 className="section-title">Dados da Vítima/Solicitante</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">
                    <FiUser size={14} /> Solicitante/Vítima:
                  </span>
                  <span className="info-value">
                    {occurrence.solicitante?.nome || 'Maria da Silva Vieira'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">
                    <FiPhone size={14} /> Contato:
                  </span>
                  <span className="info-value">
                    {occurrence.solicitante?.telefone || '(81) 99999-0000'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Relação com Vítima:</span>
                  <span className="info-value">
                    {occurrence.solicitante?.relacao || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Validar Local */}
            <div className="info-section">
              <button className="btn-action btn-location-full" onClick={handleGetGps} disabled={isUpdatingGps}>
                {isUpdatingGps ? (
                  <><FiLoader className="spinner-inline" size={18} /> Obtendo GPS...</>
                ) : (
                  <><FiMapPin size={18} /> Validar Localização</>  
                )}
              </button>
              {gpsError && <p className="error-message">{gpsError}</p>}
            </div>
          </div>

          {/* Painel Direito - Ações e Timeline */}
          <div className="detail-panel-right">
            
            {/* Ações Principais */}
            <div className="actions-card">
              <button 
                className="btn-edit-full"
                onClick={() => navigate(`/occurrences/${occurrenceId}/edit`)}
                disabled={isLoading || isCancelling}
              >
                <FiEdit2 size={20} /> Editar Formulário Completo
              </button>
              
              <button 
                className="btn-finalize"
                onClick={() => alert('Função de finalizar em desenvolvimento')}
                disabled={isLoading || isCancelling || status.toLowerCase().includes('finalizada')}
              >
                Finalizar Ocorrência
              </button>
              
              <button 
                className="btn-cancel"
                onClick={handleCancelOccurrence}
                disabled={isCancelling || isLoading || status.toLowerCase().includes('cancelada')}
              >
                {isCancelling ? (
                  <><FiLoader className="spinner-inline" size={20} /> Cancelando...</>
                ) : (
                  <>Cancelar Ocorrência</>
                )}
              </button>
              {cancelError && <p className="error-message">{cancelError}</p>}
            </div>

            {/* Coordenadas GPS */}
            {occurrence.coordenadas && (
              <div className="gps-card">
                <h3 className="section-title">Coordenadas GPS</h3>
                <div className="gps-info">
                  <p><strong>Latitude:</strong> {occurrence.coordenadas.latitude?.toFixed(6)}</p>
                  <p><strong>Longitude:</strong> {occurrence.coordenadas.longitude?.toFixed(6)}</p>
                  <p><strong>Precisão:</strong> {occurrence.coordenadas.precisao?.toFixed(0)}m</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
}