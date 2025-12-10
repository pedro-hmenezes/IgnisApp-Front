import './style.css';
import ignisLogo from '../../assets/ignis-logo.png';

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <img src={ignisLogo} alt="Ignis Logo" className="loading-logo" />
        <div className="loading-spinner"></div>
        <p className="loading-text">Carregando...</p>
      </div>
    </div>
  );
}
