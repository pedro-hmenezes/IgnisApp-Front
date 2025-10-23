// src/pages/OngoingOccurrenceDetail/index.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style.css';
// Importaremos ícones conforme necessário
import { FiArrowLeft, FiMapPin, FiCamera, FiVideo, FiEdit2 } from 'react-icons/fi'; 

// SIMULAÇÃO DE DADOS: Ocorrências recebidas da central (mesmo mock de antes)
const mockOccurrences = [
  { id: 'OCC-001', naturezaInicial: 'Incêndio em Residência', endereco: 'Rua Augusta, 123 - Casa Amarela, Recife', status: 'Em Deslocamento', horaRecebimento: '14:52', tipoViatura: 'VT-0845' },
  { id: 'OCC-002', naturezaInicial: 'Atropelamento', endereco: 'Av. Boa Viagem, 456 - Boa Viagem, Recife', status: 'Aguardando Equipe', horaRecebimento: '15:10', tipoViatura: 'UR-1234' },
  { id: 'OCC-003', naturezaInicial: 'Queda de Altura', endereco: 'Rua da Moeda, 789 - Recife Antigo, Recife', status: 'Aguardando Equipe', horaRecebimento: '15:21', tipoViatura: 'AR-5678' }
];

// Mock da Timeline (F-12)
const mockTimeline = [
  { time: '15:36', event: 'Ocorrência encontrada' },
  { time: '15:05', event: 'Viatura em Deslocamento' },
  { time: '14:52', event: 'Ocorrência Registrada' },
];

export default function OngoingOccurrenceDetail() {
  const { occurrenceId } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();
  const [occurrence, setOccurrence] = useState<any>(null); // Estado para guardar os dados da ocorrência

  // Busca (simulada) os dados da ocorrência quando o componente carrega
  useEffect(() => {
    const foundOccurrence = mockOccurrences.find(occ => occ.id === occurrenceId);
    if (foundOccurrence) {
      setOccurrence(foundOccurrence);
    } else {
      // Ocorrência não encontrada, talvez redirecionar?
      console.error("Ocorrência não encontrada:", occurrenceId);
      navigate('/ongoing'); // Volta para a lista
    }
  }, [occurrenceId, navigate]);

  // Se os dados ainda não carregaram, mostra uma mensagem
  if (!occurrence) {
    return <div className="detail-container loading">Carregando detalhes da ocorrência...</div>;
  }

  // Função para o requisito F-04: Captura GPS
  const handleGetGps = () => {
    // ... (mesma lógica que tínhamos antes, podemos colocar num hook depois)
    alert("Funcionalidade GPS a ser implementada aqui.");
  };

  // Funções placeholder para F-05 (Foto), F-10 (Video), F-06 (Assinatura)
  const handleTakePhoto = () => alert("Funcionalidade Câmera (F-05) a ser implementada.");
  const handleRecordVideo = () => alert("Funcionalidade Vídeo (F-10) a ser implementada.");
  const handleGetSignature = () => alert("Funcionalidade Assinatura (F-06) a ser implementada.");


  return (
    <div className="detail-container">
      <div className="detail-header">
        <button onClick={() => navigate('/ongoing')} className="back-button">
          <FiArrowLeft /> Voltar para Lista
        </button>
        <h1>Ver Detalhes</h1>
      </div>
      
      <h2>{occurrence.naturezaInicial}</h2>
      <p className="address-detail">{occurrence.endereco}</p>

      <div className="detail-grid">
        {/* --- Coluna 1: Campos e Localização --- */}
        <div className="detail-column">
          <div className="info-card">
            <h3>Campos</h3>
            <div className="field-group">
              <label>Tipo</label>
              <span>{occurrence.naturezaInicial.toUpperCase()}</span> {/* Mostra o tipo inicial */}
            </div>
            <div className="field-group">
              <label>Status</label>
              <span>{occurrence.status.toUpperCase()}</span>
            </div>
             <div className="field-group">
              <label>Viatura</label>
              <span>{occurrence.tipoViatura}</span> {/* Exemplo, pegando do mock */}
            </div>
            {/* Aqui entrarão os inputs para os campos da Etapa 2 */}
            <p style={{marginTop: '20px', color: '#888'}}><i>(Formulário da Etapa 2 virá aqui)</i></p>
          </div>

          <div className="info-card map-card">
            <h3>Localização</h3>
            {/* Placeholder para o Mapa */}
            <div className="map-placeholder">
              <p><i>(Componente de Mapa será inserido aqui)</i></p>
              <button onClick={handleGetGps} className="gps-button-detail">
                <FiMapPin /> Obter/Atualizar GPS (F-04)
              </button>
            </div>
          </div>
        </div>

        {/* --- Coluna 2: Mídia e Timeline --- */}
        <div className="detail-column">
           <div className="info-card media-card">
            <h3>Mídia</h3>
            {/* Placeholder para a galeria de fotos/vídeos */}
            <div className="media-placeholder">
               <img src="https://via.placeholder.com/200x150?text=Exemplo+Foto" alt="Exemplo Mídia" />
              <p><i>(Galeria de Mídia)</i></p>
            </div>
            <div className="media-actions">
              <button onClick={handleTakePhoto}><FiCamera/> Adicionar Foto (F-05)</button>
              <button onClick={handleRecordVideo}><FiVideo/> Adicionar Vídeo (F-10)</button>
              <button onClick={handleGetSignature}><FiEdit2/> Coletar Assinatura (F-06)</button>
            </div>
          </div>

          <div className="info-card timeline-card">
            <h3>Timeline (F-12)</h3>
            <ul className="timeline">
              {mockTimeline.map((item, index) => (
                <li key={index}>
                  <span className="time">{item.time}</span>
                  <span className="event">{item.event}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="detail-actions">
         <button className="button-secondary">Baixar Formulário Completo</button>
         <button className="button-primary">Ver/Editar Formulário Completo</button>
      </div>
    </div>
  );
}