# Public repository safety

This repository is intended to remain public. Authentication, scores, progress, and teacher uploads live in Supabase; assessment grading keys are private deployment configuration.

- Vercel production and preview functions require the sensitive environment variable `SINAGBASA_ASSESSMENT_KEYS`. Set it through Vercel, never in Git or browser code. Local API work can use an environment variable loaded privately outside this repository.
- The Supabase publishable key is intentionally public. Do not replace it with a secret or service-role key.
- Never commit raw assessment source documents, answer-key files, database exports, user records, private keys, `.env` files, or temporary extraction folders.
- Existing Supabase answer-key rows are unaffected by source cleanup. For a fresh database, generate private SQL outside this checkout with `scripts/generate-assessment-migration.cjs` and the private environment variable, then run it in the Supabase SQL Editor.
- Tests use synthetic grading keys. Run `node scripts/check-public-repository.cjs` before pushing.

The public branch history was restarted to remove previously committed private assessment material and temporary research files. Older clones must be replaced or rebased carefully; never merge the old history back. A private Git bundle backup preserves that history for recovery only and must never be pushed publicly.

Previously downloaded copies and GitHub's retained/cached commit URLs cannot be erased by changing the branch. For an assessment that has already had its key published, treat the old key as disclosed and use revised questions/forms for future high-stakes testing. GitHub Support may be needed to remove retained sensitive references.
