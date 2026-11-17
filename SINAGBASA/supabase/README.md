# Supabase setup for SINAGBASA

The website runs locally at `http://localhost:8000` while using the hosted Supabase project for accounts and data.

## 1. Create the database objects

For the four Exams assessments, also run `assessment-logs-migration.sql` if not already installed, followed by `reading-assessments-migration.sql`. See `ASSESSMENT-CONTENT-NOTES.md` for content review items, timing, and submission behavior.

1. Open the Supabase project dashboard.
2. Open **SQL Editor** and create a new query.
3. Paste the complete contents of `schema.sql`.
4. Run the query once.

If the original schema was already installed before Teacher Studio file uploads were added, run `file-upload-migration.sql` once instead of rerunning the complete schema. It adds attachment metadata, the private `teacher-materials` Storage bucket, the 10 MB limit, and access policies.

Run `game-authoring-migration.sql` once on an existing database to enable teacher-created story games and their scene configuration.

Run `profile-repair-migration.sql` once if an existing user sees **Account setup failed: permission denied for table profiles** after logging in. It backfills missing profiles and installs the safe self-repair function used by the login flow.

The script creates student/teacher profiles, synchronized progress, teacher content, triggers, grants, and Row Level Security policies. New accounts always receive the `student` role.

## 2. Configure email authentication

In **Authentication → URL Configuration**, set:

- Site URL: `http://localhost:8000`
- Redirect URL: `http://localhost:8000/**`

In the email authentication provider settings, keep **Confirm email** enabled.

In **Authentication → Settings → Password security**, configure the server-side policy to match the interface:

- Minimum password length: `8`
- Required characters: digits, lowercase letters, uppercase letters, and symbols

This server-side setting is important because browser validation alone can be bypassed by direct API requests. If your plan supports leaked-password protection, enabling it is also recommended.

## 3. Start the website

From the `SINAGBASA` directory:

```powershell
py -m http.server 8000 --directory dist
```

Open `http://localhost:8000`, create an account, and click the verification link received by email.

## 4. Promote a teacher

After the teacher has created and verified an account, run this in the SQL Editor, replacing the example address:

```sql
update public.profiles
set role = 'teacher'
where id = (
  select id from auth.users where email = 'teacher@example.com'
);
```

Log out and log back in. The **Teacher Studio** navigation item will appear. Students cannot promote themselves because the browser role has no permission to update the `role` column.

## Notes

- Never put a Supabase secret key or `service_role` key in `dist`.
- The publishable key in `supabase-config.js` is intended for browser use; RLS protects the data it can access.
- Teacher Studio accepts PDF, Word, PowerPoint, text, JPG, PNG, and WebP attachments up to 10 MB. Files remain private and are opened through short-lived signed URLs.
- Before production, replace localhost URLs with the deployed domain and configure a production SMTP provider for reliable email delivery.
# Class Results email grouping

For existing databases, run `class-results-email-migration.sql` in the Supabase SQL Editor, then refresh Class Results. It adds a teacher-only function that reads current account emails for grouping, while the list continues to display student names. Different emails remain separate even when display names match. New databases include this function in `schema.sql`.

## Class Results deletion

Run `class-results-delete-migration.sql` after the assessment migrations to enable teacher-only deletion of student assessment records. View opens the full student record. Delete removes the displayed group's assessment attempts after confirmation; it preserves the student account and may allow retakes.
## Access control hardening

Apply `access-control-hardening-migration.sql` to existing databases to bind attachment access to its content author's folder. After all migrations, run `test-access-control.sql` in staging to check student/teacher/anonymous authorization using rolled-back synthetic accounts. See the workspace `SECURITY-REVIEW.md` for findings and verification limits.

## Input validation

After the assessment and content migrations, apply `input-validation-migration.sql` to validate future writes to profiles, assessment answers, content, resource links, and game configuration. It preserves existing records; old invalid rows must be corrected before updating them. Run `test-access-control.sql` in staging after both security migrations to verify direct database calls as well as normal UI requests.
## Public repository and private assessment keys

Real answer keys and raw source documents are not stored in Git. The API requires the sensitive Vercel variable `SINAGBASA_ASSESSMENT_KEYS` in production and preview environments. Existing database key rows remain in Supabase. Fresh installations must seed keys privately using `scripts/generate-assessment-migration.cjs` with the private variable and an output file outside the repository. See `PUBLIC-REPOSITORY.md` at the workspace root. Never commit generated private SQL.
