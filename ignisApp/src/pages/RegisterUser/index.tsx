import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUserPlus, FiLoader } from 'react-icons/fi';
import { createUser } from '../../api/userService';
import './style.css'; 

// Tipos (UserFormData, UserFormErrors) - Sem mudança
type UserFormData = {
  name: string; email: string; role: 'operador' | 'major' | 'administrador';
  password: string; confirmPassword?: string; 
};
type UserFormErrors = { [K in keyof UserFormData]?: string; };

export default function RegisterUser() {
  const navigate = useNavigate();
  // Estados (formData, errors, isSubmitting, apiError) - Sem mudança
  const [formData, setFormData] = useState<UserFormData>({ name: '', email: '', role: 'operador', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Handler handleChange - Sem mudança
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof UserFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // --- Validação Front-end Simples ---
  const validateForm = (): boolean => {
    const newErrors: UserFormErrors = {};
    if (!formData.name) newErrors.name = 'Nome é obrigatório.';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido.';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // --- Fim Validação ---

  // === handleSubmit ATUALIZADO para chamar createUser ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    
    // 1. Validar
    if (!validateForm()) {
      alert("Por favor, corrija os erros no formulário.");
      return; 
    }

    setIsSubmitting(true); // Inicia loading

    // 2. Montar Payload (excluindo confirmPassword)
    const payload = { 
        name: formData.name, 
        email: formData.email, 
        role: formData.role, 
        password: formData.password 
    };
    console.log("Dados a serem enviados para API:", { ...payload, password: '***' }); // Log sem senha

    // 3. Chamar API via Service (com try...catch)
    try {
        await createUser(payload); // Chama a função do userService
        alert('Usuário cadastrado com sucesso! (Simulação)');
        // Decide para onde navegar após sucesso
        // Ex: Voltar para home, ir para lista de usuários, etc.
        navigate('/'); // Exemplo: volta para home
  } catch (error: unknown) {
    console.error("Erro ao cadastrar usuário:", error);
    let message = 'Falha ao cadastrar usuário. Tente novamente.';
        if (typeof error === 'object' && error !== null) {
          const errObj = error as { response?: { data?: { message?: string } }; message?: string };
          message = errObj?.response?.data?.message ?? errObj?.message ?? message;
        }
    setApiError(message);
    alert(`Erro: ${message}`);
    } finally {
        setIsSubmitting(false); // Finaliza loading
    }
  };
  // ===================================================

  // --- Renderização JSX (sem grandes mudanças, exceto talvez o botão voltar) ---
  return (
    <div className="register-user-page"> 
      
      {/* Botão Voltar pode ir para onde a lista de usuários estará, ou home */}
      <button onClick={() => navigate('/')} className="back-button"> 
        <FiArrowLeft /> Voltar para Início
      </button>

      <h1>Cadastro de Novo Usuário</h1>
      <p>Preencha os dados abaixo para criar um novo acesso.</p>

      <div className="form-card"> 
        <form onSubmit={handleSubmit}>
          {/* Campo Nome */}
          <div className="input-group">
            <label htmlFor="name">Nome Completo</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} 
                   placeholder="Digite o nome completo" className={errors.name ? 'input-error' : ''} disabled={isSubmitting} />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Campo Email */}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} 
                   placeholder="exemplo@email.com" className={errors.email ? 'input-error' : ''} disabled={isSubmitting} />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Campo Perfil (Role) */}
          <div className="input-group">
            <label htmlFor="role">Perfil de Acesso</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} disabled={isSubmitting}>
              <option value="operador">Operador (Central/Campo)</option>
              <option value="major">Major (Chefe/Supervisor)</option> 
              <option value="administrador">Administrador</option>
            </select>
          </div>
          
          {/* Campo Senha */}
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} 
                   placeholder="Mínimo 6 caracteres" className={errors.password ? 'input-error' : ''} disabled={isSubmitting} />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Campo Confirmar Senha */}
           <div className="input-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} 
                   placeholder="Repita a senha" className={errors.confirmPassword ? 'input-error' : ''} disabled={isSubmitting} />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {/* Mensagem de Erro da API */}
          {apiError && <p className="error-message api-error">{apiError}</p>}

          {/* Botão de Envio */}
          <div className="form-actions">
             <button type="submit" className="button-primary" disabled={isSubmitting}>
              {isSubmitting ? <><FiLoader className="spinner-inline" /> Cadastrando...</> : <><FiUserPlus /> Cadastrar Usuário</>}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}