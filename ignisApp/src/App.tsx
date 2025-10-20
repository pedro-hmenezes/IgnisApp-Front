// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import Home from './pages/Home';
import RegisterOccurrence from './pages/RegisterOccurrence';
import BasicForm from './pages/BasicForm'; // 1. Importe o novo formulário

import './App.css';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterOccurrence />} />
        
        {/* 2. Adicione esta nova rota dinâmica */}
        <Route path="/register/new/:typeId" element={<BasicForm />} />
        
        {/* Adicionaremos mais rotas aqui no futuro */}
      </Routes>
    </MainLayout>
  );
}

export default App;