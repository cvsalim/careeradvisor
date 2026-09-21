-- AI Workspace (PRD 5.11 / 6 / 7): app-level secrets + execution history.

-- Holds server-only configuration (e.g. the OpenAI API key). No RLS policies
-- are defined on purpose: only the service-role key (used server-side) can
-- read/write this table, never the anon/authenticated roles.
create table public.app_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id)
);

alter table public.app_settings enable row level security;

create table public.ai_executions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  task_key text not null,
  task_label text not null,
  context_blocks jsonb,
  system_prompt text not null,
  user_prompt text not null,
  result text,
  status text not null default 'completed'
    check (status in ('completed', 'failed')),
  error_message text,
  saved_to jsonb,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.ai_executions enable row level security;

create policy "authenticated users manage ai_executions"
  on public.ai_executions for all
  to authenticated
  using (true)
  with check (true);

create index ai_executions_client_id_idx on public.ai_executions (client_id);
