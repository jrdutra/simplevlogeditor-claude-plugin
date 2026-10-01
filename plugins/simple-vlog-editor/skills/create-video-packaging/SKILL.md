---
name: create-video-packaging
description: Use when the user asks for thumbnails, covers, video titles, a YouTube description, chapters, hashtags or discoverability tags for a video — and right after finishing an edit in SimpleVlogEditor when the project's automatic Video Packaging setting is on. Reads the project in the Video Editor (transcript, frames, QR links), researches how the topic ranks on YouTube, then delivers titles, description, tags and three covers into the Video Packaging tool.
---

# Create video packaging in SimpleVlogEditor

The local SimpleVlogEditor desktop application includes a built-in MCP server that receives AI control commands. The `simple-vlog-editor` AI client plugin connects to this server and exposes tools for reading and controlling the project in the local desktop editor. Use this MCP connection as the control interface for this workflow.

Packaging is what makes a finished video get watched: three covers, three
titles, a description with chapters and hashtags, and a tag list. All of it is
delivered into the **Video Packaging** tool through the `simple-vlog-editor`
MCP server, never left as text in chat.

Everything comes from the project that is loaded in the **Video Editor**. That
is where the transcript lives, where frames can be captured, and where the QR
links and the finished timeline are. Video Packaging reads the editor; it never
reads a folder on its own.

**Order matters.** Understand the whole video first. Then write the description,
the tags and the titles. Only then draw the covers, each one from its own title.
A cover drawn before the title exists is a cover about nothing.

**When it runs by itself.** The project decides, not you. In the Video Editor's
project settings the user has a checkbox — *Generate thumbnails, titles,
description and tags automatically* — and `finish_editing` reports it as
`videoPackaging.automatic` (also `autoVideoPackaging` in
`get_packaging_sources`, and in `get_project`'s settings).

- `true` (the default) — run this workflow as soon as `finish_editing` returns.
- `false` — the edit is the whole job. Stop there, exactly as before Video
  Packaging existed: no covers, no titles, no description, no tags, no
  `save_frames`. Run this workflow only if the user explicitly asks for
  thumbnails, titles, a description or tags.

A direct request from the user always wins over the setting. Do not change the
setting (`set_project_settings` `autoVideoPackaging`) unless the user asks you to.

---

## Step 1 — Make sure there is a project

Call `show_tool` with `tool: "video-editor"`, then call
`get_packaging_sources` **and** `get_video_understanding`. They answer with
everything below in one pass, so
do not probe with `get_project`, `list_assets` and `transcribe` first.

- `hasProject: true` — go on to step 2.
- `hasProject: false` — load the videos the user means into the editor with
  `queue_media_import` (an explicit list of absolute file paths; enumerate the folder first), then
  analyse them as `edit-video` describes and call `get_packaging_sources` again.
- No videos to load, or the editor will not take them — stop and tell the user
  plainly: Video Packaging works from a project in the Video Editor, so at least
  one video has to be loaded and analysed there first. Do not invent covers from
  the file name.
- For `unknown_command`, inspect `get_editor_capabilities` and `health_check`. If the command is supported, call `show_tool` for `video-editor` and retry once. If it is absent, report the required editor/plugin update; the error alone does not prove the page is closed.

## Step 2 — Reuse what is already there

`get_packaging_sources` tells you, per clip, `transcriptReady`, `silenceAnalyzed`
and `savedFrames`, plus a stored `understanding` and the `savedFrames` list with
absolute paths.

- Stored understanding is not null — use it as a starting point, but still
  verify the final edited picture across the complete timeline before choosing
  covers.
- `transcriptReady: true` means a complete transcript of this source is cached for the current model, language and denoise settings. `transcribe` reuses it when those settings remain unchanged. A partial transcript or a different source/model does not qualify; do not change the model merely to refresh a cached result.
- `savedFrames` are candidates, not permission to reuse an old cover. The list
  only ever holds backgrounds saved from the edit **as it is now**; `staleFrames`
  counts the ones an edit has since invalidated, and those are refused by
  `set_video_packaging`. A background still has to fit the current creative
  direction.
- `understanding.stale: true` means the edit changed after it was written (a
  cut, a zoom, a caption, an effect). Read the finished video again and store a
  new one; chapters in particular will have moved.

Only what is genuinely missing gets done again.

## Step 3 — Settle the tag style

Call `get_packaging_tag_style`. It returns the lettering that will be used: its
`path` on disk, its `id`, its `name`, a description, the `mode` the reader chose
and the `available` styles.

The editor ships a catalogue of styles — **Classic** is the default — and the
reader may have loaded one of their own, which the application keeps across
restarts.

Two modes, both decided by the reader in the Video Packaging tool:

- `mode: "default"` — the saved style is used. The call returns at once.
- `mode: "ask"` — the call **opens the style picker on screen and waits**. The
  editor minimises its activity console while the picker is up and brings it
  back afterwards. Call it early, before you start drawing, and simply wait; it
  falls back to the saved style if nobody answers.

Do not choose a style on the reader's behalf and do not nag them about it. If
they hand you an image file and ask you to use it, save it with
`set_packaging_tag_style` — that makes it their own style and keeps it.

Keep both the returned `id` and `path`. The returned image is attached to every
cover prompt as the lettering reference. Do not reuse an older response after
the active style changes.
See `references/cover-prompt.md`.

## Step 4 — Understand the video, then choose three backgrounds

Read the whole transcript (`transcribe` per clip) and inspect the final edited
picture across the whole timeline. Start with `get_contact_sheet`, then use
`get_frames` with `composited: true` around promising moments so cuts, zooms,
text and effects are present exactly as the audience will see them. Sample the
opening, the central action and the final result, not just one convenient scene.
Work out what the video actually delivers, in what order, and where its strongest
moments are.

Store it with `set_video_understanding`: `summary`, `topics`, `chapters`
(seconds from the start of the finished video), `highlights` and `language`. This
is what step 2 of the next run reuses.

Then choose **three different real frames** to serve as cover backgrounds — one
per creative direction. Prefer people when people exist: front-facing, clear,
expressive faces, followed by frames that visibly show the video's action or
result. Avoid backs of heads, closed eyes, motion blur, tiny subjects and scenes
without context. Never invent a person, room, object or event.

Write them out with `save_frames` (clip id + the three source timestamps). It
saves the **finished picture** — the same composition as `get_frames` with
`composited: true`, with cuts, speed, zooms, captions, placed pictures, effects
and tags — in `video-packaging/frames/` beside the footage, and returns each
file's absolute `path`, its source `timestamp` and its `outputTime`, the second
it occupies in the finished video.

It refuses, before writing anything, an instant the export never shows:

- one inside a stretch that was **cut out** of the edit;
- one inside a **transition**, where two shots are blended;
- one whose person cut-out (Background Caption, picture behind the person, AI
  effect) could not be computed on this machine.

The refusal is `unfaithful_frame`, with a `suggestedTimestamp` for each rejected
instant when a nearby faithful one exists. Use it, or pick another moment. When
you look first with `get_frames` `composited: true`, choose among frames that
report `faithful: true`.

## Step 5 — Research the topic on YouTube, then write the titles

Before writing anything, search YouTube for the video's topic and read the
**titles, descriptions and recurring keywords** of the videos that actually rank:

- Prefer the highest-viewed videos on the topic.
- Pay special attention to **outliers** — a video with far more views than the
  rest of its own channel normally gets. That gap is the packaging working, and
  those titles are the ones worth learning from.
- Note the phrasing, the word order, the numbers, the brackets and the promise
  each title makes. Note which keywords appear in the first line of the
  descriptions.

Then write **three** titles into the titles inputs. Each title must:

- create curiosity — the viewer has to feel they are missing something;
- still deliver — it says what the video actually gives, in the video's own
  language, and never promises something the transcript does not contain;
- read like the titles that rank for this topic, without copying one;
- carry the keywords that matter, near the front;
- stay under about 70 characters so it is not cut off.

Title `n` belongs to background `n`: the pair is one creative direction.

From each title, write the **cover text** — the few words that will be set in
the tag lettering on that cover. It is not the title repeated: it is the hook
that makes the title land. Short, spoken, uppercase-friendly, two or three words
per line, at most three lines. It must create curiosity and still be honest about
what the video contains, the same as the title. Choose the cover text so it suits
the background you paired it with.

## Step 6 — Write the description

From the transcript and the frames, write a description that says what the video
delivers, in the video's own language. Structure it as:

1. Two or three lines that repeat the promise of the strongest title, carrying
   the keywords found in step 5 in the first line, because that is the part
   search reads.
2. Whatever context the video needs — what it is, who is in it, where it is.
3. **Chapters**, one per line as `mm:ss Title`, starting at `00:00`, from the
   `chapters` you stored in step 4. Use the finished video's clock.
4. Every link that appears in the video. `get_packaging_sources` returns
   `qrLinks` — every link a QR tag encodes on the timeline. All of them must be
   in the description, each with a line saying what it is for. A QR code the
   viewer cannot scan in time is only useful if the link is underneath.
5. **Hashtags** on the last line, three to five, the most relevant first.

## Step 7 — Write the tags

From the whole video and the keyword research, write the discoverability tags as
a comma-separated list: the exact topic first, then its close variants, then the
broader category, then the names and places the video actually features. Keep
them all true to the content. Around 15 to 25 tags is right; do not pad.

## Step 8 — Draw the covers, then deliver

Before drawing or delivering, follow **`review-youtube-policy`** for the three
titles, cover concepts/text, description, chapters, hashtags, tags, QR links and
chosen final frames. Replace policy-breaking or materially misleading packaging.
If the review discovers a violation still present in the finished timeline,
return to `edit-video`, remove it with verified semantic continuity, call
`finish_editing` again with the updated `youtubePolicyReview`, and only then
save new cover frames; an old frame is tied to the pre-fix edit.

Now, and only now, generate the three covers — one per title, using its paired
background and its cover text, with the prompt in
`references/cover-prompt.md`. Immediately before generating **each cover**, call
`get_packaging_tag_style` again; attach that exact reference image to that cover
request and carry its exact `id` and `path` with its result. If the active style
changes between covers, discard the earlier draft set and regenerate it under
the newly active style. Save each as a
16:9 PNG in the `coversFolder` that `get_packaging_sources` returned.

Before composing **each cover**, call `prepare_packaging_background` with the
original `sourceFramePath` from `save_frames`. It writes a lossless PNG with
deterministic exposure, contrast and colour adjustments while retaining every
object, person and scene coordinate. Inspect it beside the original, including
faces and dark areas. Adjust the exposure/contrast/saturation within its limits
when needed; do not accept clipping, unnatural skin tones or amplified grain.
Attach that corrected PNG as the generator's background, keeping the original
saved frame as the provenance master. Deliver its path as `preparedBackgroundPath`.
If the user explicitly requested untouched tones, respect that instead and
record the exception. An older editor without this tool needs an equivalent
deterministic tonal pass and visual check; an instruction in a prompt alone is
not evidence that colour and lighting were improved.

Treat the saved background frame and every face in it as protected pixels.
Prefer deterministic colour correction and typography over regenerating the
scene. When the user explicitly names the only people permitted in a cover,
insert those names in the prompt's optional identity guard; otherwise allow only
the people already visible in that frame. Never carry names from one project to
another, infer a name from a face, add a person, or invent a named person who is
not in the supplied frame.

Compare every generated cover side by side with the selected reference before
delivery: family and weight, colours, outlines, shadows, texture, angle,
proportions, spacing and hierarchy. Reject invented slashes, side streaks,
brush marks or decorations that the reference does not contain. Confirm that
the saved final-edit frame is still the background and that faces and other
protected areas are unchanged and unobscured. If generated letters are not
faithful or readable, keep the source frame intact and add the lettering with a
deterministic SVG/canvas/raster composition instead of asking image generation
to spell it again; then repeat the same visual comparison.

If you have no way to generate images, say so in one line and deliver the rest;
the backgrounds, the titles, the cover texts and the prompts are enough for the
user to finish in the generator of their choice.

Deliver everything with one `set_video_packaging` call — absolute cover paths,
each cover's `sourceFramePath` (the `path` `save_frames` returned for its
background), `sourceTimestamp` (that frame's **`outputTime`**, not its source
timestamp), `tagStyleId`, `tagStyleReferencePath`, `letteringMethod`
(`generated` or `deterministic-overlay`), and `styleVerification` with
`checked: true` plus concise comparison notes. Include the three titles, the
description with real newline characters, and the tags, with a unique
`requestId`. A background saved before the last change to the edit or a style
different from the current active reference is refused: read/save again and
redraw that cover.
Include the corrected `preparedBackgroundPath` when using the preparation tool.
Verification must describe what was compared: letter shapes/weight, colour,
outline, shadow, proportions and spacing at small size; then the source,
corrected background and final cover, with unchanged expressions and no new
people, objects, geometry or invented decorations. An approximate font is not
an exact match: compose the lettering with an available matching font/style,
or disclose the specific limitation instead of declaring an unverified match.
Omitted fields keep their current values and supplied arrays replace that
section, so a later fix can send only what changed. Use `get_video_packaging` to
check what is on screen before a partial update.

The desktop editor also saves `video-packaging.txt` directly in the
`packagingFolder` returned by `get_packaging_sources`, alongside the cover
subfolder. Once all three titles, the description and the tags are delivered,
this single UTF-8 file contains each title on its own line, a blank line, the
full description, another blank line, and the tags separated by commas.
Later deliveries update the same file. Keep the description's real paragraph
breaks; do not add headings or create a separate text file per title. A failed
save is reported by `set_video_packaging`; resolve the reported folder/write
problem and retry before claiming that the text was saved.

The editor brings Video Packaging forward by itself after the call. Immediately
call `get_video_packaging` and verify that all three thumbnails have a positive
`byteLength`, all three source timestamps and paths are present, and the titles,
multiline description and tags are visible. A zero-byte or missing image is a
failed delivery: fix it and verify again. Then call `set_ai_control_log` with
`view: "minimized"`; the reader can maximize the global log from any tool tab.

In the final response, state the three real final-timeline timestamps used. Do
not claim delivery until `get_video_packaging` confirms it.

---

## What not to do

- Do not put covers, titles, descriptions or tags into timeline text clips
  unless the user explicitly asks for them inside the video.
- Do not invent a link, a chapter or a claim the transcript does not support.
- Do not draw a cover before its title exists.
- Do not reuse an old generated cover or fabricate a scene instead of using a
  frame from the edited video.
- Do not deliver only in chat. If it is not in Video Packaging, it was not
  delivered.
