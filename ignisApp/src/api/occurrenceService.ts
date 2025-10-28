// src/api/occurrenceService.ts
import apiClient from './axiosConfig';
// Ajuste o caminho se seus tipos estiverem em outro lugar
import type { OccurrenceCreatePayload, OccurrenceSummary, OccurrenceDetail, OccurrenceUpdatePayload } from '../types/occurrence';

// --- FUNÇÕES DO SERVIÇO COM CHAMADAS REAIS ---

// --- CREATE ---
export const createOccurrence = async (occurrenceData: OccurrenceCreatePayload): Promise<OccurrenceDetail> => {
 try {
  console.log("Chamando API para criar ocorrência:", occurrenceData);
  // Chamada real à API
  const response = await apiClient.post<OccurrenceDetail>('/occurrences', occurrenceData);
  console.log("Resposta da API (Create):", response.data);
  return response.data;

  /* // Simulação REMOVIDA
  console.log("Simulação: Ocorrência criada:", mockCreatedOccurrence);
  return mockCreatedOccurrence;
  */
 } catch (error) {
  console.error("Erro ao criar ocorrência:", error);
  throw error;
 }
};

// --- READ (List) ---
export const getOccurrences = async (): Promise<OccurrenceSummary[]> => {
 try {
  console.log("Chamando API para buscar lista de ocorrências...");
  // Chamada real à API
  const response = await apiClient.get<OccurrenceSummary[]>('/occurrences');
  console.log("Resposta da API (List):", response.data);
  return response.data;

  /* // Simulação REMOVIDA
  console.log("Simulação: Lista de ocorrências:", mockOccurrencesList);
  return mockOccurrencesList;
  */
 } catch (error) {
  console.error("Erro ao buscar ocorrências:", error);
  throw error;
 }
};

// --- READ (Single) ---
export const getOccurrenceById = async (id: string): Promise<OccurrenceDetail> => {
  try {
  console.log(`Chamando API para buscar ocorrência ID: ${id}`);
  // Chamada real à API
  const response = await apiClient.get<OccurrenceDetail>(`/occurrences/${id}`);
  console.log("Resposta da API (Single):", response.data);
  return response.data;

  /* // Simulação REMOVIDA
   console.log("Simulação: Detalhe da ocorrência:", found);
  return found;
  */
 } catch (error) {
  console.error(`Erro ao buscar ocorrência ${id}:`, error);
  throw error;
 }
};

// --- UPDATE ---
export const updateOccurrence = async (id: string, updateData: OccurrenceUpdatePayload): Promise<OccurrenceDetail> => {
 try {
  console.log(`Chamando API para atualizar ocorrência ID: ${id}`, updateData);
  // Chamada real à API (usando PATCH conforme rotas do back-end)
  const response = await apiClient.patch<OccurrenceDetail>(`/occurrences/${id}`, updateData);
  console.log("Resposta da API (Update):", response.data);
  return response.data;

  /* // Simulação REMOVIDA
  console.log("Simulação: Ocorrência atualizada:", mockUpdated);
  return mockUpdated;
  */
 } catch (error) {
  console.error(`Erro ao atualizar ocorrência ${id}:`, error);
  throw error;
 }
};

// --- DELETE / CANCEL ---
export const cancelOccurrence = async (id: string): Promise<void> => {
 try {
  console.log(`Chamando API para cancelar ocorrência ID: ${id}`);
  // Chamada real à API (usando PATCH /cancel conforme rotas do back-end)
  await apiClient.patch(`/occurrences/${id}/cancel`); // PATCH não costuma retornar body
  console.log("Resposta da API (Cancel): OK");

  /* // Simulação REMOVIDA
  console.log("Simulação: Ocorrência cancelada:", id);
  */
 } catch (error) {
  console.error(`Erro ao cancelar ocorrência ${id}:`, error);
  throw error;
 }
};