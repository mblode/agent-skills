# Explanation forms

## Contents

- Controlled English (ASD-STE100)
- Diagram
- HTML page
- Explainer video

The house style in `SKILL.md` applies to every form: the words on a diagram, the labels on a page, and the narration in a video.

## Controlled English (ASD-STE100)

ASD-STE100 is Simplified Technical English, a controlled language written for aircraft maintenance manuals. Its rules limit sentence length, voice, and word meaning, so a reader can parse each sentence once.

**Full profile.** Use when the user asks for STE100 with no softening.

- Procedural sentences: 20 words or fewer. Descriptive sentences: 25 words or fewer.
- One instruction per sentence. Write instructions in the imperative ("Remove the cache.").
- Put a condition before its action ("If the build fails, read the log.").
- Active voice. Simple present, simple past, and simple future only. No "-ing" verb forms outside technical names.
- One word, one meaning, everywhere in the text. Pick "start" or "begin" and keep it. Use the approved-dictionary sense of common words (for example, "follow" means "come after", not "obey").
- Noun clusters of three words or fewer. Write "the timeout of the retry queue", not "the retry queue timeout value setting".
- Keep articles ("the", "a"). Do not drop words to make a sentence shorter.
- Paragraphs: one topic, six sentences or fewer.
- Put a warning or caution before the step it applies to, as a command followed by the risk.
- Technical names (identifiers, commands, product names) are allowed and stay verbatim.

**Relaxed profile ("80% STE100").** Keep the structure rules and drop the vocabulary rules.

- Keep: sentence length caps, one idea per sentence, imperative steps, condition first, active voice, one term per concept, short noun clusters, articles.
- Drop: the approved dictionary, the "-ing" ban in descriptive text, the tense limits.
- Allow a short framing sentence or analogy before the controlled text when it helps the reader.

Do not announce the profile or label the sentences. Return the text.

## Diagram

One diagram answers one question. Write that question as the caption, then draw only what the answer needs.

**Pick the format by surface.**

- Renders Mermaid (GitHub, most chat UIs, Markdown docs): a fenced `mermaid` block.
- Terminal or plain text: a fenced block of box-drawing or ASCII characters, 80 columns or fewer.
- A page or artifact tool is available: inline SVG, following that tool's design guidance.

**Pick the diagram by shape.**

| Content | Diagram |
| --- | --- |
| Who calls whom, in order | Sequence diagram |
| States and the events that move between them | State diagram |
| Parts and the links between them | Flowchart or box-and-arrow |
| Data changing as it moves | Left-to-right pipeline with the data shape on each edge |
| A choice | Decision tree |

**Rules.**

- Node labels are the real names: file paths, function names, service names, verbatim.
- Label edges with a verb or the data that moves ("POST /login", "JWT").
- About 12 nodes or fewer. Split a bigger picture into an overview and one detail diagram.
- Add two or three sentences after the diagram: where to start reading and the one thing to notice.
- Check the syntax when a renderer is available (for example `npx -y @mermaid-js/mermaid-cli`). A diagram that does not render is worse than prose.

## HTML page

Make a page when the reader learns by doing: moving a slider, stepping through a sequence, or toggling a case.

- Build around the one variable that drives the mechanism. One control the reader understands beats five they ignore.
- Show the mechanism changing, not decoration. Animation must carry meaning (a packet moving, a pointer advancing).
- One self-contained `.html` file with no build step. Inline the CSS and JS; load a library from a CDN only when it saves real work.
- Support light and dark themes and a phone-width viewport.
- Text on the page follows the house style; identifiers stay verbatim.
- If the host has a page or artifact publishing tool, use it and follow its design guidance. Otherwise write the file into the working directory and give the path.
- Open it before handing it over: load it in a headless browser (Playwright, or whatever the project has), take a screenshot, and look at it. Use each control once and check the console for errors.

## Explainer video

The default is a 3Blue1Brown-style animation: dark background, shapes and equations that move to show the idea, and a narrator. Aim for 1 to 3 minutes unless the user gives a length.

**Pipeline.**

1. **Script.** Write a scene list. Each scene has one narration paragraph (house style, spoken rhythm, no symbols the narrator cannot say) and the visual that matches it. Show the script to the user before rendering when the topic or length is open; render directly when the request is specific.
2. **Animation.** Use Manim Community Edition (`pip install manim`, needs `ffmpeg`). Use `Text` instead of `MathTex` when LaTeX is not installed. One Python class per scene.
3. **Narration.** Choose in this order:
   - ElevenLabs when `ELEVENLABS_API_KEY` is set in the environment. Read the key from the environment only; never print it, write it to a file, or put it in the script source.
   - A local voice when no key is set: Kokoro or Piper for natural speech, `espeak-ng` or macOS `say` as a last resort.
   - No narration, with on-screen captions, when no voice tool can be installed. Say so in one line.
   The `manim-voiceover` plugin wraps several of these and times each animation to its audio; use it when it installs cleanly.
4. **Sync.** Generate the audio for each scene first. Measure each clip with `ffprobe` and make each scene's animation that long, so the picture never runs ahead of the voice.
5. **Render.** Render at low quality (`-ql`) first. Fix problems there, then render the final at `-qh`. Join the scenes and the audio with `ffmpeg`.

**Review before delivery.**

- Extract one frame from the middle of each scene (`ffmpeg -ss <t> -frames:v 1`) and look at each frame: no text off-screen, no overlapping labels, legible at the final size.
- Check that the final duration matches the sum of the audio clips, give or take a second.
- Deliver the `.mp4` path, the script, and the source files, so the user can change one scene and render again.

Never claim the narration sounds right; no one has listened to it yet. Say what you checked.
