# Findings

- Deep-learning articles use filenames, frontmatter titles, and daily dates from 2026-05-23 through 2026-07-25 as a single sequence.
- The sidebar has its own scroll container (`.wiki-sidebar-inner`) but has no client behavior to scroll the selected link into view after navigation.
- Course ordering is defined in `lib/content.ts`; article route slugs do not include the numeric file prefix.
- Windows PowerShell does not support `Set-Content -Encoding utf8NoBOM`. The first migration pass renamed all 64 files but did not write any content; original numbers remain recoverable from frontmatter titles.
- A later Unicode replacement pass was applied twice. Applying the inverse permutation restored the intended single mapping; every direct chapter reference now matches the original reference transformed exactly once.
