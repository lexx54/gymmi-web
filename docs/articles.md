# Articles & Community Module (Web)

The web frontend implementation for the Articles knowledge hub and community feed across **Clients**, **Trainers**, and **Gyms**.

## Features & Routing
- **Routes**:
  - `/articles`: Accessible to Clients, Trainers, and Admins.
    - Clients view their personalized feed aggregating articles strictly from their accepted coaches and active gym memberships, along with a "Saved (Bookmarks)" tab and source filters.
    - Trainers have sub-tabs: Feed, My Articles (Published / Draft management), and Saved.
  - `/gym/articles`: Dedicated management and announcement hub for Gym owners (`RoleRoute role="Gym"`).
    - Lists all facility articles with draft/published indicators, view/like metrics, comment count, and instant reader/editor controls.
- **Components**:
  - `src/components/articles/ArticleCard.tsx`: Rich card with cover image or category fallback banner, reading time, author pill, category tag, live like toggle, bookmark toggle, comment counter, and author edit/delete actions.
  - `src/components/articles/ArticleReaderModal.tsx`: Comprehensive reading modal with markdown rendering for headers, quotes, lists, and paragraphs, alongside interactive like and bookmark buttons.
  - `src/components/articles/ArticleCommentThread.tsx`: Two-way discussion thread embedded directly inside the reader modal, with support for posting comments and deleting authorized entries.
  - `src/components/articles/ArticleEditorModal.tsx`: Form for authoring new articles or editing existing ones with markdown content, direct cover image file upload to Cloudflare R2 (purpose `'article-cover'`) with URL input fallback, category selector, reading time, and dual "Publish" vs "Save as Draft" workflows.
- **Hooks & Services**:
  - `src/services/api/articles.ts`: Complete REST client connecting to `/articles/*`.
  - `src/hooks/useArticles.ts`: TanStack React Query hooks with automatic cache invalidation on like, bookmark, edit, delete, and comment actions.
- **Navigation**:
  - Sidebar links added in `src/components/layout/Sidebar.tsx` for standard users (`/articles`) and gym users (`/gym/articles`).
- **i18n**:
  - Full translations for all buttons, labels, categories, and empty states in both English (`en.json`) and Spanish (`es.json`).

## Recent Changes
- Standardized form row layout in `ArticleEditorModal.tsx` using a balanced 2-column grid (`grid-template-columns: 1fr 1fr; gap: 1rem;` with mobile fallback to `1fr`).
- Fixed vertical and horizontal misalignment between **Category** and **Estimated Read Time** by removing restrictive inline width constraints (`width: 130px`), standardizing input and select heights (`2.65rem`), and aligning fields to prevent label wrapping discrepancies from skewing the inputs.
- Added direct file upload capability for article cover images in `ArticleEditorModal.tsx` using `uploadImageDirectly(file, 'article-cover')`.
- Replaced the raw cover image URL input with an intuitive drag-and-drop dropzone and image preview card:
  - Default dropzone with dashed border, image icon, dragover highlight, prompt text, and direct click-to-browse trigger.
  - Interactive image preview displaying the uploaded or existing cover image with overlay buttons to change or remove the cover image.
  - Drop support on both empty dropzone and existing image preview to easily replace the image.
  - Retained an expandable secondary toggle ("Paste URL") for manual link entry without cluttering the primary UI.
- Uploads now send `Cache-Control: public, max-age=31536000, immutable` headers.
- Added comprehensive unit tests in `src/components/articles/ArticleEditorModal.test.tsx` verifying field rendering, dropzone interactions, image preview, removal, and submission (all 6 tests passing).
