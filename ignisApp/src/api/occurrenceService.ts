// src/api/occurrenceService.ts
import apiClient from './axiosConfig';
// Ajuste o caminho se seus tipos estiverem em outro lugar
import type { OccurrenceCreatePayload, OccurrenceSummary, OccurrenceDetail, OccurrenceUpdatePayload } from '../types/occurrence';

// --- FUNÇÕES DO SERVIÇO COM CHAMADAS REAIS ---

// --- CREATE ---
export const createOccurrence = async (occurrenceData: OccurrenceCreatePayload): Promise<OccurrenceDetail> => {
  try {
    console.log("Chamando API para criar ocorrência:", occurrenceData);
    // Tentativa principal
    const response = await apiClient.post<OccurrenceDetail>('/occurrences', occurrenceData);
    console.log("Resposta da API (Create):", response.data);
    return response.data;
  } catch (error: unknown) {
    // Fallback automático para diferença de prefixo
    if (error && typeof error === 'object' && 'response' in error) {
      const resp = (error as { response?: { status?: number } }).response;
      if (resp?.status === 404) {
        try {
          console.warn('CreateOccurrence: 404 em /occurrences, tentando /api/occurrences');
          const alt = await apiClient.post<OccurrenceDetail>('/api/occurrences', occurrenceData);
          console.log('Resposta da API (Create - fallback):', alt.data);
          return alt.data;
        } catch (fallbackErr) {
          console.error('Erro no fallback /api/occurrences:', fallbackErr);
          throw fallbackErr;
        }
      }
    }
    console.error('Erro ao criar ocorrência:', error);
    throw error;
  }
};

// --- READ (List) ---
export const getOccurrences = async (): Promise<OccurrenceSummary[]> => {
 try {
  console.log("Chamando API para buscar lista de ocorrências...");
  // Chamada real à API (DESCOMENTADA)
  const response = await apiClient.get<OccurrenceSummary[]>('/occurrences');
  console.log("Resposta da API (List):", response.data);
  return response.data;

  /* // Simulação REMOVIDA/COMENTADA
  await new Promise(resolve => setTimeout(resolve, 800));
  const mockOccurrencesList: OccurrenceSummary[] = [ ... ];
  console.log("Simulação: Lista de ocorrências:", mockOccurrencesList);
  return mockOccurrencesList;
  */
 } catch (error: unknown) {
  if (error && typeof error === 'object' && 'response' in error) {
    const resp = (error as { response?: { status?: number } }).response;
    if (resp?.status === 404) {
      try {
        console.warn('getOccurrences: 404 em /occurrences, tentando /api/occurrences');
        const alt = await apiClient.get<OccurrenceSummary[]>('/api/occurrences');
        console.log('Resposta da API (List - fallback):', alt.data);
        return alt.data;
      } catch (fallbackErr) {
        console.error('Erro no fallback GET /api/occurrences:', fallbackErr);
        throw fallbackErr;
      }
    }
  }
  console.error("Erro ao buscar ocorrências:", error);
  throw error;
 }
};

// --- READ (Single) ---
export const getOccurrenceById = async (id: string): Promise<OccurrenceDetail> => {
  try {
  console.log(`Chamando API para buscar ocorrência ID: ${id}`);
  // Chamada real à API (DESCOMENTADA)
  const response = await apiClient.get<OccurrenceDetail>(`/occurrences/${id}`);
  console.log("Resposta da API (Single):", response.data);
  return response.data;

  /* // Simulação REMOVIDA/COMENTADA
  await new Promise(resolve => setTimeout(resolve, 600));
  const mockOccurrencesDetails: { [key: string]: OccurrenceDetail } = { ... };
  const found = mockOccurrencesDetails[id];
  if (!found) throw new Error("Ocorrência não encontrada (simulação)");
  console.log("Simulação: Detalhe da ocorrência:", found);
  return found;
  */
 } catch (error: unknown) {
  if (error && typeof error === 'object' && 'response' in error) {
    const resp = (error as { response?: { status?: number } }).response;
    if (resp?.status === 404) {
      try {
        console.warn(`getOccurrenceById: 404 em /occurrences/${id}, tentando /api/occurrences/${id}`);
        const alt = await apiClient.get<OccurrenceDetail>(`/api/occurrences/${id}`);
        console.log('Resposta da API (Single - fallback):', alt.data);
        return alt.data;
      } catch (fallbackErr) {
        console.error('Erro no fallback GET /api/occurrences/:id:', fallbackErr);
        throw fallbackErr;
      }
    }
  }
  console.error(`Erro ao buscar ocorrência ${id}:`, error);
  throw error;
 }
};

// --- UPDATE ---
export const updateOccurrence = async (id: string, updateData: OccurrenceUpdatePayload): Promise<OccurrenceDetail> => {
 try {
  console.log(`Chamando API para atualizar ocorrência ID: ${id}`, updateData);
  // Chamada real à API (DESCOMENTADA - usando PATCH conforme suas rotas)
  const response = await apiClient.patch<OccurrenceDetail>(`/occurrences/${id}`, updateData);
  console.log("Resposta da API (Update):", response.data);
  return response.data;

  /* // Simulação REMOVIDA/COMENTADA
  await new Promise(resolve => setTimeout(resolve, 400));
  const mockUpdated: OccurrenceDetail = { ... };
  console.log("Simulação: Ocorrência atualizada:", mockUpdated);
  return mockUpdated;
  */
 } catch (error: unknown) {
  if (error && typeof error === 'object' && 'response' in error) {
    const resp = (error as { response?: { status?: number } }).response;
    if (resp?.status === 404) {
      try {
        console.warn(`updateOccurrence: 404 em /occurrences/${id}, tentando /api/occurrences/${id}`);
        const alt = await apiClient.patch<OccurrenceDetail>(`/api/occurrences/${id}`, updateData);
        console.log('Resposta da API (Update - fallback):', alt.data);
        return alt.data;
      } catch (fallbackErr) {
        console.error('Erro no fallback PATCH /api/occurrences/:id:', fallbackErr);
        throw fallbackErr;
      }
    }
  }
  console.error(`Erro ao atualizar ocorrência ${id}:`, error);
  throw error;
 }
};

// --- DELETE / CANCEL ---
 export const cancelOccurrence = async (id: string): Promise<void> => {
 try {
  console.log(`Chamando API para cancelar ocorrência ID: ${id}`);
  // Chamada real à API (DESCOMENTADA - usando PATCH /cancel conforme suas rotas)
  await apiClient.patch(`/occurrences/${id}/cancel`); // PATCH não costuma retornar body, Promise<void> está ok
  console.log("Resposta da API (Cancel): OK");

  /* // Simulação REMOVIDA/COMENTADA
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log("Simulação: Ocorrência cancelada:", id);
  */
 } catch (error: unknown) {
  if (error && typeof error === 'object' && 'response' in error) {
    const resp = (error as { response?: { status?: number } }).response;
    if (resp?.status === 404) {
      try {
        console.warn(`cancelOccurrence: 404 em /occurrences/${id}/cancel, tentando /api/occurrences/${id}/cancel`);
        await apiClient.patch(`/api/occurrences/${id}/cancel`);
        console.log('Resposta da API (Cancel - fallback): OK');
        return;
      } catch (fallbackErr) {
        console.error('Erro no fallback PATCH /api/occurrences/:id/cancel:', fallbackErr);
        throw fallbackErr;
      }
    }
  }
  console.error(`Erro ao cancelar ocorrência ${id}:`, error);
  throw error;
 }
};

// --- FINALIZE ---
export const finalizeOccurrence = async (id: string): Promise<void> => {
  try {
    console.log(`Chamando API para finalizar ocorrência ID: ${id}`);
    await apiClient.patch(`/occurrences/${id}/finalize`);
    console.log('Resposta da API (Finalize): OK');
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const resp = (error as { response?: { status?: number } }).response;
      if (resp?.status === 404) {
        try {
          console.warn(`finalizeOccurrence: 404 em /occurrences/${id}/finalize, tentando /api/occurrences/${id}/finalize`);
          await apiClient.patch(`/api/occurrences/${id}/finalize`);
          console.log('Resposta da API (Finalize - fallback): OK');
          return;
        } catch (fallbackErr) {
          console.error('Erro no fallback PATCH /api/occurrences/:id/finalize:', fallbackErr);
          throw fallbackErr;
        }
      }
    }
    console.error(`Erro ao finalizar ocorrência ${id}:`, error);
    throw error;
  }
};