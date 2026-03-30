create extension if not exists pgcrypto;

create table if not exists public.wmss_users (
  id uuid primary key default gen_random_uuid(),
  matricula text unique not null,
  senha text not null,
  email text,
  telefone text,
  perfil text not null check (perfil in ('ADM', 'OPERACAO')),
  created_at timestamp without time zone not null default now()
);

create table if not exists public.wmss_notas (
  id uuid primary key default gen_random_uuid(),
  chave_nfe text unique not null,
  numero_nota text not null,
  motorista text not null,
  telefone_motorista text,
  placa text not null,
  xml_raw text not null,
  publicado_por uuid references public.wmss_users(id),
  created_at timestamp without time zone not null default now()
);

create table if not exists public.wmss_nota_itens (
  id uuid primary key default gen_random_uuid(),
  nota_id uuid not null references public.wmss_notas(id) on delete cascade,
  codigo text not null,
  descricao text not null,
  quantidade_esperada numeric not null default 0
);

create table if not exists public.wmss_conferencias (
  id uuid primary key default gen_random_uuid(),
  nota_id uuid not null references public.wmss_notas(id) on delete cascade,
  user_id uuid not null references public.wmss_users(id),
  status text not null check (status in ('OK', 'COM_DIVERGENCIA')),
  observacao text,
  created_at timestamp without time zone not null default now()
);

create table if not exists public.wmss_conferencia_itens (
  id uuid primary key default gen_random_uuid(),
  conferencia_id uuid not null references public.wmss_conferencias(id) on delete cascade,
  codigo text not null,
  quantidade_esperada numeric not null,
  quantidade_informada numeric not null,
  divergencia boolean not null default false
);

create table if not exists public.wmss_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.wmss_users(id),
  nota_id uuid references public.wmss_notas(id) on delete cascade,
  codigo text,
  quantidade_esperada numeric,
  quantidade_informada numeric,
  divergencia boolean not null default false,
  tipo text not null default 'CONFERENCIA',
  created_at timestamp without time zone not null default now()
);

create table if not exists public.wmss_chat_messages (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references public.wmss_users(id),
  to_user_id uuid references public.wmss_users(id),
  to_role text check (to_role in ('ADM', 'OPERACAO')),
  mensagem text not null,
  created_at timestamp without time zone not null default now()
);

create index if not exists idx_wmss_logs_created_at on public.wmss_logs(created_at desc);
create index if not exists idx_wmss_chat_created_at on public.wmss_chat_messages(created_at desc);
