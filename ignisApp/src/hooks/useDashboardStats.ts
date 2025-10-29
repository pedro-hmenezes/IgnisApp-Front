import { useState, useEffect } from 'react';
import { getOccurrences } from '../api/occurrenceService';

export interface DashboardStats {
  total: number;
  recebidas: number;
  emAtendimento: number;
  finalizadas: number;
  canceladas: number;
  porMunicipio: Array<{ nome: string; total: number }>;
  porDia: Array<{ data: string; total: number }>;
  loading: boolean;
  error: string | null;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    recebidas: 0,
    emAtendimento: 0,
    finalizadas: 0,
    canceladas: 0,
    porMunicipio: [],
    porDia: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const occurrences = await getOccurrences();
        
        // Contadores por status (normalizado para minúsculo)
        let recebidas = 0;
        let emAtendimento = 0;
        let finalizadas = 0;
        let canceladas = 0;
        
        // Map para agrupar por município
        const municipioMap = new Map<string, number>();
        
        // Map para agrupar por dia
        const diaMap = new Map<string, number>();
        
        occurrences.forEach((occ) => {
          const status = (occ.statusGeral || occ.status || 'recebida').toLowerCase().trim();
          
          // Debug: ver todos os status recebidos
          console.log('Status encontrado:', status, 'na ocorrência:', occ._id);
          
          // Contagem por status (normalizando variações)
          if (status === 'recebida') {
            recebidas++;
          } else if (
            status === 'em andamento' || 
            status === 'emandamento' || 
            status === 'ematendimento' || 
            status === 'em atendimento' || 
            status === 'despachada'
          ) {
            emAtendimento++;
          } else if (status === 'finalizada') {
            finalizadas++;
          } else if (status === 'cancelada') {
            canceladas++;
          } else {
            // Logar status desconhecidos
            console.warn('Status não reconhecido:', status, 'para ocorrência:', occ._id);
          }
          
          // Contagem por município
          const municipio = occ.endereco?.municipio || 'Não informado';
          municipioMap.set(municipio, (municipioMap.get(municipio) || 0) + 1);
          
          // Contagem por dia (extrair apenas a data)
          if (occ.timestampRecebimento) {
            try {
              const data = new Date(occ.timestampRecebimento).toISOString().split('T')[0];
              diaMap.set(data, (diaMap.get(data) || 0) + 1);
            } catch {
              // Ignora timestamps inválidos
            }
          }
        });
        
        // Converter maps em arrays e ordenar
        const porMunicipio = Array.from(municipioMap.entries())
          .map(([nome, total]) => ({ nome, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 10); // Top 10 municípios
        
        const porDia = Array.from(diaMap.entries())
          .map(([data, total]) => ({ data, total }))
          .sort((a, b) => a.data.localeCompare(b.data)) // Ordenar por data
          .slice(-30); // Últimos 30 dias
        
        setStats({
          total: occurrences.length,
          recebidas,
          emAtendimento,
          finalizadas,
          canceladas,
          porMunicipio,
          porDia,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Erro ao buscar estatísticas:', err);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Falha ao carregar estatísticas',
        }));
      }
    };
    
    fetchStats();
  }, []);
  
  return stats;
}
