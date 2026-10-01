---
name: review-youtube-policy
description: Use only after a video edit is editorially and technically complete, or when the user explicitly asks for a YouTube policy review. Review the final video and publishing material, make the smallest coherent policy cuts, and produce SimpleVlogEditor's structured removal report.
---

# Review YouTube policy compliance

The local SimpleVlogEditor desktop application includes a built-in MCP server that receives AI control commands. The `simple-vlog-editor` AI client plugin connects to this server and exposes tools for reading and controlling the project in the local desktop editor. Use this MCP connection as the control interface for this workflow.

Use this skill only at the final policy gate, after narrative, rhythm, speech,
picture and sound decisions are complete, or when the user explicitly asks for
a policy review. Do not load it while assembling the story and do not let policy
classification compete with ordinary editorial decisions.

At that final gate, read the complete [policy catalog](references/youtube-community-guidelines.md) once.
It covers every policy in the supplied reference set, the cross-policy rules,
and the stable identifiers used in reports.

Keep one structured review record for the run. Reuse that record and the policy
identifiers instead of loading or pasting the catalog again for packaging. If a
policy cut changes the timeline, re-open the edit, make the smallest coherent
cut, verify the join, then review the changed final result again before marking
the review complete.

## Review the actual publication

Review all evidence that can reach a viewer:

- every spoken word and audible sound;
- representative frames across every kept visual stretch, plus exact frames
  around suspected material;
- captions, text cards, placed images, effects, tags, QR codes and visible URLs;
- the proposed thumbnail, title, description, chapters, hashtags, playlist
  framing and other metadata when those exist.

Do not classify from a file name or transcript alone when the picture, tone or
surrounding context could change the meaning. A coarse contact sheet is a first
pass, not proof that a brief visual violation is absent. Densify around relevant
speech, scene changes and suspicious frames.

## Decide with context

Distinguish a Community Guidelines violation from material that may only need
an age restriction, may be unsuitable for ads, or is merely uncomfortable.
Those are not interchangeable. Consider purpose, focus, duration, detail,
encouragement, likelihood of imitation, target, age of people shown, and whether
the necessary educational, documentary, scientific or artistic (EDSA) context
is present in the video or audio where the policy requires it.

Do not manufacture an EDSA exception by adding a vague disclaimer. Do not cut a
quotation, news record, criticism, recovery story or prevention discussion just
because it contains policy-related words; apply the catalog's context rules.
When evidence remains genuinely ambiguous after inspecting the surrounding
material, preserve the user's meaning and identify the item for human review
instead of claiming that YouTube will approve it.

## Remove a violation without breaking the story

For a clear policy conflict in source footage:

1. Select the smallest complete source range that removes the violating speech,
   image and audio. Use transcript word boundaries and safe visual cut points;
   never cut through a word.
2. Check the sentence before and after. Extend the cut only when a dangling
   pronoun, missing premise, changed claim or misleading juxtaposition would
   remain.
3. Apply `delete_source_range` with a reason that starts `YouTube policy:` and
   names the policy identifier. Remove a whole clip only when no smaller range
   can leave a truthful, coherent edit.
4. Re-read the timeline and inspect or preview both sides of the join. Repair
   audiovisual continuity with a clean cut, existing B-roll, a brief contextual
   card or a transition only when that addition is truthful and editorially
   justified. Never conceal a meaning-changing cut.
5. Record the committed source interval, exact transcript excerpt or precise
   visual/audio description, every applicable policy, and how semantic and
   audiovisual continuity were verified.

Review the completed edit again after all policy cuts. A cut can create a new
misleading claim by removing a negation or its context; the final pass must catch
that.

## Completion report

Always pass `youtubePolicyReview` to `finish_editing`, even when no violations
were found. Set `reviewed` to true only after all scopes above that exist in the
project were inspected. Use:

```json
{
  "reviewed": true,
  "summary": "One policy-breaking passage was removed; the surrounding explanation remains intact.",
  "reviewedScopes": ["speech", "audio", "visuals", "on-screen text", "links", "publishing metadata"],
  "findings": [
    {
      "clipId": "clip-id",
      "mediaName": "camera-01.mp4",
      "start": 12.4,
      "end": 18.9,
      "excerpt": "Exact removed words, or a precise description of the removed image/audio.",
      "policies": [
        { "id": "YT-HARMFUL-DANGEROUS", "name": "Harmful or dangerous content", "rule": "The passage instructs viewers to perform an act with an imminent risk of serious injury." }
      ],
      "action": "removed",
      "continuity": "Cut on complete sentence boundaries; preview confirmed that the preceding warning now joins the next safe explanation without changing its claim."
    }
  ]
}
```

One finding represents one removed source range and may list several policies.
Report only committed policy removals in `findings`; do not mix ordinary cleanup
cuts, age-restriction notes or hypothetical concerns into the alert. If nothing
was removed, send an empty `findings` array and a concise review summary.

This is a preventative editorial review, not a guarantee of YouTube approval.
Policies and enforcement evolve, and jurisdiction-specific law, copyright,
privacy, monetization and advertiser-suitability rules can still apply.
