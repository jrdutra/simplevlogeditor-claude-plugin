# The cover prompt

One cover per title. Each cover is drawn from three things:

1. **the title** it belongs to (step 5 of the skill);
2. **the background** — the frame saved by `save_frames` for that same
   position, handed to the generator as an image, never described in words;
3. **the tag style** — the image returned by `get_packaging_tag_style`, handed
   to the generator as its lettering reference (the first attachment).

Attach both images to the request. A cover drawn from a description of the
background instead of the background itself is a different video's cover.

Before attachment, run `prepare_packaging_background` on the saved frame and
inspect the corrected PNG beside the source. Attach the active style **first**
and the corrected background **second**, matching the numbered images below.
Keep the original frame for provenance and content checks. The correction step
must actually happen; mentioning it in this prompt is insufficient. If the source
is not 16:9, preserve the whole scene inside a 16:9 canvas with a neutral border;
never stretch faces or invent scenery to fill it.

The saved final-edit frame is the protected image master. Prefer deterministic
colour correction and deterministic type composition over regenerating that
image. Generative processing is acceptable only when inspection confirms that
the scene, framing, people and faces are pixel-faithful apart from the permitted
tonal corrections.

## The prompt

Fill the three bracketed fields and send it with the two images attached.

```
Make a thumbnail for a YouTube video whose title is:

[TITLE]

The first image is the active lettering style selected in Video Packaging; the
thumbnail's text must copy that style. The second image is the exact background
frame captured from the finished edited video, with only its deterministic tonal
correction already applied; you must use that file.

Use the background exactly as given: do not replace it, do not redraw it, do not
crop or reframe it, and do not change its scene geometry, objects or perspective.
Do not reconstruct, retouch, beautify, swap or otherwise change any face,
identity, expression, hair or body. Keep only the people who are already in the
background and add no one else — no extra people and no new subjects.

[OPTIONAL IDENTITY GUARD]

If the user explicitly named the people allowed in this cover, replace the line
above with: "The only people allowed in this thumbnail are [ALLOWED PEOPLE],
and only when they are already present in the supplied background frame. Add no
one else." Never infer a person's name from the image and never hard-code names
from another project.

Improve only the colour, the lighting, the brightness and the contrast of the
background so it reads well as a thumbnail. Do not introduce noise, grain,
blur, halos, oversharpening or artefacts. These are tonal corrections, not
permission to repaint the scene or alter a face.

Set this text on the thumbnail, in the lettering style of the first image:

[COVER TEXT]

Copy the reference's visual language exactly — font family and weight, colours,
outline, shadow, texture, inclination, proportions, spacing, line hierarchy and
only the panels or decorations actually visible there. Never copy its example
words. Do not add slashes, side streaks, brush marks, sparks, icons or other
artefacts unless they are part of the reference. Use two or three short lines,
placed where they do not cover a face or another protected area.

The text must read as an extension of the title, not a repeat of it: together
they create curiosity and still tell the truth about what the video delivers.
The cover text must also suit the specific background frame. The result must be
16:9 and legible at a small size.
```

## The active style

`get_packaging_tag_style` returns whichever style is current, with its stable
`id`, reference-image `path` and description. The image is authoritative; the
description is only a fallback. Attach the image to every generation request
and keep the same id/path pair in that cover's delivery metadata. The editor
rejects a cover if the user selected another style after it was generated.

## Judging the result

Before delivering a cover, check it honestly:

- Is the background still the background that was handed over?
- Are the framing, scene geometry and objects unchanged?
- Are the faces and identities untouched, and is nobody in the picture who was
  not already in the supplied frame?
- If the user named allowed people, are those the only named people present,
  without inventing them when the frame does not contain them?
- Is the lettering the style from the reference, and is it readable at the size
  of a phone thumbnail?
- Are font family/weight, colours, outline, shadow, texture, angle, spacing,
  proportions and hierarchy consistent with the reference, without foreign
  marks or decorations?
- Does the text plus the title make someone want to click, without promising
  anything the video does not deliver?

If a cover fails any of these, redraw it rather than shipping it. If generation
cannot spell or shape the lettering faithfully, generate no text and compose
the type deterministically over the untouched saved frame with SVG, canvas or
an equivalent raster method, then inspect the final pixels again.
