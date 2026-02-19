# WMSS - Controle de Estoque por Área

Aplicação web simples (HTML/CSS/JS) para operar com Supabase e gerenciar:

- Cadastro/edição/exclusão de estoque por **área + SKU + tipo**.
- Cadastro de SKUs em `produtos`.
- Consulta de onde cada produto está e totais por SKU em todas as áreas.
- Expedição com baixa de estoque e registro em `movimentacoes`.
- Importação de planilha Excel/CSV para **incluir/atualizar/apagar** posições em lote.
- Exportação em planilha (XLSX) no fim de cada seção.

## Como rodar o front

Abra o `index.html` no navegador **ou** sirva com:

```bash
python3 -m http.server 4173
```

Depois acesse `http://localhost:4173`.

## Importação de planilha (novo)

Na aba **Cadastro** existe uma seção para upload de arquivo (`.xlsx`, `.xls`, `.csv`).

### Colunas esperadas

- `area`
- `sku`
- `tipo`
- `paletes`
- `acao` (opcional)

### Regras

- Se `acao` for `APAGAR`, `EXCLUIR`, `DELETE`, `DEL`, `REMOVER` ou `REMOVE`, a posição é apagada.
- Se `paletes = 0`, também apaga a posição.
- Nos demais casos, faz **incluir/atualizar** via `upsert`.

### Exemplo

| area | sku | tipo | paletes | acao |
|------|-----|------|---------|------|
| B02 | 20104409 | PL2 | 30 | |
| B02 | 30152626 | PBR | 25 | |
| B02 | 30152626 | PBR | 0 | APAGAR |

## Novo SQL do sistema (Supabase)

Foi adicionado o arquivo:

- `supabase/schema_v2.sql`

Esse script cria uma estrutura mais completa com:

- tabela `areas` (cadastro de áreas),
- tabela `tipos_palete`,
- tabela `produtos`,
- tabela `estoque_area` com chaves estrangeiras,
- tabela `movimentacoes` com tipo de operação,
- função `fn_expedir_produto(...)` para baixa segura de estoque,
- views `vw_consulta_estoque` e `vw_totais_sku` para consultas,
- seeds iniciais de tipos (`PL2`, `PBR`, `FARDO`) e áreas exemplo.

### Como aplicar no Supabase SQL Editor

1. Abra o projeto no Supabase.
2. Entre em **SQL Editor**.
3. Cole o conteúdo de `supabase/schema_v2.sql`.
4. Execute o script.

> Observação: o script é idempotente (usa `if not exists` e `on conflict do nothing`) para facilitar reexecução.
