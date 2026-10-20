# Default vlog brief

This is the user's standard brief for editing a vlog. It is the starting point
of every full-vlog edit:

- When the user's request says nothing more than "edit this" (or names only the
  folder), follow this brief in full.
- When the user's request covers some points, those points win and this brief
  supplies everything the request left out.
- The brief wins over the automatic behaviour described in the phases of
  `SKILL.md` wherever the two differ. The "Applying the brief" section below
  says exactly where that happens.

The brief is kept exactly as the user wrote it, in Portuguese. Every text placed
*inside* the video still follows the vlog's predominant spoken language (Phase 4),
and the chat report follows the language of the user's request.

---

## The brief (verbatim)

Quero que edite os vídeos disponíveis neste diretório usando o Simple Vlog Editor.

Analise todo o material disponível e organize os vídeos de forma lógica, fluida e dinâmica, respeitando a ordem natural do conteúdo apresentado.

Adicione Background Captions destacando palavras-chave e trechos importantes do que está sendo falado. Esses captions devem ocupar aproximadamente 80% da largura do vídeo, utilizar texto branco, em negrito e possuir boa legibilidade sobre o vídeo.

Sempre que houver uma mudança relevante de assunto ou seção, adicione um elemento de texto indicando de forma curta o que será apresentado a seguir. Não é necessário adicionar esse elemento na introdução inicial.

Identifique automaticamente as principais partes do vídeo com base no conteúdo falado. Caso existam trechos repetitivos, redundantes, pausas desnecessárias ou momentos em que os apresentadores repetem a mesma informação várias vezes, remova esses trechos sempre que isso puder ser feito sem prejudicar o sentido da conversa.

Faça cortes de silêncio agressivos utilizando o padrão disponível no editor. Quando forem exibidas paisagens e lugares de natureza e contemplativos, como obras de arte, ambientes, use cortes de silêncio suaves.

Nivele o áudio de todos os clipes para que o volume fique consistente durante todo o vídeo.

Quando forem mencionadas informações importantes, como preços, valores, nomes, produtos, lugares, características, vantagens, desvantagens ou outros dados relevantes, utilize tags ou elementos gráficos para destacar essas informações no momento adequado. Nesse caso dê preferência para Background caption, onde a largura do texto deve ocupar 90% da largura do vídeo. As tags que não forem de subscribe, devem ter seu comprimento de 15 a 30% da largura do vídeo.

Caso existam links ou informações promocionais fornecidas junto ao projeto, gere QR Codes correspondentes e insira-os em momentos apropriados do vídeo. Utilize cores e estilos visuais coerentes com a identidade do serviço ou conteúdo relacionado.

Caso exista uma música no diretório do projeto, utilize-a como música de fundo. Dê preferência ao uso da música durante elementos de texto, introduções de seções e outros momentos em que ela possa aumentar o dinamismo da edição sem atrapalhar as falas.

Mantenha a música em volume suficientemente baixo para que as vozes permaneçam sempre claras e em primeiro plano.

Faça uma edição dinâmica, agradável e com ritmo adequado para manter a atenção do espectador. Remova tempos mortos e evite deixar trechos excessivamente longos quando não houver informação relevante sendo apresentada.

Utilize recursos como cortes, zooms dinâmicos, tags, background captions, transições e elementos gráficos quando eles ajudarem a reforçar o conteúdo, mas evite efeitos excessivos ou elementos que distraiam do assunto principal. As tags que não forem de subscribe, devem ter seu comprimento de 10 a 20% da largura do vídeo.

Sempre que aplicar algum tipo de zoom dinâmico, utilize um zoom de 50% como padrão. O zoom deve ser aplicado de forma suave ou abrupta(a depender da necessidade), contextual e intencional, preferencialmente em momentos de destaque, mudança de assunto, reação, informação importante ou quebra de ritmo. Evite aplicar zooms em excesso ou em intervalos muito curtos.

Se houver uma chamada para inscrição, curtida ou outra ação do espectador, adicione uma tag visual correspondente em um momento apropriado, preferencialmente próximo ao início do vídeo.

Para as thumbnails, utilize frames do próprio vídeo que sejam visualmente interessantes, explicativos e capazes de despertar curiosidade. Escolha preferencialmente frames com boa iluminação, enquadramento e expressão dos apresentadores.

Não altere o rosto ou as características físicas das pessoas presentes no vídeo. É permitido corrigir iluminação, contraste, exposição, nitidez e cores para melhorar a aparência da imagem.

Crie thumbnails com texto curto, grande e facilmente legível. O texto da thumbnail deve complementar o título do vídeo em vez de simplesmente repetir exatamente a mesma informação.

Quando houver logotipos ou elementos de identidade visual associados ao conteúdo, produto ou serviço apresentado, utilize-os de maneira discreta e visualmente coerente.

Ao finalizar a edição, gere também sugestões de título, descrição e palavras-chave para publicação.

Na descrição do vídeo:

- Inclua uma introdução curta explicando o assunto do vídeo.
- Inclua capítulos com timestamps correspondentes às principais seções identificadas durante a edição.
- Inclua palavras-chave relevantes de forma natural para otimização de SEO.
- Destaque os principais assuntos abordados.
- Inclua links relevantes fornecidos junto ao projeto.
- Evite excesso de palavras-chave ou texto artificial criado apenas para SEO.

Analise o conteúdo antes de realizar os cortes e tome decisões de edição levando em consideração clareza, ritmo, retenção do espectador e compreensão da narrativa.

O objetivo final é produzir um vídeo limpo, profissional, dinâmico e agradável de assistir, preservando o conteúdo original e a naturalidade dos apresentadores.

---

## Applying the brief

**Current editorial defaults.** Read
[the editorial defaults](../../edit-video/references/editorial-defaults.md).
They update this brief: Background Captions go in the upper left (`positionX: 0.3`,
`positionY: 0.24`) unless the user changes placement; this wins over older width
targets when they conflict with safe margins. Fade out an opening timelapse and
fade in its successor. Replace speech-free, non-timelapse ambience with the
project's default music. Around every standalone text card, fade out the prior
video, fade in and out the card, and fade in the next video, always picture and
sound together, including continuous music (`fadeAudioWithVideo: true`). Apply
the evidence and capability checks in that reference; preserve explicit user
choices.
When adjacent videos continue the same default music, fade only the outgoing
and incoming images (`fadeOutAudio: false`, `fadeInAudio: false`), without fading,
restarting or lowering that music. This takes precedence at a shared-music
opening-timelapse join; text-card boundaries still fade both picture and sound.

Everything below is how the brief maps onto the editor and onto the phases of
`SKILL.md`. Where a phase says something different, this section wins. Where it
says nothing, the phase applies unchanged.

**Order and story (Phases 10–13).** Keep the natural order of the content;
reorder only for clarity. Identify the main parts of the video from the speech —
they become the sections used for section titles and for the description's
chapters. Remove repetition, redundancy, unnecessary pauses and the same
information said several times, whenever the conversation keeps its meaning.

**Silence cuts (Phases 14–15).** Aggressive by default, with the editor's own
standard silence settings: `cutSilence: true` on every spoken clip, the detected
ranges kept enabled except pauses that carry humour, emotion or a reaction.
Clips that show landscapes, nature, works of art, rooms or other contemplative
places get gentle cuts: keep the pauses the shot needs to breathe (disable those
detected ranges, or leave `cutSilence` off when the clip is mostly scenery). This
replaces the "static aggressive, movement conservative" split of Phase 15.

**Dead time and pace.** Make the edit dynamic. Remove dead time, and shorten
stretches that run long without relevant information.

**Push-ins and zooms (Phases 16–19, 28).** Every dynamic zoom uses
`scalePercent: 50` unless the user asks for another value — this replaces the
proportional table and the "never above 30" limit of Phase 16. Smooth
(`rampSeconds` ≈ 0.4–0.6, `easeOut: true`) or abrupt (`rampSeconds: 0`) depending
on the moment: abrupt for a punchline, a reaction or a break in rhythm, smooth for
a highlight, a change of subject or important information. Zooms stay contextual
and intentional: the candidate selection, spacing (about 6–10 s apart, never in
quick succession) and visual checks of Phases 16–19 and 24 still apply — at 50%
check the framing especially carefully (faces, hands and the object being shown
must stay in frame). Choose a smaller value for one zoom only when 50% would crop
something essential, and say so in the report.

**Background captions for keywords (Phase 27).** Highlight the key words and
important passages of the speech with Background Captions: white, bold text,
about **80% of the frame width**, readable over the shot. The "at most 2 or 3 in
the whole project" limit of Phase 27 does not apply: use as many as the content
earns, spaced so they do not feel constant. Every other rule of Phase 27 and of
`edit-video` still holds — steady camera, the three clean layers, more than four
seconds on screen, the composited check.

**Important information (prices, values, names, products, places, features,
advantages, disadvantages, other relevant data).** Highlight it at the moment it
is said. Prefer a Background Caption whose text spans about **90% of the frame
width**. Where the shot cannot carry one (moving camera, no person to cut out,
busy frame), use a tag or another graphic element instead.

**Tag length.** Every tag that is not a Subscribe tag spans **15–20% of the frame
width**. The brief gives two ranges, 15–30% and 10–20%; 15–20% satisfies both.
Size it with `fontScale` (ordinary tags) or `scale` (special tags) and read the
width off a composited frame.

**Section titles (Phase 26).** Every identified section/topic subtitle must have
a standalone text container before the first video span about that subject.
Split at the verified source-time boundary when needed, and reuse matching
existing cards. Background Captions and overlays do not replace these containers.
Keep the reading-time, safe-margin and picture/audio fade rules of Phase 26 and
the editorial defaults, including the editor's automatic fades on both card ends
and the facing video edges.

**QR codes.** When links or promotional information come with the project (in a
text, document or note file in the folder, or in the user's request), add a QR
Code tag for each relevant link at a moment where it is mentioned or fits,
coloured and styled to match the identity of the service or content it points
to. Validate every URL; never invent one.

**Music (Phase 32).** When the project folder contains a music file, use it as
the background soundtrack (`set_project_soundtrack`), favouring text elements,
section introductions and other moments where it adds energy without competing
with speech. Keep it low enough that every voice stays clearly in front. An audio
file that is not clearly music (narration, a voice memo, an unknown recording) is
still never turned into background music on your own.

**Audio levels (Phase 32a).** Even out the volume of every clip — unchanged.

**Subscribe and calls to action (Phase 29).** When someone asks the viewer to
subscribe, like or take another action, add the matching tag at an appropriate
moment, preferably near the beginning of the video — once the viewer has had a
first moment of value, not in the very first seconds.

**Transitions, effects and graphics (Phases 30–31).** Use cuts, zooms, tags,
background captions, transitions and graphics when they reinforce the content;
avoid excessive effects and anything that distracts from the subject.

**Logos.** When logos or brand identity of the content, product or service are
available, use them discreetly and coherently (a small placed picture or the
colours of a QR tag), never as decoration for its own sake.

**Publishing material (Phase 39 and `create-video-packaging`).** At the end of
the edit, produce titles, a description and keywords. The description has a
short introduction, chapters with timestamps from the sections identified during
the edit, natural keywords, the main subjects, and the links supplied with the
project, without keyword stuffing. Thumbnails use frames from the video itself
that are interesting, explanatory and make the viewer curious, preferring good
light, framing and expression; faces and physical features are never altered
(light, contrast, exposure, sharpness and colour may be corrected); the text is
short, large, easy to read and complements the title instead of repeating it.
Deliver them through `create-video-packaging`. If the project's automatic Video
Packaging setting is off, that is the user's explicit choice and wins: do not
make covers, but still write title, description and keyword suggestions in the
final chat report.

License plate blur is off by default, per video container. Enable it only after
generative visual inspection finds a car with an exposed plate in that container.
Follow the evidence and per-container MCP rule in the editorial defaults.
