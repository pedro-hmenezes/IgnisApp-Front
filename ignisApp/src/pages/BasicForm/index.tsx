// src/pages/BasicForm/index.tsx
import { useNavigate } from 'react-router-dom';
import { useBasicForm } from '../../hooks/BasicForm/useBasicForm';
import './style.css'; // O CSS continua o mesmo

export default function BasicForm() {
  // 2. Chame o Hook para pegar toda a lógica, estados e funções
  const {
    formData,
    errors,
    noAddressNumber,
    setNoAddressNumber,
    handleChange,
    handleSingleChoiceChange,
    handleSubmit
  } = useBasicForm();

  const navigate = useNavigate();

  // 3. O JSX permanece exatamente o mesmo, mas agora está limpo e focado!
  return (
    <div className="basic-form-page">
      <div className="header-info">
      </div>
      <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '10px', fontSize: '18px' }}>Corpo de Bombeiros Militar de Pernambuco</div>

      <div className="form-title">FORMULÁRIO BÁSICO</div>

      {/* O handleSubmit vem do nosso hook */}
      <form onSubmit={handleSubmit}>

        <fieldset>
          <legend>Dados Inciais</legend>
          <div className="flex-container">
            <div className="flex-item quarter-width">
              <label htmlFor="numAviso">Nº do aviso: (NETDISPATCHER)</label>
              {/* Todos os valores, classes e handlers vêm do nosso hook */}
              <input type="text" id="numAviso" name="numAviso" value={formData.numAviso} onChange={handleChange} placeholder="Ex: 2025001234" 
                     className={errors.numAviso ? 'input-error' : ''} />
              {errors.numAviso && <span className="error-message">{errors.numAviso}</span>}
            </div>
            <div className="flex-item quarter-width">
              <label htmlFor="dataRecebimento">Data:</label>
              <input type="date" id="dataRecebimento" name="dataRecebimento" value={formData.dataRecebimento} onChange={handleChange} readOnly />
            </div>
            <div className="flex-item quarter-width">
              <label htmlFor="horaRecebimento"> Hora de recebimento:</label>
              <input type="time" id="horaRecebimento" name="horaRecebimento" value={formData.horaRecebimento} onChange={handleChange} readOnly />
            </div>
          </div>
        </fieldset>
        
        <div className="flex-container">
          <fieldset className={`half-width ${errors.formaAcionamento ? 'fieldset-error' : ''}`}>
            <legend>Forma de Acionamento</legend>
            <div className="checkbox-group flex-container">
              <label><input type="checkbox" checked={formData.formaAcionamento.co_grupamento} onChange={() => handleSingleChoiceChange('formaAcionamento', 'co_grupamento')} /> CO do Grupamento</label>
              <label><input type="checkbox" checked={formData.formaAcionamento.ciods} onChange={() => handleSingleChoiceChange('formaAcionamento', 'ciods')} /> CIODS</label>
              <label><input type="checkbox" checked={formData.formaAcionamento.pessoalmente} onChange={() => handleSingleChoiceChange('formaAcionamento', 'pessoalmente')} /> Pessoalmente</label>
              <label><input type="checkbox" checked={formData.formaAcionamento['193']} onChange={() => handleSingleChoiceChange('formaAcionamento', '193')} /> 193</label>
              <label><input type="checkbox" checked={formData.formaAcionamento['24h']} onChange={() => handleSingleChoiceChange('formaAcionamento', '24h')} /> 24h</label>
              <label><input type="checkbox" checked={formData.formaAcionamento.outros} onChange={() => handleSingleChoiceChange('formaAcionamento', 'outros')} /> Outros</label>
            </div>
            {errors.formaAcionamento && <span className="error-message">{errors.formaAcionamento}</span>}
          </fieldset>
          
          <fieldset className={`half-width ${errors.situacaoOcorrencia ? 'fieldset-error' : ''}`}>
            <legend>Situação da ocorrência</legend>
            <div className="checkbox-group flex-container">
              <label><input type="checkbox" checked={formData.situacaoOcorrencia.recebida} onChange={() => handleSingleChoiceChange('situacaoOcorrencia', 'recebida')} /> <b>Recebida</b></label>
              <label><input type="checkbox" checked={formData.situacaoOcorrencia.nao_atendida_trote} onChange={() => handleSingleChoiceChange('situacaoOcorrencia', 'nao_atendida_trote')} /> Não atendida: Trote</label>
              <label><input type="checkbox" checked={formData.situacaoOcorrencia.cancelada} onChange={() => handleSingleChoiceChange('situacaoOcorrencia', 'cancelada')} /> Cancelada</label>
              <label><input type="checkbox" checked={formData.situacaoOcorrencia.sem_atuacao} onChange={() => handleSingleChoiceChange('situacaoOcorrencia', 'sem_atuacao')} /> Sem atuação</label>
              <label><input type="checkbox" checked={formData.situacaoOcorrencia.atendida} onChange={() => handleSingleChoiceChange('situacaoOcorrencia', 'atendida')} /> Atendida</label>
            </div>
            {errors.situacaoOcorrencia && <span className="error-message">{errors.situacaoOcorrencia}</span>}
          </fieldset>
        </div>

        <fieldset>
          <legend>Evento</legend>
          <div className="flex-item">
            <label htmlFor="naturezaInicial">Natureza Inicial do Aviso:</label>
            <input type="text" id="naturezaInicial" name="naturezaInicial" value={formData.naturezaInicial} onChange={handleChange}
                   className={`full-width ${errors.naturezaInicial ? 'input-error' : ''}`} placeholder="Ex: Incêndio em residência, atropelamento..." />
            {errors.naturezaInicial && <span className="error-message">{errors.naturezaInicial}</span>}
          </div>
        </fieldset>

        <fieldset>
          <legend>Endereço</legend>
          <div className="flex-container" style={{ alignItems: 'flex-end' }}>
            <div className="flex-item" style={{ flex: 3 }}>
              <label htmlFor="endRua">Rua Avenida:</label>
              <input type="text" id="endRua" name="endRua" value={formData.endRua} onChange={handleChange} placeholder="Ex: Av. Boa Viagem" 
                     className={errors.endRua ? 'input-error' : ''} />
              {errors.endRua && <span className="error-message">{errors.endRua}</span>}
            </div>
            <div className="flex-item" style={{ flex: 1 }}>
              <label htmlFor="endNumero">Nº</label>
              <input type="text" id="endNumero" name="endNumero" value={formData.endNumero} onChange={handleChange} placeholder="Ex: 123" 
                     className={errors.endNumero ? 'input-error' : ''}
                     disabled={noAddressNumber}
                     readOnly={noAddressNumber} />
            </div>
          </div>
          
          <div className="flex-item-row" style={{ marginTop: '10px' }}>
            <label>
              <input type="checkbox" checked={noAddressNumber} onChange={(e) => setNoAddressNumber(e.target.checked)} />
              Sem número (S/N)
            </label>
          </div>
          {errors.endNumero && <span className="error-message">{errors.endNumero}</span>}

          <div className="flex-container" style={{ marginTop: 10 }}>
            <div className="flex-item third-width">
              <label htmlFor="endBairro">Bairro:</label>
              <input type="text" id="endBairro" name="endBairro" value={formData.endBairro} onChange={handleChange} placeholder="Ex: Boa Viagem" 
                     className={errors.endBairro ? 'input-error' : ''} />
              {errors.endBairro && <span className="error-message">{errors.endBairro}</span>}
            </div>
            <div className="flex-item third-width">
              <label htmlFor="endMunicipio">Municipio</label>
              <input type="text" id="endMunicipio" name="endMunicipio" value={formData.endMunicipio} onChange={handleChange} placeholder="Ex: Recife" 
                     className={errors.endMunicipio ? 'input-error' : ''} />
              {errors.endMunicipio && <span className="error-message">{errors.endMunicipio}</span>}
            </div>
          </div>
          <div className="flex-container" style={{ marginTop: 10 }}>
            <div className="flex-item half-width">
              <label htmlFor="endReferencia">Referência:</label>
              <input type="text" id="endReferencia" name="endReferencia" value={formData.endReferencia} onChange={handleChange} placeholder="Ex: Próximo à padaria, esquina com..." />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Solicitante</legend>
          <div className="flex-container">
            <div className="flex-item" style={{ flex: 2 }}>
              <label htmlFor="solNome">Nome</label>
              <input type="text" id="solNome" name="solNome" value={formData.solNome} onChange={handleChange} placeholder="Ex: Maria da Silva" 
                     className={errors.solNome ? 'input-error' : ''} />
              {errors.solNome && <span className="error-message">{errors.solNome}</span>}
            </div>
            <div className="flex-item" style={{ flex: 1 }}>
              <label htmlFor="solFone">Fone</label>
              <input type="text" id="solFone" name="solFone" value={formData.solFone} onChange={handleChange} placeholder="Ex: (81) 99999-1234" 
                     className={errors.solFone ? 'input-error' : ''} />
              {errors.solFone && <span className="error-message">{errors.solFone}</span>}
            </div>
            <div className="flex-item" style={{ flex: 1 }}>
              <label htmlFor="solRelacao">Relação</label>
              <input type="text" id="solRelacao" name="solRelacao" value={formData.solRelacao} onChange={handleChange} placeholder="Ex: Vítima ou Testemunha" 
                     className={errors.solRelacao ? 'input-error' : ''} />
              {errors.solRelacao && <span className="error-message">{errors.solRelacao}</span>}
            </div>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/register')} className="button-secondary">Cancelar</button>
          <button type="submit" className="button-primary">Salvar e Enviar para Equipe</button>
        </div>
      </form>
    </div>
  );
}