// src/api/occurrenceService.ts
import apiClient from './axiosConfig';
import type { OccurrenceCreatePayload, OccurrenceSummary, OccurrenceDetail } from '../types/occurrence';

// Tipo genérico para dados de atualização (pode refinar depois)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OccurrenceUpdatePayload = Record<string, any>;


// --- FUNÇÕES DO SERVIÇO COM TIPAGEM ---

// Temporário para evitar erro de apiClient não usado
console.log('API Client instance (for debugging):', apiClient); 


// --- CREATE ---
export const createOccurrence = async (occurrenceData: OccurrenceCreatePayload): Promise<OccurrenceDetail> => { // Retorna o detalhe da ocorrência criada
  try {
    console.log("Chamando API para criar ocorrência:", occurrenceData);
    // const response = await apiClient.post<OccurrenceDetail>('/occurrences', occurrenceData); // Espera OccurrenceDetail como resposta
    // console.log("Resposta da API (Create):", response.data);
    // return response.data; 

    // Simulação:
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockCreatedOccurrence: OccurrenceDetail = { // Usa o tipo OccurrenceDetail
        ...occurrenceData, // Inclui dados enviados
        _id: `MOCK_${Date.now()}`, 
        status: 'Recebida', // Define status inicial
        createdAt: new Date().toISOString()
        // Preencha outros campos necessários do OccurrenceDetail se o mock precisar
    };
    console.log("Simulação: Ocorrência criada:", mockCreatedOccurrence);
    return mockCreatedOccurrence; 

  } catch (error) {
    console.error("Erro ao criar ocorrência:", error);
    throw error; 
  }
};

// --- READ (List) ---
export const getOccurrences = async (): Promise<OccurrenceSummary[]> => { // Retorna array de OccurrenceSummary
  try {
    console.log("Chamando API para buscar lista de ocorrências...");
    // const response = await apiClient.get<OccurrenceSummary[]>('/occurrences'); // Espera array de OccurrenceSummary
    // console.log("Resposta da API (List):", response.data);
    // return response.data;

    // Simulação: Tipando o array mock
    await new Promise(resolve => setTimeout(resolve, 800)); 
    const mockOccurrencesList: OccurrenceSummary[] = [ // Usa o tipo OccurrenceSummary[]
      { _id: 'OCC-001', naturezaInicial: 'Incêndio em Residência', status: 'Em Deslocamento', horaRecebimento: '14:52', endereco: { municipio: 'Recife' } },
      { _id: 'OCC-002', naturezaInicial: 'Atropelamento', status: 'Aguardando Equipe', horaRecebimento: '15:10', endereco: { municipio: 'Recife' } },
      { _id: 'OCC-004', naturezaInicial: 'Vazamento de Gás', status: 'Finalizada', horaRecebimento: '10:30', endereco: { municipio: 'Recife' } }
    ];
    console.log("Simulação: Lista de ocorrências:", mockOccurrencesList);
    return mockOccurrencesList;

  } catch (error) {
    console.error("Erro ao buscar ocorrências:", error);
    throw error;
  }
};

// --- READ (Single) ---
export const getOccurrenceById = async (id: string): Promise<OccurrenceDetail> => { // Retorna OccurrenceDetail
   try {
    console.log(`Chamando API para buscar ocorrência ID: ${id}`);
    // const response = await apiClient.get<OccurrenceDetail>(`/occurrences/${id}`); // Espera OccurrenceDetail
    // console.log("Resposta da API (Single):", response.data);
    // return response.data;

    // Simulação:
    await new Promise(resolve => setTimeout(resolve, 600)); 
    // Mock completo para detalhes (ajuste conforme necessário)
    const mockOccurrencesDetails: { [key: string]: OccurrenceDetail } = { 
        'OCC-001': { _id: 'OCC-001', naturezaInicial: 'Incêndio em Residência', status: 'Em Deslocamento', horaRecebimento: '14:52', tipoViatura: 'VT-0845', enderecoCompleto: { rua: 'Rua Augusta', numero: '123', bairro: 'Casa Amarela', municipio: 'Recife' }, solicitante: { nome: 'Maria', telefone: '81999991111', relacao: 'Vizinha'} },
        'OCC-002': { _id: 'OCC-002', naturezaInicial: 'Atropelamento', status: 'Aguardando Equipe', horaRecebimento: '15:10', tipoViatura: 'UR-1234', enderecoCompleto: { rua: 'Av. Boa Viagem', numero: '456', bairro: 'Boa Viagem', municipio: 'Recife' }, solicitante: { nome: 'João', telefone: '81988882222', relacao: 'Testemunha'} },
        'OCC-004': { _id: 'OCC-004', naturezaInicial: 'Vazamento de Gás', status: 'Finalizada', horaRecebimento: '10:30', tipoViatura: 'ABT-9999', enderecoCompleto: { rua: 'Rua da Aurora', numero: '101', bairro: 'Boa Vista', municipio: 'Recife' }, solicitante: { nome: 'Carlos', telefone: '81977773333', relacao: 'Morador'} }
    };
    const found = mockOccurrencesDetails[id];
    if (!found) throw new Error("Ocorrência não encontrada (simulação)");
     console.log("Simulação: Detalhe da ocorrência:", found);
    return found;

  } catch (error) {
    console.error(`Erro ao buscar ocorrência ${id}:`, error);
    throw error;
  }
};

// --- UPDATE ---
export const updateOccurrence = async (id: string, updateData: OccurrenceUpdatePayload): Promise<OccurrenceDetail> => { // Retorna a ocorrência atualizada
  try {
    console.log(`Chamando API para atualizar ocorrência ID: ${id}`, updateData);
    // const response = await apiClient.put<OccurrenceDetail>(`/occurrences/${id}`, updateData); // Espera OccurrenceDetail
    // console.log("Resposta da API (Update):", response.data);
    // return response.data;

    // Simulação:
    await new Promise(resolve => setTimeout(resolve, 400));
    // Simula a atualização - idealmente buscaria o mock original e mesclaria
    const mockUpdated: OccurrenceDetail = { _id: id, naturezaInicial: 'Natureza Atualizada', status: 'Status Atualizado', ...updateData, updatedAt: new Date().toISOString() };
    console.log("Simulação: Ocorrência atualizada:", mockUpdated);
    return mockUpdated;

  } catch (error) {
     console.error(`Erro ao atualizar ocorrência ${id}:`, error);
    throw error;
  }
};

// --- DELETE / CANCEL ---
 export const cancelOccurrence = async (id: string): Promise<void> => { // Não retorna nada
  try {
    console.log(`Chamando API para cancelar ocorrência ID: ${id}`);
    // await apiClient.delete(`/occurrences/${id}`); 
    // console.log("Resposta da API (Cancel): OK");

    // Simulação:
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log("Simulação: Ocorrência cancelada:", id);

  } catch (error) {
     console.error(`Erro ao cancelar ocorrência ${id}:`, error);
    throw error;
  }
};