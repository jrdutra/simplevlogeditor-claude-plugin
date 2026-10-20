# Opening timelapses, background captions, ambience and chapter fades

Apply these defaults during the requested editorial pass, unless the user has
explicitly chosen different behavior. Preserve the existing structural cuts,
five-minute block analysis, source-time inspection, soundtrack continuity,
timelapse timing, readable cards and visual-verification rules.

## Blur plates only in video containers with visual evidence

Plate blur is off by default and belongs to each video container, never to the
project, its default clip edits, images or text cards. During the visual review,
the generative AI must inspect raw source frames (`get_contact_sheet` or
`get_frames`, `composited: false`) throughout each retained video span, including
timelapses. When a frame shows a car with its license plate exposed, record the
clipId and source timestamp and enable blur for that video container only.
Do not require reading or transcribing the number: a visible exposed plate is
enough. A car with its plate hidden, a scene without cars, filenames, a transcript,
or the local detector's result alone do not establish this visual condition.

Discover top-level `licensePlateBlur` in `get_editor_capabilities`, then use
`apply_edit_batch` with
`{ "type": "set_license_plate_blur", "clipId": "<observed-video-id>", "enabled": true }`.
Do not set this through `set_project_settings` or `set_clip_edits`. Keep other
containers off. For unclear, small or distant cars, inspect additional source
frames at higher resolution; if still inconclusive, leave blur off and report the
uncertainty. Never enable it across all videos as a precaution. Respect explicit
user opt-outs (`enabled: false` on the requested containers). Preserve intentional
manual choices; do not reset them simply because sampled frames show no plate.
After splits or trims, reassess the retained spans separately instead of enabling
all pieces from one source. On a request to reapply this policy, remove earlier
AI-applied blanket settings from containers without the required visual evidence.

Verify `get_timeline` and serialized `get_project` container `blurLicensePlates`
values after the batch. For enabled videos, inspect `get_frames` with
`composited: true` at the observed source instants and check
`licensePlateBlurApplied: true`; raw source frames remain unedited for analysis.
The bundled local model locates and blurs plates over time only within enabled
containers. Generative AI chooses the container; local AI processes its frames.
Use the normal MCP visual-inspection tools; do not send frames to an additional
plate-recognition service, and do not read or store plate numbers.

Automatic detection can miss tiny, obscured or motion-blurred plates; do not
promise complete detection. A `plate_detection_failed` error blocks protected
output: resolve the cause and retry, never disable an enabled container merely to
finish exporting. If the per-container capability is missing, report the required
editor update instead of falling back to the removed global option.

## Opening timelapse

After ordering and cutting the timeline, identify the first video. If it is a
timelapse (editor metadata or verified visual evidence), set `fadeOut: true` on
that timelapse and `fadeIn: true` on the following playable item, with
`fadeAudioWithVideo: true` on both, `fadeOutAudio: true` on the timelapse and
`fadeInAudio: true` on its successor. The continuous-project-music rule below
overrides these audio edges when both adjacent videos continue that music.
Use `set_clip_edits` with `fadeSeconds: 1`
unless the user chose another duration; the editor clamps short clips. Preserve
their other fade ends, cuts, speed and audio settings. If a text card comes
between the timelapse and the next video, also apply the card rule below. A lone
opening timelapse still ends with a fade out; do not invent another clip.

These are separate fades through black and silence, not a dissolve that mixes
the two pictures. Keep ordinary transitions on unrelated joins.

## Background captions default to the upper left

For every new Background Caption, explicitly send `positionX: 0.3` and
`positionY: 0.24`, including when using an animated or originally centered
preset. The generic `behind-subject` preset now has this same upper-left default.
Keep white, bold, uppercase sans-serif type and the existing segmentation,
clean-layer and minimum-duration rules. Change position only when the user
requests it. Do not reset an existing placement the user customized.

Upper-left placement and safe margins take precedence over older 80–90% width
targets when those cannot fit together. Shorten the wording or adjust font size
and line breaks; do not recenter the text to achieve the old width target.
Check composited frames at the start, middle and end, including motion extremes.

## No speech, only background sounds: use the project music

Inspect every non-timelapse video, including files that have an audio track.
Use the transcript, source audio excerpts (`get_audio_levels` with `includeAudio`
where supported) and pictures to distinguish speech from ambience. Empty text,
quiet RMS, a failed transcript or missing analysis is not proof of no speech;
retry or inspect the source before deciding. Review each retained split/span,
not only the original file as a whole. Preserve speech wherever it occurs.

When a retained video has no speech and contains only background sounds,
replace its original audio with the **project's default music**. Establish the
chosen music with `set_project_soundtrack` first. If the clip has a different
per-clip replacement, remove that attachment with `detach_audio` and its
`clipId`, then use `set_audio_mode` with `mode: "replace"` on that clip. Do not
use `mute`, mix the ambient track back in, or rely on a silence detector: loud
traffic, wind or room tone can contain no speech without being digital silence.
Do not replace the audio of an entire clip that also contains speech; split at
verified boundaries if only part is ambience. Respect an explicit user choice
to keep a meaningful natural sound or an existing audio treatment.

Do not select an arbitrary narration/unknown audio file as music. If the project
has no default music and the folder provides none identifiable as music, retain
the audio and report the missing soundtrack; never mute first or claim a
replacement happened. Use the editor's continuous music offsets and check
`soundShort`; do not leave the end of an ambience clip without music.

## Consecutive videos with continuous project music: picture-only fades

When two directly adjacent videos both resolve to the project's default music
and the next video continues that same track, always fade out the outgoing
picture and fade in the incoming picture, while the music plays continuously
at its existing level. This includes an opening timelapse when its successor
continues the project music; at that shared-music boundary this rule takes
precedence over the opening timelapse's picture-and-sound default.

Read `get_timeline` after final ordering. Require both videos to have
`resolvedSound.kind: "file"`, `resolvedSound.projectDefault: true` and the same
project soundtrack, with a continuous offset. Do not infer continuity from file
names alone, `audioMode: "continue"`, or the presence of a project soundtrack;
the next clip may still be playing its own speech or a different replacement.
Do not switch a spoken video's audio merely to make it qualify for this rule.

Use `set_clip_edits` with `fadeSeconds: 1` unless the user chose another duration:

- Outgoing video: `fadeOut: true`, `fadeOutAudio: false`.
- Incoming video: `fadeIn: true`, `fadeInAudio: false`.

These per-edge overrides keep the music audible even if `fadeAudioWithVideo`
was already enabled. Preserve the opposite fade edge and all other edits. A
video coming from a text card may need `fadeInAudio: true` at its entrance and
`fadeOutAudio: false` at its exit into another video; never globally clear its
audio fades to implement a picture-only exit. Apply this to every qualifying
pair in a run. Leave the existing project soundtrack and playback offsets in
place: do not restart or reattach music, mute it, change its volume, or insert
an audio fade/crossfade at these joins. Do not add a dissolve over the picture
fades: explicit per-edge fades take precedence over overlapping transitions;
remove redundant transition rows at those joins, preserving unrelated joins.

Check `get_editor_capabilities.audio.clipFades.fields` for `fadeInAudio` and
`fadeOutAudio`; request an editor update if unavailable instead of claiming the
rule was applied. Verify `plannedFades.picture` has both ramps, while neither
`plannedFades.audio` nor `plannedFades.soundtrack` dips at this boundary.
Without an overlap, the incoming music offset must equal the outgoing offset
plus its output duration (allow rounding). Check `soundShort: false` and preview
with sound across each join. If the track runs out or restarts, resolve that
shortfall or report it; a restarted track is not continuous music.

This rule applies between video clips. Standalone text cards keep the
picture-and-sound fades below at their own boundaries.

## Every identified topic subtitle becomes a text container

Every identified section/topic subtitle must become a standalone text container
before the first retained video span discussing that subject. This is a narrative
section heading, not each line of speech subtitles. Do not replace the required
container with a Background Caption, an overlay, or a description chapter alone.
This requirement takes precedence over older advice to use cards sparingly or
prefer a title over footage for section headings. Preserve spoken subtitles and
keyword overlays as their own features.

Keep a ledger of identified topic subtitles, source span starts and final card
IDs. After structural cuts/reordering, use `add_text_clip` at each topic boundary,
in the spoken language, with concise readable wording and adequate full-text hold.
If the topic starts inside a video container, split at the verified source-time
boundary and insert the card before the new topic's video piece. Reuse or update
an existing matching card instead of duplicating it; consolidate repeated mentions
of the same continuing section. Verify in `get_timeline` that every identified
heading has its text container immediately before the corresponding subject.
Use final output times, including the cards, for packaging chapter timestamps.

## Fade every text card and its neighboring videos, picture and sound

For each standalone text element (`kind: "text"` / `add_text_clip`), use
`set_clip_edits` on the final clip IDs:

- Previous playable video: `fadeOut: true`, `fadeAudioWithVideo: true`, `fadeOutAudio: true`.
- Text card: `fadeIn: true`, `fadeOut: true`, `fadeAudioWithVideo: true`, `fadeInAudio: true`, `fadeOutAudio: true`.
- Next playable video: `fadeIn: true`, `fadeAudioWithVideo: true`, `fadeInAudio: true`.

The current editor also derives these picture/audio edges automatically whenever
a text card is added, moved, duplicated or reopened. Discover
`audio.clipFades.automaticTextCardBoundaries`; the rule follows the current order,
including transition rows between the containers. Existing positive fade lengths
are preserved, and zero/invalid lengths use 1 second, clamped for short clips.
Verify effective container edits and `plannedFades` instead of assuming that
automatic behavior ran. Use the explicit operations above when needed on an
older compatible editor; do not undo the automatic rule. The directly adjacent
video-to-video music-continuity rule still applies at other edges.

Use `fadeSeconds: 1` unless the user specified a duration. Merge these fields
into the current clip edits; never replace unrelated settings or remove an
already required fade on the other end. The same rule applies at both ends of
a run of consecutive cards. At project edges, apply only the neighbors that
exist. This rule concerns standalone cards, not speech subtitles or keyword
captions over continuing footage.

The editor gives these faded edges priority over overlapping transitions, even
when a default transition is configured. Remove redundant transition rows at
those boundaries where appropriate; do not disable transitions for the whole
project. Continuing project music must also dip to silence and return with the
picture. `soundFade` alone fades a whole music run and does not implement these
per-card breaks. Keep the project music under cards unless explicitly muted by
the user; never treat a fade-out as permission to silence an entire clip.

Check `get_editor_capabilities.audio.clipFades` before using
`fadeAudioWithVideo`. If the editor lacks it, report the required editor update
and do not claim these picture-and-music breaks were completed.

## Completion evidence

Dry-run and commit the batches with current revisions and request IDs, then read
`get_timeline`. Verify `resolvedSound.projectDefault: true` for each ambience
replacement, its `soundShort: false`, and `plannedFades.picture` and
`plannedFades.audio` at each picture-and-sound boundary. At continuous-music
video joins verify picture fades and the absence of music/audio dips instead.
These fade ranges use **output**
seconds; caption positions and cut operations retain their source-time rules.
Check `plannedTransitions` for the absence of overlaps on these breaks. Preview
with sound around the opening timelapse and every card, checking both fade ends.
Report actual changes and any unavailable music/analysis/capability explicitly.
