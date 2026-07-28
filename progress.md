# Progress

- Identified the sidebar visibility and course metadata migration requirements.
- Confirmed the current 64 dates are consecutive daily values, so the new sequence can retain that cadence from 2026-05-23.
- Added client-side sidebar positioning and server-rendered previous/next links based on the canonical category order.
- Renamed the 64 files into canonical order. Metadata update was deferred after detecting PowerShell encoding incompatibility before any file content was written.
- Rewrote all 64 frontmatter title numbers and dates using explicit UTF-8 without a BOM, then updated chapter cross-references from the original Git filename mapping.
- Verified 64 files have matching filename/title/date sequence, TypeScript passes, lint has no errors, and `/courses/gen-diffusion-dit` renders with sidebar and previous/next navigation.
- Audited all 64 files against their Git-baseline reference sequences after correcting a duplicate mapping pass; there are zero cross-reference mismatches.
- Moved sidebar positioning to the layout phase and skip it when the selected article is already visible, preventing a post-paint jump.
