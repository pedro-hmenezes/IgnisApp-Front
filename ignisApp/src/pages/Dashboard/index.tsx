import { useDashboardStats } from '../../hooks/useDashboardStats';
import { FiLoader, FiAlertCircle, FiActivity, FiCheckCircle, FiXCircle, FiTrendingUp } from 'react-icons/fi';
import './style.css';

export default function Dashboard() {
  const stats = useDashboardStats();

  if (stats.loading) {
    return (
      <div className="dashboard-loading">
        <FiLoader className="spinner" size={40} />
        <p>Carregando estatísticas...</p>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="dashboard-error">
        <FiAlertCircle size={40} />
        <p>{stats.error}</p>
      </div>
    );
  }

  // Preparar dados para gráfico de pizza (status)
  const statusData = [
    { name: 'Em Atendimento', value: stats.emAtendimento, color: '#f59e0b' },
    { name: 'Finalizadas', value: stats.finalizadas, color: '#10b981' },
    { name: 'Canceladas', value: stats.canceladas, color: '#ef4444' },
  ].filter(item => item.value > 0);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard de Ocorrências</h1>
        <p className="dashboard-subtitle">Visão geral e estatísticas do sistema</p>
      </div>

      {/* Cards de Métricas */}
      <div className="metrics-grid">
        <div className="metric-card total">
          <div className="metric-icon">
            <FiActivity size={32} />
          </div>
          <div className="metric-content">
            <h3>Total de Ocorrências</h3>
            <p className="metric-value">{stats.total}</p>
          </div>
        </div>

        <div className="metric-card em-atendimento">
          <div className="metric-icon">
            <FiTrendingUp size={32} />
          </div>
          <div className="metric-content">
            <h3>Em Atendimento</h3>
            <p className="metric-value">{stats.emAtendimento}</p>
            <span className="metric-percentage">
              {stats.total > 0 ? ((stats.emAtendimento / stats.total) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>

        <div className="metric-card finalizadas">
          <div className="metric-icon">
            <FiCheckCircle size={32} />
          </div>
          <div className="metric-content">
            <h3>Finalizadas</h3>
            <p className="metric-value">{stats.finalizadas}</p>
            <span className="metric-percentage">
              {stats.total > 0 ? ((stats.finalizadas / stats.total) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>

        <div className="metric-card canceladas">
          <div className="metric-icon">
            <FiXCircle size={32} />
          </div>
          <div className="metric-content">
            <h3>Canceladas</h3>
            <p className="metric-value">{stats.canceladas}</p>
            <span className="metric-percentage">
              {stats.total > 0 ? ((stats.canceladas / stats.total) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Seção de Gráficos */}
      <div className="charts-grid">
        {/* Gráfico: Distribuição por Status */}
        <div className="chart-card">
          <h3 className="chart-title">Distribuição por Status</h3>
          <div className="chart-container">
            {statusData.length > 0 ? (
              <div className="simple-pie-chart">
                {statusData.map((item, index) => (
                  <div key={index} className="pie-item">
                    <div className="pie-bar" style={{ width: `${(item.value / stats.total) * 100}%`, backgroundColor: item.color }} />
                    <div className="pie-label">
                      <span className="pie-color" style={{ backgroundColor: item.color }} />
                      <span className="pie-name">{item.name}</span>
                      <span className="pie-value">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="chart-empty">Nenhum dado disponível</p>
            )}
          </div>
        </div>

        {/* Gráfico: Top Municípios */}
        <div className="chart-card">
          <h3 className="chart-title">Ocorrências por Município (Top 10)</h3>
          <div className="chart-container">
            {stats.porMunicipio.length > 0 ? (
              <div className="bar-chart">
                {stats.porMunicipio.map((item, index) => {
                  const maxValue = Math.max(...stats.porMunicipio.map(m => m.total));
                  const percentage = (item.total / maxValue) * 100;
                  return (
                    <div key={index} className="bar-item">
                      <div className="bar-label">{item.nome}</div>
                      <div className="bar-container">
                        <div className="bar-fill" style={{ width: `${percentage}%` }} />
                        <span className="bar-value">{item.total}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="chart-empty">Nenhum dado disponível</p>
            )}
          </div>
        </div>

        {/* Gráfico: Linha do Tempo (últimos 30 dias) */}
        <div className="chart-card chart-wide">
          <h3 className="chart-title">Ocorrências nos Últimos 30 Dias</h3>
          <div className="chart-container">
            {stats.porDia.length > 0 ? (
              <div className="line-chart">
                {stats.porDia.map((item, index) => {
                  const maxValue = Math.max(...stats.porDia.map(d => d.total));
                  const height = maxValue > 0 ? (item.total / maxValue) * 100 : 0;
                  const date = new Date(item.data);
                  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
                  
                  return (
                    <div key={index} className="line-item" title={`${item.data}: ${item.total} ocorrências`}>
                      <div className="line-bar-container">
                        <div className="line-bar" style={{ height: `${height}%` }}>
                          <span className="line-value">{item.total}</span>
                        </div>
                      </div>
                      <div className="line-label">{formattedDate}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="chart-empty">Nenhum dado disponível</p>
            )}
          </div>
        </div>
      </div>

      {/* Resumo Rápido */}
      <div className="summary-section">
        <h3>Resumo Rápido</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <strong>Taxa de Conclusão:</strong>
            <span>{stats.total > 0 ? ((stats.finalizadas / stats.total) * 100).toFixed(1) : 0}%</span>
          </div>
          <div className="summary-item">
            <strong>Taxa de Cancelamento:</strong>
            <span>{stats.total > 0 ? ((stats.canceladas / stats.total) * 100).toFixed(1) : 0}%</span>
          </div>
          <div className="summary-item">
            <strong>Em Andamento:</strong>
            <span>{stats.recebidas + stats.emAtendimento}</span>
          </div>
          <div className="summary-item">
            <strong>Município Mais Ativo:</strong>
            <span>{stats.porMunicipio[0]?.nome || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
