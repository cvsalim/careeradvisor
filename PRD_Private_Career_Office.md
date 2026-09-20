# PRD — Advisor Career Office

## 1. Visão do produto

Construir uma aplicação interna para apoiar a prestação do serviço de Career & Branding Advisory.

A aplicação centralizará os dados, objetivos, decisões, recomendações e histórico de cada cliente. Ela também permitirá utilizar modelos de IA externos por meio de prompts personalizados, montados dinamicamente com as informações estratégicas de cada cliente.

A aplicação será principalmente utilizada pelo Advisor. O cliente terá, em uma fase posterior, uma visão simplificada para acompanhar sua evolução, aprovar conteúdos e consultar informações autorizadas.

Essa aplicação é pensada em uma qualidade alta de ferramentas, com poucos usuários.

## 2. Princípio central

A aplicação não deverá tentar substituir todas as ferramentas de IA existentes.

Deve-se:

- Construir internamente aquilo que envolve contexto, decisões, organização, histórico e metodologia própria.
- Utilizar ferramentas externas para geração de texto, pesquisa, design, vídeo e transcrição.
- Evitar RAG, embeddings, banco vetorial e treinamento de modelos próprios no MVP.
- Usar banco relacional tradicional, como PostgreSQL/Supabase.
- Montar prompts dinamicamente com os dados estruturados do cliente.

Nome técnico da abordagem:

- Dynamic Context Injection
- Prompt-Based Personalization
- Client Skill / Client Intelligence Profile

## 3. Objetivos do MVP

1. Cadastrar e organizar clientes.
2. Criar um perfil estratégico completo de cada cliente.
3. Registrar Professional DNA, objetivos, posicionamento e regras de marca.
4. Manter uma memória estratégica atualizada.
5. Preparar prompts personalizados para tarefas específicas.
6. Permitir que o Advisor execute tarefas de IA com contexto individualizado.
7. Organizar tarefas, reuniões, decisões e evolução do cliente.
8. Produzir um relatório mensal de carreira.
9. Acompanhar um Career Score interno e orientativo.
10. Evitar dependência de módulos complexos ou automações prematuras.

## 4. Usuário principal

### Advisor

O Advisor é o usuário principal da aplicação.

Ele deverá conseguir:

- Cadastrar clientes.
- Atualizar informações estratégicas.
- Registrar entrevistas e reuniões.
- Definir recomendações.
- Aprovar ou rejeitar informações.
- Criar e atualizar o Client Skill.
- Executar tarefas de IA por cliente.
- Acompanhar prioridades e evolução.
- Preparar relatórios.

### Cliente — fase posterior

O cliente poderá:

- Visualizar sua jornada.
- Consultar objetivos e posicionamento aprovados.
- Aprovar conteúdos.
- Visualizar relatórios.
- Consultar oportunidades selecionadas.
- Enviar respostas e informações ao Advisor.

O portal do cliente não é prioridade no MVP.

## 5. Módulos do MVP

### 5.1 Dashboard do Advisor

Exibir:

- Total de clientes ativos.
- Clientes em onboarding.
- Clientes em acompanhamento.
- Prioridades da semana.
- Tarefas atrasadas.
- Próximas reuniões.
- Oportunidades pendentes.
- Conteúdos aguardando revisão.
- Alertas importantes.
- Atalhos para abrir o perfil de cada cliente.

Funcionalidades:

- Filtro por status.
- Filtro por prioridade.
- Ordenação por prazo.
- Acesso rápido ao Client 360.
- Criação rápida de tarefa, reunião ou nota.

Não implementar no MVP:

- Automação avançada de tarefas.
- Calendário completo.
- Integrações com todas as agendas.

### 5.2 Cadastro 360º do cliente

Criar uma ficha centralizada contendo:

- Nome completo.
- Foto.
- E-mail e telefone.
- Cargo ou profissão.
- Empresa.
- Segmento.
- Cidade ou região ampla.
- Links de redes sociais.
- Site.
- Status do relacionamento.
- Data de início.
- Objetivo principal.
- Desafios atuais.
- Observações gerais.
- Documentos e links importantes.

A ficha deverá possuir abas ou seções para:

- Dados básicos.
- Histórico profissional.
- Objetivos.
- Documentos.
- Reuniões.
- Tarefas.
- Decisões.
- Client Skill.
- Histórico de alterações.

### 5.3 Professional DNA

Criar formulário estruturado para registrar:

- Formação.
- Experiências profissionais.
- Competências técnicas.
- Competências comportamentais.
- Principais conquistas.
- Resultados comprovados.
- Histórias relevantes.
- Valores.
- Crenças.
- Interesses.
- Paixões.
- Diferenciais percebidos.
- Conhecimentos que deseja desenvolver.
- Ambições.
- Medos ou bloqueios relevantes para o trabalho de aconselhamento.
- Referências profissionais.
- Evidências e exemplos que sustentam cada informação.

Cada informação importante deverá permitir:

- Status: rascunho, validada, rejeitada ou arquivada.
- Fonte: entrevista, documento, observação ou declaração do cliente.
- Observação do Advisor.
- Data de atualização.

A IA poderá ajudar a organizar entrevistas, mas o Advisor deverá validar as informações estratégicas.

### 5.4 Estratégia de carreira

Criar uma área para definir:

- Visão de futuro.
- Objetivo principal.
- Objetivos secundários.
- Situação atual.
- Posicionamento atual percebido.
- Situação desejada.
- Gaps estratégicos.
- Prioridades.
- Plano de 90 dias.
- Plano de 12 meses.
- Ações estratégicas.
- Indicadores de evolução.
- Riscos e obstáculos.
- Critérios de decisão.

Cada ação deverá conter:

- Descrição.
- Responsável.
- Prazo.
- Status.
- Prioridade.
- Resultado esperado.
- Resultado obtido.
- Observações.

A estratégia deverá possuir versionamento para preservar decisões anteriores.

### 5.5 Laboratório de posicionamento

Criar uma ferramenta para construir e registrar:

- Público-alvo.
- Nicho.
- Território de autoridade.
- Problemas que o cliente resolve.
- Diferenciais.
- Proposta de valor.
- Frase de posicionamento.
- Discurso de apresentação.
- Biografia profissional.
- Mensagens-chave.
- Provas de autoridade.
- Temas que o cliente deve dominar.
- Abordagens aprovadas.
- Abordagens rejeitadas.

Permitir criar múltiplas versões de posicionamento.

Cada versão deverá possuir:

- Nome.
- Descrição.
- Data.
- Status: em análise, aprovada, rejeitada ou arquivada.
- Justificativa.
- Comentários do Advisor.

Somente versões aprovadas deverão ser utilizadas como referência principal nos prompts.

### 5.6 Brand Brain / Client Skill

Este será o núcleo da personalização da IA.

O sistema deverá armazenar informações estruturadas e instruções estratégicas específicas de cada cliente.

Estrutura mínima:

- Identidade profissional.
- Objetivos.
- Posicionamento aprovado.
- Público-alvo.
- Diferenciais.
- Tom de voz.
- Personalidade da comunicação.
- Palavras e expressões preferidas.
- Palavras e abordagens proibidas.
- Temas prioritários.
- Temas proibidos.
- Histórias autorizadas.
- Opiniões e crenças.
- Recomendações do Advisor.
- Decisões aprovadas.
- Exemplos de conteúdos aprovados.
- Critérios de qualidade.
- Regras específicas para conteúdo.
- Regras específicas para carreira.
- Contexto atual.
- Prioridades do momento.

Cada item deverá permitir:

- Categoria.
- Conteúdo.
- Status: rascunho, aprovado, rejeitado ou arquivado.
- Prioridade.
- Data de atualização.
- Autor da alteração.
- Observação.

O sistema deverá permitir gerar uma versão compilada do Client Skill em texto estruturado.

Importante:

- Não criar treinamento de modelo.
- Não utilizar embeddings no MVP.
- Não utilizar banco vetorial.
- Não enviar automaticamente todo o banco de dados à IA.
- Enviar apenas os blocos relevantes para a tarefa selecionada.

### 5.7 Diário e memória de carreira

Criar uma linha do tempo por cliente para registrar:

- Acontecimentos importantes.
- Mudanças de cargo.
- Conquistas.
- Feedbacks.
- Decisões.
- Dificuldades.
- Aprendizados.
- Mudanças de objetivo.
- Mudanças de posicionamento.
- Eventos relevantes.
- Observações do Advisor.

Cada registro deverá conter:

- Título.
- Data.
- Tipo.
- Descrição.
- Impacto.
- Tags.
- Visibilidade.
- Relação com objetivos ou ações.

A memória deverá ser consultável e organizada por data e categoria.

### 5.8 Pipeline de conteúdo

Criar um quadro simples com os estados:

1. Ideia
2. Briefing
3. Roteiro
4. Em produção
5. Revisão do Advisor
6. Aprovação do cliente
7. Publicado
8. Analisado

Cada conteúdo deverá conter:

- Cliente.
- Título.
- Objetivo.
- Pilar.
- Tema.
- Formato.
- Canal.
- Mensagem principal.
- Briefing.
- Roteiro ou texto.
- Link para arquivos externos.
- Status.
- Data planejada.
- Data de publicação.
- Resultado.
- Aprendizado.

A geração de conteúdo poderá ser feita externamente com ChatGPT, Claude ou Gemini. A aplicação deverá organizar o processo e armazenar o resultado final.

### 5.9 Career Score

Criar um score interno e orientativo com dimensões configuráveis:

- Posicionamento.
- Autoridade.
- Visibilidade.
- Networking.
- Oportunidades.
- Impacto profissional.

Para cada dimensão:

- Nota de 0 a 100.
- Nota anterior.
- Evidências.
- Justificativa.
- Próxima ação recomendada.
- Data da avaliação.

O sistema deverá mostrar a evolução ao longo do tempo.

O score não deverá ser apresentado como avaliação científica, diagnóstico ou verdade objetiva.

### 5.10 Relatório mensal de carreira

Criar uma ferramenta para gerar um relatório mensal a partir dos registros da aplicação.

Seções:

- Resumo executivo.
- O que mudou no mês.
- Principais conquistas.
- Ações executadas.
- O que não foi executado.
- Aprendizados.
- Mudanças relevantes no mercado.
- Oportunidades identificadas.
- Evolução do Career Score.
- Recomendações do Advisor.
- Prioridades do próximo mês.

O sistema deverá gerar uma prévia editável. O Advisor deverá revisar e aprovar antes de compartilhar.

### 5.11 AI Workspace

Criar uma área central para executar tarefas de IA por cliente.

Fluxo:

1. Selecionar o cliente.
2. Selecionar o tipo de tarefa.
3. Carregar automaticamente os blocos de contexto relevantes.
4. Exibir o contexto que será enviado.
5. Permitir editar ou acrescentar instruções.
6. Montar o prompt final.
7. Enviar para o provedor de IA configurado.
8. Exibir o resultado.
9. Permitir salvar o resultado no módulo correspondente.
10. Registrar histórico da execução.

Tipos iniciais de tarefa:

- Criar ideias de conteúdo.
- Criar roteiro.
- Revisar posicionamento.
- Criar bio profissional.
- Analisar uma oportunidade.
- Preparar reunião.
- Organizar entrevista.
- Gerar relatório mensal.
- Sugerir próximos passos de carreira.
- Revisar um texto conforme o Brand Brain.

## 6. Arquitetura de prompts

O prompt deverá ser montado dinamicamente em camadas:

### Camada 1 — Instruções do sistema

Define o comportamento geral da IA:

- Atuar como assistente do Advisor.
- Não inventar informações.
- Diferenciar fatos, hipóteses e recomendações.
- Respeitar as informações aprovadas.
- Indicar quando faltarem dados.
- Não substituir a decisão do Advisor.

### Camada 2 — Contexto do cliente

Incluir somente os dados necessários:

- Client 360.
- Professional DNA.
- Estratégia de carreira.
- Posicionamento aprovado.
- Brand Brain.
- Memória recente.
- Dados específicos da tarefa.

### Camada 3 — Regras do Advisor

Incluir recomendações, restrições e decisões específicas.

### Camada 4 — Tarefa

Descrever o que a IA deve produzir.

### Camada 5 — Formato de saída

Definir o formato esperado:

- Lista.
- Tabela.
- Briefing.
- Roteiro.
- Relatório.
- JSON estruturado, quando necessário para salvar dados.

O sistema deverá exibir o prompt final para auditoria do Advisor.

## 7. Seleção de contexto por tarefa

Criar uma configuração que relacione cada tarefa aos blocos de dados necessários.

Exemplo:

### Criar conteúdo

Usar:

- Posicionamento aprovado.
- Brand Brain.
- Público-alvo.
- Temas prioritários.
- Estratégia de conteúdo.
- Exemplos aprovados.
- Contexto atual.

### Analisar oportunidade

Usar:

- Objetivos de carreira.
- Professional DNA.
- Competências.
- Momento atual.
- Critérios de decisão.
- Restrições do cliente.

### Preparar reunião

Usar:

- Histórico de reuniões.
- Decisões.
- Tarefas pendentes.
- Estratégia atual.
- Diário de carreira.
- Oportunidades em aberto.

### Gerar relatório mensal

Usar:

- Plano do mês.
- Tarefas executadas.
- Conteúdos publicados.
- Resultados.
- Diário.
- Career Score.
- Oportunidades.
- Recomendações do Advisor.

## 8. Modelo de dados inicial

Entidades sugeridas:

- users
- clients
- client_contacts
- professional_dna
- professional_dna_items
- career_strategies
- career_goals
- career_actions
- positioning_versions
- brand_brain_items
- client_skill_versions
- career_journal_entries
- meetings
- meeting_notes
- decisions
- tasks
- content_items
- content_metrics
- career_scores
- career_score_entries
- monthly_reviews
- ai_task_templates
- ai_executions
- ai_execution_contexts
- files
- tags
- audit_logs

Todas as entidades relacionadas ao cliente deverão possuir client_id.

## 9. Requisitos de segurança e privacidade

- Autenticação obrigatória.
- Autorização por usuário.
- Isolamento dos dados por cliente.
- Registro de alterações importantes.
- Controle de visibilidade de cada informação.
- Não expor dados de um cliente em prompts de outro cliente.
- Confirmar quais dados serão enviados a provedores externos de IA.
- Evitar enviar dados pessoais desnecessários.
- Permitir excluir ou arquivar informações.
- Aplicar princípios de minimização de dados.
- Preparar a solução para conformidade com a LGPD.

## 10. Experiência de usuário

A interface deverá ser:

- Elegante.
- Limpa.
- Profissional.
- Rápida.
- Orientada à ação.
- Mais próxima de um escritório privado do que de um painel de CRM tradicional.

Prioridades de navegação:

1. Dashboard
2. Clientes
3. Agenda e tarefas
4. AI Workspace
5. Conteúdos
6. Inteligência e registros
7. Relatórios
8. Configurações

No perfil do cliente, exibir:

- Resumo executivo.
- Prioridade atual.
- Objetivo principal.
- Status da estratégia.
- Próximas ações.
- Últimas decisões.
- Últimos registros.
- Atalhos para Professional DNA, posicionamento, Brand Brain e AI Workspace.

## 11. Ferramentas externas a utilizar no MVP

Não desenvolver internamente funcionalidades que já podem ser realizadas por ferramentas externas.

Sugestões:

- ChatGPT, Claude ou Gemini: geração, análise e organização de informações.
- NotebookLM/Gemini Notebook: consulta a conjuntos de documentos selecionados.
- Perplexity: pesquisa de mercado e informações atuais.
- Google Trends: análise de interesse por temas.
- Google Drive: armazenamento de documentos.
- Canva: materiais visuais e relatórios.
- CapCut: edição de vídeos.
- Granola, Fathom ou Fireflies: transcrição de reuniões, caso aprovados pelo cliente.
- Supabase/PostgreSQL: dados estruturados e autenticação.
- n8n ou Make: automações futuras.

A plataforma deverá armazenar links, resultados, decisões e resumos das ferramentas externas, em vez de tentar reproduzir todas as suas funções.

## 12. Fora do escopo do MVP

- RAG.
- Embeddings.
- Banco vetorial.
- Fine-tuning ou treinamento de modelo próprio.
- Agentes autônomos complexos.
- Monitoramento automático de toda a internet.
- Integrações completas com Instagram, LinkedIn e YouTube.
- Publicação automática em redes sociais.
- Portal completo do cliente.
- Chatbot público.
- Gestão financeira.
- Sistema de cobrança.
- Aplicativo mobile nativo.
- Automação de todas as reuniões.
- Análise totalmente automatizada de reputação.

## 13. Fases de desenvolvimento

### Fase 1 — Fundação

- Autenticação.
- Layout principal.
- Cadastro de clientes.
- Dashboard básico.
- Cadastro 360º.
- Tarefas e registros.

### Fase 2 — Metodologia

- Professional DNA.
- Estratégia de carreira.
- Laboratório de posicionamento.
- Brand Brain.
- Client Skill.
- Versionamento e auditoria.

### Fase 3 — Operação do Advisor

- Diário e memória de carreira.
- Reuniões e decisões.
- Pipeline de conteúdo.
- Career Score.
- Relatório mensal.

### Fase 4 — IA contextual

- AI Workspace.
- Templates de tarefas.
- Montagem dinâmica de prompts.
- Seleção de contexto.
- Histórico de execuções.
- Salvamento de resultados.

### Fase 5 — Evolução

- Portal simplificado do cliente.
- Aprovações.
- Integrações com ferramentas externas.
- Inteligência de mercado.
- Radar de sinais.
- Automação de relatórios.

## 14. Critérios de aceite do MVP

O MVP será considerado funcional quando o Advisor conseguir:

1. Criar um cliente.
2. Preencher o cadastro 360º.
3. Registrar o Professional DNA.
4. Definir uma estratégia de carreira.
5. Criar e aprovar um posicionamento.
6. Criar um Brand Brain.
7. Gerar um Client Skill compilado.
8. Selecionar uma tarefa de IA.
9. Ver quais dados serão utilizados no prompt.
10. Executar a tarefa com contexto personalizado.
11. Salvar o resultado.
12. Registrar uma decisão.
13. Criar uma tarefa.
14. Atualizar o diário de carreira.
15. Registrar um conteúdo no pipeline.
16. Atualizar o Career Score.
17. Gerar e editar um relatório mensal.
18. Consultar o histórico do cliente.
19. Garantir que os dados de clientes diferentes permaneçam isolados.

## 15. Diretriz final para o editor de código

Priorizar simplicidade, clareza e velocidade de validação.

Não criar uma arquitetura excessivamente complexa.

Implementar primeiro um sistema CRUD bem estruturado, com banco relacional, autenticação, histórico e montagem de prompts.

Toda funcionalidade de IA deverá ser desacoplada da interface e implementada por meio de um serviço central de execução de tarefas.

O código deverá permitir trocar o provedor de IA no futuro.

A regra principal é:

> A plataforma guarda o contexto e as decisões. As ferramentas externas executam pesquisas, análises e produções especializadas. O Advisor continua responsável pela decisão estratégica final.
