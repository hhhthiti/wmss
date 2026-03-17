# wmss-ai-assist (Edge Function)

Função para responder perguntas de planejamento/ocupação usando provedor OpenAI-compatible (AirLLM/OpenAI/etc.).

## Deploy

```bash
supabase functions deploy wmss-ai-assist
```

## Secrets obrigatórios

```bash
supabase secrets set AIRLLM_API_KEY="<sua_chave>"
```

## Secrets opcionais

```bash
supabase secrets set AIRLLM_BASE_URL="https://api.openai.com/v1"
supabase secrets set AIRLLM_MODEL="gpt-4o-mini"
```

> Para AirLLM, ajuste `AIRLLM_BASE_URL` e `AIRLLM_MODEL` conforme o endpoint/modelo do seu ambiente.
