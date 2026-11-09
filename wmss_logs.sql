-- WMSS - tabela de logs. Aplique as políticas restritivas da migração
-- supabase/migrations/202611090001_secure_auth_and_rls.sql.

create table if not exists public.wmss_logs (
  id bigserial primary key,
  usuario text not null,
  acao text not null,
  detalhe text,
  created_at timestamptz not null default now()
);

create index if not exists idx_wmss_logs_usuario on public.wmss_logs (usuario);
create index if not exists idx_wmss_logs_created on public.wmss_logs (created_at desc);
create index if not exists idx_wmss_logs_acao on public.wmss_logs (acao);

alter table public.wmss_logs enable row level security;
-- Nenhuma política anon é criada aqui.
revoke all on public.wmss_logs from public, anon, authenticated;
