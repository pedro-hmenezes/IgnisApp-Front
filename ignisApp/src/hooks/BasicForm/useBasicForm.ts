// src/hooks/BasicForm/useBasicForm.ts
import { useState, useEffect } from 'react';
// 1. Importar tipos explicitamente
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createOccurrence } from '../../api/occurrenceService';

// Tipos (CheckboxGroup, FormData, FormErrors) - Sem mudança
type Checkgroup = { [key: string]: boolean };
type FormData = {
  numAviso: string; dataRecebimento: string; horaRecebimento: string;
  naturezaInicial: string; formaAcionamento: Checkgroup; situacaoOcorrencia: Checkgroup;
  solNome: string; solFone: string; solRelacao: string;
  endRua: string; endNumero: string; endBairro: string; endMunicipio: string; endReferencia: string;
};
type FormErrors = { [K in keyof FormData]?: string; };

// Função Helper - formata telefone removendo caracteres não numéricos e aplicando máscara simples
const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  // Formatos comuns: (DD) 9XXXX-XXXX ou (DD) XXXX-XXXX
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (rest.length <= 8) return `(${ddd}) ${rest.slice(0, rest.length - 4)}-${rest.slice(-4)}`;
  // celular com 9 dígitos
  return `(${ddd}) ${rest.slice(0, rest.length - 4)}-${rest.slice(-4)}`;
};

// Hook Customizado
export function useBasicForm() {
  const navigate = useNavigate();
  const { typeId } = useParams<{ typeId: string }>(); 

  // Estados - Sem mudança na inicialização, o erro ts(2345) pode ser um falso positivo se a estrutura estiver correta.
  const [formData, setFormData] = useState<FormData>({ 
    numAviso: '', dataRecebimento: '', horaRecebimento: '', naturezaInicial: '', 
    formaAcionamento: { co_grupamento: false, ciods: false, pessoalmente: false, '193': false, '24h': false, outros: false, }, 
    situacaoOcorrencia: { recebida: true, nao_atendida_trote: false, cancelada: false, sem_atuacao: false, atendida: false, }, 
    solNome: '', solFone: '', solRelacao: '', endRua: '', endNumero: '', endBairro: '', endMunicipio: '', endReferencia: '', 
   });
  const [errors, setErrors] = useState<FormErrors>({});
  const [noAddressNumber, setNoAddressNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffects - Sem mudança
  useEffect(() => {
    // Preenche dataRecebimento e horaRecebimento com o momento atual na montagem do componente
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`; // formato ISO date para inputs type=date
    const timeStr = `${hours}:${minutes}`;
    setFormData(prev => ({ ...prev, dataRecebimento: dateStr, horaRecebimento: timeStr }));
  }, []);

  useEffect(() => {
    // Quando marcar S/N, coloca 'S/N' em endNumero; quando desmarcar, limpa se ainda for 'S/N'
    if (noAddressNumber) {
      setFormData(prev => ({ ...prev, endNumero: 'S/N' }));
    } else {
      setFormData(prev => ({ ...prev, endNumero: prev.endNumero === 'S/N' ? '' : prev.endNumero }));
    }
  }, [noAddressNumber]);

  // Handlers - Adicionado tipo de retorno : void
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => { // <--- CORREÇÃO 2 e 5 (Return Type)
    const { name, value } = e.target; // 'value' É usado nas linhas seguintes
    let finalValue = value;
    if (name === 'solFone') { finalValue = formatPhone(value); } 
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (errors[name as keyof FormErrors]) { setErrors(prev => ({ ...prev, [name]: undefined })); }
  };
  
  const handleSingleChoiceChange = ( groupName: 'formaAcionamento' | 'situacaoOcorrencia', key: string ): void => { // <--- CORREÇÃO 4 e 5 (Return Type)
    // groupName e key SÃO usados aqui
    setFormData(prev => {
      const newGroupState = { ...prev[groupName] };
      Object.keys(newGroupState).forEach(k => { newGroupState[k] = false; });
      newGroupState[key] = true;
      return { ...prev, [groupName]: newGroupState };
    });
    if (errors[groupName]) { setErrors(prev => ({ ...prev, [groupName]: undefined })); }
  };

  // Função de Validação
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Exemplo de validações básicas
    if (!formData.numAviso || formData.numAviso.trim() === '') {
      newErrors.numAviso = 'Número do aviso é obrigatório.';
    }

    if (!formData.naturezaInicial || formData.naturezaInicial.trim() === '') {
      newErrors.naturezaInicial = 'Natureza inicial é obrigatória.';
    }

    if (!Object.values(formData.formaAcionamento).some(val => val)) {
      newErrors.formaAcionamento = 'Selecione uma forma de acionamento.';
    }

    if (!Object.values(formData.situacaoOcorrencia).some(val => val)) {
      newErrors.situacaoOcorrencia = 'Selecione uma situação.';
    }

    if (!formData.solNome || formData.solNome.trim() === '') {
      newErrors.solNome = 'Nome do solicitante é obrigatório.';
    }

    const digitsInPhone = formData.solFone.replace(/\D/g, '');
    if (!digitsInPhone || digitsInPhone.length < 8) {
      newErrors.solFone = 'Telefone inválido ou incompleto.';
    }

    if (!formData.endRua || formData.endRua.trim() === '') {
      newErrors.endRua = 'Rua é obrigatória.';
    }

    if (!formData.endMunicipio || formData.endMunicipio.trim() === '') {
      newErrors.endMunicipio = 'Município é obrigatório.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função handleSubmit - Adicionado tipo de retorno : Promise<void>
  const handleSubmit = async (e: FormEvent): Promise<void> => { // <--- Boa prática adicionar tipo de retorno async
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      setIsSubmitting(true);
        // Monta o payload conforme OccurrenceCreatePayload definido em occurrenceService
        const pickSelected = (group: { [k: string]: boolean }): string => {
          const found = Object.entries(group).find(([, v]) => v);
          return found ? found[0] : '';
        };

        // Combina data + hora em um timestamp ISO
        let timestampRecebimento = '';
        try {
          if (formData.dataRecebimento) {
            const timePart = formData.horaRecebimento ? `${formData.horaRecebimento}:00` : '00:00:00';
            const iso = new Date(`${formData.dataRecebimento}T${timePart}`);
            timestampRecebimento = iso.toISOString();
          }
        } catch {
          timestampRecebimento = new Date().toISOString();
        }

        const payload = {
          numAviso: formData.numAviso,
          tipoOcorrencia: typeId ?? '',
          timestampRecebimento,
          formaAcionamento: pickSelected(formData.formaAcionamento),
          situacaoOcorrencia: pickSelected(formData.situacaoOcorrencia),
          naturezaInicial: formData.naturezaInicial,
          endereco: { rua: formData.endRua, numero: formData.endNumero, bairro: formData.endBairro, municipio: formData.endMunicipio, referencia: formData.endReferencia },
          solicitante: { nome: formData.solNome, telefone: formData.solFone, relacao: formData.solRelacao }
        };

      try {
        await createOccurrence(payload);
        console.log('Ocorrência criada com sucesso');
        alert('Ocorrência registrada com sucesso!');
        navigate('/occurrences');
      } catch (apiError) {
        console.error('Falha ao criar ocorrência:', apiError);
        alert('Erro ao salvar a ocorrência. Tente novamente.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('Validação falhou:', errors);
      alert('Por favor, preencha todos os campos obrigatórios destacados.');
    }
  };

  // Retorno do Hook - Sem mudança
  return {
    formData, errors, noAddressNumber, setNoAddressNumber,
    handleChange, handleSingleChoiceChange, handleSubmit,
    isSubmitting
  };
}