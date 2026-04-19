-- ==========================================================
-- WMSS - Tabela de logs de ações
-- Execute este script no Supabase SQL Editor
-- ==========================================================

create table if not exists public.wmss_logs (
  id        bigserial primary key,
  usuario   text not null,
  acao      text not null,
  detalhe   text,
  created_at timestamptz not null default now()
);

create index if not exists idx_wmss_logs_usuario   on public.wmss_logs (usuario);
create index if not exists idx_wmss_logs_created   on public.wmss_logs (created_at desc);
create index if not exists idx_wmss_logs_acao      on public.wmss_logs (acao);

-- RLS: permite insert e select para a chave anon (ajuste conforme sua estratégia)
alter table public.wmss_logs enable row level security;

create policy "wmss_logs_insert" on public.wmss_logs
  for insert with check (true);

create policy "wmss_logs_select" on public.wmss_logs
  for select using (true);

-- ==========================================================
-- WMSS - Policy de UPDATE para wmss_users (corrige edição de perfil)
-- Execute junto com o script acima
-- ==========================================================

alter table public.wmss_users enable row level security;

-- Remove policies antigas se existirem, para evitar conflito
drop policy if exists "allow_anon_select" on public.wmss_users;
drop policy if exists "allow_anon_update" on public.wmss_users;
drop policy if exists "allow_anon_insert" on public.wmss_users;

create policy "wmss_users_select" on public.wmss_users
  for select using (true);

create policy "wmss_users_insert" on public.wmss_users
  for insert with check (true);

create policy "wmss_users_update" on public.wmss_users
  for update using (true) with check (true);
