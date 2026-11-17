# Assessment content and private grading

The Exams page provides four single-attempt assessments with 30 questions each. Public browser files contain question text and choices, not grading keys. Existing content remains unchanged.

Correct-answer arrays, raw source documents, and item-by-item grading notes must remain outside this public repository. The API reads `SINAGBASA_ASSESSMENT_KEYS` from private Vercel environment variables. Never use a browser-exposed environment variable prefix for this value.

For an existing database, the installed `assessment_keys` rows remain unchanged. The public reading-assessments migration contains schema and grading functions but no seed keys. For a fresh database, set the private environment variable locally and run `node scripts/generate-assessment-migration.cjs <absolute-output-path-outside-repository>`; run that private SQL in Supabase without committing it.

Tests use synthetic grading fixtures, not real assessment answers. The API authenticates requests and respects Supabase RLS. Assessment timing, score calculation, prerequisites, and submission behavior remain covered by the test scripts.
