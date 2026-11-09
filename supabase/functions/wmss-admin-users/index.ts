import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...corsHeaders, "Content-Type": "application/json" },
});
const emailFor = (usuario: string) => `${usuario.toLowerCase()}@wmss.invalid`;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ success: false, error: "Método não permitido." }, 405);

  const url = Deno.env.get("SUPABASE_URL");
  const readDefaultKey = (name: string, legacyName: string) => {
    const legacy = Deno.env.get(legacyName);
    if (legacy) return legacy;
    try {
      const keys = JSON.parse(Deno.env.get(name) || "{}");
      return keys.default || Object.values(keys)[0] || null;
    } catch { return null; }
  };
  const anonKey = readDefaultKey("SUPABASE_PUBLISHABLE_KEYS", "SUPABASE_ANON_KEY");
  const serviceKey = readDefaultKey("SUPABASE_SECRET_KEYS", "SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !anonKey || !serviceKey) return json({ success: false, error: "Configuração incompleta." }, 500);

  const service = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return json({ success: false, error: "JSON inválido." }, 400); }
  const action = String(body.action || "");

  try {
    if (action === "bootstrap") {
      const expected = Deno.env.get("WMSS_BOOTSTRAP_SECRET");
      const usuario = String(body.usuario || "").trim();
      const senha = String(body.senha || "");
      if (!expected || String(body.secret || "") !== expected) return json({ success: false, error: "Chave temporária inválida." }, 403);
      if (!/^[a-zA-Z0-9._-]{2,64}$/.test(usuario) || senha.length < 12) return json({ success: false, error: "Matrícula ou senha inválida." }, 400);
      const [{ count, error: countError }, { data: roster, error: rosterError }] = await Promise.all([
        service.from("wmss_profiles").select("auth_user_id", { count: "exact", head: true }),
        service.from("wmss_users").select("usuario, nome, perfil, ativo").eq("usuario", usuario).maybeSingle(),
      ]);
      if (countError || rosterError) throw countError || rosterError;
      if ((count || 0) > 0) return json({ success: false, error: "O acesso mestre já foi ativado." }, 409);
      if (roster && (roster.perfil !== "MASTER" || !roster.ativo)) return json({ success: false, error: "Matrícula não autorizada para o primeiro acesso mestre." }, 403);
      const nome = roster?.nome || "Administrador WMSS";
      const { data: created, error: createError } = await service.auth.admin.createUser({
        email: emailFor(usuario), password: senha, email_confirm: true,
      });
      if (createError || !created.user) throw createError || new Error("Falha ao criar usuário Auth.");
      const { error: profileError } = await service.from("wmss_profiles").insert({
        auth_user_id: created.user.id, usuario, nome, perfil: "MASTER", ativo: true,
      });
      if (profileError) {
        await service.auth.admin.deleteUser(created.user.id);
        throw profileError;
      }
      const { error: rosterUpsertError } = await service.from("wmss_users").upsert({
        usuario, nome, perfil: "MASTER", ativo: true,
      }, { onConflict: "usuario" });
      if (rosterUpsertError) {
        await service.from("wmss_profiles").delete().eq("auth_user_id", created.user.id);
        await service.auth.admin.deleteUser(created.user.id);
        throw rosterUpsertError;
      }
      return json({ success: true });
    }

    const bearer = request.headers.get("Authorization") || "";
    const callerClient = createClient(url, anonKey, { global: { headers: { Authorization: bearer } }, auth: { persistSession: false } });
    const { data: callerData, error: callerError } = await callerClient.auth.getUser();
    if (callerError || !callerData.user) return json({ success: false, error: "Sessão inválida." }, 401);
    const { data: callerProfile, error: profileError } = await service.from("wmss_profiles")
      .select("usuario, perfil, ativo").eq("auth_user_id", callerData.user.id).maybeSingle();
    if (profileError) throw profileError;
    if (!callerProfile?.ativo || callerProfile.perfil !== "MASTER") return json({ success: false, error: "Ação exclusiva do usuário mestre." }, 403);

    if (action === "list") {
      const [{ data: roster, error: rosterError }, { data: profiles, error: profilesError }] = await Promise.all([
        service.from("wmss_users").select("usuario, nome, perfil, ativo").order("usuario"),
        service.from("wmss_profiles").select("usuario, auth_user_id"),
      ]);
      if (rosterError || profilesError) throw rosterError || profilesError;
      const provisioned = new Set((profiles || []).map((p) => p.usuario));
      return json({ success: true, users: (roster || []).map((u) => ({ ...u, authProvisioned: provisioned.has(u.usuario) })) });
    }

    if (action === "save") {
      const usuario = String(body.usuario || "").trim();
      const nome = String(body.nome || "").trim();
      const perfil = String(body.perfil || "");
      const senha = typeof body.senha === "string" ? body.senha : "";
      const ativo = body.ativo === true;
      if (!/^[a-zA-Z0-9._-]{2,64}$/.test(usuario) || !["MASTER", "COMUM", "ANALISTA"].includes(perfil)) return json({ success: false, error: "Matrícula ou perfil inválido." }, 400);
      if (senha && senha.length < 12) return json({ success: false, error: "A nova senha deve ter pelo menos 12 caracteres." }, 400);
      const { data: oldProfile, error: oldError } = await service.from("wmss_profiles")
        .select("auth_user_id, perfil, ativo").eq("usuario", usuario).maybeSingle();
      if (oldError) throw oldError;
      if (oldProfile?.perfil === "MASTER" && oldProfile.ativo && (perfil !== "MASTER" || !ativo)) {
        const { count, error: masterCountError } = await service.from("wmss_profiles")
          .select("auth_user_id", { count: "exact", head: true }).eq("perfil", "MASTER").eq("ativo", true);
        if (masterCountError) throw masterCountError;
        if ((count || 0) <= 1) return json({ success: false, error: "Mantenha pelo menos um usuário MASTER ativo." }, 409);
      }
      if (usuario === callerProfile.usuario && (perfil !== "MASTER" || !ativo)) {
        return json({ success: false, error: "O usuário mestre não pode desativar ou rebaixar o próprio acesso." }, 409);
      }
      let authUserId = oldProfile?.auth_user_id;
      if (!authUserId) {
        if (!senha) return json({ success: false, error: "Defina uma senha temporária para provisionar o primeiro acesso." }, 400);
        const { data: created, error } = await service.auth.admin.createUser({ email: emailFor(usuario), password: senha, email_confirm: true });
        if (error || !created.user) throw error || new Error("Falha ao criar usuário Auth.");
        authUserId = created.user.id;
      } else if (senha) {
        const { error } = await service.auth.admin.updateUserById(authUserId, { password: senha });
        if (error) throw error;
      }
      const { error: legacyError } = await service.from("wmss_users").upsert({ usuario, nome, perfil, ativo }, { onConflict: "usuario" });
      if (legacyError) throw legacyError;
      const { error: upsertError } = await service.from("wmss_profiles").upsert({ auth_user_id: authUserId, usuario, nome, perfil, ativo }, { onConflict: "auth_user_id" });
      if (upsertError) throw upsertError;
      return json({ success: true });
    }
    return json({ success: false, error: "Ação desconhecida." }, 400);
  } catch (error) {
    console.error("wmss-admin-users failed:", error instanceof Error ? error.message : "unknown");
    return json({ success: false, error: "Falha ao processar a solicitação." }, 500);
  }
});

