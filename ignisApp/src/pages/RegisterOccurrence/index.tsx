// src/pages/RegisterOccurrence/index.tsx
import './style.css';
import { FiPlus, FiArrowLeft } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

// Lista dos tipos de ocorrência
const occurrenceTypes = [
 { id: 'basic', title: 'Ocorrência Básica' },
 { id: 'pre-hospitalar', title: 'Atendimento Pré Hospitalar' },
 { id: 'incendio', title: 'Atendimento de incêndio' },
 { id: 'salvamento', title: 'Atendimento de Salvamento' },
 { id: 'produtos-perigosos', title: 'Atendimento de Produtos Perigosos' },
];

function RegisterOccurrence() {
 const navigate = useNavigate(); // Hook para navegação programática

 return (
  // Classe principal para escopo do CSS
  <div className="register-occurrence-page">

    {/* Botão Voltar posicionado antes do título */}
    <button onClick={() => navigate('/occurrences')} className="back-button">
      <FiArrowLeft /> Voltar ao Painel
    </button>

    {/* Título da página */}
    <h1>Selecione o tipo de ocorrência</h1>

    {/* Grid com os cards de tipo de ocorrência */}
    <div className="type-grid">
      {occurrenceTypes.map((type) => (
        <Link
          to={`/register/new/${type.id}`}
          key={type.id}
          className="type-card"
        >
          <span>{type.title}</span>
          <div className="icon-wrapper">
            <FiPlus />
          </div>
        </Link>
      ))}
    </div>
  </div>
 );
}

export default RegisterOccurrence;