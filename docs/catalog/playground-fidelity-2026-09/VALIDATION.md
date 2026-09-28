# Validation — 2026-09-28

## Automatic checks

| Project | Command | Result |
|---|---|---|
| Web | `npm run catalog:sync` | PASS: 302 products, 302 image identities, shared data/runtime synchronized. |
| Web | `npm run catalog:check` | PASS: no generated drift. |
| Web | `npm run lint` | PASS, zero warnings. |
| Web | `npm run test` | **174 passed**, zero failed/skipped. |
| Web | `npm run build` | PASS: 129 modules, metadata for 303 catalog routes. Existing large PDF-thumbnail chunk warning remains. |
| App | `npm run typecheck` | PASS. |
| App | `npm run lint` | PASS, zero warnings. |
| App | `npm run test` | **73 passed**, zero failed/skipped. |

The first final build failed with `ENOSPC` while copying `public/images/products/let-freedom-ring-24-pack-480.webp`. After removing only generated temporary capture frames and the regenerable Node compile cache, the same command passed. Ignored `public/artifacts` QA files were temporarily moved outside `public` during the build and restored afterward. The successful generated `dist` was then removed to leave disk space for Git; it is ignored and reproducible. Production resources were not removed or changed. No exports, deployments or app publications were run.

New regression coverage checks the restored Aggression phases against the unchanged absolute times of its first five bursts, defensive duration bounds, secondary tail validation, delayed bouquet decay, and event delivery at 60/30/12/~6 Hz with pause/resume. It includes all bouquet events from Vertical Limit and Wild Horses, as well as Aggression's longer documented flower decay. A runtime test reproduces terminal audio reporting and verifies live zero counts after stop/restart. App tests compare profiles and serialized/shared engines byte for byte and exercise all ten changed/new timelines.

## Desktop browser review

Chrome 153 on macOS. The actual production document, renderer, timeline and audio factories were used in the local QA gallery; no alternate simulator was substituted. The gallery fixes sound/quality defaults for reproducibility and does not test public preference restoration. All ten changed/new profiles played their published window to completion:

| Profile | End position, seconds | Final particles | Evidence |
|---|---:|---:|---|
| Aggression | 15.14 | 0 | [Runtime](evidence/aggression-runtime.json) |
| Jawbreaker | 28.74 | 0 | [Runtime](evidence/jawbreaker-runtime.json) |
| Willow Explosion | 20.95 | 0 | [Runtime](evidence/willow-explosion-runtime.json) |
| Old Ironsides | 36.50 | 0 | [Runtime](evidence/old-ironsides-runtime.json) |
| Color Rage | 33.80 | 0 | [Runtime](evidence/color-rage-runtime.json) |
| Whisky Business | 31.92 | 0 | [Runtime](evidence/whisky-business-runtime.json) |
| Whacky Tobacky | 24.89 | 0 | [Runtime](evidence/whacky-tobacky-runtime.json) |
| Migraine | 30.82 | 0 | [Runtime](evidence/migraine-runtime.json) |
| Fuego Loco | 21.07 | 0 | [Runtime](evidence/fuego-loco-runtime.json) |
| Walkin' Dead | 20.72 | 0 | [Runtime](evidence/walkin-dead-runtime.json) |

The windows, scope and reference limitations are in [README](README.md) and [observations](observations.json). A complete browser playback of an excerpt does **not** make the source coverage complete. The source review for Old Ironsides and Whisky Business reused the preceding iteration's timestamped full captures, as explicitly recorded. The wider historical visual audit is still incomplete; [audit.json](audit.json) distinguishes mechanical checks, source playback and corrected playback.

Jawbreaker + Willow Explosion + Old Ironsides + Nishiki Blast exercised pause at 0.299 s, a first shell counted once, a manual second shell during the cakes and a third after automatic playback ended. Counts and effect identity remained independent. Restart returned to zero; switching to an empty Close-up disposed the previous scene. [Pre-fix observations](evidence/manual-pause-audio.json) exposed cached audio voice counts after stop. [Post-fix observations](evidence/resources-after-fix.json) report zero voices, RMS, peak and particles at rest; [muting the next manual shell](evidence/muted-after-fix.json) ends with a suspended audio context, zero voices and zero particles.

Audio signal generation and active/suspended context state were verified. **Physical audible output was not verified.** The recording intentionally has no audio. No new audio assets or licenses were introduced.

The public `/playground` page was also checked: Dallas shows 44 aerial profiles (33 cakes and 11 shells); Fuego Loco and Walkin' Dead are searchable; changing search preserves the active selection. Labels show `Approx. 21 sec`, `Preview · Approx. 21 sec` and `Approx. 15 sec` for Fuego Loco, Walkin' Dead and Aggression respectively. Fuego Loco's `Watch the reference` opens `/products/fuego-loco#product-video`, focuses the demo heading and retains the lazy `Load video` control without autoplay. My List remained at its pre-existing three units. The public page and final QA gallery reported no browser console errors/warnings at the final check.

## Motion artifact and performance

[Before/after + Fuego Loco recording](evidence/fidelity-before-after.webm): **45.008 seconds, 795,511 bytes**. Three labeled segments, 147 timestamped browser frames, approximately 3–4 captured frames/s. The original intervals are retained without interpolation; this is not a renderer FPS benchmark. The before segment uses the historical Aggression profile in the current production document. The final saved bytes were compared with the complete browser recording after extraction in bounded chunks; no truncated base64 payload is included.

[Performance data](evidence/performance.json): three bounded 35-second runs of Aggression, Color Rage, Willow Explosion and Fuego Loco using the production renderer/timeline. CSS canvas 1280×640, DPR 2, eight logical cores exposed, physical model unidentified. This measures canvas drawing, not GPU/compositor work, audio mixing, battery or thermal behavior; it is separate from screenshot capture.

| Requested / effective | FPS | Mean / p95 draw ms | Max draw ms | Gaps >50 ms | Peak particles / points | Peak JS heap |
|---|---:|---:|---:|---:|---:|---:|
| Auto / High | 59.94 | 1.56 / 3.80 | 42.5 | 1 | 652 / 1,915 | 36.3 MB |
| High / High | 60.03 | 0.58 / 1.30 | 2.3 | 0 | 652 / 1,915 | 31.4 MB |
| Balanced / Balanced | 60.03 | 0.42 / 0.90 | 1.5 | 0 | 482 / 1,044 | 31.7 MB |

No sustained adaptation occurred; p95 frame interval was 16.8 ms. Render buffers were 2560×1280 (High) and 1920×960 (Balanced). The first pass includes warm-up; its cost difference is not evidence that explicit High outperforms Auto. Some individual capture reports include first-message latency from changing QA documents; use the dedicated benchmark for performance comparisons.

## Preserved scope and limitations

- Semantic catalog diff: only `demonstration` changes on ten IDs. No product IDs, categories, weights, photographs, promotion rules or saved quantities change.
- Exactly eight existing profiles change; two are added; all other approved profiles remain byte-identical at the data level. Shared tail protection also applies to existing bouquets.
- No Dallas/hero/environment resources or presentation components change. Skyline occlusion, scenery, star distribution and product bases retain their existing composition.
- App data, index, renderer, runtime and timeline are synchronized. **Native visual review is “pospuesta por decisión del usuario.”** No Simulator, Metro inspection, device tests or routine platform exports were performed. Desktop results are not native validation.
- Repeated disk-space failures limited further source capture and fine analysis. Pending recent profiles and 84 cakes without profiles are enumerated with concrete reasons in [PENDING.md](PENDING.md); neither full inventory coverage nor a completed historical visual audit is claimed.

Local preview: <http://localhost:5173/playground>. Recreate the inspection gallery with `node scripts/playground/fidelity-review-static.mjs`; then open `/artifacts/fidelity-review.html`. Bounded benchmark: `/scripts/playground/fidelity-performance.html`. Temporary files, caches, generated builds and the three pre-existing personal PDFs are excluded from commits.
