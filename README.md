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


## Usando seu schema atual (somente ALTER TABLE)

Como você já tem as tabelas criadas, adicionei um script só com alterações incrementais:

- `supabase/alter_tables_from_current_schema.sql`

Esse script **não recria tabelas**. Ele apenas:

- adiciona checks básicos de qualidade de dados,
- cria índices de performance,
- adiciona colunas opcionais em `movimentacoes` (`operacao`, `area`, `observacao`),
- cria a view `vw_totais_sku`.

Pode rodar direto no SQL Editor do Supabase.


## Layout visual do galpão + PDF

Na aba **Cadastro**, clique em **"📦 Visualizar Layout (Cubículos)"** para abrir a planta:

- colunas fixas: `TISSUE | C | BE | BD | A | LONIL`,
- leitura automática das áreas no padrão `TISSUE1`, `C1`, `BE1`, `BD1`, `A1`, `LONIL1` etc,
- corredor B dividido em esquerda/direita (`BE` e `BD`),
- cores por tipo de material (`PL2`, `PBR`, `FARDO`),
- botão para exportar a planta em PDF.

> Se usar `B1`, `B2`... (padrão antigo), o sistema considera como `BE1`, `BE2`... por compatibilidade.
> Se a área não seguir esse padrão, ela continua aparecendo nas tabelas normais de estoque, mas não entra na planta fixa.


## Planilha espelho automática

Foi adicionada uma seção no **Cadastro** para "Planilha espelho automática":

- botão **Baixar planilha espelho agora**,
- opção **Atualizar planilha automaticamente a cada alteração**.

Quando ativo, após ações de cadastro/edição, exclusão, importação e expedição, o sistema baixa uma nova `planilha_espelho_wmss.xlsx` com:

- estoque atual,
- totais por SKU,
- movimentações,
- totais expedidos por SKU.

> Importante: por segurança do navegador, não é possível editar automaticamente o mesmo arquivo Excel já aberto no seu computador. O que o sistema faz é gerar uma nova versão atualizada da planilha.


## Login de usuários (Supabase)

Para cadastrar novos usuários da aplicação, execute também:

- `supabase/wmss_users.sql`

Esse script cria a tabela `public.wmss_users` com:

- `usuario` (único),
- `senha`,
- `perfil` (`MASTER`/`COMUM`),
- `ativo`.

Depois de rodar o script, você pode inserir novos usuários assim:

```sql
insert into public.wmss_users (usuario, senha, nome, perfil, ativo)
values ('12345678', 'minhasenha', 'Operador 1', 'COMUM', true)
on conflict (usuario) do update
set senha = excluded.senha,
    nome = excluded.nome,
    perfil = excluded.perfil,
    ativo = excluded.ativo;
```

> Segurança: o login atual é simples (senha em texto) para operação rápida. Recomendado migrar para Supabase Auth ou hash de senha em produção.

## Integração de IA (AirLLM/OpenAI via Edge Function)

A tela de **Planejamento** agora possui o botão **✨ Sugerir com IA**.

Ela chama a função HTTP:

- `POST /functions/v1/wmss-ai-assist`

com payload:

```json
{
  "prompt": "texto digitado pelo usuário",
  "context": {
    "capacidadePlanejamento": {"A":80,"BD":40,"BE":32,"C":48},
    "ocupado": {"A":0,"BD":0,"BE":0,"C":0},
    "ocupacaoSetores": {"principal":0,"tissue":0,"lonil":0,"ttd":0},
    "topSkus": []
  }
}
```

### Próximo passo para ativar de verdade

Publique uma Edge Function `wmss-ai-assist` no Supabase para conectar no provedor de LLM (AirLLM/OpenAI/etc).

> Recomendado: manter chave do provedor **somente** no backend (Edge Function), nunca no browser.
