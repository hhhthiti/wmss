-- ==========================================================
-- WMSS - ALTER TABLEs para schema atual informado pelo usuário
-- Base atual:
--   estoque_area(area, sku, paletes, tipo)
--   movimentacoes(id, sku, tipo, paletes, created_at)
--   produtos(sku, fardos_por_palete, tipo)
--   tipos_palete(tipo, fardos_por_palete)
-- ==========================================================

-- 1) Regras mínimas de qualidade de dados
alter table if exists public.estoque_area
  add constraint if not exists estoque_area_paletes_ck check (paletes >= 0);

alter table if exists public.movimentacoes
  add constraint if not exists movimentacoes_paletes_ck check (paletes > 0);

alter table if exists public.produtos
  add constraint if not exists produtos_fardos_ck check (fardos_por_palete > 0);

-- 2) Índices úteis para consulta/performance
create index if not exists idx_estoque_area_sku on public.estoque_area (sku);
create index if not exists idx_estoque_area_area on public.estoque_area (area);
create index if not exists idx_movimentacoes_created_at on public.movimentacoes (created_at desc);
create index if not exists idx_movimentacoes_sku on public.movimentacoes (sku);

-- 3) Colunas opcionais para registrar expedição com mais contexto
-- (o front já funciona sem elas; isso é apenas melhoria)
alter table if exists public.movimentacoes
  add column if not exists operacao text;

alter table if exists public.movimentacoes
  add column if not exists area text;

alter table if exists public.movimentacoes
  add column if not exists observacao text;

-- 4) Default e check da coluna operacao (somente se a coluna existir)
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'movimentacoes'
      and column_name = 'operacao'
  ) then
    alter table public.movimentacoes
      alter column operacao set default 'EXPEDICAO';

    if not exists (
      select 1
      from pg_constraint
      where conname = 'movimentacoes_operacao_ck'
    ) then
      alter table public.movimentacoes
        add constraint movimentacoes_operacao_ck
        check (operacao in ('ENTRADA', 'EXPEDICAO', 'AJUSTE'));
    end if;
  end if;
end $$;

-- 5) View de totais por SKU para uso em consulta/relatórios
create or replace view public.vw_totais_sku as
select
  sku,
  sum(paletes)::integer as total_paletes
from public.estoque_area
group by sku
order by sku;
