# MTBJournal

Journal application built with Next.js, Clerk, Prisma/PostgreSQL and LangChain.

## Development

Use Node.js 24.22.2 or a newer patched 24.x LTS release (`.nvmrc`). Keep the
deployment runtime on Node 24 as well.

1. Copy `.env.template` to `.env` and configure Clerk, PostgreSQL and the AI provider.
2. Install the locked dependencies with `npm ci`.
3. Start your local PostgreSQL server if using the Docker configuration.
4. Run `npm run prisma:generate` and `npm run check:db`.
5. For a new database, apply the existing schema with `npm run prisma:deploy`.
6. Start development with `npm run dev`.

The Docker definition uses PostgreSQL 15.19, updating the old 15.3 image within
the same major release. Back up existing data before restarting a database with
a new image. This dependency update did not start Docker or modify database data.

## Build and deployment

`npm run build` generates the Prisma client and compiles Next.js. It does not
apply database migrations. Run `npm run prisma:deploy` explicitly in your release
process when schema migrations are required. This update does not change the
Prisma schema or add migrations.

Set the same required environment variables in the deployment environment.
Confirm database connectivity there before checking sign-in, journal editing,
autosave, deletion, mood statistics, and AI analysis/search with a real account.

## Verification

- `npm run lint`: ESLint, including React and TypeScript rules.
- `npm run typecheck`: Prisma generation, Next.js route types and TypeScript.
- `npm test`: AI regression checks with simulated model responses and embeddings.
  These tests block external fetch calls and do not consume the AI API.
- `npm run check:db`: read-only `SELECT 1` against the configured database.
  It loads environment files using the same loader as Next.js.
- `npm run test:smoke`: public routes, compiled assets and rejection of anonymous
  journal API calls. Start the production build with `npm start` first.
  Set `SMOKE_BASE_URL` to test a different local port.
  Clerk development keys may redirect public routes to their development
  handshake; that redirect does not test a completed sign-in.
- `npm audit --omit=dev`: production dependencies.
- `npm audit`: complete dependency tree.

## Security update notes

Next.js and React were updated together, middleware was renamed to `proxy.ts`,
and Clerk was patched within its compatible 6.x line. LangChain's legacy vector
store now comes from `@langchain/classic`, alongside current core/OpenAI packages
and Zod 4. Prisma CLI and client remain on matching 6.19.3 versions.

The Prisma configuration dependency `deepmerge-ts` is overridden to patched 8.x,
and the TypeScript parser's `minimatch` dependency to patched 11.x. Prisma
generation and the AI tests verify the APIs used by this application.

The complete npm audit still flags ESLint's `minimatch` 3.x dependencies under
[GHSA-g3hv-75wg-m249](https://github.com/isaacs/minimatch/security/advisories/GHSA-g3hv-75wg-m249).
npm marks versions below 11.0.1 as affected; the upstream report describes
10.2.6 preprocessing with `optimizationLevel >= 2`, which does not exist in 3.x.
Keep this discrepancy under review until the plugins or advisory are updated.
A global override to 11.x would break the callable 3.x API used by the plugins.
