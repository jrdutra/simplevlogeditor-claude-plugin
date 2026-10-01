# Editing a single recording, raw footage and rough cuts

Read this before the structural pass. A single file can contain an entire vlog:
file count is not scene count, and importing it plus adding graphics is not an edit.
For a rough cut, preserve successful existing joins and graphics; inspect it for
dead air, weak openings, unfinished sentences, repetitions, abrupt audio changes
and slow sections just as carefully as raw footage. Do not remove valuable
action, ambience, emotional pauses or intentional repetition just to reduce duration.

## Analyse every block, with a five-minute ceiling

1. Transcribe each source with speech; for sources longer than five minutes use
   `includeWords: false` to cache the full transcript without flooding context.
   Read `analysisBlocks` in the result, or
   call `get_analysis_blocks`. These are source-time suggestions of at most
   **300 seconds**, favouring sentence ends and pauses. They do not understand
   topic meaning: you must refine them using the transcript and pictures.
2. For each block, call `get_analysis_blocks` with its `blockIndex` and inspect
   `get_contact_sheet` over that block's `start`/`end`. Sample extra frames at
   topic changes, important action and proposed joins. Keep the previous block's
   ending and the next block's opening in view: a question and answer or an
   explanation must not lose its context across a boundary.
3. Choose actual boundaries at topic, place, activity or time changes, complete
   sentences and safe pauses. Every resulting block must still be at most 300
   seconds. If no topic changes for longer than five minutes, subdivide at a
   safe sentence boundary and mark both as continuations of the same topic.
   Silent footage uses visual scene/action boundaries instead of invented speech.
4. Keep a coverage ledger in source seconds: block range, subject, opening and
   closing words, visual evidence, mistakes/redundancy, removable pauses,
   retained action, keyword candidates, and the decision for each candidate cut.
   Account for the complete source: no uncovered or double-owned intervals.
5. Physically divide video clips longer than 300 seconds with `split_clip` at
   those refined boundaries, in a structural dry run before decorative work.
   Split in **descending source-time order** on the original id so subsequent
   boundaries remain in that clip. Read `created[].clipId` for the new halves,
   then `get_timeline` and map each id to its `inPoint`/`outPoint`. Reuse the
   source transcript; source timestamps do not restart at zero after a split.

If an older compatible editor does not offer block reads, build the same bounded
coverage ledger from the full transcript and contact sheets. Never skip the
per-block review. A missing transcript on audible footage is an unresolved task;
retry or disclose the specific unavailable analysis, rather than pretending it
was reviewed. Splitting alone removes no footage and is never counted as a cut.

## Structural pass before graphics

Apply `edit-video/references/cut-inspection.md` before every split, trim,
removal and silence activation: review four seconds on each side of every
boundary, with source frames and real audio at 200 ms resolution, listen to
the excerpt where supported, and reconcile it with the transcript. Include
both removal edges and adjacent five-minute blocks in the evidence ledger.

For every block, identify retakes, abandoned sentences, verbal mistakes, repeated
information, camera setup, waiting and unproductive dead air. Decide what to keep
using the speech, action and continuity together. Cut mistakes and redundancy
with `delete_source_range`, taking their dead pause as well. Use word timings and
small speech handles (roughly 80–150 ms where safe); listen to the resulting join.
Do not infer silence from a transcript gap alone: it may contain meaningful sound
or action, and recognition may have missed speech.

Run `analyze_silence` for spoken material. `scopedSilenceRanges` preserves the
original `rangeIndex` and clips statistics to each split's actual bounds. Review
these ranges per block and per shot type, not by the source file's global average.
Detection is **not activation**: commit `set_clip_edits` with `cutSilence: true`
on every intended spoken clip, and `set_detected_range` with `enabled: false`
for reactions, breaths, suspense, visual demonstrations and other useful pauses.
Keep automatic zoom off and plan motivated push-ins separately.

After committing structure, inspect `get_timeline`: each planned removal must
appear in `removedRanges`, be absent from `keepRanges`, and affect output duration
as expected after speed and transitions. Compare the sum of kept source seconds
before/after; added cards and transitions can hide the reduction in total duration.
If the result still retains one continuous source range despite identified cuts,
fix activation, stale revisions, disabled ranges or a rolled-back batch before
adding text. Never report an intended or dry-run cut as applied.

Do not manufacture cuts in a clean pre-edited section. Record why a block needed
no removal. If the whole vlog has no source-time removal, inspect it again and
explain the evidence; adding cards, dividing containers or speeding footage up
does not satisfy a requested silence/retake edit.

## Reading time and visual emphasis

At a genuine subject change, use a short context card in the spoken language.
Reserve a complete-text hold of `max(6, 1.4 + characters / 11 + 2.5)` seconds (cap 20 s),
**after** a short reveal, normally 0.4–1.0 s. The extra 2.5 seconds is reading
time, not more animation. Prefer `holdAuto: true` and omit `durationSeconds`;
setting a short total overrides automatic timing. If an existing context card
is too brief, extend its fully readable hold by 2–3 seconds, then preview it.
Respect an explicit duration the user requested and prioritise readable text
within it. Speech subtitles and keyword overlays follow their spoken moment;
they do not get chapter-card timing and should not persist into unrelated shots.

Actively search every block for a useful keyword: a location, cost, surprise,
important result, reaction or short promise supported by the speech. Select 2–3
strong candidates across a normal vlog when suitable footage exists; this is a
target, not a reason to add unrelated words. Put them behind a visible person
with a background-caption preset from capabilities, in stable footage. Verify
the subject matte and readability on composited frames. If segmentation or
framing fails, try another candidate; use a readable classic keyword caption
when appropriate and disclose why the background version could not be used.
Do not silently omit the whole keyword pass because one candidate failed.

For dynamism, use motivated framing changes, concise B-roll and clean audio joins.
Retain real events and vary pace with the story. Avoid constant zooms, repeated
subscribe tags, long title animations and arbitrary effects on every boundary.

## Completion evidence

Before `finish_editing`, reconcile the coverage ledger with the final timeline:
all blocks reviewed, structural removals committed, meaningful pauses retained,
context cards readable, keyword candidates applied or a concrete reason recorded,
and joins previewed with audio. Report actual removed source seconds separately
from container splits, speed changes and added cards. No graphics-only completion
when the requested structural work remains unfinished.
