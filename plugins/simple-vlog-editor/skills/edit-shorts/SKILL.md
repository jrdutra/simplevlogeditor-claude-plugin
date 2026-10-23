---
name: edit-shorts
description: Use when the user asks for shorts, reels, vertical clips or cuts for TikTok/Reels/YouTube Shorts made from a video in SimpleVlogEditor — picking the source video, selecting authentic standalone micro-stories with a hook, progression and payoff, and creating, captioning, framing on the person and rendering each short in the Short Editor.
---

# Edit shorts in SimpleVlogEditor

The local SimpleVlogEditor desktop application includes a built-in MCP server that receives AI control commands. The `simple-vlog-editor` AI client plugin connects to this server and exposes tools for reading and controlling the local desktop editor. The **Short Editor** is its own tool tab with its own session: it never changes the Video Editor project, and the Video Editor never changes it. Every Short Editor command starts with `short_`.

Read [references/short-tools.md](references/short-tools.md) before the first call: it lists every Short Editor command, its arguments and the shape of the session.

Read [references/short-editorial.md](references/short-editorial.md) before selecting candidates and again for the editorial review. It defines what makes a good Short, narrative structure, duration, pacing, integrity, audiovisual quality and the weighted review rubric. Apply these criteria throughout selection, editing and validation, within the capabilities actually returned by the editor.

## Defaults

**The user's explicit instructions always win.** Everything below is what to do
when the request does not say otherwise; when it covers some points, use the
request for those and these defaults for the rest.

1. **Length serves the story.** For general vlogs, start with 20–40 seconds,
   then adjust to deliver the complete idea. The reference includes examples
   from 7–180 seconds; these are editorial guidance, not tool or platform limits.
   Check `short_get_capabilities` for actual supported limits. Count transition
   overlaps in the finished length. Never pad or cut the payoff to meet a target.
2. **Quality determines quantity.** Create only independent, worthwhile stories.
   There is no minimum count or quota per source minute: one or no suitable
   candidates is a valid result. Explain when the material is insufficient.
3. **The source is the largest video in the project folder** — usually the
   edited, exported version. Use another video only when the user names it.
4. **Captions are always on, in the default style** (`Classic`), unless the user
   describes the captions they want (another preset, colours, font, size,
   position) or asks for none.
5. **The frame always follows the person, kept in the horizontal centre**:
   `short_track_person` on every short, with `restX: 0.5`, so the frame goes back
   to the centre wherever nobody is visible.
6. **The original sound stays.** Use music or any other audio only when the
   video has no sound, is a timelapse, or the user asks for it. With the
   original sound, leave `audioPath` null and `volume` at 1.

## Phase 0 — Start safely

1. `health_check` — the editor is running and visible. If it is not installed or
   is out of date, follow the setup guidance in `edit-video`.
2. `short_get_capabilities` — transitions, limits, caption presets and fonts.
3. `show_tool` with `tool: "shorts-generator"`, so the user can watch.
4. `short_get_state` — what is already in the session.

Every mutation needs a fresh `requestId`. Reuse an id only to retry the very
same request after an uncertain result.

## Phase 1 — Choose the source video

Unless the user named a video, list the project folder the user is working in
with your own file tools and take the **largest video file by size**
(`.mp4`, `.mov`, `.mkv`, `.webm`). Ignore files that are already shorts — files
in a `shorts` folder or ones you rendered earlier. Say which file you chose and
why in the final report.

Then compare with `short_get_state`:

- The same video is already loaded: keep the session and add new shorts to it.
- Another video is loaded and its shorts are all rendered (or there are none):
  `short_import_video` with `replace: true`. Exported files stay on disk.
- Another video is loaded with shorts that were never rendered: first keep them
  with `short_save_document` (`kind: "project"`, a new `.json` file in the
  project folder), then import with `replace: true`, and say so in the report.

The video must be horizontal. A vertical source is refused; tell the user.

## Phase 2 — Captions and transcript

`short_generate_captions` with the vlog's language (or `auto`). It transcribes on
this computer (the model downloads once, about 82 MB), turns the captions on in
the default style, and returns the transcript as timed lines in **source
seconds**. New shorts inherit the captions.

- If the user described the captions, pass `preset` here, and set any further
  style fields with `short_set_selection` → `settings.captions.style` before
  creating the shorts (or `short_update` per short afterwards).
- If the user asked for no captions, call it with `enabled: false` — the
  transcript is still needed to choose the moments.
- `noAudio: true`: the video has no sound. Leave captions off and see Phase 4
  for the audio. Choose the moments from what happens on screen instead
  (Phase 3).

`short_get_transcript` returns the transcript again at any time; with `from`,
`to` and `includeWords: true` it gives the timing of every word in a stretch.

## Phase 3 — Choose the moments

Read the whole transcript and inspect available visual evidence before choosing.
Group related moments by subject and source timestamps. Select stories, not
merely stretches with continuous speech or no silence. For each candidate record
its theme, hook, minimal context, progression, real payoff and proposed ranges.
Use a hook in the first 1–2 seconds, only the context needed (often 2–7 seconds),
and a logical development that fulfills the opening promise. Skip generic
introductions unless they have narrative value. Never invent a conclusion,
remove essential caveats or reorder events deceptively.

Rank candidates using the reference's weighted rubric. Prefer diverse subjects
and avoid near-duplicates or repeated hooks. Reject candidates that cannot stand
alone or have no truthful payoff; report insufficient material instead of filling
a quota. Several related source ranges may form one coherent micro-story.

Cut points, in source seconds from the transcript:

- Start about 0.1–0.2 s before the first word and end about 0.2–0.4 s after the
  last one, never inside a word. Use `short_get_transcript` with
  `includeWords: true` around each boundary.
- One continuous cut is best. Two or three cuts are fine when they tell one
  idea (the question and its answer, a setup and its payoff) — drop the filler
  between them.
- Check the finished length against the narrative, the user's brief and the supported limits; keep complete words, meaningful pauses, reactions and the payoff.

A video without sound, or a long silent stretch: there is no transcript to go
by. Use what the Video Editor can see when the same footage is in its project
(`get_frames`, `get_contact_sheet`); otherwise report the missing visual evidence and leave candidates provisional.
Do not treat evenly spaced samples as verified stories or claim to have watched
footage that the tools could not expose.

## Phase 4 — Create the shorts

One `short_create` per short, with:

- `name`: a short, clear, specific and faithful title in the vlog's language — it names the card and
  the rendered file;
- `ranges`: the cut or cuts, in order;
- `settings`, only what differs from the draft:
  - original sound (the default): nothing to set — `audioPath` stays null.
  - **no sound, a timelapse, or the user asked for music**: `audioPath` set to a
    music file from the project folder (or the one the user named), `musicVolume`
    1 and `volume` 0 (for a video with no sound) — or the user's mix.
  - transitions: prefer direct `cut`, including between related ranges. Use `fade` (0.2–0.3 s) only for a motivated
    context/time change; count any overlap in the length.

Captions come from the draft. Verify on the result that each short has
`settings.captions.enabled` (unless the user wanted none) and words.

## Phase 5 — Follow the person

`short_track_person` once per short, with `id` and `restX: 0.5` (keep the
default follow settings unless the user asks for another feel). It runs person
detection on this computer and keeps the person in the horizontal centre.

Read `cuts[].personSeenShare` in the result. Where it is low (B-roll, scenery,
an object being shown), the frame rests at the centre. When something else
should be in the frame there — the object being talked about, the view — use
`short_set_focus` on that interval with the position that shows it.

## Phase 6 — Check before rendering

Review each assembled Short against `references/short-editorial.md`:

- Score hook /25, progression /25, payoff /20, clarity and autonomy /15,
  audiovisual quality /10, and genuine interaction potential /5 (total /100).
  This is an editorial estimate, never a prediction of views or retention.
- Below 80: seek a stronger truthful hook, remove redundancy, shorten excess
  context, improve coherent ordering/cuts and preserve or restore the payoff;
  then re-evaluate. After one revision pass, report remaining weaknesses rather
  than chasing a score indefinitely. Mark 80+ approved, 70–79 improvable,
  60–69 needs review, below 60 not recommended for automatic publication.
  Never mark an incoherent or misleading story approved, regardless of score.
- With `short_get_state` and capabilities, verify valid source ranges, finished
  duration including overlaps and supported vertical output (prefer 9:16,
  1080 × 1920). Inspect accessible preview/output for framing that
  preserves faces/hands/products/actions, caption words and sync, readable short
  lines in safe areas, and clear original audio. No duplicated content, cut
  words, distorted proportions, unexpected black frames or abrupt audio joins.
- Use `short_update` to fix supported settings (caption words survive style-only
  changes). Review the resulting preview/output when accessible. State which
  checks were actually performed and which could not be verified; do not invent
  audio cleanup, visual inspection, cover selection or tool capabilities.

Keep an editorial record per candidate: id, title, theme, micro-story summary,
finished duration, hook type/text, payoff, ordered source timestamps, final
transcript, scores per criterion/total, selection rationale, issues, improvements
and editorial status. Store it in a separate new JSON report with your own file
tools if available; otherwise return it in chat. Do not pass unsupported metadata
to `short_create`/`short_update` or change the editor's project JSON schema.

## Phase 7 — Render

`short_render` per short to a **new** `.mp4` path in an allowed folder — the
project folder, or a `shorts` folder inside it when one exists or you can create
it with your own file tools. Use the short's name for the file, without
characters a file name cannot hold. Existing files are never overwritten: pick a
new name if one is taken.

At most two renders run at once; start the next when one finishes. Poll
`short_get_state` until each short is `done` (or `error` — read the error, fix,
render again).

Then keep the session with `short_save_document` (`kind: "project"`, a new
`.json` in the project folder), so the shorts can be reopened and changed later.

## Phase 8 — Report

In the user's language, briefly: the source video chosen and why, then one line
per short — its name, the source time range(s), the finished length, what it is
about, and the rendered file. Mention anything that departed from the defaults
(music used or captions off), the saved project and editorial report.
Include each Short's hook, payoff, editorial score/status and remaining issues.
Render completion is not publication approval: do not publish automatically.
If there are no suitable candidates, explain why instead of creating filler.

## Recovering

- A command fails: read the error. `short_get_state` is always safe to call.
- A render ends in `error`: fix the cause and render again to a new path.
- Person tracking or captions interrupted: run the same command again with a
  new `requestId`; finished cuts are simply tracked again.
- Never import over unrendered shorts without saving them first (Phase 1).
