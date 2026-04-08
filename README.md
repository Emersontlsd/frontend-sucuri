# SucuriDrive Frontend

## Visão Geral

Este projeto é um frontend em React + Vite para a plataforma `SucuriDrive`, uma solução de gerenciamento de arquivos com perfis de usuário e administração. Ele combina:

- `React 19` com `Vite`
- `Tailwind CSS 4` para estilos utilitários
- `React Router v7` para navegação
- `Supabase` para banco de dados, storage e autenticação parcial
- `Axios` para chamadas a APIs externas
- `React Toastify` para notificações visuais
- `Lucide React` para ícones modernos

O app contém páginas públicas, rotas protegidas para usuários e áreas exclusivas para administradores.

---

## Funcionalidades principais

- Tela de login e cadastro
- Protected routes com validação localStorage
- Dashboard de usuário para visualizar documentos públicos
- Página administrativa com lista de membros
- Upload de arquivos e categorias no Supabase Storage
- Edição de perfil e atualização de senha
- Feedback visual com `ToastContainer`

---

## Estrutura do projeto

### Arquivos principais

- `package.json` - dependências e scripts do projeto
- `vite.config.js` - configuração do Vite
- `src/main.jsx` - ponto de entrada do React
- `src/App.jsx` - definição de rotas e rotas protegidas
- `src/supabaseClient.js` - cliente Supabase configurado
- `src/index.css` - importa Tailwind CSS
- `src/App.css` - estilos adicionais do template

### Diretórios em `src`

- `src/pages/` - páginas de rota
- `src/components/` - componentes reutilizáveis

---

## Navegação e rotas

### Rotas públicas

- `/` - `Home.jsx`
- `/login` - `Login.jsx`
- `/register` - `Register.jsx`

### Rotas de usuário comum (protegidas)

- `/dashboard` - `UserHome.jsx`
- `/arquivos` - `Dashboard.jsx`
- `/perfil` - `ProfileEdit.jsx`

### Rotas de administrador (protegidas)

- `/admin` - `AdminDashboard.jsx`
- `/admin/arquivos` - `AdminFiles.jsx`

### Comportamento de proteção de rotas

`App.jsx` implementa dois wrappers:

- `PrivateRoute` - exige sessão do Supabase no `localStorage`
- `AdminRoute` - exige sessão + `role === 'admin'`

A verificação usa chaves do `localStorage` semelhantes ao Supabase:

- `supabase.auth.token`
- `sb-*`
- `role`

Se a sessão não existir, o usuário é redirecionado para `/login`.

---

## Páginas detalhadas

### `Home.jsx`

Página inicial da plataforma com descrição, destaques de recursos e um layout em grade com cards.

### `Login.jsx`

Formulário de login que envia dados para o backend externo:

- `POST https://backend-sucuri-api.vercel.app/api/auth/login`

Salva no `localStorage`:

- `supabase.auth.token`
- `token`
- `user`
- `role`
- `userName`

Redireciona para:

- `/admin` quando `role === 'admin'`
- `/dashboard` para usuários comuns

### `Register.jsx`

Registro de novos usuários com máscara de CPF e telefone.

Envia dados para:

- `POST https://backend-sucuri-api.vercel.app/api/auth/register`

Campos principais:

- `name`
- `email`
- `password`
- `phone`
- `cpf`

### `UserHome.jsx`

Dashboard de boas-vindas para usuário comum com informações institucionais e CTA para arquivo.

### `Dashboard.jsx`

Tela de visualização de documentos públicos.

- Busca `documents` e `categories` no Supabase
- Filtra por categoria e busca em tempo real
- Abre o documento em `FileViewer.jsx`
- Protege clique direito e adiciona `#toolbar=0` para a visualização do iframe

### `ProfileEdit.jsx`

Permite editar informações de usuário e atualizar senha.

- Atualiza dados no Supabase em `profiles`
- Atualiza senha via backend externo:
  - `PUT https://backend-sucuri-api.vercel.app/api/auth/update-password`

### `AdminDashboard.jsx`

Painel administrativo com:

- cartões de estatísticas (`StatCard.jsx`)
- barra de busca (`SearchBar.jsx`)
- tabela de usuários (`UserTable.jsx`)
- modal de edição de usuário (`EditUserModal.jsx`)

A API admin usada é:

- `GET /api/admin/users`
- `PUT /api/admin/approve/:id`
- `PUT /api/admin/disable/:id`
- `POST /api/admin/update-user`

### `AdminFiles.jsx`

Gerenciamento de arquivos e categorias no Supabase Storage.

Funcionalidades:

- criar categoria
- upload de arquivo
- listar documentos
- alternar visibilidade (`is_visible`)
- excluir documento

Componentes principais:

- `FileCard.jsx` - cada documento exibido
- `FileViewer.jsx` - visualizador em modal para arquivos PDF/links

---

## Componentes e responsabilidades

### `Header.jsx`

Navegação principal com:

- links públicos e privados
- menu dinâmico para admin e usuário comum
- logout limpa `localStorage`

### `FileViewer.jsx`

Modal de visualização de arquivo com `iframe` e bloqueio de clique direito.

### `FileCard.jsx`

Card de controle para admin com ações:

- alterar visibilidade
- abrir arquivo
- excluir arquivo

### `EditUserModal.jsx`

Modal de edição de usuário reutilizável para admin.

### `SearchBar.jsx`

Componente simples de busca com ícone de pesquisa.

### `StatCard.jsx`

Cartão de estatísticas clicável para filtrar usuários.

### `UserTable.jsx`

Tabela de usuários com ações de aprovação, bloqueio e edição.

---

## Configuração do Supabase

O arquivo `src/supabaseClient.js` cria o cliente Supabase com:

- `persistSession: true`
- `autoRefreshToken: true`
- `detectSessionInUrl: true`
- `storage: window.localStorage`

O projeto usa o bucket/storage `documents` para uploads.

> Observação: o código contém a URL pública e anon key do Supabase.

---

## Dependências importantes

- `react`
- `react-dom`
- `react-router-dom`
- `react-toastify`
- `axios`
- `lucide-react`
- `@supabase/supabase-js`
- `tailwindcss`
- `vite`

---

## Scripts disponíveis

- `npm run dev` - inicia o servidor de desenvolvimento Vite
- `npm run build` - gera a build de produção
- `npm run preview` - pré-visualiza o build gerado
- `npm run lint` - executa o ESLint no projeto

---

## Como executar localmente

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Abra o navegador em `http://localhost:5173`.

---

## Observações importantes

- O app depende de uma API externa hospedada em `backend-sucuri-api.vercel.app`.
- O login/cadastro não está implementado apenas com Supabase; o backend cria tokens e perfis.
- A proteção de rotas é feita no frontend com `localStorage` e não é segura por si só.
- Para produção, recomenda-se mover chaves secretas e URLs para variáveis de ambiente.

---

## Estrutura de pastas simplificada

```text
src/
  App.jsx
  main.jsx
  supabaseClient.js
  index.css
  App.css
  components/
    Header.jsx
    FileViewer.jsx
    FileCard.jsx
    EditUserModal.jsx
    StatCard.jsx
    SearchBar.jsx
    UserTable.jsx
  pages/
    Home.jsx
    Login.jsx
    Register.jsx
    UserHome.jsx
    Dashboard.jsx
    ProfileEdit.jsx
    AdminDashboard.jsx
    AdminFiles.jsx
```

---

## Exemplo de fluxo de usuário

1. Usuário acessa `/` e usa o botão para navegar até `/login`.
2. Faz login em `/login` e é enviado para `/dashboard`.
3. Em `/dashboard`, pesquisa arquivos e clica em um documento.
4. O modal `FileViewer` exibe o PDF/documento com proteção de clique direito.

## Exemplo de fluxo de admin

1. Admin faz login e é redirecionado para `/admin`.
2. Visualiza estatísticas e filtra membros.
3. Pode editar um usuário via modal e aprovar/bloquear perfis.
4. Vai para `/admin/arquivos` para criar categoria, enviar arquivo ou ajustar visibilidade.

---

## Como contribuir

- Mantenha a consistência de classes Tailwind
- Separe lógica pesada em hooks ou serviços se necessário
- Evite expor chaves sensíveis no frontend
- Prefira componentes pequenos e foco em reutilização

---

## Considerações finais

Este README documenta a implementação atual do frontend `frontend-sucuri-main`. A aplicação já funciona como uma interface de gerenciamento para perfis e arquivos, com rotas protegidas, operações de admin e integração com Supabase.
