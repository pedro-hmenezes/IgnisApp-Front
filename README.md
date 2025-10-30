# 🔥 IgnisApp - Front-End

[cite_start]Interface de usuário para o sistema de Coleta e Gestão de Ocorrências do Corpo de Bombeiros Militar de Pernambuco (CBMPE). [cite: 3] Desenvolvido com React, TypeScript e Vite.

## ✨ Funcionalidades Principais

* **Autenticação:** Tela de login e gerenciamento de sessão de usuário (com perfis simulados/forçados por enquanto).
* **Painel de Ocorrências:** Visualização unificada de ocorrências em andamento e finalizadas.
* **Cadastro de Ocorrência:** Formulário multi-etapas (atualmente Etapa 1 implementada) com validações.
* **Detalhes da Ocorrência:** Visualização detalhada de uma ocorrência, incluindo placeholders para mapa, mídia e timeline. Permite atualização de GPS e cancelamento.
* **Cadastro de Usuário:** Tela para administradores cadastrarem novos usuários (conectada ao back-end).
* **Roteamento:** Navegação entre telas usando React Router DOM.
* **Controle de Acesso:** Rotas protegidas e exibição condicional de elementos da UI (ex: link "Cadastrar Usuário" na Sidebar).
* **Comunicação com API:** Camada de serviço (`src/api/`) com Axios configurado para interagir com o back-end (envio de token JWT automático).

## 🚀 Tecnologias Utilizadas

* **React:** Biblioteca principal para construção da UI.
* **TypeScript:** Superset do JavaScript para tipagem estática.
* **Vite:** Ferramenta de build e servidor de desenvolvimento rápido.
* **React Router DOM:** Para gerenciamento de rotas no lado do cliente.
* **Axios:** Cliente HTTP para fazer requisições à API back-end.
* **React Icons:** Biblioteca para ícones.
* **CSS:** Estilização (com CSS Modules ou CSS puro por componente).

## ⚙️ Configuração e Instalação

**Pré-requisitos:**
* Node.js (versão 18 ou superior recomendada)
* npm (ou Yarn)

**Passos:**

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-seu-repositorio-frontend>
    cd <nome-da-pasta-frontend> 
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Configure as Variáveis de Ambiente:**
    * Crie um arquivo `.env` na raiz do projeto front-end.
    * Adicione a URL base da API back-end. **IMPORTANTE:** O prefixo `VITE_` é obrigatório!
      ```env
      # .env
      VITE_API_URL=http://localhost:5000/api 
      # Substitua pela URL local do seu back-end ou pela URL do Render/Vercel se já deployado
      ```

## ▶️ Rodando Localmente

1.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
2.  Abra seu navegador e acesse `http://localhost:5173` (ou a porta indicada no terminal).

## 🛠️ Build para Produção

1.  **Gere a build otimizada:**
    ```bash
    npm run build
    ```
2.  Os arquivos finais estarão na pasta `dist/`. Este é o conteúdo que será deployado.

## 📁 Estrutura de Pastas (Principais)

* `public/`: Arquivos estáticos servidos diretamente.
* `src/`: Código fonte da aplicação.
    * `api/`: Configuração do Axios e serviços para chamadas API (ex: `occurrenceService.ts`, `userService.ts`).
    * `assets/`: Imagens, fontes, etc.
    * `components/`: Componentes React reutilizáveis (UI genérica, layout).
    * `contexts/`: Contextos React para gerenciamento de estado global (ex: `AuthContext.tsx`).
    * `hooks/`: Hooks customizados com lógica reutilizável (ex: `useBasicForm.ts`, `useAuth.ts`).
    * `pages/`: Componentes que representam as telas/páginas da aplicação.
    * `routes/`: (Se aplicável) Configuração centralizada de rotas.
    * `styles/`: Arquivos CSS globais ou temas.
    * `types/`: Definições de tipos TypeScript compartilhadas.
    * `App.tsx`: Componente principal que define as rotas.
    * `main.tsx`: Ponto de entrada da aplicação React.

## ☁️ Deploy

* O front-end está configurado para deploy na **Vercel**.
* Certifique-se de configurar a variável de ambiente `VITE_API_URL` nas settings do projeto na Vercel com a URL **pública** da API back-end.
* Um arquivo `vercel.json` foi adicionado para garantir o roteamento correto de SPA.
