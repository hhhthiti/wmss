-- Cadastro de perfis do WMSS. Senhas ficam exclusivamente no Supabase Auth.

create table if not exists public.wmss_users (
  id bigserial primary key,
  usuario text not null unique,
  nome text,
  perfil text not null default 'COMUM' check (perfil in ('MASTER', 'COMUM', 'ANALISTA')),
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_wmss_users_perfil on public.wmss_users (perfil);
create index if not exists idx_wmss_users_ativo on public.wmss_users (ativo);

create or replace function public.set_updated_at_wmss_users()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_wmss_users_updated_at on public.wmss_users;
create trigger trg_wmss_users_updated_at
before update on public.wmss_users
for each row execute function public.set_updated_at_wmss_users();

-- Não crie um usuário mestre padrão neste script.
-- Use a Edge Function wmss-admin-users com uma chave temporária após aplicar
-- a migração supabase/migrations/202611090001_secure_auth_and_rls.sql.

alter table public.wmss_users enable row level security;
revoke all on public.wmss_users from public, anon, authenticated;
