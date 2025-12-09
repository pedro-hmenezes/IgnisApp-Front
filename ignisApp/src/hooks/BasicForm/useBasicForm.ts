import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; // Removido useParams
import { createOccurrence } from '../../api/occurrenceService';
import { useAuth } from '../../contexts/AuthContext';
// Importar tipos da API (ajuste o caminho se necessário)
import type { OccurrenceCreatePayload } from '../../types/occurrence';

// Tipos locais
type Checkgroup = { [key: string]: boolean };
// 1. Adicionar tipoOcorrencia à FormData
type FormData = {
  numAviso: string; dataRecebimento: string; horaRecebimento: string;
  tipoOcorrencia: string; // <<< NOVO CAMPO
  naturezaInicial: string; formaAcionamento: Checkgroup; situacaoOcorrencia: Checkgroup;
  solNome: string; solFone: string; solRelacao: string;
  endRua: string; endNumero: string; endBairro: string; endMunicipio: string; endReferencia: string;
  latitude: number | null;
  longitude: number | null;
};
type FormErrors = { [K in keyof FormData]?: string; };

// Função Helper - formatPhone
const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, (_, ddd, p1, p2) => 
      p2 ? `(${ddd}) ${p1}-${p2}` : p1 ? `(${ddd}) ${p1}` : ddd ? `(${ddd}` : ''
    );
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, (_, ddd, p1, p2) => 
    p2 ? `(${ddd}) ${p1}-${p2}` : `(${ddd}) ${p1}`
  );
};

// Hook Customizado
export function useBasicForm() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  // Removido useParams - o tipo virá do formulário

  const [formData, setFormData] = useState<FormData>({ 
    numAviso: '', 
    dataRecebimento: '', 
    horaRecebimento: '', 
    tipoOcorrencia: '',
    naturezaInicial: '', 
    formaAcionamento: { 
      telefone: false, 
      radioAmador: false, 
      pessoalmente: false, 
      outros: false 
    }, 
    situacaoOcorrencia: { 
      recebida: true, 
      despachada: false, 
      emAtendimento: false, 
      finalizada: false 
    }, 
    solNome: '', 
    solFone: '', 
    solRelacao: '', 
    endRua: '', 
    endNumero: '', 
    endBairro: '', 
    endMunicipio: '', 
    endReferencia: '',
    latitude: null,
    longitude: null,
   });
  const [errors, setErrors] = useState<FormErrors>({});
  const [noAddressNumber, setNoAddressNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect para preencher data, hora e número do aviso automaticamente
  useEffect(() => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].substring(0, 5);
    
    // Gerar número do aviso automaticamente: ANO + TIMESTAMP
    // Formato: 2025 + timestamp_simplificado (ex: 2025001234567)
    const year = now.getFullYear();
    const timestamp = now.getTime().toString().slice(-9); // Últimos 9 dígitos do timestamp
    const numAviso = `${year}${timestamp}`;
    
    setFormData(prev => ({ 
      ...prev, 
      numAviso,
      dataRecebimento: date, 
      horaRecebimento: time 
    }));
  }, []);
  
  // useEffect para lidar com checkbox "S/N" no número do endereço
  useEffect(() => {
    if (noAddressNumber) {
      setFormData(prev => ({ ...prev, endNumero: 'S/N' }));
    } else if (formData.endNumero === 'S/N') {
      setFormData(prev => ({ ...prev, endNumero: '' }));
    }
  }, [noAddressNumber, formData.endNumero]);

  // Handlers (handleChange com máscara, handleSingleChoiceChange - sem mudança)
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => { // Adicionado HTMLSelectElement
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'solFone') { finalValue = formatPhone(value); } 
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (errors[name as keyof FormErrors]) { setErrors(prev => ({ ...prev, [name]: undefined })); }
  };
  const handleSingleChoiceChange = ( 
    groupName: 'formaAcionamento' | 'situacaoOcorrencia', 
    key: string 
  ): void => {
    setFormData(prev => ({
      ...prev,
      [groupName]: Object.keys(prev[groupName]).reduce((acc, k) => {
        acc[k] = k === key;
        return acc;
      }, {} as Checkgroup)
    }));
  };

  // Função de Validação
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.numAviso?.trim()) {
      newErrors.numAviso = 'Número do aviso é obrigatório.';
    }
    
    if (!formData.tipoOcorrencia) {
      newErrors.tipoOcorrencia = 'Tipo de ocorrência é obrigatório.';
    }
    
    if (!formData.naturezaInicial?.trim()) {
      newErrors.naturezaInicial = 'Natureza inicial é obrigatória.';
    }
    
    const hasFormaAcionamento = Object.values(formData.formaAcionamento).some(v => v);
    if (!hasFormaAcionamento) {
      newErrors.formaAcionamento = 'Selecione uma forma de acionamento.';
    }
    
    const hasSituacao = Object.values(formData.situacaoOcorrencia).some(v => v);
    if (!hasSituacao) {
      newErrors.situacaoOcorrencia = 'Selecione uma situação.';
    }
    
    if (!formData.solNome?.trim()) {
      newErrors.solNome = 'Nome do solicitante é obrigatório.';
    }
    
    const digitsInPhone = formData.solFone.replace(/\D/g, '');
    if (!digitsInPhone || digitsInPhone.length < 10) {
      newErrors.solFone = 'Telefone inválido ou incompleto (mín. 10 dígitos).';
    }
    
    if (!formData.endRua?.trim()) {
      newErrors.endRua = 'Rua é obrigatória.';
    }
    
    if (!formData.endBairro?.trim()) {
      newErrors.endBairro = 'Bairro é obrigatório.';
    }
    
    if (!formData.endMunicipio?.trim()) {
      newErrors.endMunicipio = 'Município é obrigatório.';
    }
    
    if (formData.latitude === null || formData.latitude === undefined) {
      newErrors.latitude = 'Latitude é obrigatória. Clique no mapa para selecionar.';
    }
    
    if (formData.longitude === null || formData.longitude === undefined) {
      newErrors.longitude = 'Longitude é obrigatória. Clique no mapa para selecionar.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função handleSubmit (AJUSTADA PARA FORMATAR PAYLOAD)
  const handleSubmit = async (e: FormEvent): Promise<void> => { 
    e.preventDefault();
    if (!validateForm()) {
      alert('Por favor, preencha todos os campos obrigatórios destacados.');
      return; // Interrompe se inválido
    }

    setIsSubmitting(true);

    // --- 3. Formatação do Payload conforme instrução ---
    const pickSelected = (group: { [k: string]: boolean }): string => {
       const found = Object.entries(group).find(([, v]) => v);
       return found ? found[0] : ''; // Retorna a CHAVE selecionada como string
    };

    let timestampRecebimentoISO = '';
    try {
      if (formData.dataRecebimento && formData.horaRecebimento) {
        // Combina data e hora numa string ISO 8601 UTC
        timestampRecebimentoISO = new Date(`${formData.dataRecebimento}T${formData.horaRecebimento}:00`).toISOString(); 
      } else {
         throw new Error("Data ou hora inválida"); // Segurança
      }
    } catch {
       timestampRecebimentoISO = new Date().toISOString(); // Fallback (discutir se é o ideal)
       console.warn("Usando timestamp atual como fallback devido a data/hora inválida no form.");
    }
    
    // Monta o payload para a API (usando tipo OccurrenceCreatePayload)
    const payload: OccurrenceCreatePayload = {
      numAviso: formData.numAviso.trim(),
      tipoOcorrencia: formData.tipoOcorrencia, // Vem do novo campo <select>
      timestampRecebimento: timestampRecebimentoISO, // Envia string ISO
      formaAcionamento: pickSelected(formData.formaAcionamento), // Envia string
      situacaoOcorrencia: pickSelected(formData.situacaoOcorrencia), // Envia string
      naturezaInicial: formData.naturezaInicial.trim(),
      latitude: formData.latitude!, // Garantido pela validação
      longitude: formData.longitude!, // Garantido pela validação
      endereco: { 
        rua: formData.endRua.trim(), 
        numero: formData.endNumero.trim(), // 'S/N' já está tratado
        bairro: formData.endBairro.trim(), 
        municipio: formData.endMunicipio.trim(), 
        referencia: formData.endReferencia?.trim() || undefined, // Envia undefined se vazio
       },
      solicitante: { 
        nome: formData.solNome.trim(), 
        telefone: formData.solFone.replace(/\D/g, ''), // Envia só dígitos
        relacao: formData.solRelacao.trim(), 
       },
      criadoPor: userId || '', // Vem do AuthContext
    };
    // --- Fim da Formatação ---

    // Chama API
    try {
      await createOccurrence(payload); 
      alert('Ocorrência registrada com sucesso!');
      navigate('/occurrences'); 
    } catch (apiError: unknown) {
      console.error('Falha ao criar ocorrência:', apiError);
      let errorMessage = 'Erro desconhecido';
      if (apiError && typeof apiError === 'object') {
        if ('response' in apiError && apiError.response && typeof apiError.response === 'object') {
          const response = apiError.response as { data?: { message?: string }; status?: number; statusText?: string; config?: { url?: string } };
          const statusPart = response.status ? `[${response.status}] ` : '';
          const urlPart = response.config?.url ? ` (${response.config.url})` : '';
          errorMessage = `${statusPart}${response.data?.message || response.statusText || errorMessage}${urlPart}`;
        } else if ('message' in apiError && typeof apiError.message === 'string') {
          errorMessage = apiError.message;
        }
      }
      alert(`Erro ao salvar a ocorrência: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para atualizar latitude e longitude (chamada pelo mapa)
  const setCoordinates = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
    // Limpar erro de coordenadas se existir
    if (errors.latitude || errors.longitude) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.latitude;
        delete newErrors.longitude;
        return newErrors;
      });
    }
  };

  // Retorno do Hook
  return {
    formData,
    errors,
    noAddressNumber,
    setNoAddressNumber,
    isSubmitting,
    handleChange,
    handleSingleChoiceChange,
    handleSubmit,
    setCoordinates,
  };
}