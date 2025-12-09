import { useState, useEffect } from 'react';
import { FiUserPlus, FiEdit2, FiTrash2, FiLoader, FiAlertCircle, FiFilter, FiX, FiSave } from 'react-icons/fi';
import { getUsers, createUser, updateUser, deleteUser } from '../../api/userService';
import type { User, UserUpdatePayload } from '../../api/userService';
import './style.css';

interface UserFormData {
  name: string;
  email: string;
  role: 'operador' | 'major' | 'administrador';
  password: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para filtros
  const [roleFilter, setRoleFilter] = useState<'all' | 'operador' | 'major' | 'administrador'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para modal de criação/edição
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'operador',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Carregar usuários
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('Falha ao carregar usuários. Tente recarregar a página.');
      console.error('Erro buscando usuários:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Aplicar filtros
  const filteredUsers = users
    .filter(user => {
      // Filtro por role
      if (roleFilter !== 'all' && user.role !== roleFilter) return false;
      
      // Filtro por busca (nome ou email)
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
        );
      }
      
      return true;
    });

  // Contadores por role
  const operadorCount = users.filter(u => u.role === 'operador').length;
  const majorCount = users.filter(u => u.role === 'major').length;
  const adminCount = users.filter(u => u.role === 'administrador').length;

  // Abrir modal para criar
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingUserId(null);
    setFormData({ name: '', email: '', role: 'operador', password: '' });
    setFormErrors({});
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleOpenEditModal = (user: User) => {
    setModalMode('edit');
    setEditingUserId(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '' // Senha vazia = não alterar
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: '', email: '', role: 'operador', password: '' });
    setFormErrors({});
    setEditingUserId(null);
  };

  // Validar formulário
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) errors.email = 'Email é obrigatório';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email inválido';
    
    // Senha obrigatória apenas na criação
    if (modalMode === 'create' && !formData.password) {
      errors.password = 'Senha é obrigatória';
    }
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (modalMode === 'create') {
        // Criar novo usuário
        await createUser({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password
        });
        alert('Usuário cadastrado com sucesso!');
      } else {
        // Atualizar usuário existente
        if (!editingUserId) return;
        
        const updatePayload: UserUpdatePayload = {
          name: formData.name,
          email: formData.email,
          role: formData.role
        };
        
        // Só enviar senha se foi preenchida
        if (formData.password) {
          updatePayload.password = formData.password;
        }
        
        await updateUser(editingUserId, updatePayload);
        alert('Usuário atualizado com sucesso!');
      }
      
      // Recarregar lista e fechar modal
      await fetchUsers();
      handleCloseModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar usuário';
      alert(errorMessage);
      console.error('Erro ao salvar usuário:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Deletar usuário
  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${userName}"?`)) return;

    try {
      await deleteUser(userId);
      alert('Usuário excluído com sucesso!');
      await fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir usuário';
      alert(errorMessage);
      console.error('Erro ao deletar usuário:', err);
    }
  };

  // Traduzir role para português
  const translateRole = (role: string): string => {
    const roles: Record<string, string> = {
      'operador': 'Usuário Operacional',
      'major': 'Major/Supervisor',
      'administrador': 'Administrador'
    };
    return roles[role] || role;
  };

  // Formatar data
  const formatDate = (date?: string | Date): string => {
    if (!date) return '--';
    try {
      return new Date(date).toLocaleDateString('pt-BR');
    } catch {
      return '--';
    }
  };

  return (
    <div className="user-management">
      <div className="management-header">
        <h1>Gestão de Usuários</h1>
        <button onClick={handleOpenCreateModal} className="btn-create-user">
          <FiUserPlus /> Novo Usuário
        </button>
      </div>

      {/* Filtros */}
      {!isLoading && !error && (
        <div className="filters-container">
          <div className="filter-group">
            <FiFilter size={18} />
            <span className="filter-label">Filtros:</span>
          </div>

          <div className="filter-group">
            <label>Perfil:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
              className="filter-select"
            >
              <option value="all">Todos ({users.length})</option>
              <option value="operador">Usuários Operacionais ({operadorCount})</option>
              <option value="major">Majors/Supervisores ({majorCount})</option>
              <option value="administrador">Administradores ({adminCount})</option>
            </select>
          </div>

          <div className="filter-group search-group">
            <label>Buscar:</label>
            <input
              type="text"
              placeholder="Nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      )}

      <div className="management-content">
        {/* Loading */}
        {isLoading && (
          <div className="loading-state">
            <FiLoader className="spinner" size={30} />
            <p>Carregando usuários...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-state">
            <FiAlertCircle size={30} />
            <p>{error}</p>
          </div>
        )}

        {/* Tabela de Usuários */}
        {!isLoading && !error && (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Perfil</th>
                  <th>Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge role-${user.role}`}>
                          {translateRole(user.role)}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="action-btn edit-btn"
                          title="Editar usuário"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          className="action-btn delete-btn"
                          title="Excluir usuário"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="no-data">
                      {searchTerm || roleFilter !== 'all'
                        ? 'Nenhum usuário encontrado com os filtros aplicados.'
                        : 'Nenhum usuário cadastrado.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Criação/Edição */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Novo Usuário' : 'Editar Usuário'}</h2>
              <button onClick={handleCloseModal} className="modal-close-btn">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label htmlFor="name">Nome *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={formErrors.name ? 'input-error' : ''}
                />
                {formErrors.name && <span className="error-message">{formErrors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={formErrors.email ? 'input-error' : ''}
                />
                {formErrors.email && <span className="error-message">{formErrors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="role">Perfil *</label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserFormData['role'] })}
                >
                  <option value="operador">Usuário Operacional (padrão)</option>
                  <option value="major">Major/Supervisor</option>
                  <option value="administrador">Administrador do Sistema</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Senha {modalMode === 'create' ? '*' : '(deixe vazio para manter)'}
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={formErrors.password ? 'input-error' : ''}
                  placeholder={modalMode === 'edit' ? 'Nova senha (opcional)' : ''}
                />
                {formErrors.password && <span className="error-message">{formErrors.password}</span>}
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCloseModal} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" disabled={isSaving} className="btn-save">
                  <FiSave /> {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
