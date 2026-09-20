# DESIGN SYSTEM & UI/UX — ADVISOR CAREER OFFICE

## 1. DIREÇÃO CRIATIVA

O Advisor Career Office deve parecer menos um “SaaS tradicional” e mais um **Private Career Advisory Office digital**.

A interface deve transmitir:

* sofisticação
* inteligência
* discrição
* confiança
* exclusividade
* precisão
* organização
* visão estratégica
* maturidade profissional

A referência estética é uma mistura sutil de:

**Italian Executive Design + Private Advisory Office + Modern Intelligence Platform.**

A inspiração italiana deve aparecer de maneira discreta através de:

* tipografia editorial
* proporções elegantes
* muito espaço em branco
* contrastes entre serif e sans-serif
* tons terrosos e profundos
* linhas finas
* materiais visuais inspirados em papel, couro, madeira e bronze
* detalhes extremamente discretos

NÃO transformar a interface em:

* site de moda
* aplicativo de luxo exagerado
* dashboard futurista
* interface preta cheia de efeitos
* “AI dashboard” genérico
* interface corporativa azul
* excesso de cards
* excesso de gradientes
* excesso de ícones
* excesso de bordas
* estética de startup SaaS convencional

A sensação deve ser:

> “Este é o sistema interno de um advisor que administra estrategicamente a carreira de poucas pessoas.”

---

# 2. PRINCÍPIO DE DESIGN

A aplicação deve parecer uma ferramenta construída para **poucos clientes de alto valor**, e não para milhares de usuários.

Priorizar:

**Clareza > quantidade de informação**

**Hierarquia > decoração**

**Contexto > métricas superficiais**

**Decisão > visualização**

**Elegância > efeitos**

**Precisão > complexidade**

Cada tela deve responder claramente:

1. Onde estou?
2. Qual cliente estou analisando?
3. O que mudou?
4. O que importa agora?
5. Qual decisão precisa ser tomada?
6. Qual é a próxima ação?

---

# 3. PALETA PRINCIPAL

Utilizar a paleta fornecida como base oficial do produto.

### Deep Burgundy

`#531113`

Cor institucional principal.

Uso:

* navegação ativa
* títulos especiais
* indicadores importantes
* botões primários
* pequenos elementos de destaque
* estados selecionados

Não utilizar em grandes áreas da interface.

---

### Dark Coffee

`#3B2418`

Uso:

* elementos secundários
* títulos escuros
* detalhes
* elementos de navegação
* backgrounds especiais

---

### Warm Brown

`#46291A`

Uso:

* estados secundários
* elementos de apoio
* ícones
* detalhes de branding

---

### Terracotta

`#8D4E30`

Uso extremamente controlado.

Pode representar:

* destaque
* progresso
* evolução
* elementos de interação
* pequenos indicadores

Não utilizar como cor dominante.

---

### Stone / Parchment

`#B0A383`

Cor de apoio editorial.

Uso:

* divisores
* labels
* pequenos backgrounds
* elementos secundários
* gráficos discretos
* detalhes

---

### Olive Bronze

`#5F5022`

Uso:

* indicadores positivos
* evolução
* status estratégicos
* detalhes de dados
* elementos de destaque

Evitar usar como “verde de sucesso” tradicional.

---

### Olive Gray

`#3E3E2F`

Uso:

* textos secundários
* ícones
* labels
* elementos auxiliares

---

### Charcoal

`#2D2B28`

Cor principal de texto.

Preferir esta cor ao preto puro.

---

### Near Black

`#14171A`

Utilizar somente para:

* textos de máximo contraste
* títulos muito importantes
* áreas específicas de destaque

---

# 4. CORES NEUTRAS

Criar uma escala neutra derivada da paleta.

A aplicação deve possuir fundos claros e quentes.

Sugestão:

```text
Background:
#F6F3ED

Surface:
#FBF9F5

Surface Secondary:
#EFEAE1

Border:
#DDD6C9

Border Strong:
#C9BEAE

Text Primary:
#2D2B28

Text Secondary:
#6F685D

Text Muted:
#91897C
```

Evitar branco absoluto `#FFFFFF` como background principal.

O produto deve ter uma sensação de **papel sofisticado**, mas sem textura pesada.

---

# 5. TIPOGRAFIA

## Display / Titles

Utilizar:

**Bauer Bodoni**

Principalmente para:

* títulos de páginas
* nome do cliente
* grandes números estratégicos
* frases-chave
* headings editoriais
* relatórios

A Bauer Bodoni deve funcionar como elemento de identidade.

Não utilizar em:

* botões
* menus
* tabelas
* inputs
* textos longos
* labels pequenos

---

## Body / Interface

Utilizar:

**EB Garamond**

Para:

* subtítulos
* textos editoriais
* descrições
* insights
* observações
* textos de relatório

---

## UI / Functional Typography

Apesar da identidade baseada em Bauer Bodoni + EB Garamond, elementos funcionais podem utilizar uma sans-serif extremamente discreta para garantir legibilidade.

Preferência:

**Inter**

ou

**Manrope**

Utilizar para:

* navegação
* botões
* inputs
* tabelas
* números pequenos
* badges
* filtros
* timestamps
* metadados

A combinação deve ser:

**Bauer Bodoni → identidade**

**EB Garamond → narrativa**

**Sans-serif → operação**

---

# 6. HIERARQUIA TIPOGRÁFICA

### Page Title

Bauer Bodoni

32–42px

Peso regular.

Exemplo:

> Career Overview

---

### Section Title

Bauer Bodoni

22–28px

---

### Editorial Heading

EB Garamond

20–24px

---

### Body

EB Garamond

16–18px

---

### Interface

Inter / Manrope

13–15px

---

### Metadata

Inter / Manrope

11–12px

Letter spacing:

0.04–0.08em

Text-transform:

uppercase apenas em pequenas labels.

---

# 7. LAYOUT

Utilizar uma estrutura de aplicação profissional semelhante a ferramentas premium de gestão.

Desktop-first.

Estrutura:

```text
┌─────────────────────────────────────────────────────────────┐
│ TOP BAR                                                     │
│ Logo / Context / Search / Notifications / Advisor Profile   │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│ SIDEBAR      │              MAIN CONTENT                    │
│              │                                              │
│ Overview     │                                              │
│ Clients      │                                              │
│ Intelligence │                                              │
│ Career       │                                              │
│ Branding     │                                              │
│ Content      │                                              │
│ Decisions    │                                              │
│ Tasks        │                                              │
│ Meetings     │                                              │
│ Reports      │                                              │
│              │                                              │
│ Settings     │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

Sidebar estreita.

Não utilizar sidebar gigante.

A navegação deve parecer um **instrumento profissional**, não um menu de aplicativo consumidor.

---

# 8. SIDEBAR

Background:

`#F1ECE3`

ou

`#2D2B28`

Preferência para versão clara no MVP.

Sidebar:

* 220–240px
* border-right extremamente discreta
* ícones pequenos
* labels simples
* muito espaço vertical

Exemplo:

```text
ADVISOR OFFICE

Overview

CLIENTS
Clients
Career Intelligence
Professional DNA

STRATEGY
Objectives
Positioning
Decisions
Priorities

EXECUTION
Tasks
Content
Meetings

INTELLIGENCE
Opportunities
Market
Reports
```

Evitar menus com 20+ opções.

---

# 9. DASHBOARD PRINCIPAL

O dashboard não deve ser um “painel de métricas”.

Ele deve ser um **Command Center do Advisor**.

Estrutura:

```text
Good morning, Caio.

Your advisory office
September 20, 2026

────────────────────────────────────────────

ACTIVE CLIENTS        PRIORITIES        DECISIONS
08                    05                03

────────────────────────────────────────────

TODAY

Client / Priority / Status / Next Action

────────────────────────────────────────────

CLIENT PULSE

Client A
Career     ███████░░
Brand      █████████░
Position   ██████░░░

Client B
...

────────────────────────────────────────────

RECENT INTELLIGENCE

[Insight]
[Decision]
[Opportunity]

────────────────────────────────────────────

THIS WEEK

Meetings
Tasks
Reviews
Reports
```

A página deve ser extremamente limpa.

Não colocar gráficos simplesmente porque existe espaço.

---

# 10. CLIENT PROFILE

Essa deve ser uma das telas mais importantes do produto.

Ao entrar em um cliente:

```text
← Clients

CLIENT
Ana Silva

Senior Product Executive
São Paulo · Brazil

Career Strategy / Personal Brand

[Career Score] [Brand Position] [Priority] [Next Review]

────────────────────────────────────────────

Overview
Professional DNA
Career Strategy
Brand
Content
Decisions
Opportunities
Meetings
Tasks
Reports
Intelligence
```

O perfil deve funcionar como um **dossiê estratégico vivo**.

---

# 11. CLIENT HEADER

O header do cliente deve ter:

* nome
* cargo
* localização
* área profissional
* status
* próxima reunião
* prioridade atual
* último update

Não sobrecarregar com cards.

Exemplo:

```text
ANA SILVA

Chief Marketing Officer

Career transition
Brand repositioning

Last strategic review
Sep 18, 2026

Next meeting
Sep 23, 2026
```

---

# 12. PROFESSIONAL DNA

Essa tela deve parecer um **documento estratégico**, não um formulário.

Organizar em blocos:

### Identity

* Professional identity
* Career narrative
* Values
* Ambitions

### Strengths

* Core strengths
* Differentiators
* Expertise
* Proof points

### Career

* Current position
* Desired position
* Target market
* Career horizon

### Personality & Working Style

* Decision style
* Communication style
* Leadership style
* Preferences

### Constraints

* Non-negotiables
* Risks
* Limitations
* Context

---

# 13. CLIENT INTELLIGENCE

Esta é uma das áreas mais importantes da aplicação.

Criar uma interface chamada:

**Client Intelligence**

Ela representa o conjunto de informações que a IA poderá utilizar.

Estrutura:

```text
CLIENT INTELLIGENCE

Context Status
● Updated

Professional DNA
██████████████████

Career Strategy
██████████████

Brand Positioning
████████████████

Current Priorities
██████████████████

Decision History
████████████

────────────────────────

AI CONTEXT

Last updated:
September 19, 2026

Approved information:
84

Pending validation:
6

Conflicts detected:
2
```

A ideia é permitir que o Advisor veja **quão completo e confiável está o contexto daquele cliente**.

---

# 14. CLIENT SKILL

Criar uma tela própria para:

**Client Skill**

Ela deve permitir visualizar:

* identidade
* contexto
* objetivos
* posicionamento
* preferências
* regras
* tom de voz
* restrições
* prioridades
* decisões
* informações aprovadas

Não mostrar isso como código bruto por padrão.

Mostrar como uma estrutura visual organizada.

Possibilitar:

**Preview Context**

para o Advisor visualizar o contexto que será enviado à IA.

---

# 15. AI WORKSPACE

Criar uma interface chamada:

**AI Workspace**

Essa será uma das telas centrais.

Layout:

```text
┌──────────────────────────────────────────────┐
│ AI WORKSPACE                                 │
│ Client: Ana Silva                            │
├───────────────────┬──────────────────────────┤
│ TASK              │ CONTEXT                  │
│                   │                          │
│ Create LinkedIn   │ Professional DNA ✓       │
│ content strategy  │ Career Strategy ✓        │
│                   │ Brand Position ✓         │
│                   │ Current Priorities ✓     │
│                   │ Decision History ✓       │
├───────────────────┴──────────────────────────┤
│                                              │
│ PROMPT / TASK                                │
│                                              │
│ [editor]                                     │
│                                              │
├──────────────────────────────────────────────┤
│ External AI                                  │
│ [Copy Prompt] [Open ChatGPT] [Open Claude]   │
└──────────────────────────────────────────────┘
```

A aplicação não precisa gerar a resposta da IA no MVP.

Seu papel é:

**Context → Prompt → External AI**

---

# 16. DECISION CENTER

Criar uma área dedicada a decisões.

Cada decisão deve conter:

```text
Decision

Move toward C-Level positioning

Context
...

Options considered
...

Advisor recommendation
...

Client decision
...

Date
...

Status
Approved
```

Visualmente, decisões devem parecer registros importantes.

Evitar visual de ticket.

---

# 17. PRIORITY ENGINE

As prioridades devem ser apresentadas de forma muito simples.

Exemplo:

```text
CURRENT PRIORITIES

01
Reposition LinkedIn profile

HIGH
Brand

02
Prepare executive narrative

HIGH
Career

03
Build content authority

MEDIUM
Brand
```

A numeração pode utilizar Bauer Bodoni.

---

# 18. CAREER SCORE

O Career Score deve ser apresentado como **instrumento interno e orientativo**, não como uma avaliação absoluta da pessoa.

Visual:

```text
CAREER SCORE

78

Strategic Direction       82
Market Position           71
Professional Narrative    86
Visibility                74
Network                   69

Last review
Sep 2026

+6 since previous review
```

Evitar velocímetros, gauges e gráficos exagerados.

Preferir:

* números
* barras horizontais
* pequenas tendências
* sparklines

---

# 19. RELATÓRIO MENSAL

O Monthly Career Report deve ter aparência editorial.

Pode parecer uma mistura de:

**consulting report + private briefing + executive dossier**

Estrutura:

```text
MONTHLY CAREER REPORT

ANA SILVA

September 2026

────────────────────────

01
Executive Summary

02
Career Evolution

03
Brand Evolution

04
Key Decisions

05
Market Intelligence

06
Opportunities

07
Next Priorities

08
Advisor Notes
```

Utilizar bastante:

* Bauer Bodoni
* EB Garamond
* linhas finas
* grandes margens
* números de seção
* pequenos detalhes em Burgundy

---

# 20. CARDS

Cards devem ser utilizados com moderação.

Não criar:

```text
[Card]
[Card]
[Card]
[Card]
[Card]
```

para tudo.

Preferir:

* áreas abertas
* divisores
* listas
* tabelas
* seções
* blocos editoriais

Cards somente quando houver necessidade de agrupar informação.

Border radius:

**6–10px**

Evitar:

* 16px
* 20px
* 24px
* cards completamente arredondados

A estética deve ser mais editorial e arquitetônica.

---

# 21. BORDAS

Usar linhas muito discretas.

Exemplo:

```text
1px solid #DDD6C9
```

Evitar borders muito contrastantes.

A interface deve parecer construída através de:

**espaço + tipografia + linhas**

e não:

**boxes + shadows + colors.**

---

# 22. SHADOWS

Usar sombras quase imperceptíveis.

Preferência:

```text
0 2px 8px rgba(20, 23, 26, 0.04)
```

Nunca utilizar sombras fortes.

---

# 23. BORDER RADIUS

Sistema:

```text
Small: 4px
Default: 8px
Large: 12px
```

Botões:

6–8px.

Inputs:

6–8px.

Cards:

8–10px.

---

# 24. BOTÕES

Primary:

Background:

`#531113`

Text:

`#F6F3ED`

Secondary:

Background:

transparent

Border:

`#C9BEAE`

Text:

`#2D2B28`

Tertiary:

sem background

text:

`#531113`

Botões devem ser discretos.

Evitar:

* gradientes
* glow
* efeitos neon
* sombras grandes
* botões gigantes

---

# 25. STATUS

Não utilizar somente vermelho / amarelo / verde.

Criar uma linguagem própria:

### Active

Burgundy

### Strategic

Olive Bronze

### Pending

Terracotta

### Neutral

Stone

### Archived

Gray

O status deve aparecer como pequenos indicadores ou labels.

---

# 26. GRÁFICOS

Os gráficos devem ser extremamente minimalistas.

Preferir:

* line charts
* bar charts horizontais
* sparklines
* progress bars

Evitar:

* pie charts
* 3D charts
* gauges
* gráficos multicoloridos
* dashboards extremamente coloridos

Usar principalmente:

`#531113`

`#8D4E30`

`#5F5022`

`#B0A383`

com fundo neutro.

---

# 27. TABELAS

Tabelas devem seguir padrão de software profissional.

Exemplo:

```text
CLIENT          CAREER        BRAND        PRIORITY       NEXT REVIEW

Ana Silva       Strong        Developing   High           Sep 23
Carlos Mendes   Stable        Strong       Medium         Sep 25
Marina Costa    Transition    Strong       High           Sep 27
```

Linhas limpas.

Sem excesso de borders.

Hover extremamente sutil.

---

# 28. SEARCH

Busca global sempre disponível.

Shortcut:

`⌘ K`

ou

`Ctrl K`

Permitir procurar:

* clientes
* decisões
* tarefas
* reuniões
* oportunidades
* relatórios
* informações estratégicas

Visual semelhante a command palette de softwares profissionais.

---

# 29. EMPTY STATES

Não utilizar ilustrações genéricas de SaaS.

Usar mensagens editoriais.

Exemplo:

```text
No strategic decisions yet.

Decisions made during advisory sessions
will appear here.
```

Tipografia EB Garamond.

Muito espaço vazio.

---

# 30. MICROINTERAÇÕES

As animações devem ser quase imperceptíveis.

Duração:

150–250ms.

Utilizar:

* fade
* subtle slide
* opacity
* hover transitions

Evitar:

* bounce
* spring exagerado
* parallax
* partículas
* efeitos futuristas

---

# 31. RESPONSIVIDADE

Desktop é prioridade.

Breakpoints:

```text
≥ 1440px
Large desktop

1280–1439px
Desktop

1024–1279px
Small desktop / tablet landscape

768–1023px
Tablet

<768px
Mobile
```

O mobile deve permitir:

* consulta de clientes
* tarefas
* reuniões
* decisões
* notas

Mas não precisa reproduzir toda a complexidade do desktop.

---

# 32. ICONOGRAFIA

Utilizar ícones simples e lineares.

Preferência:

**Lucide Icons**

Stroke:

1.5–1.75px.

Tamanho:

14–18px.

Nunca utilizar emojis como elementos de interface.

---

# 33. AVATAR

Avatares devem ser discretos.

Utilizar:

* fotografia circular pequena
* iniciais
* monograma

Evitar avatares muito grandes.

---

# 34. FOTOGRAFIA

Quando houver fotografias de clientes, utilizar imagens com estética editorial/profissional.

Evitar:

* stock photos genéricas
* fotos excessivamente corporativas
* filtros fortes
* imagens coloridas demais

A fotografia deve funcionar como parte de um **private dossier**.

---

# 35. PRINCÍPIO DE HIERARQUIA

Cada tela deve possuir apenas:

### 1 elemento dominante

Exemplo:

Nome do cliente.

### 2–4 elementos secundários

Exemplo:

Career Score, Priority, Next Review.

### Conteúdo operacional

Listas, tarefas, decisões etc.

Não permitir que todos os elementos tenham o mesmo peso visual.

---

# 36. DASHBOARD DO CLIENTE

Quando o portal do cliente for desenvolvido, ele deverá ser significativamente mais simples.

O cliente não deve visualizar a complexidade interna.

Mostrar:

```text
YOUR CAREER JOURNEY

Current focus

Your priorities

Your progress

Your approved positioning

Content awaiting approval

Upcoming meeting

Monthly report
```

A experiência deve transmitir:

> “Meu advisor sabe exatamente onde estamos e o que estamos fazendo.”

---

# 37. DESIGN TOKENS

Criar tokens desde o início.

```css
--color-burgundy: #531113;
--color-coffee: #3B2418;
--color-brown: #46291A;
--color-terracotta: #8D4E30;
--color-stone: #B0A383;
--color-olive: #5F5022;
--color-olive-gray: #3E3E2F;
--color-charcoal: #2D2B28;
--color-black: #14171A;

--background: #F6F3ED;
--surface: #FBF9F5;
--surface-secondary: #EFEAE1;

--border: #DDD6C9;
--border-strong: #C9BEAE;

--font-display: "Bauer Bodoni";
--font-editorial: "EB Garamond";
--font-ui: "Inter";

--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;

--shadow-subtle: 0 2px 8px rgba(20,23,26,.04);
```

---

# 38. PRINCÍPIO FINAL

O sistema deve parecer uma ferramenta criada por um **strategic advisor experiente**, não por uma startup tentando parecer sofisticada.

A estética deve ser:

**quiet luxury, não luxury marketing.**

**Italian, não temático italiano.**

**Executive, não corporativo.**

**Editorial, não fashion.**

**Intelligent, não futurista.**

**Premium, não chamativo.**

A interface deve fazer o usuário sentir que está entrando em um **escritório privado de estratégia de carreira**.

A pergunta principal para cada decisão visual é:

> “Isso aumenta a percepção de inteligência, precisão e exclusividade?”

Se não aumentar, remover.

O resultado final deve combinar a sofisticação visual da marca pessoal do Advisor com a usabilidade e previsibilidade de softwares profissionais consolidados.

**Referências de UX:** Linear, Notion, Stripe Dashboard, Vercel, Raycast, Superhuman e ferramentas modernas de consulting / executive intelligence — absorvendo seus princípios de navegação, hierarquia e interação, sem copiar visualmente nenhuma delas.
