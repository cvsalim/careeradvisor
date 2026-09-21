-- Fase 5 (parcial) do PRD — Evolução: portal simplificado do cliente (somente
-- leitura), recursos externos e sinais de mercado (registro manual).
--
-- Modelo de acesso do portal: o Advisor cria manualmente, no painel do
-- Supabase, um usuário de autenticação para o cliente e define
-- `user_metadata.role = 'client'`. Em seguida, o Advisor vincula esse usuário
-- ao registro do cliente via `clients.portal_user_id`. Usuários de portal têm
-- acesso apenas de leitura aos seus próprios dados já publicados/aprovados;
-- usuários internos (sem essa claim) continuam com acesso total, como hoje.

alter table public.clients
  add column portal_user_id uuid unique references auth.users (id) on delete set null;

create or replace function public.is_portal_client()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'user_metadata' ->> 'role') = 'client', false);
$$;

create or replace function public.current_portal_client_id()
returns uuid
language sql
stable
as $$
  select id from public.clients where portal_user_id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- clients: usuários internos mantêm CRUD total; usuários de portal só leem o
-- próprio registro.

drop policy "authenticated users manage clients" on public.clients;

create policy "staff manage clients"
  on public.clients for all
  to authenticated
  using (not public.is_portal_client())
  with check (not public.is_portal_client());

create policy "portal client reads own record"
  on public.clients for select
  to authenticated
  using (public.is_portal_client() and id = public.current_portal_client_id());

-- ---------------------------------------------------------------------------
-- career_score_entries: portal lê o próprio histórico de score.

drop policy "authenticated users manage career_score_entries" on public.career_score_entries;

create policy "staff manage career_score_entries"
  on public.career_score_entries for all
  to authenticated
  using (not public.is_portal_client())
  with check (not public.is_portal_client());

create policy "portal client reads own career_score_entries"
  on public.career_score_entries for select
  to authenticated
  using (public.is_portal_client() and client_id = public.current_portal_client_id());

-- ---------------------------------------------------------------------------
-- monthly_reviews: portal lê apenas relatórios com status "shared".

drop policy "authenticated users manage monthly_reviews" on public.monthly_reviews;

create policy "staff manage monthly_reviews"
  on public.monthly_reviews for all
  to authenticated
  using (not public.is_portal_client())
  with check (not public.is_portal_client());

create policy "portal client reads shared monthly_reviews"
  on public.monthly_reviews for select
  to authenticated
  using (
    public.is_portal_client()
    and client_id = public.current_portal_client_id()
    and status = 'shared'
  );

-- ---------------------------------------------------------------------------
-- decisions: portal lê apenas decisões com status "approved".

drop policy "authenticated users manage decisions" on public.decisions;

create policy "staff manage decisions"
  on public.decisions for all
  to authenticated
  using (not public.is_portal_client())
  with check (not public.is_portal_client());

create policy "portal client reads approved decisions"
  on public.decisions for select
  to authenticated
  using (
    public.is_portal_client()
    and client_id = public.current_portal_client_id()
    and status = 'approved'
  );

-- ---------------------------------------------------------------------------
-- content_items: portal lê apenas conteúdo com status "published".

drop policy "authenticated users manage content_items" on public.content_items;

create policy "staff manage content_items"
  on public.content_items for all
  to authenticated
  using (not public.is_portal_client())
  with check (not public.is_portal_client());

create policy "portal client reads published content_items"
  on public.content_items for select
  to authenticated
  using (
    public.is_portal_client()
    and client_id = public.current_portal_client_id()
    and status = 'published'
  );

-- ---------------------------------------------------------------------------
-- external_resources: registro simples de links/resumos de ferramentas
-- externas (ChatGPT, Perplexity, Granola, Canva etc.), por cliente.
-- Uso exclusivo interno — não exposto ao portal do cliente.

create table public.external_resources (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  tool_name text not null,
  link text,
  summary text,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.external_resources enable row level security;

create policy "staff manage external_resources"
  on public.external_resources for all
  to authenticated
  using (not public.is_portal_client())
  with check (not public.is_portal_client());

create index external_resources_client_id_idx on public.external_resources (client_id);

-- ---------------------------------------------------------------------------
-- market_signals: registro manual de sinais/insights de mercado (a partir de
-- Perplexity, Google Trends etc.). Pode ser vinculado a um cliente ou geral
-- (client_id nulo = watchlist geral do Advisor). Uso exclusivo interno.

create table public.market_signals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients (id) on delete cascade,
  title text not null,
  source text,
  summary text,
  tags text[] not null default '{}',
  signal_date date not null default current_date,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.market_signals enable row level security;

create policy "staff manage market_signals"
  on public.market_signals for all
  to authenticated
  using (not public.is_portal_client())
  with check (not public.is_portal_client());

create index market_signals_client_id_idx on public.market_signals (client_id);
