# what-it-shows

Work for MEGA.dev S01E03. Support ticket #4471 merged 412 reports about wrong dates and marked
them known. They hold three problems; each has an issue in this repo.

- `support-kb/`: the support desk's kb export, plus one new page,
  `src/routes/kb/incidents/4471-split/+page.svx`. The page is signed in its frontmatter.
- `analysis/count.mjs`: counts the reports by problem. Run `node analysis/count.mjs` from the
  repo root. `analysis/groups.json` is its output (report ids per problem).

The page was not rendered: the export has no build files, so it is source only.
