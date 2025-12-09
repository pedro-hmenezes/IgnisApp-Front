import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOccurrences } from '../../api/occurrenceService';
import type { OccurrenceDetail } from '../../types/occurrence';
import { FiMapPin, FiLoader, FiAlertCircle, FiFilter, FiX } from 'react-icons/fi';
import './style.css';

// Tipo para o mapa Leaflet
type LeafletMapInstance = {
  setView: (coords: [number, number], zoom: number) => LeafletMapInstance;
  fitBounds: (bounds: unknown, options?: unknown) => void;
};

type LeafletMarker = {
  remove: () => void;
  bindPopup: (content: string) => LeafletMarker;
  addTo: (map: LeafletMapInstance) => LeafletMarker;
};

export default function Map() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);

  const [occurrences, setOccurrences] = useState<OccurrenceDetail[]>([]);
  const [filteredOccurrences, setFilteredOccurrences] = useState<OccurrenceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Carregar Leaflet CDN
  useEffect(() => {
    if (window.L) {
      setMapReady(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setMapReady(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  // Buscar ocorrências
  useEffect(() => {
    const fetchOccurrences = async () => {
      try {
        const data = await getOccurrences();
        setOccurrences(data);
        setFilteredOccurrences(data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar ocorrências:', err);
        setError('Falha ao carregar ocorrências');
        setLoading(false);
      }
    };

    fetchOccurrences();
  }, []);

  // Filtrar ocorrências
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOccurrences(occurrences);
    } else {
      const filtered = occurrences.filter(occ => {
        const status = (occ.statusGeral || '').toLowerCase();
        if (statusFilter === 'ongoing') {
          return status !== 'finalizada' && status !== 'cancelada';
        }
        return status === statusFilter;
      });
      setFilteredOccurrences(filtered);
    }
  }, [statusFilter, occurrences]);

  // Inicializar mapa
  useEffect(() => {
    if (!mapReady || !mapRef.current || mapInstanceRef.current) return;

    const timer = setTimeout(() => {
      try {
        const L = window.L;
        const map = L.map(mapRef.current).setView([-8.0476, -34.877], 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
      } catch (err) {
        console.error('Erro ao inicializar mapa:', err);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [mapReady]);

  // Adicionar marcadores
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    const L = window.L;

    // Limpar marcadores existentes
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    console.log('Ocorrências filtradas:', filteredOccurrences.length);
    console.log('Ocorrências com coordenadas:', filteredOccurrences.filter(o => o.coordenadas?.latitude).length);

    // Adicionar novos marcadores
    filteredOccurrences.forEach(occ => {
      if (!occ.coordenadas?.latitude || !occ.coordenadas?.longitude) {
        console.log('Ocorrência sem coordenadas:', occ._id, occ.numAviso);
        return;
      }

      const status = (occ.statusGeral || '').toLowerCase();
      let iconColor = '#2196f3'; // Azul padrão

      if (status.includes('finalizada')) iconColor = '#4caf50'; // Verde
      else if (status.includes('cancelada')) iconColor = '#757575'; // Cinza
      else if (status.includes('atendimento') || status.includes('andamento')) iconColor = '#ff9800'; // Laranja

      const iconHtml = `
        <div style="
          background-color: ${iconColor};
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <div style="
            transform: rotate(45deg);
            margin-top: 5px;
            margin-left: 6px;
            color: #fff;
            font-size: 16px;
            font-weight: bold;
          ">📍</div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      const marker = L.marker(
        [occ.coordenadas.latitude, occ.coordenadas.longitude],
        { icon: customIcon }
      ).addTo(mapInstanceRef.current);

      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 1rem; color: #2c3e50;">
            ${occ.naturezaInicial || 'Ocorrência'}
          </h3>
          <p style="margin: 4px 0; font-size: 0.9rem;">
            <strong>Número:</strong> ${occ.numAviso || occ._id?.slice(-6) || 'N/A'}
          </p>
          <p style="margin: 4px 0; font-size: 0.9rem;">
            <strong>Status:</strong> ${occ.statusGeral || 'Recebida'}
          </p>
          <p style="margin: 4px 0; font-size: 0.85rem; color: #666;">
            ${occ.enderecoCompleto ? 
              `${occ.enderecoCompleto.rua}, ${occ.enderecoCompleto.numero} - ${occ.enderecoCompleto.bairro}` 
              : 'Endereço não disponível'}
          </p>
          <button 
            onclick="window.location.href='#/ongoing/${occ._id}'" 
            style="
              margin-top: 8px;
              padding: 6px 12px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #fff;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 0.85rem;
              font-weight: 600;
              width: 100%;
            "
          >
            Ver Detalhes
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
    });

    // Ajustar zoom para mostrar todos os marcadores
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [filteredOccurrences, navigate]);

  if (loading) {
    return (
      <div className="map-container">
        <div className="map-loading">
          <FiLoader className="spinner" size={40} />
          <p>Carregando mapa de ocorrências...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-container">
        <div className="map-error">
          <FiAlertCircle size={40} />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      {/* Header com filtros */}
      <div className="map-header">
        <div className="map-title-section">
          <FiMapPin size={28} />
          <div>
            <h1>Mapa de Ocorrências</h1>
            <p className="map-subtitle">
              {filteredOccurrences.length} ocorrência{filteredOccurrences.length !== 1 ? 's' : ''} no mapa
            </p>
          </div>
        </div>

        <div className="map-filters">
          <FiFilter size={18} />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas</option>
            <option value="ongoing">Em Andamento</option>
            <option value="finalizada">Finalizadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
          
          {statusFilter !== 'all' && (
            <button 
              className="clear-filter-btn"
              onClick={() => setStatusFilter('all')}
              title="Limpar filtro"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Legenda */}
      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#2196f3' }}></div>
          <span>Recebida</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ff9800' }}></div>
          <span>Em Atendimento</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4caf50' }}></div>
          <span>Finalizada</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#757575' }}></div>
          <span>Cancelada</span>
        </div>
      </div>

      {/* Mapa */}
      <div className="map-wrapper">
        <div ref={mapRef} id="map" className="leaflet-map"></div>
        {filteredOccurrences.length === 0 && (
          <div className="map-no-data">
            <FiMapPin size={48} />
            <p>Nenhuma ocorrência encontrada com o filtro selecionado</p>
          </div>
        )}
        {filteredOccurrences.length > 0 && filteredOccurrences.filter(o => o.coordenadas?.latitude).length === 0 && (
          <div className="map-no-data">
            <FiAlertCircle size={48} />
            <p>Nenhuma ocorrência possui coordenadas GPS cadastradas</p>
            <small>Use o botão "Validar Localização" nos detalhes das ocorrências para adicionar coordenadas</small>
          </div>
        )}
      </div>
    </div>
  );
}
