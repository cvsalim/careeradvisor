-- Fase 3 do PRD — Operação do Advisor: diário de carreira, reuniões, decisões,
-- pipeline de conteúdo, career score e relatório mensal.

create table public.career_journal_entries (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  title text not null,
  entry_date date not null default current_date,
  entry_type text not null default 'event'
    check (entry_type in (
      'achievement', 'feedback', 'decision', 'difficulty', 'learning',
      'objective_change', 'positioning_change', 'event', 'other'
    )),
  description text,
  impact text,
  tags text[] not null default '{}',
  visibility text not null default 'advisor_only'
    check (visibility in ('advisor_only', 'client_visible')),
  related_to text,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.career_journal_entries enable row level security;

create policy "authenticated users manage career_journal_entries"
  on public.career_journal_entries for all
  to authenticated
  using (true)
  with check (true);

create index career_journal_entries_client_id_idx
  on public.career_journal_entries (client_id);

-- ---------------------------------------------------------------------------
create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  title text not null,
  meeting_date timestamptz not null default now(),
  notes text,
  summary text,
  next_steps text,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.meetings enable row level security;

create policy "authenticated users manage meetings"
  on public.meetings for all
  to authenticated
  using (true)
  with check (true);

create index meetings_client_id_idx on public.meetings (client_id);

-- ---------------------------------------------------------------------------
create table public.decisions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  title text not null,
  decision_date date not null default current_date,
  description text,
  rationale text,
  status text not null default 'approved'
    check (status in ('proposed', 'approved', 'rejected')),
  related_meeting_id uuid references public.meetings (id) on delete set null,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.decisions enable row level security;

create policy "authenticated users manage decisions"
  on public.decisions for all
  to authenticated
  using (true)
  with check (true);

create index decisions_client_id_idx on public.decisions (client_id);

-- ---------------------------------------------------------------------------
create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  title text not null,
  objective text,
  pillar text,
  theme text,
  format text,
  channel text,
  main_message text,
  briefing text,
  script_text text,
  external_link text,
  status text not null default 'idea'
    check (status in (
      'idea', 'briefing', 'script', 'in_production', 'advisor_review',
      'client_approval', 'published', 'analyzed'
    )),
  planned_date date,
  published_date date,
  result text,
  learning text,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger content_items_set_updated_at
  before update on public.content_items
  for each row execute procedure public.set_updated_at();

alter table public.content_items enable row level security;

create policy "authenticated users manage content_items"
  on public.content_items for all
  to authenticated
  using (true)
  with check (true);

create index content_items_client_id_idx on public.content_items (client_id);

-- ---------------------------------------------------------------------------
create table public.career_score_entries (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  dimension text not null
    check (dimension in (
      'positioning', 'authority', 'visibility', 'networking', 'opportunities', 'impact'
    )),
  score integer not null check (score >= 0 and score <= 100),
  evidence text,
  justification text,
  next_action text,
  evaluated_at date not null default current_date,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.career_score_entries enable row level security;

create policy "authenticated users manage career_score_entries"
  on public.career_score_entries for all
  to authenticated
  using (true)
  with check (true);

create index career_score_entries_client_id_dimension_idx
  on public.career_score_entries (client_id, dimension);

-- ---------------------------------------------------------------------------
create table public.monthly_reviews (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  review_month date not null,
  summary_text text,
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'shared')),
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, review_month)
);

create trigger monthly_reviews_set_updated_at
  before update on public.monthly_reviews
  for each row execute procedure public.set_updated_at();

alter table public.monthly_reviews enable row level security;

create policy "authenticated users manage monthly_reviews"
  on public.monthly_reviews for all
  to authenticated
  using (true)
  with check (true);

create index monthly_reviews_client_id_idx on public.monthly_reviews (client_id);
