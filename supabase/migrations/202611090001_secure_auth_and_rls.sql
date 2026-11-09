-- WMSS security migration.
-- Apply only after backing up the project. Existing users must choose new Auth passwords.

create table if not exists public.wmss_profiles (
  auth_user_id uuid primary key references auth.users(id) on delete cascade,
  usuario text not null unique,
  nome text,
  perfil text not null default 'COMUM' check (perfil in ('MASTER', 'COMUM', 'ANALISTA')),
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.wmss_user_is_active()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.wmss_profiles p
    where p.auth_user_id = (select auth.uid()) and p.ativo
  );
$$;

create or replace function public.wmss_is_master()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.wmss_profiles p
    where p.auth_user_id = (select auth.uid())
      and p.ativo
      and p.perfil = 'MASTER'
  );
$$;

revoke all on function public.wmss_user_is_active() from public, anon;
revoke all on function public.wmss_is_master() from public, anon;
grant execute on function public.wmss_user_is_active() to authenticated;
grant execute on function public.wmss_is_master() to authenticated;

alter table public.wmss_profiles enable row level security;
revoke all on public.wmss_profiles from public, anon, authenticated;
grant select on public.wmss_profiles to authenticated;
drop policy if exists wmss_profiles_read_self_or_master on public.wmss_profiles;
create policy wmss_profiles_read_self_or_master
  on public.wmss_profiles for select to authenticated
  using (auth_user_id = (select auth.uid()) or public.wmss_is_master());

-- Retain user names and roles for controlled re-provisioning, but remove stored passwords.
alter table public.wmss_users enable row level security;
do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'wmss_users' loop
    execute format('drop policy %I on public.wmss_users', p.policyname);
  end loop;
end;
$$;
revoke all on public.wmss_users from public, anon, authenticated;
alter table public.wmss_users drop column if exists senha;

-- All warehouse tables require an active Auth session. Product catalog changes remain MASTER-only.
do $$
declare
  t text;
  p record;
  tables text[] := array['areas', 'tipos_palete', 'produtos', 'estoque_area', 'movimentacoes'];
  master_tables text[] := array['areas', 'tipos_palete', 'produtos'];
begin
  foreach t in array tables loop
    if to_regclass(format('public.%I', t)) is not null then
      for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
        execute format('drop policy %I on public.%I', p.policyname, t);
      end loop;
      execute format('alter table public.%I enable row level security', t);
      execute format('revoke all on public.%I from public, anon', t);
      execute format('grant select, insert, update, delete on public.%I to authenticated', t);
      execute format(
        'create policy wmss_active_auth_read on public.%I for select to authenticated using (public.wmss_user_is_active())',
        t
      );
      if t = any(master_tables) then
        execute format(
          'create policy wmss_master_auth_write on public.%I for all to authenticated using (public.wmss_is_master()) with check (public.wmss_is_master())',
          t
        );
      else
        execute format(
          'create policy wmss_active_auth_write on public.%I for all to authenticated using (public.wmss_user_is_active()) with check (public.wmss_user_is_active())',
          t
        );
      end if;
    end if;
  end loop;
end;
$$;

-- Logs are writable by active users and readable only by the master profile.
alter table public.wmss_logs enable row level security;
do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'wmss_logs' loop
    execute format('drop policy %I on public.wmss_logs', p.policyname);
  end loop;
end;
$$;
revoke all on public.wmss_logs from public, anon;
revoke all on sequence public.wmss_logs_id_seq from public, anon;
grant insert on public.wmss_logs to authenticated;
grant select on public.wmss_logs to authenticated;
grant usage, select on sequence public.wmss_logs_id_seq to authenticated;
create policy wmss_logs_insert_active on public.wmss_logs for insert to authenticated
  with check (public.wmss_user_is_active());
create policy wmss_logs_read_master on public.wmss_logs for select to authenticated
  using (public.wmss_is_master());

-- Views must honor the caller's RLS policies instead of the view owner's privileges.
alter view public.vw_consulta_estoque set (security_invoker = true);
alter view public.vw_totais_sku set (security_invoker = true);
revoke all on public.vw_consulta_estoque, public.vw_totais_sku from public, anon;
grant select on public.vw_consulta_estoque, public.vw_totais_sku to authenticated;

revoke execute on function public.fn_expedir_produto(text, bigint, text, integer, text) from public, anon;
grant execute on function public.fn_expedir_produto(text, bigint, text, integer, text) to authenticated;
