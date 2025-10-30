import { useAuth } from '../../contexts/AuthContext'; 
import './style.css'; 

function Home() {
  const { userProfile, isAuthenticated } = useAuth(); 

  return (
    <div className="home-container">
      <h1>Olá, Bom Dia!</h1>
      
      {isAuthenticated ? (
        <>
          <p>Bem-vindo ao painel de gestão de ocorrências Ignis.</p>
          {userProfile === 'op1' && <p><b>Perfil:</b> Operador da Central</p>}
          {userProfile === 'op2' && <p><b>Perfil:</b> Operador de Campo</p>}
          {userProfile === 'chefe' && <p><b>Perfil:</b> Chefe/Supervisor</p>}
          {userProfile === 'admin' && <p><b>Perfil:</b> Administrador</p>}
        </>
      ) : (
        <p>Por favor, faça login para acessar o sistema.</p> 
        
      )}
    </div>
  );
}

export default Home;