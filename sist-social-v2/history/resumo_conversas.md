# Resumo da Conversa de Desenvolvimento - SistSocial V2

**Última Atualização:** 21 de Agosto de 2026

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

### 8. Ajustes na Listagem e no Modal de Atendimentos
* **Listagem:**
  * A tabela passou a exibir as colunas Data, Munícipe Atendido, Número do Prontuário, Tipo de Atendimento, Modalidade, Técnico, Status e Ações.
  * Foram removidos da listagem o código interno `ATE_<id>`, CPF, relato inicial e unidade.
  * A coluna Munícipe Atendido recebeu largura mínima de 220 px.
  * O responsável técnico é exibido com fallback para o responsável inicial.
* **Modal:**
  * A altura e a rolagem interna foram corrigidas para que todo o formulário e seu rodapé permaneçam acessíveis.
  * Campos de usuário e função foram estabilizados como strings para evitar o aviso do React sobre inputs controlados se tornando não controlados.
  * Após o primeiro salvamento, o atendimento passa ao estado de edição, exibe o campo ID do Atendimento e bloqueia a alteração da modalidade.
  * Os salvamentos seguintes no mesmo modal utilizam atualização (`PUT`), evitando a criação de registros duplicados.
  * Enquanto o atendimento está Aberto, forma de acesso, tipo de atendimento e observações permanecem editáveis.
  * A ação Encerrar Atendimento atualiza o status para Finalizado via `PATCH`, fecha o modal após sucesso e torna esses campos somente leitura em consultas posteriores.
* **Banco de dados:**
  * A migration `0036` removeu a coluna redundante `numero_atendimento` de `atendimentos_sociais`; o vínculo entre atendimentos permanece em `origem_atendimento_id`, chave estrangeira autorreferenciada para `atendimentos_sociais.id`.
  * Foi criado o endpoint transacional `POST /api/atendimentos_sociais/{id}/encaminhar-interno/`, que cria um atendimento técnico ligado à origem e altera o atendimento simplificado para `Encaminhado`.
  * A migration `0037` adicionou o status `Encaminhado`.
* **Encaminhamento interno:**
  * O modal replica o fluxo legado com família, prontuário e pessoa somente para leitura, motivo mínimo de 21 caracteres, data e profissional de destino.
  * O seletor exibe `Nome do técnico — Unidade(s) de trabalho`; após a seleção, nome e unidade também aparecem em campos destacados.
  * Após encaminhar, somente o modal secundário é fechado; o modal principal do atendimento permanece aberto exibindo o status `Encaminhado`.
  * Atendimentos simplificados, abertos e já gravados exibem no cabeçalho um controle alternável `Abrir Ações` / `Fechar Ações` para mostrar ou recolher a gaveta lateral.
  * A listagem geral reúne atendimentos simplificados, técnicos, encaminhamentos internos, referências e contrarreferências, com opções específicas no filtro de modalidade.
  * Registros técnicos que possuem `origem_atendimento` continuam vinculados ao fluxo de encaminhamento, mas sua modalidade permanece **Técnico**.
  * Na tabela, o atendimento originado por encaminhamento é apresentado na modalidade **Técnico**; enquanto aguarda abertura possui somente a ação **Abrir atendimento**.
  * O atendimento técnico criado por encaminhamento nasce com o status `Esperando para ser aberto`; a migration `0038` também adequou os registros derivados existentes que ainda estavam abertos.
  * A ação do encaminhamento utiliza um ícone de livro fechado e abre o formulário técnico. Ao confirmar **Abrir Atendimento**, o registro muda para o status `Aberto`.
  * Depois que o encaminhamento é aberto e passa ao status `Aberto`, sua linha deixa de usar o livro fechado e passa a exibir as ações padrão **Editar** e **Excluir**.
  * Enquanto o atendimento técnico aguarda abertura, a lateral de ações não é exibida. Depois da abertura, a lateral passa a ser mostrada e pode ser aberta ou fechada pelo usuário.
  * O modal de abertura contém Dados Pessoais, Dados do Atendimento, Informações do Atendimento Inicial somente para leitura e Informações do Atendimento Técnico editáveis, incluindo os responsáveis e suas funções.
  * Nos cadastros iniciais Simplificado e Técnico, o comando inicial foi nomeado **Abrir Atendimento**; após a criação, os salvamentos seguintes continuam como **Salvar Registro**.
  * A identificação do rótulo inicial usa a ausência de `atendimentoSelecionado` como fonte de verdade, evitando que IDs residuais façam o botão exibir Salvar Registro em um novo cadastro.
  * O atendimento Técnico criado diretamente usa o mesmo layout técnico do encaminhamento. O bloco Informações do Atendimento Inicial permanece visível e informa que não há atendimento inicial.
  * O componente `ReferralInitialInformation.tsx` concentra a apresentação dos dados herdados do atendimento de origem.
  * A gaveta de ações fica disponível nos atendimentos **Simplificados** não finalizados e em todos os atendimentos **Técnicos** depois que são abertos.
  * Para atendimentos técnicos abertos, com ou sem atendimento inicial, a gaveta usa a variante técnica do legado: Encerrar Atendimento, Ver Impressão, Abrir Prontuário, Reencaminhamento Interno, Encaminhamento Referência, Contra Referência, Upload Documentos e Associação Grupos. A abertura do prontuário navega para o cadastro do munícipe; ações ainda sem endpoint permanecem sinalizadas como em desenvolvimento.
  * As notificações de sucesso são ocultadas automaticamente após 2 segundos e não exigem fechamento manual pelo usuário.
  * No frontend, a nomenclatura visível foi padronizada para **Munícipe/Munícipes** em substituição a Pessoa/Pessoas/Cidadão; nomes técnicos internos, rotas e contratos com o backend foram preservados.
  * Foi removida da consulta geral a restrição que ocultava registros técnicos sem a permissão detalhada; a página agora recebe todas as modalidades ativas.

### 9. Refatoração do Frontend de Atendimentos
* O componente `AttendanceManagement.tsx` passou a atuar como coordenador do estado, regras e chamadas à API.
* Foram extraídos módulos TSX em `frontend/src/components/attendance/`:
  * `AttendanceManagementTypes.tsx`: contratos de dados compartilhados pelo gerenciamento de atendimentos.
  * `AttendanceTable.tsx`: estados de carregamento/vazio e renderização da listagem.
  * `AttendanceActionsDrawer.tsx`: gaveta lateral e seus comandos.
  * `InternalReferralModal.tsx`: apresentação e seleção de técnico/unidade no encaminhamento.
* A primeira etapa reduziu o arquivo principal de 1.358 para aproximadamente 1.093 linhas sem alterar o fluxo funcional.
* Todos os módulos extraídos seguem o padrão `.tsx` adotado no projeto.
* O arquivo `AttendanceManagementTypes.tsx` recebeu esse nome por centralizar exclusivamente os contratos de dados do gerenciamento de atendimentos.
* Próxima etapa sugerida: extrair o formulário principal e os modais de cadastro rápido de munícipe.

### 10. Impressão de Atendimentos
* Foi criado o endpoint autenticado `GET /api/atendimentos_sociais/{id}/impressao/` no `AtendimentoViewSet`, com renderização do template `core/templates/atendimentos/impressao_atendimento.html`.
* O botão Ver Impressão passou a buscar o HTML com Token e abrir a pré-visualização em nova aba.
* O relatório recebeu layout A4 moderno, cabeçalho institucional inspirado no legado, logotipo incorporado em Base64, dados do munícipe, atendimento, informações inicial/técnica, responsáveis, funções e data de emissão.
* O template foi validado com um registro real: sem tags Django literais, com logotipo e dados renderizados.

### 11. Checkpoint do Fluxo de Atendimentos — 21/08/2026
* A listagem diferencia atendimentos Simplificados e Técnicos pela modalidade real do registro.
* Encaminhamentos internos criam um atendimento de modalidade Técnico, vinculado por `origem_atendimento`, inicialmente com status `Esperando para ser aberto`.
* Enquanto aguarda abertura, o atendimento Técnico apresenta livro fechado e somente a ação Abrir Atendimento; depois passa para `Aberto` e apresenta Editar e Excluir.
* Atendimentos Simplificados e Técnicos são iniciados pelo comando Abrir Atendimento; alterações posteriores usam Salvar Registro.
* O Técnico direto e o Técnico originado por encaminhamento compartilham o mesmo layout. Sem origem, a seção inicial informa que não existe atendimento inicial; com origem, apresenta os dados herdados somente para leitura.
* Após a abertura, atendimentos Técnicos utilizam a gaveta técnica de ações; Simplificados continuam usando sua gaveta própria.
* Mensagens de sucesso desaparecem automaticamente após 2 segundos.
* A terminologia visível no frontend está padronizada como Munícipe/Munícipes, preservando contratos técnicos com o backend.
* O permissionamento detalhado permanece adiado para uma etapa posterior.

---

## 🗄️ Próximos Passos
* Continuar o desenvolvimento da listagem e formulário de cadastro de usuários no React consumindo `/api/usuarios/`.
* Verificar futuras normalizações e regras de negócio para atendimentos técnicos.
* Definir posteriormente o permissionamento da listagem e visualização de atendimentos técnicos, encaminhamentos, referências e contrarreferências.

---

> [!NOTE]
> Os logs originais da conversa (`transcript.jsonl` e `transcript_full.jsonl`) também foram copiados para esta pasta `history/` para que a próxima sessão da IA possa carregar o contexto exato caso necessário.
