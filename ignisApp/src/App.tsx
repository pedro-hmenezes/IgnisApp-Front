// src/App.tsx
// JSX runtime automático configurado pelo TypeScript/Vite, não é necessário importar React
// Corrija esta linha 👇
import { MainLayout } from './components/layout/MainLayout';
// O resto está correto 👇
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <MainLayout>
      <Home />
    </MainLayout>
  );
}

export default App;