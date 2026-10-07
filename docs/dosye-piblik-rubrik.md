# Rekò piblik — editorial rubric

A separate section on candidate profiles for documented actions and reports about a candidate that are
important but sensitive. It is **hidden by default** (`showPublicRecord = false` in `src/data/site.ts`).
Entries live in `candidates.ts` under `publicRecord` and start as `reviewStatus: 'draft'`.

## What can go in
1. **Official action** — a decision by an institution about the candidate (e.g. a ministry reprimand).
2. **Court decision** — a ruling or charging document from a court.
3. **Institutional report** — a published report by a named body (UN, a human-rights organisation, an
   oversight agency) that mentions the candidate. Always worded as "the report says…".

## What can never go in
- Rumours, anonymous claims, social-media posts, or unsourced "people say".
- Wikipedia or other tertiary summaries as the only source — cite the original document or a reputable report of it.
- Our own conclusions, adjectives, or headlines implying guilt.
- Public opinion (rallies, nicknames, polls) — that belongs in comments or reporting, not the record.
- Private life unrelated to public office.

## Checklist before `published`
- [ ] Original document or reputable report linked; date and issuer stated.
- [ ] Summary is neutral, attributed, and matches the source.
- [ ] `limits` says what it does not establish (e.g. "no court finding").
- [ ] Candidate offered the same right of reply, with a deadline; status recorded in `responseStatus`.
- [ ] A second person (or a 24h re-read) reviewed it.
- [ ] Same standard applied to every candidate: check whether comparable records exist for the others.
- [ ] Updates, appeals or reversals added when they happen; corrections logged on the profile.
- [ ] Haitian lawyer has reviewed the policy once before the switch is turned on.
