// src/pages/RegisterOccurrence/index.tsx
import './style.css';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom'; // Usaremos Link para a navegação

// Lista dos tipos de ocorrência
const occurrenceTypes = [
  { id: 'basic', title: 'Ocorrência Básica' },
  { id: 'pre-hospitalar', title: 'Atendimento Pré Hospitalar' },
  { id: 'incendio', title: 'Atendimento de incêndio' },
  { id: 'salvamento', title: 'Atendimento de Salvamento' },
  { id: 'produtos-perigosos', title: 'Atendimento de Produtos Perigosos' },
];

function RegisterOccurrence() {
  return (
    <div className="register-container">
      <h1>Selecione o tipo de ocorrência</h1>
      
      <div className="type-grid">
        {occurrenceTypes.map((type) => (
          // Cada card será um link para o próximo passo do formulário
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