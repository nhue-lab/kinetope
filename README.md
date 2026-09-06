# KINETOPE — a gallery of web stories

Web stories by nhue-lab. Each piece is a small web experience built to make you
feel one thing — told in scroll, shipped in a few kilobytes.

Painters paint canvases. Directors shoot films. These are my pieces: stories
that live in a page, move with your scroll, and end when they have made their
point.

## The author's rules (for every piece, before any code)

1. **One emotion, named.** If the piece can't name the feeling it targets, it
   isn't ready to be built.
2. **The story leads.** Every technical choice serves the narrative. No effect
   without a narrative reason.
3. **Scroll is the metronome.** The visitor's hand sets the pace; the page sets
   the frame. Blocks snap, the story advances.
4. **The page is a character.** It reacts, remembers (within the session),
   gets impatient, answers back.
5. **Self-contained.** One folder, no backend, no images, system fonts, works
   offline. Shareable by URL, replayable forever.
6. **Frugal by doctrine.** ~20 KB per piece. Constraint is a narrative tool:
   text is material.

## The gallery

| N° | Œuvre | Année | Langue | Émotion visée | Matériau |
|----|-------|-------|--------|---------------|----------|
| 001 | [DERIVE](sites/derive/hub.html) | 2026 | fr | the slight chill of being watched by a machine with a sense of humor | narrative terminal, ASCII, scroll-metronome |

## Platform doctrine

- **Language**: the gallery speaks English; each work speaks its own tongue and
  declares it in its cartouche (`langue: français` today, maybe `langue: english`
  tomorrow). French is not a translation gap — it is a material choice, like the
  color of a canvas.
- **Static purity**: this gallery is one HTML file. No JS on the platform side.
- **Neutral chrome**: paper & ink. Color and motion belong to the works.
- **Author cartouches**: intention first (l'intention), mechanism second
  (la mécanique). The story of how it was made comes after the story itself.
- CSP strict (`default-src 'none'; style-src 'self'`), no forms, no tracking,
  no cookies.
