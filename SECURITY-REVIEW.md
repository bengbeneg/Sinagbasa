# Access control review

Scope: source review of hash routes, assessment API, auth lifecycle, Supabase RLS/RPC definitions, content attachments, and teacher results actions. No live student records were accessed or deleted. Live Supabase policies and deployed code were not verified.

## Findings and changes

| Finding | Impact | Change |
| --- | --- | --- |
| Medium: auth listener ignored `SIGNED_OUT` | Cached roles, teacher records, and open private dialogs could remain after an SDK sign-out; a delayed request could repopulate caches. This does not independently bypass database RLS. | Clear identity and private caches, close dialogs, show the public screen, and ignore data responses for a previous user. |
| Medium: attachment paths were not bound to the content author | A teacher could reference another teacher's draft attachment path from published content, granting students access through the storage read policy. Teachers already have draft read access under the current policy. | Constrain attachment paths to the author's folder and enforce that relationship when granting published attachment access. |
| Conditional high: legacy grading RPC accepts browser scores | Applying only `assessment-logs-migration.sql` leaves a direct RPC path accepting caller-supplied scores. | The existing `reading-assessments-migration.sql` replaces it with server-side grading. Confirm that migration is applied; the deployment could not be inspected. |

## Controls found in source

- The assessment API verifies bearer tokens with Supabase, derives the student ID from that identity, and ignores spoofed `user_id`, attempt ID, and role fields. Results reads use the caller's JWT and rely on database RLS.
- Assessment RLS limits student reads to their own attempts. Begin/save/submit RPCs use `auth.uid()`; students cannot supply another owner ID. The current grading RPC ignores supplied score/total values and grades against protected keys.
- Class email and result-delete functions check `is_teacher()` in the database, not the browser role flag. Delete scopes changes to supplied attempt IDs belonging to students.
- Profiles restrict updates to the caller's own display name; clients cannot update the role column. Signup and profile repair assign the student role.
- Progress policies restrict reads/writes to the caller. Content updates/deletes require the authenticated teacher to be the author. Student content reads require publication.
- Teacher routes have UI checks, but RLS/RPC authorization is the relevant protection against direct API calls and URL/object-ID manipulation. See [OWASP BOLA guidance](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/) and [Supabase RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Scope limitation

Every teacher can read all class results, profiles, and activity logs and delete any student's assessment records. This is the current application-wide teacher policy. Class-specific teacher/student assignments do not exist. Email grouping is a presentation choice; it is not an authorization boundary.

## Required rollout and validation

1. Apply `SINAGBASA/supabase/access-control-hardening-migration.sql` to an existing database. It changes attachment authorization without deleting records; existing invalid references are blocked for students. The `NOT VALID` constraint enforces new/updated rows while allowing old references to be reviewed separately.
2. Confirm all assessment migrations, especially `reading-assessments-migration.sql`, and the class email/delete migrations are applied.
3. Run `SINAGBASA/supabase/test-access-control.sql` in staging after the migrations. It uses synthetic identities and rolls back fixtures, checking cross-student reads, draft reads, role escalation, direct score updates, teacher RPCs, cross-author edits, and cross-author file references. This SQL suite was prepared but not executed: no database connection or PostgreSQL runtime was available.
4. Deploy the changed frontend. Confirm behavior with student A, student B, teacher, and signed-out sessions against the actual deployment, including direct REST/RPC requests with substituted IDs. Do not infer live security from frontend buttons alone.

## Executed checks

Passed: JavaScript syntax checks and the auth recovery, assessments, assessment API, class results, activity sessions, and presence test scripts. Added regression cases for sign-out identity clearing, stale assessment responses, and spoofed user/attempt IDs. These checks are local and mocked; they do not prove deployed RLS enforcement.

## Input validation follow-up

The assessment endpoint now parses and normalizes an explicit payload, limits requests to 16 KB, returns 400 for malformed JSON/shapes, and accepts only known assessment types, reasons, canonical question indices, and integer choices from 0 through 4. Caller-supplied identity, role, and score fields are discarded. Authentication headers have a type and length check. Existing SQL functions use typed parameters and static SQL; no user-built SQL statements were found in the reviewed paths. Output escaping remains necessary for text and HTML attributes; legitimate apostrophes and Unicode are preserved, consistent with [OWASP input-validation guidance](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

`input-validation-migration.sql` adds server-side triggers for future writes to names, content lengths, resource link schemes, attachment metadata, saved answer shapes/ranges, and game configuration size/structure. It must be applied after the content and assessment migrations. It does not clean up existing rows. Direct database validation tests were added to the staging SQL suite but have not been executed here. Browser form validation is supplementary, not the security boundary. Password/session validation remains delegated to Supabase Auth; this app's assessment endpoint uses bearer authentication rather than trusting identity cookies or GET parameters.

Additional local checks passed: malformed and oversized API requests, invalid/nested/string answer choices, SQL-like assessment type strings, prototype keys, content field limits, unsafe URL schemes, oversized game configuration, and safe handling of legitimate text (`scripts/test-input-validation.cjs`).
