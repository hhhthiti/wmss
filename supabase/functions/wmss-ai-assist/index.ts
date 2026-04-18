// Supabase Edge Function: wmss-ai-assist
// Compatível com provedores OpenAI-like (AirLLM/OpenAI/etc.)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

type AssistPayload = {
  prompt?: string;
  context?: Record<string, unknown>;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = (await req.json()) as AssistPayload;
    const prompt = String(body?.prompt || '').trim();
    const context = body?.context || {};

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt obrigatório.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const baseUrl = Deno.env.get('AIRLLM_BASE_URL') || 'https://api.openai.com/v1';
    const apiKey = Deno.env.get('AIRLLM_API_KEY');
    const model = Deno.env.get('AIRLLM_MODEL') || 'gpt-4o-mini';

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Defina AIRLLM_API_KEY nos secrets da Edge Function.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const system = [
      'Você é assistente de operação de armazém WMSS.',
      'Responda em português (pt-BR), de forma objetiva e prática.',
      'Priorize ações operacionais: blocados a desfazer, risco de falta de espaço, sugestão por bloco e justificativa curta.',
      'Use somente as informações do contexto enviado; quando faltar dado, diga explicitamente.'
    ].join(' ');

    const userContent = `Pergunta do operador:\n${prompt}\n\nContexto WMSS:\n${JSON.stringify(context, null, 2)}`;

    const llmResp = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userContent }
        ]
      })
    });

    if (!llmResp.ok) {
      const errText = await llmResp.text();
      return new Response(JSON.stringify({ error: `Erro no provedor LLM: ${errText}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const llmJson = await llmResp.json();
    const answer = llmJson?.choices?.[0]?.message?.content?.trim?.() || '';

    if (!answer) {
      return new Response(JSON.stringify({ error: 'LLM retornou resposta vazia.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Erro interno.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
