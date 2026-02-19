# WMSS - Controle de Estoque por Área

Aplicação web simples (HTML/CSS/JS) para operar com Supabase e gerenciar:

- Cadastro/edição/exclusão de estoque por **área + SKU + tipo**.
- Cadastro de SKUs em `produtos`.
- Consulta de onde cada produto está e totais por SKU em todas as áreas.
- Expedição com baixa de estoque e registro em `movimentacoes`.
- Exportação em planilha (XLSX) no fim de cada seção.

## Como rodar

Abra o `index.html` no navegador **ou** sirva com:

```bash
python3 -m http.server 4173
```

Depois acesse `http://localhost:4173`.

## Banco usado

A aplicação foi preparada para as tabelas:

- `estoque_area(area, sku, paletes, tipo)`
- `movimentacoes(id, sku, tipo, paletes, created_at)`
- `produtos(sku, fardos_por_palete)`
- `tipos_palete(tipo, fardos_por_palete)`

As credenciais informadas já vêm preenchidas no formulário e podem ser alteradas.
