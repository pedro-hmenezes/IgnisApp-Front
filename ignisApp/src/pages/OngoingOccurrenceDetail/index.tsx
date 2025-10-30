import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// 1. Importar updateOccurrence
import { getOccurrenceById, updateOccurrence, cancelOccurrence } from '../../api/occurrenceService'; 
import type { OccurrenceDetail } from '../../types/occurrence'; // Verifique o caminho
import './style.css';
import { FiArrowLeft, FiMapPin, FiLoader, FiAlertCircle, FiTrash2 } from 'react-icons/fi'; // Ícones necessários

  // ... (Mock da Timeline - sem mudança)
  const mockTimeline = [ { time: '15:36', event: 'Ocorrência encontrada' }, { time: '15:05', event: 'Viatura em Deslocamento' }, { time: '14:52', event: 'Ocorrência Registrada' } ];

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

    return (
      <div className="detail-container">
        <div className="detail-header">
          <button onClick={() => navigate('/occurrences')} className="back-button">
            <FiArrowLeft /> Voltar para Lista
          </button>
          <h1>Ver Detalhes</h1>
        </div>

    <h2>{occurrence.naturezaInicial}</h2>
    <p className="address-detail">{formatDetailedAddress(occurrence.enderecoCompleto, typeof occurrence.endereco === 'string' ? occurrence.endereco : undefined)}</p>

        <div className="detail-grid">
          <div className="detail-column">
            <div className="info-card">
              <h3>Campos</h3>
              <div className="field-group">
                <label>Tipo</label>
                <span>{occurrence.naturezaInicial?.toUpperCase()}</span>
              </div>
              <div className="field-group">
                <label>Status</label>
                <span>{(occurrence.statusGeral || occurrence.status || 'indefinido').toUpperCase()}</span>
              </div>
              <div className="field-group">
                <label>Viatura Pré-Atribuída</label>
                <span>{occurrence.tipoViatura || 'N/A'}</span>
              </div>
              <p style={{ marginTop: '20px', color: '#888' }}><i>(Formulário da Etapa 2 virá aqui)</i></p>
            </div>

            <div className="info-card map-card">
              <h3>Localização</h3>
              {occurrence.coordenadas && (
                <div className="current-coords">
                  Lat: {occurrence.coordenadas.latitude?.toFixed(6)}, Lon: {occurrence.coordenadas.longitude?.toFixed(6)} (Precisão: {occurrence.coordenadas.precisao?.toFixed(0)}m)
                </div>
              )}
              <div className="map-placeholder">
                <p><i>(Componente de Mapa será inserido aqui)</i></p>
                <button onClick={handleGetGps} className="gps-button-detail" disabled={isUpdatingGps}>
                  {isUpdatingGps ? (<><FiLoader className="spinner-inline" size={16} /> Atualizando...</>) : (<><FiMapPin /> Obter/Atualizar GPS</>)}
                </button>
              </div>
              {gpsError && <p className="error-message gps-error">{gpsError}</p>}
            </div>
          </div>

          <div className="detail-column">
            <div className="info-card media-card">{/* media card placeholder */}</div>
            <div className="info-card timeline-card">
              <h3>Timeline (F-12)</h3>
              <ul className="timeline">
                {mockTimeline.map((item, idx) => (
                  <li key={idx}><span className="time">{item.time}</span><span className="event">{item.event}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="detail-actions">
          <button 
            className="button-danger"
            onClick={handleCancelOccurrence}
            disabled={isCancelling || isLoading}
          >
            {isCancelling ? (<><FiLoader className="spinner-inline" size={16} /> Cancelando...</>) : (<><FiTrash2 /> Cancelar Ocorrência</>)}
          </button>

          {cancelError && <p className="error-message cancel-error">{cancelError}</p>}

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}> 
        <button className="button-secondary" disabled={isLoading || isCancelling}>Baixar Formulário Completo</button>
        <button className="button-primary" disabled={isLoading || isCancelling} onClick={() => navigate(`/occurrences/${occurrenceId}/edit`)}>Ver/Editar Formulário Completo</button>
         </div>
        </div>
      </div>
    );
  }