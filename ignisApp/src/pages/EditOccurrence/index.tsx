import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOccurrenceById, updateOccurrence } from '../../api/occurrenceService';
import type { OccurrenceDetail, OccurrenceUpdatePayload, Address } from '../../types/occurrence';
import '../BasicForm/style.css';

// Tipos locais reaproveitados do BasicForm
 type Checkgroup = { [key: string]: boolean };
 type FormData = {
  numAviso: string; dataRecebimento: string; horaRecebimento: string;
  tipoOcorrencia: string;
  naturezaInicial: string; formaAcionamento: Checkgroup; situacaoOcorrencia: Checkgroup;
  solNome: string; solFone: string; solRelacao: string;
  endRua: string; endNumero: string; endBairro: string; endMunicipio: string; endReferencia: string;
 };
 type FormErrors = { [K in keyof FormData]?: string };

 const occurrenceTypeOptions = [
  { value: '', label: 'Selecione...' },
  { value: 'basic', label: 'Ocorrência Básica' },
  { value: 'pre-hospitalar', label: 'Atendimento Pré Hospitalar' },
  { value: 'incendio', label: 'Atendimento de Incêndio' },
  { value: 'salvamento', label: 'Atendimento de Salvamento' },
  { value: 'produtos-perigosos', label: 'Atendimento de Produtos Perigosos' },
 ];

 const maskPhone = (digits: string) => {
  const v = digits.replace(/\D/g, '');
  if (v.length <= 10) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, (_m, a, b, c) => c ? `(${a}) ${b}-${c}` : b ? `(${a}) ${b}` : a ? `(${a}` : '');
  return v.replace(/(\d{2})(\d{5})(\d{0,4})/, (_m, a, b, c) => c ? `(${a}) ${b}-${c}` : `(${a}) ${b}`);
 };

 export default function EditOccurrence() {
  const { occurrenceId } = useParams<{ occurrenceId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [noAddressNumber, setNoAddressNumber] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!occurrenceId) { setError('ID inválido'); setLoading(false); return; }
      try {
        const occ = await getOccurrenceById(occurrenceId);
        setFormData(mapOccurrenceToForm(occ));
        const endereco = (occ as unknown as { endereco?: Address }).endereco || occ.enderecoCompleto;
        setNoAddressNumber((endereco?.numero || '') === 'S/N');
      } catch (e) {
        console.error('Falha ao carregar ocorrência:', e);
        setError('Falha ao carregar dados da ocorrência');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [occurrenceId]);

  const mapOccurrenceToForm = (o: OccurrenceDetail): FormData => {
    // timestampRecebimento pode vir em "timestampRecebimento" ou horaRecebimento; preferimos o ISO
    const iso = (o.timestampRecebimento || o.createdAt || new Date().toISOString()).toString();
    const d = new Date(iso);
    const dataRecebimento = d.toISOString().split('T')[0];
    const horaRecebimento = d.toTimeString().substring(0, 5);

    const forma = (o.formaAcionamento || '').toString();
    const situacao = (o.situacaoOcorrencia || o.statusGeral || o.status || 'recebida').toString().toLowerCase();

    // Backend usa 'endereco' como objeto Address
    const endereco = (o as unknown as { endereco?: Address }).endereco || o.enderecoCompleto;

    return {
      numAviso: o.numAviso || '',
      dataRecebimento,
      horaRecebimento,
      tipoOcorrencia: (o as unknown as { tipoOcorrencia?: string }).tipoOcorrencia || '',
      naturezaInicial: o.naturezaInicial || '',
      formaAcionamento: {
        telefone: forma === 'telefone',
        radioAmador: forma === 'radioAmador',
        pessoalmente: forma === 'pessoalmente',
        outros: forma === 'outros',
      },
      situacaoOcorrencia: {
        recebida: situacao === 'recebida',
        despachada: situacao === 'despachada',
        emAtendimento: situacao === 'em andamento' || situacao === 'emAtendimento' || situacao === 'ematendimento',
        finalizada: situacao === 'finalizada',
      },
      solNome: o.solicitante?.nome || '',
      solFone: maskPhone(o.solicitante?.telefone || ''),
      solRelacao: o.solicitante?.relacao || '',
      endRua: endereco?.rua || '',
      endNumero: endereco?.numero || '',
      endBairro: endereco?.bairro || '',
      endMunicipio: endereco?.municipio || '',
      endReferencia: endereco?.referencia || '',
    };
  };

  const pickSelected = (group: { [k: string]: boolean }): string => {
    const found = Object.entries(group).find(([, v]) => v);
    return found ? found[0] : '';
  };

  const validate = (): boolean => {
    if (!formData) return false;
    const e: FormErrors = {};
    if (!formData.numAviso.trim()) e.numAviso = 'Número do aviso é obrigatório.';
    if (!formData.tipoOcorrencia) e.tipoOcorrencia = 'Tipo de ocorrência é obrigatório.';
    if (!formData.naturezaInicial.trim()) e.naturezaInicial = 'Natureza inicial é obrigatória.';
    if (!Object.values(formData.formaAcionamento).some(Boolean)) e.formaAcionamento = 'Selecione uma forma de acionamento.';
    if (!Object.values(formData.situacaoOcorrencia).some(Boolean)) e.situacaoOcorrencia = 'Selecione uma situação.';
    if (!formData.endRua.trim()) e.endRua = 'Rua é obrigatória.';
    if (!formData.endBairro.trim()) e.endBairro = 'Bairro é obrigatório.';
    if (!formData.endMunicipio.trim()) e.endMunicipio = 'Município é obrigatório.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    const v = name === 'solFone' ? maskPhone(value) : value;
    setFormData(prev => prev ? { ...prev, [name]: v } as FormData : prev);
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSingleChoiceChange = (
    groupName: 'formaAcionamento' | 'situacaoOcorrencia',
    key: string,
  ) => {
    if (!formData) return;
    setFormData(prev => {
      if (!prev) return prev;
      const next: FormData = { ...prev };
      next[groupName] = Object.keys(prev[groupName]).reduce((acc: Checkgroup, k) => {
        acc[k] = k === key; return acc;
      }, {} as Checkgroup);
      return next;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !occurrenceId) return;
    if (!validate()) { alert('Por favor, corrija os campos destacados.'); return; }

    setSaving(true);
    try {
      const timestampRecebimentoISO = new Date(`${formData.dataRecebimento}T${formData.horaRecebimento}:00`).toISOString();
      const payload: OccurrenceUpdatePayload = {
        numAviso: formData.numAviso.trim(),
        tipoOcorrencia: formData.tipoOcorrencia,
        timestampRecebimento: timestampRecebimentoISO,
        formaAcionamento: pickSelected(formData.formaAcionamento),
        situacaoOcorrencia: pickSelected(formData.situacaoOcorrencia),
        naturezaInicial: formData.naturezaInicial.trim(),
        endereco: {
          rua: formData.endRua.trim(),
          numero: formData.endNumero.trim(),
          bairro: formData.endBairro.trim(),
          municipio: formData.endMunicipio.trim(),
          referencia: formData.endReferencia?.trim() || undefined,
        },
        solicitante: {
          nome: formData.solNome.trim(),
          telefone: formData.solFone.replace(/\D/g, ''),
          relacao: formData.solRelacao.trim(),
        },
      } as OccurrenceUpdatePayload;

      await updateOccurrence(occurrenceId, payload);
      alert('Ocorrência atualizada com sucesso!');
      navigate(`/ongoing/${occurrenceId}`);
    } catch (err) {
      console.error('Falha ao atualizar ocorrência:', err);
      alert('Erro ao atualizar a ocorrência.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Carregando formulário...</div>;
  if (error) return <div style={{ padding: 24, color: 'crimson' }}>{error}</div>;
  if (!formData) return null;

  return (
    <div className="basic-form-page">
      <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 10, fontSize: 18 }}>Corpo de Bombeiros Militar de Pernambuco</div>
      <div className="form-title">EDITAR OCORRÊNCIA</div>

      <form onSubmit={onSubmit}>
        <fieldset>
          <legend>Dados Inciais</legend>
          <div className="flex-container">
            <div className="flex-item quarter-width">
              <label htmlFor="numAviso">Nº do aviso:</label>
              <input type="text" id="numAviso" name="numAviso" value={formData.numAviso} onChange={handleChange} className={errors.numAviso ? 'input-error' : ''} disabled={saving} />
              {errors.numAviso && <span className="error-message">{errors.numAviso}</span>}
            </div>
            <div className="flex-item quarter-width">
              <label htmlFor="dataRecebimento">Data:</label>
              <input type="date" id="dataRecebimento" name="dataRecebimento" value={formData.dataRecebimento} onChange={handleChange} readOnly disabled={saving} />
            </div>
            <div className="flex-item quarter-width">
              <label htmlFor="horaRecebimento">Hora de recebimento:</label>
              <input type="time" id="horaRecebimento" name="horaRecebimento" value={formData.horaRecebimento} onChange={handleChange} readOnly disabled={saving} />
            </div>
            <div className="flex-item quarter-width">
              <label htmlFor="tipoOcorrencia">Tipo de Ocorrência</label>
              <select id="tipoOcorrencia" name="tipoOcorrencia" value={formData.tipoOcorrencia} onChange={handleChange} className={errors.tipoOcorrencia ? 'input-error' : ''} disabled={saving}>
                {occurrenceTypeOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </select>
              {errors.tipoOcorrencia && <span className="error-message">{errors.tipoOcorrencia}</span>}
            </div>
          </div>
        </fieldset>

        <div className="flex-container">
          <fieldset className="flex-item half-width">
            <legend>Forma de Acionamento</legend>
            <div className="checkbox-group">
              {Object.keys(formData.formaAcionamento).map(key => (
                <label key={key}>
                  <input type="radio" name="formaAcionamento" checked={formData.formaAcionamento[key as keyof typeof formData.formaAcionamento] as boolean} onChange={() => handleSingleChoiceChange('formaAcionamento', key)} disabled={saving} />
                  {key === 'telefone' && 'Telefone'}
                  {key === 'radioAmador' && 'Rádio Amador'}
                  {key === 'pessoalmente' && 'Pessoalmente'}
                  {key === 'outros' && 'Outros'}
                </label>
              ))}
            </div>
            {errors.formaAcionamento && <span className="error-message">{errors.formaAcionamento}</span>}
          </fieldset>

          <fieldset className="flex-item half-width">
            <legend>Situação da Ocorrência</legend>
            <div className="checkbox-group">
              {Object.keys(formData.situacaoOcorrencia).map(key => (
                <label key={key}>
                  <input type="radio" name="situacaoOcorrencia" checked={formData.situacaoOcorrencia[key as keyof typeof formData.situacaoOcorrencia] as boolean} onChange={() => handleSingleChoiceChange('situacaoOcorrencia', key)} disabled={saving} />
                  {key === 'recebida' && 'Recebida'}
                  {key === 'despachada' && 'Despachada'}
                  {key === 'emAtendimento' && 'Em Atendimento'}
                  {key === 'finalizada' && 'Finalizada'}
                </label>
              ))}
            </div>
            {errors.situacaoOcorrencia && <span className="error-message">{errors.situacaoOcorrencia}</span>}
          </fieldset>
        </div>

        <fieldset>
          <legend>Evento</legend>
          <div className="flex-container">
            <div className="flex-item full-width">
              <label htmlFor="naturezaInicial">Natureza Inicial:</label>
              <textarea id="naturezaInicial" name="naturezaInicial" value={formData.naturezaInicial} onChange={handleChange} rows={3} className={errors.naturezaInicial ? 'input-error' : ''} disabled={saving} />
              {errors.naturezaInicial && <span className="error-message">{errors.naturezaInicial}</span>}
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Endereço</legend>
          <div className="address-grid">
            <div className="grid-item span-2">
              <label htmlFor="endRua">Rua:</label>
              <input type="text" id="endRua" name="endRua" value={formData.endRua} onChange={handleChange} className={errors.endRua ? 'input-error' : ''} disabled={saving} />
              {errors.endRua && <span className="error-message">{errors.endRua}</span>}
            </div>
            <div className="grid-item">
              <label htmlFor="endNumero">Número:</label>
              <input type="text" id="endNumero" name="endNumero" value={formData.endNumero} onChange={handleChange} className={errors.endNumero ? 'input-error' : ''} disabled={saving || noAddressNumber} readOnly={noAddressNumber} />
              <div className="flex-item-row" style={{ marginTop: 8, marginBottom: 8 }}>
                <label style={{ marginBottom: 0 }}>
                  <input type="checkbox" checked={noAddressNumber} onChange={(e) => setNoAddressNumber(e.target.checked)} disabled={saving} />
                  Sem Nº
                </label>
              </div>
              {errors.endNumero && <span className="error-message">{errors.endNumero}</span>}
            </div>
            <div className="grid-item">
              <label htmlFor="endBairro">Bairro:</label>
              <input type="text" id="endBairro" name="endBairro" value={formData.endBairro} onChange={handleChange} className={errors.endBairro ? 'input-error' : ''} disabled={saving} />
              {errors.endBairro && <span className="error-message">{errors.endBairro}</span>}
            </div>
            <div className="grid-item">
              <label htmlFor="endMunicipio">Município:</label>
              <input type="text" id="endMunicipio" name="endMunicipio" value={formData.endMunicipio} onChange={handleChange} className={errors.endMunicipio ? 'input-error' : ''} disabled={saving} />
              {errors.endMunicipio && <span className="error-message">{errors.endMunicipio}</span>}
            </div>
            <div className="grid-item span-3">
              <label htmlFor="endReferencia">Ponto de Referência:</label>
              <input type="text" id="endReferencia" name="endReferencia" value={formData.endReferencia} onChange={handleChange} disabled={saving} />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Solicitante</legend>
          <div className="requester-grid">
            <div className="grid-item span-2">
              <label htmlFor="solNome">Nome:</label>
              <input type="text" id="solNome" name="solNome" value={formData.solNome} onChange={handleChange} className={errors.solNome ? 'input-error' : ''} disabled={saving} />
              {errors.solNome && <span className="error-message">{errors.solNome}</span>}
            </div>
            <div className="grid-item">
              <label htmlFor="solFone">Telefone:</label>
              <input type="text" id="solFone" name="solFone" value={formData.solFone} onChange={handleChange} className={errors.solFone ? 'input-error' : ''} disabled={saving} />
              {errors.solFone && <span className="error-message">{errors.solFone}</span>}
            </div>
            <div className="grid-item">
              <label htmlFor="solRelacao">Relação:</label>
              <input type="text" id="solRelacao" name="solRelacao" value={formData.solRelacao} onChange={handleChange} className={errors.solRelacao ? 'input-error' : ''} disabled={saving} />
              {errors.solRelacao && <span className="error-message">{errors.solRelacao}</span>}
            </div>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(`/ongoing/${occurrenceId}`)} className="button-secondary" disabled={saving}>Voltar</button>
          <button type="submit" className="button-primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar Alterações'}</button>
        </div>
      </form>
    </div>
  );
 }
