-- Tabela de usuários do WMSS (login simples por usuário/senha)
-- Atenção: para produção, recomenda-se migrar para Supabase Auth + senha com hash.

create table if not exists public.wmss_users (
  id bigserial primary key,
  usuario text not null unique,
  senha text not null,
  nome text,
  perfil text not null default 'COMUM' check (perfil in ('MASTER', 'COMUM')),
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

-- Usuário mestre inicial (altere a senha após executar)
insert into public.wmss_users (usuario, senha, nome, perfil, ativo)
values ('30152962', '123', 'Usuário Mestre', 'MASTER', true)
on conflict (usuario) do update
set perfil = excluded.perfil,
    ativo = excluded.ativo;
