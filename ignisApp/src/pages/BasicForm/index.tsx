import { useNavigate } from 'react-router-dom';
import { useBasicForm } from '../../hooks/BasicForm/useBasicForm';
import { MapPicker } from '../../components/MapPicker';
import './style.css'; 

// Opções para o select de Tipo de Ocorrência
const occurrenceTypeOptions = [
  { value: '', label: 'Selecione...' }, // Opção inicial
  { value: 'basic', label: 'Ocorrência Básica' },
  { value: 'pre-hospitalar', label: 'Atendimento Pré Hospitalar' },
  { value: 'incendio', label: 'Atendimento de Incêndio' },
  { value: 'salvamento', label: 'Atendimento de Salvamento' },
  { value: 'produtos-perigosos', label: 'Atendimento de Produtos Perigosos' },
];

export default function BasicForm() {
  const {
    formData, errors, noAddressNumber, setNoAddressNumber,
    handleChange, handleSingleChoiceChange, handleSubmit,
    isSubmitting, setCoordinates
  } = useBasicForm();
  const navigate = useNavigate(); 

  return (
    <div className="basic-form-page">
       <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '10px', fontSize: '18px' }}>Corpo de Bombeiros Militar de Pernambuco</div>
       <div className="form-title">FORMULÁRIO BÁSICO</div>

      <form onSubmit={handleSubmit}>

        {/* --- Fieldset Dados Iniciais --- */}
        <fieldset>
          <legend>Dados Inciais</legend>
          <div className="flex-container">
            {/* Input Nº do Aviso (Gerado Automaticamente) */}
            <div className="flex-item quarter-width">
              <label htmlFor="numAviso">Nº do aviso:</label>
              <input 
                type="text" 
                id="numAviso" 
                name="numAviso" 
                value={formData.numAviso} 
                readOnly 
                disabled
                style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                title="Número gerado automaticamente"
              />
              <small style={{ color: '#666', fontSize: '0.85rem' }}>(Gerado automaticamente)</small>
            </div>
             {/* Input Data */}
            <div className="flex-item quarter-width">
              <label htmlFor="dataRecebimento">Data:</label>
              <input type="date" id="dataRecebimento" name="dataRecebimento" value={formData.dataRecebimento} onChange={handleChange} readOnly disabled={isSubmitting}/>
            </div>
             {/* Input Hora */}
            <div className="flex-item quarter-width">
              <label htmlFor="horaRecebimento"> Hora de recebimento:</label>
              <input type="time" id="horaRecebimento" name="horaRecebimento" value={formData.horaRecebimento} onChange={handleChange} readOnly disabled={isSubmitting}/>
            </div>
            
            {/* === NOVO CAMPO TIPO DE OCORRÊNCIA === */}
            <div className="flex-item quarter-width">
              <label htmlFor="tipoOcorrencia">Tipo de Ocorrência</label>
              <select id="tipoOcorrencia" name="tipoOcorrencia" value={formData.tipoOcorrencia} onChange={handleChange} 
                      className={errors.tipoOcorrencia ? 'input-error' : ''} disabled={isSubmitting}>
                 {occurrenceTypeOptions.map(option => (
                   <option key={option.value} value={option.value}>{option.label}</option>
                 ))}
              </select>
              {errors.tipoOcorrencia && <span className="error-message">{errors.tipoOcorrencia}</span>}
            </div>
            {/* ==================================== */}
          </div>
        </fieldset>

        {/* --- Fieldsets Acionamento e Situação --- */}
        <div className="flex-container">
          <fieldset className="flex-item half-width">
            <legend>Forma de Acionamento</legend>
            <div className="checkbox-group">
              {Object.keys(formData.formaAcionamento).map(key => (
                <label key={key}>
                  <input 
                    type="radio" 
                    name="formaAcionamento"
                    checked={formData.formaAcionamento[key]} 
                    onChange={() => handleSingleChoiceChange('formaAcionamento', key)}
                    disabled={isSubmitting}
                  />
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
                  <input 
                    type="radio" 
                    name="situacaoOcorrencia"
                    checked={formData.situacaoOcorrencia[key]} 
                    onChange={() => handleSingleChoiceChange('situacaoOcorrencia', key)}
                    disabled={isSubmitting}
                  />
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

        {/* --- Fieldset Evento --- */}
        <fieldset>
          <legend>Evento</legend>
          <div className="flex-container">
            <div className="flex-item full-width">
              <label htmlFor="naturezaInicial">Natureza Inicial:</label>
              <textarea 
                id="naturezaInicial" 
                name="naturezaInicial" 
                value={formData.naturezaInicial} 
                onChange={handleChange}
                placeholder="Descreva a natureza da ocorrência..."
                rows={3}
                className={errors.naturezaInicial ? 'input-error' : ''}
                disabled={isSubmitting}
              />
              {errors.naturezaInicial && <span className="error-message">{errors.naturezaInicial}</span>}
            </div>
          </div>
        </fieldset>

        {/* --- Fieldset Endereço --- */}
<fieldset>
           <legend>Endereço</legend>
           {/* Usaremos uma classe grid específica */}
           <div className="address-grid"> 
              {/* Linha 1 */}
              <div className="grid-item span-2"> {/* Ocupa 2 colunas */}
                 <label htmlFor="endRua">Rua:</label>
                 <input type="text" id="endRua" name="endRua" value={formData.endRua} onChange={handleChange} placeholder="Nome da rua" 
                        className={errors.endRua ? 'input-error' : ''} disabled={isSubmitting} />
                 {errors.endRua && <span className="error-message">{errors.endRua}</span>}
              </div>
              <div className="grid-item">
                 <label htmlFor="endNumero">Número:</label>
                 <input type="text" id="endNumero" name="endNumero" value={formData.endNumero} onChange={handleChange} placeholder="Número" 
                        className={errors.endNumero ? 'input-error' : ''}
                        disabled={noAddressNumber || isSubmitting} readOnly={noAddressNumber} />
                 {/* Checkbox S/N vem logo abaixo */}
                 <div className="flex-item-row" style={{ marginTop: '8px', marginBottom: '8px' }}> 
                    <label style={{ marginBottom: 0 }}> {/* Remove margem extra */}
                       <input type="checkbox" checked={noAddressNumber} onChange={(e) => setNoAddressNumber(e.target.checked)} disabled={isSubmitting} />
                       Sem Nº
                    </label>
                 </div>
                 {errors.endNumero && <span className="error-message">{errors.endNumero}</span>}
              </div>
              <div className="grid-item">
                 <label htmlFor="endBairro">Bairro:</label>
                 <input type="text" id="endBairro" name="endBairro" value={formData.endBairro} onChange={handleChange} placeholder="Bairro" 
                        className={errors.endBairro ? 'input-error' : ''} disabled={isSubmitting} />
                 {errors.endBairro && <span className="error-message">{errors.endBairro}</span>}
              </div>

              {/* Linha 2 */}
              <div className="grid-item">
                 <label htmlFor="endMunicipio">Município:</label>
                 <input type="text" id="endMunicipio" name="endMunicipio" value={formData.endMunicipio} onChange={handleChange} placeholder="Município" 
                        className={errors.endMunicipio ? 'input-error' : ''} disabled={isSubmitting} />
                 {errors.endMunicipio && <span className="error-message">{errors.endMunicipio}</span>}
              </div>
              <div className="grid-item span-3"> {/* Ocupa 3 colunas */}
                 <label htmlFor="endReferencia">Ponto de Referência:</label>
                 <input type="text" id="endReferencia" name="endReferencia" value={formData.endReferencia} onChange={handleChange} placeholder="Ponto de referência (opcional)" 
                        disabled={isSubmitting} />
              </div>
           </div>
        </fieldset>

        {/* --- Fieldset Mapa --- */}
        <fieldset>
          <legend>Localização no Mapa</legend>
          <MapPicker
            onLocationSelect={setCoordinates}
            initialLat={formData.latitude || undefined}
            initialLng={formData.longitude || undefined}
            error={errors.latitude || errors.longitude}
          />
        </fieldset>

        {/* --- Fieldset Solicitante (REESTRUTURADO) --- */}
        <fieldset>
           <legend>Solicitante</legend>
           {/* Usaremos outra classe grid específica */}
           <div className="requester-grid"> 
               <div className="grid-item span-2"> {/* Nome ocupa mais espaço */}
                  <label htmlFor="solNome">Nome:</label>
                  <input type="text" id="solNome" name="solNome" value={formData.solNome} onChange={handleChange} placeholder="Nome completo" 
                         className={errors.solNome ? 'input-error' : ''} disabled={isSubmitting} />
                  {errors.solNome && <span className="error-message">{errors.solNome}</span>}
               </div>
               <div className="grid-item">
                  <label htmlFor="solFone">Telefone:</label>
                  <input type="text" id="solFone" name="solFone" value={formData.solFone} onChange={handleChange} placeholder="(00) 00000-0000" 
                         className={errors.solFone ? 'input-error' : ''} disabled={isSubmitting} />
                  {errors.solFone && <span className="error-message">{errors.solFone}</span>}
               </div>
               <div className="grid-item">
                  <label htmlFor="solRelacao">Relação:</label>
                  <input type="text" id="solRelacao" name="solRelacao" value={formData.solRelacao} onChange={handleChange} placeholder="Ex: Proprietário" 
                         className={errors.solRelacao ? 'input-error' : ''} disabled={isSubmitting} />
                  {errors.solRelacao && <span className="error-message">{errors.solRelacao}</span>}
               </div>
           </div>
        </fieldset>

        {/* --- Botões de Ação --- */}
        <div className="form-actions">
          {/* Botão Cancelar agora volta para o Dashboard de Ocorrências */}
          <button type="button" onClick={() => navigate('/occurrences')} className="button-secondary" disabled={isSubmitting}> Cancelar </button> 
          <button type="submit" className="button-primary" disabled={isSubmitting}> {isSubmitting ? 'Salvando...' : 'Salvar e Enviar para Equipe'} </button>
        </div>
      </form>
    </div>
  );
}