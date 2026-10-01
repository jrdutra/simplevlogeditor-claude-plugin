# Audiovisual evidence before each cut

Read this before proposing or committing cuts, including in a pre-edited vlog.
Descriptions, filenames, transcript timing and detected silence are candidates,
not sufficient evidence for a cut. Inspect the original picture and sound first.

## Four seconds on both sides, every 200 ms

For every proposed boundary `t`, inspect `[max(0, t - 4), min(sourceDuration, t + 4)]`
in **original source seconds**, before any edit is committed. Use the complete
source duration, not the current split container's in/out points: its neighbour
is part of the evidence. Record shortened context only at the actual file edges.

- For `delete_source_range`, inspect **both** the start and end boundaries. A
  long removal needs two separate windows, not just one sample in its middle.
- For `split_clip`, inspect the split point; for trims, inspect every changed
  in/out boundary; for removing a whole clip or rearranging clips, inspect the
  outgoing and incoming edges that will meet in the resulting sequence.
- Before enabling `cutSilence`, inspect both edges of **every enabled detected
  range** that would be removed. Disable unreviewed or meaningful ranges first.
  Enabling a global/default silence setting is subject to the same rule.
- Overlapping windows may share evidence if the same source asset and exact
  times are covered. Keep a boundary ledger; do not omit candidates to save context.

For each window:

1. Read all transcript words intersecting it, including the complete surrounding
   sentence. Fetch adjacent `get_analysis_blocks` when a window crosses a block
   boundary. Extend context when four seconds does not resolve meaning.
2. Call `get_contact_sheet` with explicit `start`, `end`, `interval: 0.2`,
   `composited: false`, and a modest width (320–480). An eight-second window
   contains about **41 frames**. Inspect the actual returned images in sequence,
   not a textual description. Alternatively use `get_frames` with explicit
   timestamps at 200 ms spacing including the boundary; at most 64 per call.
   Split extended windows into bounded calls: a contact sheet has a frame cap.
3. Call `get_audio_levels` with the same range, `interval: 0.2` and
   `includeAudio: true`. The eight-second range returns about **40 measured
   bins**, channel RMS/peak and dBFS, decode coverage, and an original WAV excerpt
   as native MCP audio. Read the measurements **and listen to the excerpt**
   when the client supports audio. These are full PCM-window measurements, not
   isolated samples every 200 ms or upsampled whole-file waveform buckets.
4. Check words and syllables, breaths and reactions, music/ambience changes,
   laughter, impacts and other useful sounds, and the action visible in frames.
   Keep speech handles where safe (usually 80–150 ms). A low RMS does not prove
   useless silence; a transcript gap does not prove an absence of speech.
   Multichannel meters do not cancel opposite-phase signals. Missing decoded
   samples/low `coverage` are **unknown audio**, never verified silence.
5. Record `assetId`, boundary time, exact reviewed range, first/last frame times,
   audio coverage and level changes, relevant words/sounds/action, and why the
   proposed join preserves meaning and audiovisual continuity. Choose
   `keep`, `move boundary` or `cut`. A moved boundary requires fresh coverage
   of its complete four-second context before committing.

The tool measures the original sound **before** cuts, speed, volume, denoise and
soundtrack. It has no silence-analysis prerequisite. General measurement ranges
are at most 120 seconds; audible previews are at most 12 seconds/8 MiB. Request
longer evidence in consecutive bounded ranges, not by increasing the interval
and skipping the cut's 200 ms inspection.

If `noAudio: true`, record that the source has no audio track and base that
window's decision on its actual pictures; do not invent sounds. Decoder failure
is not `noAudio`. If the client cannot consume native audio, use the meters,
transcript and frames as partial evidence and do not claim to have heard it.
Preserve a candidate whose sound/meaning remains uncertain and state the precise
limitation; do not substitute a textual description for unavailable evidence.
If an older editor lacks `get_audio_levels`, disclose the missing capability;
its coarse waveform alone does not satisfy this inspection.

## Commit and verify the actual join

Only commit candidates with resolved evidence, using a fresh revision and a
structural dry run. After committing, inspect the actual kept/removed ranges
in `get_timeline` and preview each resulting join with sound, accounting for
speed, transitions and the edited output clock. Confirm no clipped syllable,
abrupt meaningful sound, unfinished gesture or lost context. Fix and re-inspect
any changed boundary before proceeding. Preview after the edit supplements the
mandatory inspection **before** cutting; it does not replace it.
