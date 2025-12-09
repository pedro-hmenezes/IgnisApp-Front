import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { 
  FiClock, FiThermometer, FiFileText, FiMap, FiActivity,
  FiCheckCircle, FiLoader
} from 'react-icons/fi';
import './style.css'; 

function Home() {
  const { isAuthenticated } = useAuth(); 
  const navigate = useNavigate();
  const stats = useDashboardStats();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Atualizar relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Buscar temperatura (usando API pública do OpenWeatherMap)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Coordenadas de Recife, PE (pode ser ajustado)
        const lat = -8.0476;
        const lon = -34.877;
        const apiKey = ''; // API key pode ser adicionada aqui
        
        // Se não tiver API key, usar valor mock
        if (!apiKey) {
          setTimeout(() => {
            setTemperature(28 + Math.random() * 4); // Mock: 28-32°C
            setWeatherLoading(false);
          }, 1000);
          return;
        }

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();
        setTemperature(data.main.temp);
        setWeatherLoading(false);
      } catch (error) {
        console.error('Erro ao buscar temperatura:', error);
        setTemperature(29); // Fallback
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bom Dia';
    if (hour < 18) return 'Boa Tarde';
    return 'Boa Noite';
  };

  if (!isAuthenticated) {
    return (
      <div className="home-container">
        <h1>Bem-vindo ao Ignis</h1>
        <p>Por favor, faça login para acessar o sistema.</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Header com Relógio e Temperatura */}
      <div className="home-header">
        <div className="greeting-section">
          <h1>Olá, {getGreeting()}!</h1>
          <p className="welcome-text">Bem-vindo ao painel de gestão de ocorrências</p>
        </div>
        
        <div className="clock-weather-section">
          <div className="clock-card">
            <FiClock size={24} />
            <div className="clock-info">
              <div className="time">{formatTime(currentTime)}</div>
              <div className="date">{formatDate(currentTime)}</div>
            </div>
          </div>
          
          <div className="weather-card">
            <FiThermometer size={24} />
            <div className="weather-info">
              {weatherLoading ? (
                <FiLoader className="spinner-inline" size={20} />
              ) : (
                <div className="temperature">{temperature?.toFixed(1)}°C</div>
              )}
              <div className="location">Recife, PE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">
            <FiFileText size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.loading ? '...' : stats.total}</div>
            <div className="stat-label">Total de Ocorrências</div>
          </div>
        </div>

        <div className="stat-card stat-active">
          <div className="stat-icon">
            <FiActivity size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.loading ? '...' : stats.emAtendimento}</div>
            <div className="stat-label">Em Atendimento</div>
          </div>
        </div>

        <div className="stat-card stat-completed">
          <div className="stat-icon">
            <FiCheckCircle size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.loading ? '...' : stats.finalizadas}</div>
            <div className="stat-label">Finalizadas</div>
          </div>
        </div>
      </div>

      {/* Atalhos Rápidos */}
      <div className="quick-actions-section">
        <h2>Atalhos Rápidos</h2>
        <div className="quick-actions-grid">
          <button 
            className="quick-action-card action-new"
            onClick={() => navigate('/occurrences/new')}
          >
            <FiFileText size={32} />
            <span>Nova Ocorrência</span>
          </button>

          <button 
            className="quick-action-card action-list"
            onClick={() => navigate('/occurrences')}
          >
            <FiActivity size={32} />
            <span>Ocorrências Ativas</span>
          </button>

          <button 
            className="quick-action-card action-map"
            onClick={() => navigate('/map')}
          >
            <FiMap size={32} />
            <span>Ver Mapa</span>
          </button>

          <button 
            className="quick-action-card action-reports"
            onClick={() => navigate('/reports')}
          >
            <FiCheckCircle size={32} />
            <span>Relatórios</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;