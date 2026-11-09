# Migração segura do login WMSS

Esta mudança substitui a senha em texto e o login local por Supabase Auth. Cada pessoa recebe uma senha nova. O projeto não deve ser reativado para uso normal enquanto a migração de banco e a função estiverem pendentes.

## O que muda

- O navegador autentica pela API Supabase Auth; não consulta senha nem grava perfil de acesso no `localStorage`.
- `wmss_profiles` guarda matrícula, nome, perfil e vínculo ao usuário Auth. O usuário só lê o próprio perfil; a gestão é feita pela Edge Function com validação de MASTER.
- `wmss_users` vira um catálogo de perfis sem a coluna de senha e sem acesso às chaves `anon` e `authenticated`.
- As tabelas de estoque e movimentações exigem sessão ativa do Supabase Auth. Logs ficam legíveis apenas ao MASTER.
- O acesso mestre inicial exige uma chave temporária de uso único e uma senha nova com pelo menos 12 caracteres.

## Implantação controlada

O SQL Editor e o deploy de Edge Functions não ficam disponíveis enquanto o projeto está pausado. Para não deixar o banco reaberto sem proteção, faça esta sequência em janela de manutenção, com o menor intervalo possível entre Resume e o SQL:

1. Faça backup pelo Supabase antes de reativar. Mantenha a aplicação pública em manutenção até o fim da migração.
2. Prepare uma chave aleatória temporária e configure `WMSS_BOOTSTRAP_SECRET` nos secrets das Edge Functions. Não a grave no repositório.
3. Reative o projeto e execute imediatamente `supabase/migrations/202611090001_secure_auth_and_rls.sql` no SQL Editor. A migração remove as políticas antigas, revoga o acesso anônimo, elimina a coluna de senhas e exige sessão Auth ativa.
4. Publique `wmss-admin-users` com `supabase functions deploy wmss-admin-users`. A função precisa de `verify_jwt = true` e usa apenas `SUPABASE_SERVICE_ROLE_KEY` no servidor. Nunca exponha essa chave ao navegador.
5. Publique a versão deste branch no host estático/Vercel. A tela antiga deixa de funcionar assim que as políticas forem aplicadas.
6. No primeiro acesso, o usuário MASTER existente escolhe uma senha nova e usa a chave temporária no formulário “Primeiro acesso”. A função só permite o bootstrap se ainda não houver perfil Auth.
7. O MASTER provisiona cada usuário antigo com uma senha temporária nova. Entregue as senhas por canal privado e peça a troca após o primeiro acesso. Usuários inativos permanecem bloqueados.
8. Remova o secret `WMSS_BOOTSTRAP_SECRET` assim que o bootstrap MASTER terminar. Confira o acesso com contas comuns e MASTER; só então retire a manutenção.

A coluna legada `wmss_users.senha` é apagada pela migração, então o backup é a única cópia histórica. Senhas antigas não são importadas: todos os usuários precisam ser provisionados com credenciais novas.
