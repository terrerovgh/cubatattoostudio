# Contributing to Cuba Tattoo Studio

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — auto-deploys to cubatattoostudio.com |
| `feature/*` | New features — open PR to main |
| `fix/*` | Bug fixes — open PR to main |
| `chore/*` | Maintenance — open PR to main |

## Development Workflow

```bash
# 1. Create a feature branch
git checkout -b feature/my-feature

# 2. Make changes and commit
git add src/components/MyComponent.tsx
git commit -m "feat: add my feature"

# 3. Run tests before pushing
npm test -- --run

# 4. Push and open PR
git push origin feature/my-feature
```

## Commit Convention

```
feat: add flash drop countdown timer
fix: correct booking slot collision check
chore: update dependencies
docs: add API reference for chat endpoints
test: add FloatingDock scroll behavior tests
refactor: extract auth helpers to lib/auth.ts
```

## PR Checklist

- [ ] Tests pass (`npm test -- --run`)
- [ ] TypeScript compiles (`npx astro check`)
- [ ] Build succeeds (`npm run build`)
- [ ] No new secrets committed to code
- [ ] PR description explains the change

## Secrets Policy

**Never commit secrets** — use `wrangler secret put` or GitHub Actions secrets.

If you accidentally commit a secret:
1. Rotate the secret immediately
2. Use `git filter-repo` to remove from history
3. Force-push after rewriting history

## Code Style

- TypeScript strict mode
- Functional components (no class components)
- Nanostores for cross-component state
- Tailwind CSS + inline styles for component-specific styles
- All API routes validate auth before any data access
- Use `safeCompare()` for all secret/token comparisons
