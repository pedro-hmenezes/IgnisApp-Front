/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import './style.css';

interface MapPickerProps {
  onLocationSelect: (latitude: number, longitude: number) => void;
  initialLat?: number;
  initialLng?: number;
  error?: string;
}

declare global {
  interface Window {
    L: any;
  }
}

export function MapPicker({
  onLocationSelect,
  initialLat,
  initialLng,
  error,
}: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [mapReady, setMapReady] = useState(false);

  // Carregar Leaflet
  useEffect(() => {
    const loadLeaflet = () => {
      // Carregar CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        document.head.appendChild(link);
      }

      // Carregar JS
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
        script.async = true;
        script.onload = () => {
          setMapReady(true);
        };
        script.onerror = () => {
          console.error('Erro ao carregar Leaflet');
          setLocationStatus('Erro ao carregar mapa');
        };
        document.head.appendChild(script);
      } else {
        setMapReady(true);
      }
    };

    loadLeaflet();
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    const initMap = () => {
      try {
        const L = window.L;
        if (!L) {
          setLocationStatus('Leaflet não carregou');
          return;
        }

        // Limpar mapa anterior
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        // Centro padrão: Recife, Pernambuco, Brasil
        const defaultCenter = [-8.0476, -34.877];
        const center = initialLat && initialLng ? [initialLat, initialLng] : defaultCenter;

        const map = L.map(mapRef.current).setView(center, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Adicionar marcador inicial
        let currentMarker: any = null;
        if (initialLat && initialLng) {
          currentMarker = L.marker([initialLat, initialLng])
            .addTo(map)
            .bindPopup(`Latitude: ${initialLat.toFixed(6)}<br>Longitude: ${initialLng.toFixed(6)}`);
        }

        // Evento de clique no mapa
        map.on('click', (e: any) => {
          const { lat, lng } = e.latlng;

          if (currentMarker) {
            map.removeLayer(currentMarker);
          }

          currentMarker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`Latitude: ${lat.toFixed(6)}<br>Longitude: ${lng.toFixed(6)}`);

          onLocationSelect(lat, lng);
          setLocationStatus(`✓ Localização selecionada: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          markerRef.current = currentMarker;
        });

        mapInstanceRef.current = map;
        markerRef.current = currentMarker;
      } catch (err) {
        console.error('Erro ao inicializar mapa:', err);
        setLocationStatus('Erro ao inicializar mapa');
      }
    };

    // Aguardar um pouco
    const timer = setTimeout(initMap, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [mapReady, onLocationSelect, initialLat, initialLng]);

  // Função para obter localização atual
  const getCurrentLocation = () => {
    setLoading(true);
    setLocationStatus('Obtendo localização...');

    if (!navigator.geolocation) {
      setLocationStatus('Geolocalização não suportada');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationSelect(latitude, longitude);
        setLocationStatus(
          `✓ Localização obtida: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        );
        setLoading(false);

        // Atualizar o mapa
        if (mapInstanceRef.current && window.L) {
          const L = window.L;
          if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
          }

          markerRef.current = L.marker([latitude, longitude])
            .addTo(mapInstanceRef.current)
            .bindPopup(`Latitude: ${latitude.toFixed(6)}<br>Longitude: ${longitude.toFixed(6)}`);

          mapInstanceRef.current.setView([latitude, longitude], 16);
        }
      },
      (error) => {
        let errorMsg = 'Erro ao obter localização';
        if (error.code === 1) {
          errorMsg = 'Permissão negada. Ative a localização.';
        } else if (error.code === 2) {
          errorMsg = 'Localização indisponível.';
        } else if (error.code === 3) {
          errorMsg = 'Tempo limite excedido.';
        }
        setLocationStatus(errorMsg);
        setLoading(false);
      }
    );
  };

  return (
    <div className={`map-picker-container ${error ? 'error' : ''}`}>
      <div className="map-controls">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loading || !mapReady}
          className="btn-get-location"
        >
          {loading ? '⏳ Obtendo...' : '📍 Usar Localização Atual'}
        </button>
      </div>

      <div ref={mapRef} style={{ height: '220px', width: '100%', backgroundColor: '#f0f0f0' }} />

      {error && <span className="map-error-message">{error}</span>}
      {locationStatus && <p className="map-status-message">{locationStatus}</p>}
      <p className="map-helper-text">
        Você também pode clicar no mapa para ajustar a localização
      </p>
    </div>
  );
}
