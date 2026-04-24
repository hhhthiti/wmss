-- ==========================================================
-- WMSS - Schema SQL v2 (Supabase / PostgreSQL)
-- Objetivo:
--   - Cadastro de áreas e SKUs
--   - Controle de estoque por área + SKU + tipo
--   - Expedição com baixa de estoque e log de movimentações
--   - Consultas consolidadas (totais por área e por SKU)
-- ==========================================================

-- Extensão para UUID aleatório
create extension if not exists pgcrypto;

-- -----------------------------
-- Tabelas de domínio
-- -----------------------------
create table if not exists public.areas (
  codigo text primary key,
  descricao text,
  ativo boolean not null default true,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint areas_codigo_ck check (codigo = upper(trim(codigo)) and length(trim(codigo)) > 0)
);

create table if not exists public.tipos_palete (
  tipo text primary key,
  fardos_por_palete integer,
  created_at timestamp without time zone not null default now(),
  constraint tipos_palete_tipo_ck check (tipo = upper(trim(tipo)) and length(trim(tipo)) > 0),
  constraint tipos_palete_fardos_ck check (fardos_por_palete is null or fardos_por_palete > 0)
);

create table if not exists public.produtos (
  sku bigint primary key,
  descricao text,
  fardos_por_palete integer not null,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint produtos_sku_ck check (sku > 0),
  constraint produtos_fardos_ck check (fardos_por_palete > 0)
);

-- -----------------------------
-- Estoque por área
-- -----------------------------
create table if not exists public.estoque_area (
  area text not null,
  sku bigint not null,
  tipo text not null,
  paletes integer not null,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint estoque_area_pk primary key (area, sku, tipo),
  constraint estoque_area_area_fk foreign key (area) references public.areas (codigo) on update cascade,
  constraint estoque_area_sku_fk foreign key (sku) references public.produtos (sku) on update cascade,
  constraint estoque_area_tipo_fk foreign key (tipo) references public.tipos_palete (tipo) on update cascade,
  constraint estoque_area_paletes_ck check (paletes >= 0)
);

create index if not exists idx_estoque_area_sku on public.estoque_area (sku);
create index if not exists idx_estoque_area_area on public.estoque_area (area);

-- -----------------------------
-- Movimentações
-- -----------------------------
create table if not exists public.movimentacoes (
  id uuid primary key default gen_random_uuid(),
  operacao text not null,
  area text not null,
  sku bigint not null,
  tipo text not null,
  paletes integer not null,
  observacao text,
  created_at timestamp without time zone not null default now(),
  constraint movimentacoes_operacao_ck check (operacao in ('ENTRADA', 'EXPEDICAO', 'AJUSTE')),
  constraint movimentacoes_paletes_ck check (paletes > 0),
  constraint movimentacoes_area_fk foreign key (area) references public.areas (codigo) on update cascade,
  constraint movimentacoes_sku_fk foreign key (sku) references public.produtos (sku) on update cascade,
  constraint movimentacoes_tipo_fk foreign key (tipo) references public.tipos_palete (tipo) on update cascade
);

create index if not exists idx_movimentacoes_data on public.movimentacoes (created_at desc);
create index if not exists idx_movimentacoes_sku on public.movimentacoes (sku);

-- -----------------------------
-- Trigger para updated_at
-- -----------------------------
create or replace function public.fn_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_areas_updated_at on public.areas;
create trigger trg_areas_updated_at
before update on public.areas
for each row execute function public.fn_set_updated_at();

drop trigger if exists trg_produtos_updated_at on public.produtos;
create trigger trg_produtos_updated_at
before update on public.produtos
for each row execute function public.fn_set_updated_at();

drop trigger if exists trg_estoque_area_updated_at on public.estoque_area;
create trigger trg_estoque_area_updated_at
before update on public.estoque_area
for each row execute function public.fn_set_updated_at();

-- -----------------------------
-- Função de expedição (baixa segura)
-- -----------------------------
create or replace function public.fn_expedir_produto(
  p_area text,
  p_sku bigint,
  p_tipo text,
  p_paletes integer,
  p_observacao text default null
)
returns table (
  area text,
  sku bigint,
  tipo text,
  saldo_paletes integer
)
language plpgsql
as $$
declare
  v_atual integer;
  v_novo integer;
begin
  if p_paletes is null or p_paletes <= 0 then
    raise exception 'Quantidade para expedição deve ser maior que zero';
  end if;

  select e.paletes
    into v_atual
  from public.estoque_area e
  where e.area = upper(trim(p_area))
    and e.sku = p_sku
    and e.tipo = upper(trim(p_tipo))
  for update;

  if v_atual is null then
    raise exception 'Registro não encontrado no estoque (área %, sku %, tipo %)', p_area, p_sku, p_tipo;
  end if;

  if v_atual < p_paletes then
    raise exception 'Estoque insuficiente para expedição. Atual: %, solicitado: %', v_atual, p_paletes;
  end if;

  v_novo := v_atual - p_paletes;

  if v_novo = 0 then
    delete from public.estoque_area
    where area = upper(trim(p_area))
      and sku = p_sku
      and tipo = upper(trim(p_tipo));
  else
    update public.estoque_area
       set paletes = v_novo
     where area = upper(trim(p_area))
       and sku = p_sku
       and tipo = upper(trim(p_tipo));
  end if;

  insert into public.movimentacoes (operacao, area, sku, tipo, paletes, observacao)
  values ('EXPEDICAO', upper(trim(p_area)), p_sku, upper(trim(p_tipo)), p_paletes, p_observacao);

  return query
  select upper(trim(p_area)), p_sku, upper(trim(p_tipo)), v_novo;
end;
$$;

-- -----------------------------
-- Views para consulta
-- -----------------------------
create or replace view public.vw_consulta_estoque as
select
  e.area,
  e.sku,
  p.descricao as produto,
  e.tipo,
  e.paletes,
  coalesce(tp.fardos_por_palete, p.fardos_por_palete) as fardos_por_palete_ref,
  e.paletes * coalesce(tp.fardos_por_palete, p.fardos_por_palete) as total_fardos_estimado
from public.estoque_area e
join public.produtos p on p.sku = e.sku
left join public.tipos_palete tp on tp.tipo = e.tipo;

create or replace view public.vw_totais_sku as
select
  e.sku,
  p.descricao as produto,
  sum(e.paletes)::integer as total_paletes,
  sum(e.paletes * coalesce(tp.fardos_por_palete, p.fardos_por_palete))::integer as total_fardos_estimado
from public.estoque_area e
join public.produtos p on p.sku = e.sku
left join public.tipos_palete tp on tp.tipo = e.tipo
group by e.sku, p.descricao
order by e.sku;

-- -----------------------------
-- Seeds básicos (idempotentes)
-- -----------------------------
insert into public.tipos_palete (tipo, fardos_por_palete)
values
  ('PL2', null),
  ('PBR', null),
  ('FARDO', 1)
on conflict (tipo) do nothing;

-- Exemplo de áreas
insert into public.areas (codigo, descricao)
values
  ('B01', 'Área B01'),
  ('B02', 'Área B02')
on conflict (codigo) do nothing;
