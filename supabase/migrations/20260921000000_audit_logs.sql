-- Audit trail (5.2 / seção 4.3 da PRD): registra mudanças materiais em
-- entidades estratégicas para dar rastreabilidade ao Advisor.

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients (id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  action text not null
    check (action in ('created', 'updated', 'status_changed', 'deleted')),
  old_value jsonb,
  new_value jsonb,
  reason text,
  changed_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

create policy "authenticated users manage audit_logs"
  on public.audit_logs for all
  to authenticated
  using (true)
  with check (true);

create index audit_logs_client_id_idx on public.audit_logs (client_id);
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);
