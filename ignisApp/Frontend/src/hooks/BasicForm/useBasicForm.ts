// src/hooks/BasicForm/useBasicForm.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Tipos para os novos campos de checkbox
type CheckboxGroup = { [key: string]: boolean };

// Este tipo definirá todos os campos do nosso formulário
type FormData = {
  numAviso: string;
  dataRecebimento: string;
  horaRecebimento: string;
  naturezaInicial: string;
  formaAcionamento: CheckboxGroup;
  situacaoOcorrencia: CheckboxGroup;
  solNome: string;
  solFone: string;
  solRelacao: string;
  endRua: string;
  endNumero: string;
  endBairro: string;
  endMunicipio: string;
  endReferencia: string;
};

// Tipo para o estado de erros
type FormErrors = {
  [K in keyof FormData]?: string; 
};

// === NOVA FUNÇÃO DE MÁSCARA (SEM BIBLIOTECA) ===
// Esta função aplica a máscara de telefone (BR)
const formatPhone = (value: string): string => {
  if (!value) return "";
  
  // 1. Remove tudo que não é dígito
  let digits = value.replace(/\D/g, '');

  // 2. Limita a 11 dígitos (DD + 9 + NNNNNNNN)
  digits = digits.substring(0, 11);

  // 3. Aplica a formatação dinamicamente
  if (digits.length <= 2) {
    // (DD
    return `(${digits}`;
  } 
  if (digits.length <= 6) {
    // (DD) NNNN
    return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
  } 
  if (digits.length <= 10) {
    // (DD) NNNN-NNNN (Telefone fixo ou celular antigo)
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}`;
  }
  // (DD) 9NNNN-NNNN (Celular com 9º dígito)
  return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`;
};
// ===============================================

// Este é o nosso Hook Customizado
export function useBasicForm() {
  const navigate = useNavigate();

  // Todos os estados que tínhamos antes
  const [formData, setFormData] = useState<FormData>({
    // ... (seu estado inicial - sem mudança)
    numAviso: '',
    dataRecebimento: '',
    horaRecebimento: '',
    naturezaInicial: '',
    formaAcionamento: {
      co_grupamento: false, ciods: false, pessoalmente: false,
      '193': false, '24h': false, outros: false,
    },
    situacaoOcorrencia: {
      recebida: true, nao_atendida_trote: false, cancelada: false,
      sem_atuacao: false, atendida: false,
    },
    solNome: '',
    solFone: '',
    solRelacao: '',
    endRua: '',
    endNumero: '',
    endBairro: '',
    endMunicipio: '',
    endReferencia: '',
  });
  const [errors, setErrors] = useState<FormErrors>({}); 
  const [noAddressNumber, setNoAddressNumber] = useState(false);

  // Todos os useEffects que tínhamos (sem mudança)
  useEffect(() => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].substring(0, 5);
    setFormData(prev => ({ ...prev, dataRecebimento: date, horaRecebimento: time }));
  }, []);

  useEffect(() => {
    if (noAddressNumber) {
      setFormData(prev => ({ ...prev, endNumero: 'S/N' }));
      setErrors(prev => ({ ...prev, endNumero: undefined }));
    } else {
      if (formData.endNumero === 'S/N') {
        setFormData(prev => ({ ...prev, endNumero: '' }));
      }
    }
  }, [noAddressNumber, formData.endNumero]); 

  // === handleChange ATUALIZADO (com máscara) ===
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let finalValue = value;
    
    // Se o campo for 'solFone', aplica a máscara
    if (name === 'solFone') {
      finalValue = formatPhone(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue, // Salva o valor formatado
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  // ==============================================
  
  const handleSingleChoiceChange = (
    groupName: 'formaAcionamento' | 'situacaoOcorrencia', 
    key: string
  ) => {
    // ... (Sua lógica aqui - sem mudança)
    setFormData(prev => {
      const newGroupState = { ...prev[groupName] };
      Object.keys(newGroupState).forEach(k => { newGroupState[k] = false; });
      newGroupState[key] = true;
      return { ...prev, [groupName]: newGroupState };
    });
    if (errors[groupName]) {
      setErrors(prev => ({ ...prev, [groupName]: undefined }));
    }
  };

  // === validateForm ATUALIZADA (lógica do telefone) ===
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.numAviso) newErrors.numAviso = "O N° do aviso é obrigatório.";
    if (!formData.naturezaInicial) newErrors.naturezaInicial = "A natureza é obrigatória.";
    if (!formData.solNome) newErrors.solNome = "O nome do solicitante é obrigatório.";

    // Lógica de validação do telefone atualizada
    const phoneDigits = formData.solFone.replace(/\D/g, ''); // Pega só os dígitos
    if (!phoneDigits) {
      newErrors.solFone = "O fone do solicitante é obrigatório.";
    } else if (phoneDigits.length < 10) {
      // Mínimo de 10 dígitos (DD + NNNN-NNNN)
      newErrors.solFone = "O número de telefone está incompleto.";
    }

    if (!formData.solRelacao) newErrors.solRelacao = "A relação é obrigatória.";
    if (!formData.endRua) newErrors.endRua = "A rua é obrigatória.";
    if (!formData.endBairro) newErrors.endBairro = "O bairro é obrigatório.";
    if (!formData.endMunicipio) newErrors.endMunicipio = "O município é obrigatório.";
    
    if (!formData.endNumero && !noAddressNumber) {
      newErrors.endNumero = "O N° é obrigatório ou marque 'Sem número'.";
    }

    if (!Object.values(formData.formaAcionamento).some(val => val)) {
      newErrors.formaAcionamento = "Selecione uma forma de acionamento.";
    }
    if (!Object.values(formData.situacaoOcorrencia).some(val => val)) {
      newErrors.situacaoOcorrencia = "Selecione uma situação.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // =================================================

  const handleSubmit = (e: React.FormEvent) => {
    // ... (Sua lógica aqui - sem mudança)
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      console.log("Formulário (Etapa 1) salvo localmente:", formData);
      alert("Ocorrência 'Recebida' registrada. Próximo passo: Equipe de Campo.");
      navigate('/register');
    } else {
      console.log("Validação falhou:", errors);
      alert("Por favor, preencha todos os campos obrigatórios destacados.");
    }
  };

  // O Hook retorna tudo (sem mudança)
  return {
    formData,
    errors,
    noAddressNumber,
    setNoAddressNumber,
    handleChange,
    handleSingleChoiceChange,
    handleSubmit
  };
}