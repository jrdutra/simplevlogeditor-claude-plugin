# Short Editor MCP commands

All times are **seconds of the source video** (`timeSpace: "source"`). The
output is always 1080×1920, 30 fps, H.264/AAC in `.mp4`. Every command except
the three reads needs a unique `requestId`.

## Reads

| Command | Arguments | Returns |
|---|---|---|
| `short_get_state` | — | The whole session (below). |
| `short_get_capabilities` | — | Output format, transitions, default settings, limits, caption presets/fonts/style limits, person-tracking options, command list. |
| `short_get_transcript` | `from?`, `to?`, `includeWords?` | `segments: [{start, end, text}]`, `wordCount`, and with `includeWords` the `words: [{start, end, text}]` of that stretch (at most 5000). Empty until `short_generate_captions` has run for the loaded video. |

## Session

| Command | Arguments | Notes |
|---|---|---|
| `short_import_video` | `path`, `replace?` | Loads one **horizontal** video; makes the filmstrip and waveform. Replacing a session that has shorts needs `replace: true` (exported files stay). |
| `short_clear` | — | Empties the session; stops renders; exported files stay. |
| `short_set_view` | `zoom?` (1–20), `playhead?` | Only the timeline view in the window. |
| `short_save_document` | `path` (new `.json`), `kind?` (`project` default, or `settings`) | Same format as the window's Save. Never overwrites. |
| `short_open_document` | `path`, `replace?` | A project loads its video again and recreates every short; settings apply to the session. Missing audio is left out and listed in `document.missingAudio`. |

## Cuts and shorts

| Command | Arguments | Notes |
|---|---|---|
| `short_set_selection` | `ranges`, `settings?` | The draft: cuts not yet made into a short, and the settings new shorts start from. `ranges: []` clears it. Captions set here also apply to every short that is not rendering. |
| `short_create` | `name?`, `ranges?`, `settings?` | A new short card from `ranges` (or the selection), with the draft settings plus `settings`. |
| `short_update` | `id`, `name?`, `ranges?`, `settings?` | Changes a short; invalidates its render. |
| `short_delete` | `id` | Removes the card; its exported file stays. |

A cut (`ranges[]` item): `{ start, end, cropX?, cropTrack?, follow? }` —
`cropX` is the cut's own still framing (0 left, 0.5 centre, 1 right);
`cropTrack: [{t, x}]` is a framing path made by `short_track_person` or
`short_set_focus`; `follow` records how it was drawn. Cuts are played in the
order given and must be at least 0.1 s long.

## Settings

| Field | Default | Meaning |
|---|---|---|
| `audioPath` | `null` | Replacement/extra audio file (loops to fill the short). `null` = the original sound only. |
| `volume` | 1 | Level of the original sound (0–2). With `audioPath`, 0 replaces the original. |
| `musicVolume` | 1 | Level of `audioPath` (0–2). |
| `cropX` | 0.5 | Framing of cuts without their own. |
| `transition` | `cut` | `cut`, `fade`, `wipeleft`, `slideright` between cuts. |
| `transitionSeconds` | 0.3 | Length of each transition (0.05–2); it overlaps the two cuts. |
| `audioFadeOut` / `audioFadeIn` | `null` | Fades of each cut's sound at a transition; `null` = a crossfade as long as the overlap. |
| `captions` | — | `{ enabled, preset?, style?, words? }` — send only what changes; words are kept when omitted. Presets: Classic (default), Neon, Impact, Minimal, Editorial. Style fields: `color`, `highlight`, `shadow`, `outline` (`#rrggbb`), `outlineWidth` 0–8, `font`, `fontSize` 32–200, `highlightScale` 1–1.4, `lineHeight` 1–2.5, `positionY` 10–90 (% of height), `charsPerCaption` 10–120, `bold`. |

Finished length of a short = sum of its cuts − one `transitionSeconds` per join
(when `transition` is not `cut`; each overlap is capped at half of the shorter
neighbouring cut).

## Done in the window, on this computer

| Command | Arguments | Notes |
|---|---|---|
| `short_generate_captions` | `language?` (`auto`, `pt`, `en`, …), `enabled?` (true), `preset?` | Transcribes the loaded video, stores the words as captions on the draft and on every short not rendering, and returns `segments`. `noAudio: true` for a video without sound. |
| `short_track_person` | `id?` (omit for the selection), `cutIndex?`, `restX?`, `follow?` | Person detection on every cut (or one): keeps the person in the horizontal centre — face, then speaker, then body; returns `cuts[].personSeenShare`. `follow`: `{ delays, startDelayMs, holdDelayMs, smoothness: abrupt|slight|smooth|very }`. |
| `short_set_focus` | `id?`, `cutIndex`, `start`, `end`, `x`, `endX?`, `transitionSeconds?` | Your own framing over one interval of a cut (B-roll, an object, scenery); tracking elsewhere is kept. |

## Rendering

| Command | Arguments | Notes |
|---|---|---|
| `short_render` | `id`, `outputPath` (new `.mp4` in an allowed folder) | Returns at once; poll `short_get_state` for `status` (`rendering`, `done`, `error`), `progress` and `outputPath`. At most two at a time. Never overwrites. |
| `short_cancel_render` | `id` | Stops it and removes the temporary file. |

## Session shape (`short_get_state`)

```json
{
  "source": { "path": "…", "name": "…", "duration": 412.3, "width": 1920, "height": 1080, "hasAudio": true },
  "selection": [ { "start": 12.4, "end": 22.1 } ],
  "draftSettings": { "audioPath": null, "volume": 1, "musicVolume": 1, "cropX": 0.5, "transition": "cut", "transitionSeconds": 0.3, "audioFadeOut": null, "audioFadeIn": null, "captions": { "enabled": true, "words": [], "style": {} } },
  "shorts": [ { "id": "…", "name": "…", "ranges": [], "settings": {}, "status": "idle", "progress": 0, "outputPath": null, "error": null } ],
  "zoom": 1, "playhead": 0, "revision": 12
}
```

The state also carries `source.filmstrip` and `source.waveformImage` (small
images for the window); ignore them.
