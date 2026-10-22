# Moderation (Web)

Report and block actions on articles and comments, plus an admin review queue. These back the Terms of Service promise that reports are reviewed within 24 hours (App Store guideline 1.2). For the API, see `gymmi-api/docs/moderation.md`.

## What it does
- **Article reader** (`ArticleReaderModal`): "Report" and "Block" buttons appear on articles written by someone else. Block asks for confirmation, calls `POST /blocks/:authorId`, then closes the reader.
- **Comments** (`ArticleCommentThread`): flag and ban icons appear on other users' comments.
- **Report dialog** (`ReportDialog`): pick a reason (required) and optionally add details (up to 1000 characters). It posts to `/reports/{articles|comments|users}/:id`.
- Blocking invalidates the `['articles']` queries, so the blocked user's content disappears right away.
- **Admin queue** (`/admin/reports`, `AdminReportsPage`, sidebar entry "Reports"): filter by Open, Action taken, Dismissed or All. Each card shows the reported content snapshot, reason, details, author and reporter. Open reports older than 24 hours get an "Over 24h" badge. Actions: Dismiss, Remove content, and Remove and deactivate (asks for confirmation; for user reports this is Deactivate user).

## Main files
- `src/types/moderation.ts`, `src/services/api/moderation.ts`, `src/hooks/useModeration.ts`
- `src/components/articles/ReportDialog.tsx`, `ArticleReaderModal.tsx`, `ArticleCommentThread.tsx`
- `src/pages/admin/AdminReportsPage.tsx`, route in `src/App.tsx`, nav item in `src/components/layout/Sidebar.tsx`
- i18n: `articles.moderation.*`, `admin.reports.*` and `nav.reports` in `en.json` and `es.json`
- Tests: `AdminReportsPage.test.tsx`, `ArticleCommentThread.test.tsx`, `ArticleReaderModal.test.tsx`
