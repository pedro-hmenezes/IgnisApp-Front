// src/types/occurrence.ts
// Tipos compartilhados para ocorrências

// Endereço completo (usado em vários lugares)
export interface Address {
  rua: string;
  numero: string;
  bairro: string;
  municipio: string;
  referencia?: string;
}

// Solicitante
export interface Requestor {
  nome: string;
  telefone: string;
  relacao: string;
}

// Tipo base com campos comuns
interface BaseOccurrence {
  _id: string;
  numAviso?: string;
  naturezaInicial: string;
  status: string;
  timestampRecebimento?: string; // ISO String
  formaAcionamento?: string;
  situacaoOcorrencia?: string;
  tipoViatura?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Tipo para o resumo da ocorrência (usado na listagem)
export interface OccurrenceSummary extends BaseOccurrence {
  endereco?: {
    municipio?: string;
    bairro?: string;
    rua?: string;
  };
  horaRecebimento?: string;
}

// Detalhes completos da ocorrência
export interface OccurrenceDetail extends BaseOccurrence {
  enderecoCompleto?: Address;
  endereco?: {  // Mantendo compatibilidade com a API
    municipio?: string;
    bairro?: string;
  };
  horaRecebimento?: string;
  coordenadas?: { latitude?: number; longitude?: number; precisao?: number; timestamp?: string };
  solicitante?: Requestor;
}

// Payload para criar ocorrência
export interface OccurrenceCreatePayload {
  numAviso: string;
  tipoOcorrencia: string;
  timestampRecebimento: string;
  formaAcionamento: string;
  situacaoOcorrencia: string;
  naturezaInicial: string;
  endereco: Address;
  solicitante: Requestor;
}

// Timeline Event (usado em detalhes)
export interface TimelineEvent {
  time: string;
  event: string;
}