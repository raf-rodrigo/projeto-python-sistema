# Resumo da Conversa de Desenvolvimento - SistSocial V2

**Última Atualização:** 14 de Agosto de 2026

Este documento contém o histórico das alterações e decisões técnicas tomadas para que o projeto possa ser facilmente continuado em outro ambiente/computador.

---

## 🛠️ Alterações Efetuadas no Projeto

### 1. Autenticação e Login (Integração Django + React)
* **Backend:**
  * Ativação do módulo `rest_framework.authtoken` em `settings.py`.
  * Criação de um endpoint customizado de login em `/api/login/` que autentica o usuário, vincula a unidade logada e retorna o token de autenticação e os dados de perfil do usuário.
* **Frontend:**
  * Integração da chamada à API de login no arquivo `src/App.tsx`.
  * Armazenamento seguro do Token e das informações do usuário no `localStorage`.

### 2. Tela de Dashboard
* **Frontend:**
  * Criação do painel visual premium `src/components/Dashboard.tsx`.
  * Estilização completa no arquivo `src/App.css`.
  * Instalação e utilização da biblioteca `lucide-react` para ícones do sistema.

### 3. Menu Lateral Modular e Dinâmico
* **Backend:**
  * Criação do modelo autorreferenciado `Menu` em `core/models.py`, que permite criar itens de menu principais e submenus/páginas internas vinculadas.
  * Associação de Menus a Grupos de Permissões (`Group` do Django) utilizando relacionamento `ManyToManyField`.
  * Criação da view filtrada `/api/menus/` que retorna apenas os itens que o usuário logado tem permissão para visualizar de acordo com o seu perfil/grupo (ou que são públicos).
  * Registro e configuração elegante do modelo no admin do Django (`core/admin.py`) usando o widget `filter_horizontal`.
* **Frontend:**
  * Criação do componente independente `src/components/Sidebar.tsx`.
  * Implementação da requisição dinâmica com o cabeçalho `Authorization: Token <token>` para carregar os menus reais do banco de dados.

### 4. Permissões de Ação por Usuário
* **Backend:**
  * O retorno de login (`auth_views.py`) foi ajustado para enviar uma lista com todas as permissões concedidas ao usuário: `'permissions': list(user.get_all_permissions())`.
* **Frontend:**
  * Tipagem em `App.tsx` e `Dashboard.tsx` ajustada para suportar a lista de strings com as permissões.
  * Estruturação da função helper `temPermissao` no Dashboard para controlar a visibilidade e acesso a botões (ex: "Novo Atendimento", "Excluir").

### 5. Refatoração de Arquivos (Modularização)
* A pasta `core/views/` foi criada e as views foram separadas por responsabilidades:
  * `core/views/auth_views.py`: Controle de Login.
  * `core/views/menu_views.py`: Carregamento do Menu lateral.
  * `core/views/user_views.py`: ViewSet do CRUD de Usuários.
  * `core/views/__init__.py`: Exportador dos arquivos da pasta views.
  * O arquivo antigo e gigante `core/views.py` foi **excluído**.

### 6. Cadastro de Munícipes (Melhoria)
* **Frontend:**
  * Integração de select de Família dinâmico no componente [PersonManagement.tsx](file:///home/rdoimo/Documentos/Projetos/sist_python/sist-social-v2/frontend/src/components/PersonManagement.tsx) na aba de Dados Pessoais. As famílias são carregadas a partir da rota `/api/familias_domicilios/` do backend e enviadas adequadamente nas requisições de criação e edição.

### 7. Módulo de Atendimentos (Simples e Técnico)
* **Backend:**
  * Criação do modelo `Atendimento` em `core/models/atendimento.py` estruturado sem abreviações e com atributos semanticamente claros como `data_atendimento` e `descricao_atendimento`.
  * Criação de migration `0015` para criação do modelo, e migration `0016` para renomeação dos atributos e remoção de nomes genéricos.
  * Criação do serializer `AtendimentoSerializer` e da viewset `AtendimentoViewSet`.
  * A permissão customizada `visualizar_atendimento_tecnico` foi padronizada na classe Meta do modelo para utilizar o prefixo `"Can"` ("Can visualizar atendimentos técnicos detalhados") em conformidade com as diretrizes do Django (migration `0017`).
* **Frontend:**
  * Criação do componente dinâmico [AttendanceManagement.tsx](file:///home/rdoimo/Documentos/Projetos/sist_python/sist-social-v2/frontend/src/components/AttendanceManagement.tsx) para realizar o CRUD de atendimentos.
  * Exibição de campos adicionais (Procedimentos e Providências) dinamicamente caso selecionado o tipo de atendimento **Técnico**.
  * Integração do painel no [Dashboard.tsx](file:///home/rdoimo/Documentos/Projetos/sist_python/sist-social-v2/frontend/src/components/Dashboard.tsx) e associação direta aos botões de ações rápidas.

---

## 🗄️ Próximos Passos
* Continuar o desenvolvimento da listagem e formulário de cadastro de usuários no React consumindo `/api/usuarios/`.
* Verificar futuras normalizações e regras de negócio para atendimentos técnicos.

---

> [!NOTE]
> Os logs originais da conversa (`transcript.jsonl` e `transcript_full.jsonl`) também foram copiados para esta pasta `history/` para que a próxima sessão da IA possa carregar o contexto exato caso necessário.
