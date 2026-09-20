-- Initial schema for Advisor Career Office
-- Covers Fase 1 (fundação) e parte da Fase 2 (metodologia) do PRD.
-- Modelo: poucos usuários (advisors), todos autenticados podem operar sobre
-- todos os clientes. RLS bloqueia qualquer acesso anônimo/não autenticado.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: um registro por advisor autenticado (espelha auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'advisor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- creates a profile row automatically when a new auth user signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- helper: reusable updated_at trigger
-- ---------------------------------------------------------------------------
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- clients: cadastro 360º
-- ---------------------------------------------------------------------------
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  photo_url text,
  email text,
  phone text,
  role_title text,
  company text,
  segment text,
  city text,
  social_links jsonb not null default '[]'::jsonb,
  website text,
  relationship_status text not null default 'onboarding'
    check (relationship_status in ('onboarding', 'active', 'paused', 'ended')),
  start_date date,
  main_objective text,
  current_challenges text,
  notes text,
  owner_id uuid references public.profiles (id),
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger clients_set_updated_at
  before update on public.clients
  for each row execute procedure public.set_updated_at();

alter table public.clients enable row level security;

create policy "authenticated users manage clients"
  on public.clients for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- client_contacts
-- ---------------------------------------------------------------------------
create table public.client_contacts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  label text not null,
  value text not null,
  created_at timestamptz not null default now()
);

alter table public.client_contacts enable row level security;

create policy "authenticated users manage client_contacts"
  on public.client_contacts for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- professional_dna_items (5.3)
-- ---------------------------------------------------------------------------
create table public.professional_dna_items (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  category text not null,
  content text not null,
  status text not null default 'draft'
    check (status in ('draft', 'validated', 'rejected', 'archived')),
  source text
    check (source in ('interview', 'document', 'observation', 'client_statement')),
  advisor_note text,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger professional_dna_items_set_updated_at
  before update on public.professional_dna_items
  for each row execute procedure public.set_updated_at();

alter table public.professional_dna_items enable row level security;

create policy "authenticated users manage professional_dna_items"
  on public.professional_dna_items for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- career_strategies + career_goals + career_actions (5.4)
-- ---------------------------------------------------------------------------
create table public.career_strategies (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  version integer not null default 1,
  future_vision text,
  main_objective text,
  current_situation text,
  perceived_positioning text,
  desired_situation text,
  strategic_gaps text,
  priorities text,
  plan_90_days text,
  plan_12_months text,
  risks_and_obstacles text,
  decision_criteria text,
  is_current boolean not null default true,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger career_strategies_set_updated_at
  before update on public.career_strategies
  for each row execute procedure public.set_updated_at();

alter table public.career_strategies enable row level security;

create policy "authenticated users manage career_strategies"
  on public.career_strategies for all
  to authenticated
  using (true)
  with check (true);

create table public.career_goals (
  id uuid primary key default gen_random_uuid(),
  career_strategy_id uuid not null references public.career_strategies (id) on delete cascade,
  description text not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.career_goals enable row level security;

create policy "authenticated users manage career_goals"
  on public.career_goals for all
  to authenticated
  using (true)
  with check (true);

create table public.career_actions (
  id uuid primary key default gen_random_uuid(),
  career_strategy_id uuid not null references public.career_strategies (id) on delete cascade,
  description text not null,
  responsible text,
  due_date date,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'done', 'blocked', 'cancelled')),
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  expected_result text,
  actual_result text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger career_actions_set_updated_at
  before update on public.career_actions
  for each row execute procedure public.set_updated_at();

alter table public.career_actions enable row level security;

create policy "authenticated users manage career_actions"
  on public.career_actions for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- positioning_versions (5.5)
-- ---------------------------------------------------------------------------
create table public.positioning_versions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'in_review'
    check (status in ('in_review', 'approved', 'rejected', 'archived')),
  justification text,
  advisor_comments text,
  target_audience text,
  niche text,
  authority_territory text,
  problems_solved text,
  differentiators text,
  value_proposition text,
  positioning_statement text,
  presentation_speech text,
  professional_bio text,
  key_messages text,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger positioning_versions_set_updated_at
  before update on public.positioning_versions
  for each row execute procedure public.set_updated_at();

alter table public.positioning_versions enable row level security;

create policy "authenticated users manage positioning_versions"
  on public.positioning_versions for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- brand_brain_items + client_skill_versions (5.6)
-- ---------------------------------------------------------------------------
create table public.brand_brain_items (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  category text not null,
  content text not null,
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'rejected', 'archived')),
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  advisor_note text,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger brand_brain_items_set_updated_at
  before update on public.brand_brain_items
  for each row execute procedure public.set_updated_at();

alter table public.brand_brain_items enable row level security;

create policy "authenticated users manage brand_brain_items"
  on public.brand_brain_items for all
  to authenticated
  using (true)
  with check (true);

create table public.client_skill_versions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  compiled_text text not null,
  generated_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.client_skill_versions enable row level security;

create policy "authenticated users manage client_skill_versions"
  on public.client_skill_versions for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- tasks (5.1 dashboard / operação geral)
-- ---------------------------------------------------------------------------
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients (id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'done', 'cancelled')),
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  assigned_to uuid references public.profiles (id),
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute procedure public.set_updated_at();

alter table public.tasks enable row level security;

create policy "authenticated users manage tasks"
  on public.tasks for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- indexes
-- ---------------------------------------------------------------------------
create index clients_owner_id_idx on public.clients (owner_id);
create index professional_dna_items_client_id_idx on public.professional_dna_items (client_id);
create index career_strategies_client_id_idx on public.career_strategies (client_id);
create index career_actions_career_strategy_id_idx on public.career_actions (career_strategy_id);
create index positioning_versions_client_id_idx on public.positioning_versions (client_id);
create index brand_brain_items_client_id_idx on public.brand_brain_items (client_id);
create index client_skill_versions_client_id_idx on public.client_skill_versions (client_id);
create index tasks_client_id_idx on public.tasks (client_id);
