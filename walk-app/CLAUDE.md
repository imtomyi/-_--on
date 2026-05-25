# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
npm run dev      # http://localhost:5173
npm run build
npm run lint
npm run preview
```

Screenshot utility (Playwright-based, requires built app):
```bash
node capture.mjs
```

---

## Architecture

### Screen routing

No React Router. `App.jsx` manages a `screen` state (`'onboarding' | 'home' | 'detail'`) and renders screens inline with slide-in/slide-out CSS transitions (320ms). URL query params are also supported for direct access: `?screen=detail&course=loop1`.

### Three map implementations

`CourseDetail.jsx` has a style toggle that switches between:

| Mode key | Component | Backend |
|---|---|---|
| `'kakao'` | `KakaoMap.jsx` | Kakao Maps SDK (loaded as global in `index.html`) |
| `'aquarelle'` / `'aquarelle-vivid'` / `'outdoor'` / `'pastel'` | `MapLibreMap.jsx` | MapTiler API (key hardcoded in `MapLibreMap.jsx`) |

There is also a third map, `MapSvg.jsx`, which is a **fully custom SVG** renderer — no external API. It uses DXF polygon data from `src/data/dxfGeo.js` (buildings, roads, green space, water) for a topographic base, draws the fortress wall, stream, and landmarks with inline SVG, and supports pinch/two-finger zoom and drag pan. It also animates a demo walk along `course.heatmapPath` when GPS is unavailable. `MapSvg` is not currently wired into `CourseDetail` — it's a standalone component.

### Data shape

`src/data/courses.js` exports three things:
- `courses` — array of 3 course objects. Each course has `places[]` (with `lat/lng`, `type`, `ko/en` labels, `walkMin`), `heatmapPath[]` (lat/lng array for the route polyline), `character`, and `distance`.
- `NURUK_STAGES` — 4-stage fermentation labels used by `NuruGauge`.
- `GLOSSARY_EN` — Korean term glossary (unused in UI currently).

The `places[].type` values are: `'start' | 'end' | 'craft' | 'landmark' | 'food'`. Start/end places render with a gold 🍶 pin instead of a number.

### NuruGauge

`NuruGauge.jsx` uses `navigator.geolocation.watchPosition` + haversine formula to accumulate real walking distance. Progress is `traveled / totalDistance * 100`, mapped to 4 stages at 0/25/50/75%. The gauge is displayed at the bottom of `CourseDetail`.

### Pending items in code

- `CourseDetail.jsx` line 95: CTA href is `https://example.com/gyebo` — replace with the real gyebo-web URL before demo.
- `fortress` and `alley` courses have empty `heatmapPath: []`, so their map polylines won't render.

### Design tokens

`src/styles/variables.css` is the single source of truth for colors. The current palette uses 단청(丹靑) scheme — `--azalea: #BA2028` (red), `--jade: #87CFBD` (teal), `--gold: #C8A818` — which differs from the initial design in the root `CLAUDE.md`. Edit only this file to retheme.

### Fonts

Pretendard (CDN, `pretendard-dynamic-subset`) + Noto Serif KR (Google Fonts) are loaded in `index.html`. No local font files.
