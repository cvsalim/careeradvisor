# Advisor Career Office

Aplicação interna de Career & Branding Advisory. Ver [PRD_Private_Career_Office.md](./PRD_Private_Career_Office.md) para escopo completo.

Stack:

- Next.js (App Router) + TypeScript + Tailwind CSS.
- Supabase: banco Postgres, autenticação, storage e edge functions.

## Configuração

1. Copie `.env.example` para `.env.local` e preencha com a URL e a publishable key do projeto Supabase (Project Settings > API).
   - Na Vercel, a integração Supabase↔Vercel já injeta `NEXT_PUBLIC_SUPABASE_URL` (gerenciada/locked) e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` automaticamente.
   - **Nunca** coloque a `service_role key`/`secret key` no `.env.local` do frontend nem no repositório — ela só deve existir como secret de Edge Functions/servidor.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

Abra [http://localhost:3000](http://localhost:3000).

## Supabase

O projeto Supabase remoto já está linkado via Supabase CLI (`supabase link`). Estrutura:

- `supabase/migrations/` — migrações SQL (schema + storage buckets), aplicadas com `supabase db push`.
- `supabase/functions/` — Edge Functions (a criar conforme os módulos de IA do PRD).
- `supabase/config.toml` — configuração do projeto.

Para criar uma nova migração:

```bash
supabase migration new nome_da_migracao
supabase db push
```

Para criar uma Edge Function:

```bash
supabase functions new nome-da-funcao
supabase functions deploy nome-da-funcao
```

## Autenticação

Login via Supabase Auth (e-mail/senha) em `/login`. Sessão é validada e renovada em `src/proxy.ts` (convenção `proxy` do Next.js, que substitui `middleware`).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
