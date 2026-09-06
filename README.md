# KINETOPE — a laboratory of web storytelling

KINETOPE (from Greek *kinetos*, "moved", and *topos*, "place") — the place of
movement. A laboratory of websites where the form is the content: the journey
is the story. Each entry documents the **mechanism** — how it's built, why it
works — not just the link.

The catalogue is this HTML file (`index.html`), hand-curated, no backend, no
JavaScript on the platform side. To add a specimen: copy the block, increment
`SPEC-00N`.

## Specimens

| # | Ref | Site | Mechanism |
|---|-----|------|-----------|
| 1 | SPEC-001 | [DERIVE](sites/derive/hub.html) | Museum-hub of self-contained pages: Matrix-style narrative terminal, visit counter frozen since 2003 |

## Principles (non-negotiable)

- **Self-contained**: every site works standalone, shareable by direct URL.
- **Frozen**: content lives in the code. Zero maintenance, zero moderation, zero API.
- **Frugal**: platform < 12 KB, sites < 20 KB each. System fonts, zero images.
- **Deterministic**: fixed-duration looping animations, no unseeded randomness.
- **Safe**: strict CSP (`default-src 'none'; style-src 'self'`), no forms, no
  tracking, no cookies, no JavaScript on the platform.
- **Neutral chrome**: the platform stays quiet (paper & ink). Color and motion
  belong to the specimens.
