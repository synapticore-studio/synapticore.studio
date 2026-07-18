# Scroll-World `/world` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eine scroll-getriebene Landingpage unter `synapticore.studio/world`, auf der die Kamera durch fünf isometrische Diorama-Szenen fliegt (Studio-Historie 2004→heute), gespeist aus Blender-Renders statt AI-Generierung.

**Architecture:** Zweiter Vite-Entry (`world/index.html`) neben der bestehenden React-Startseite — kein Router, keine neue Runtime-Dependency. Die vendored Vanilla-JS-Engine `scrub-engine.js` mountet in einen Container und scrubbt `currentTime` von neun MP4-Segmenten entlang der Scroll-Position. Content kommt aus DuckDB über den bestehenden `@content`-Alias.

**Tech Stack:** Vite 6, ffmpeg 8.0, DuckDB + Typer CLI (uv), Blender. Kein React auf dieser Seite.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-18-scroll-world-design.md` — bei Widerspruch gewinnt der Spec.
- Keine neue npm-Runtime-Dependency. Die Engine wird vendored, nicht installiert.
- Die bestehende React-Startseite (`index.html`, `src/App.jsx`) wird nur um einen Link erweitert, sonst nicht angefasst.
- `index.jsx` im Projekt-Root (verwaiste Kopie von `src/App.jsx`) wird **nicht** angefasst — out of scope.
- DuckDB ist Source of Truth. Kein Content wird in `world.js` hardcoded, außer temporär in Task 3.
- Encoding Desktop: `-crf 20 -g 8 -keyint_min 8 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart -an`
- Encoding Mobile: `scale=720:-2 -crf 23 -g 4 -keyint_min 4`, sonst identisch.
- Kein `unsharp`-Filter (kompensiert im Original AI-Weichzeichnung, schärft bei Blender nur Artefakte).
- Segment-Schnitte über **Frame-Nummern**, nie über Zeitangaben.
- Bash-Kommandos: Forward-Slashes, quoted paths (Windows/Git Bash).
- Commits: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- Kein Commit auf `main` ohne Rückfrage — Branch `feat/scroll-world`.

## Szenen-Konstanten

Diese IDs und Frame-Grenzen sind in Task 2, 3, 5 und 9 identisch zu verwenden.

| # | id | Typ | Master-Frames (inkl.) | Länge |
|---|---|---|---|---|
| 1 | `origin` | dive | 0–240 | 241 |
| 2 | `conn1` | conn | 240–390 | 151 |
| 3 | `enterprise` | dive | 390–630 | 241 |
| 4 | `conn2` | conn | 630–780 | 151 |
| 5 | `neural` | dive | 780–1020 | 241 |
| 6 | `conn3` | conn | 1020–1170 | 151 |
| 7 | `agentic` | dive | 1170–1410 | 241 |
| 8 | `conn4` | conn | 1410–1560 | 151 |
| 9 | `finale` | dive | 1560–1799 | 240 |

Master: 1800 Frames @ 30fps = 60s. **Segmente überlappen sich an jeder Grenze um genau ein Frame** — das letzte Frame von `origin` ist dasselbe Master-Frame wie das erste von `conn1`. Genau dort blendet die Engine über, deshalb muss es dasselbe Bild sein.

---

## Task 1: Vite-Multi-Page-Entry + Engine vendoren

**Files:**
- Create: `src/lib/scrub-engine.js`
- Create: `world/index.html`
- Create: `world/world.js`
- Modify: `vite.config.js`
- Create: `.gitignore` Ergänzung

**Interfaces:**
- Produces: `mountScrollWorld(container, config)` als ES-Modul-Export aus `src/lib/scrub-engine.js`.

- [ ] **Step 1: Branch anlegen**

```bash
cd "D:/web/synapticore.studio" && git checkout -b feat/scroll-world
```

- [ ] **Step 2: Engine herunterladen**

```bash
cd "D:/web/synapticore.studio" && mkdir -p src/lib && \
curl -sSL -o src/lib/scrub-engine.js \
  "https://raw.githubusercontent.com/oso95/scroll-world/main/skills/scroll-world/references/scrub-engine.js" && \
wc -l src/lib/scrub-engine.js
```

Erwartet: `448 src/lib/scrub-engine.js`

- [ ] **Step 3: Engine auf ESM umstellen**

Die letzten drei Zeilen der Datei (447–449) lauten aktuell:

```js
// Expose for module + global use.
if (typeof module !== 'undefined' && module.exports) module.exports = { mountScrollWorld };
if (typeof window !== 'undefined') window.mountScrollWorld = mountScrollWorld;
```

Ersetze sie vollständig durch:

```js
export { mountScrollWorld };
```

Der CommonJS- und der Global-Zweig entfallen ersatzlos — Vite lädt ESM, und ein globales `window.mountScrollWorld` braucht niemand. Der MIT-Kommentarheader am Dateianfang (Zeilen 1–64) bleibt unverändert stehen.

- [ ] **Step 4: `world/index.html` anlegen**

```html
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>Invisible Architects | Synapticore Studio</title>
    <link rel="canonical" href="https://synapticore.studio/world/" />
    <meta name="description" content="Zwanzig Jahre DCC in fünf Räumen – von Blender 2.4 bis Agentic Pipelines. Scrollen Sie hindurch." />
    <style>
      :root {
        --sw-bg: #020202;
        --sw-ink: #f4f4f5;
        --sw-ink-soft: #a1a1aa;
        --sw-accent: #f97316;
      }
      html, body { margin: 0; background: var(--sw-bg); }
    </style>
  </head>
  <body>
    <div id="world"></div>
    <script type="module" src="./world.js"></script>
  </body>
</html>
```

Die Theme-Variablen stehen inline im `<head>`, nicht in einem nachgeladenen Stylesheet — sonst blitzt das Beige-Default der Engine, bevor das eigene CSS greift (Spec §5).

- [ ] **Step 5: `world/world.js` als Minimal-Mount anlegen**

```js
import { mountScrollWorld } from '../src/lib/scrub-engine.js';

mountScrollWorld(document.getElementById('world'), {
  brand: { name: 'Synapticore Studio', href: '/' },
  hint: 'scrollen',
  sections: [
    { id: 'placeholder', label: 'Test', title: 'Mount-Test', accent: '#f97316' },
  ],
});
```

Ohne `clip` zeigt die Engine nur den Still-Layer — hier leer. Das reicht, um zu beweisen, dass der Entry baut und die Engine mountet.

- [ ] **Step 6: `vite.config.js` um den zweiten Entry erweitern**

Vollständige neue Datei:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@content': path.resolve(__dirname, '../cms/data/synapticore-studio'),
      '@shared': path.resolve(__dirname, '../cms/data/shared'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        world: path.resolve(__dirname, 'world/index.html'),
      },
    },
  },
});
```

- [ ] **Step 7: Build verifizieren**

```bash
cd "D:/web/synapticore.studio" && npm run build && ls dist/ dist/world/
```

Erwartet: `dist/index.html` **und** `dist/world/index.html` existieren beide. Schlägt der Build fehl mit „Could not resolve entry", stimmt der Pfad in `rollupOptions.input` nicht.

- [ ] **Step 8: Bestehende Startseite auf Regression prüfen**

```bash
cd "D:/web/synapticore.studio" && grep -c "assets/" dist/index.html
```

Erwartet: mindestens `2` (JS- und CSS-Bundle sind weiterhin verlinkt). Der Multi-Page-Umbau darf die React-Seite nicht beschädigen.

- [ ] **Step 9: Commit**

```bash
cd "D:/web/synapticore.studio" && git add src/lib/scrub-engine.js world/ vite.config.js && \
git commit -m "$(cat <<'EOF'
feat: add /world vite entry with vendored scroll engine

Zweiter Vite-Entry neben der React-Startseite, kein Router noetig.
Engine aus oso95/scroll-world (MIT) vendored und auf ESM umgestellt.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Segmentierungs-Skript mit synthetischem Master

Dieses Skript ist der Kern der Blender-Pipeline. Es wird hier mit einem synthetischen Testvideo entwickelt und verifiziert, damit es in Task 9 unverändert auf den echten Render angewendet werden kann.

**Files:**
- Create: `scripts/segment-world.sh`
- Create: `scripts/make-test-master.sh`

**Interfaces:**
- Produces: `scripts/segment-world.sh <master.mp4> <outdir>` → schreibt neun MP4s nach `<outdir>` mit den Dateinamen aus der Szenen-Konstanten-Tabelle.

- [ ] **Step 1: Testmaster-Generator schreiben**

`scripts/make-test-master.sh`:

```bash
#!/usr/bin/env bash
# Erzeugt einen synthetischen 60s-Master (1800 Frames @ 30fps) mit sichtbarem
# Frame-Zaehler. Ersetzt den Blender-Render, solange es noch keinen gibt.
set -euo pipefail
OUT="${1:?usage: make-test-master.sh <out.mp4>}"
mkdir -p "$(dirname "$OUT")"
ffmpeg -v error -y -f lavfi -i "testsrc2=size=1920x1080:rate=30:duration=60" \
  -c:v libx264 -preset ultrafast -crf 18 -pix_fmt yuv420p -an "$OUT"
echo "master: $OUT ($(ffprobe -v error -count_frames -select_streams v:0 \
  -show_entries stream=nb_read_frames -of csv=p=0 "$OUT") frames)"
```

`testsrc2` blendet einen laufenden Zähler ein — damit ist an den Segmentgrenzen visuell prüfbar, ob die Nähte stimmen.

- [ ] **Step 2: Segmentierungs-Skript schreiben**

`scripts/segment-world.sh`:

```bash
#!/usr/bin/env bash
# Schneidet einen durchgehenden Kameraflug in die neun Segmente der Engine.
# Schnitte ueber Frame-Nummern (nicht Zeit) und mit einem Frame Ueberlappung
# an jeder Grenze: das letzte Frame von Segment N ist dasselbe Master-Frame
# wie das erste von Segment N+1 — genau dort blendet die Engine ueber.
set -euo pipefail
MASTER="${1:?usage: segment-world.sh <master.mp4> <outdir>}"
OUTDIR="${2:?usage: segment-world.sh <master.mp4> <outdir>}"
mkdir -p "$OUTDIR"

# name:start_frame:end_frame  (beide inklusive)
SEGMENTS="
origin:0:240
conn1:240:390
enterprise:390:630
conn2:630:780
neural:780:1020
conn3:1020:1170
agentic:1170:1410
conn4:1410:1560
finale:1560:1799
"

for seg in $SEGMENTS; do
  name="${seg%%:*}"; rest="${seg#*:}"
  start="${rest%%:*}"; end="${rest##*:}"
  ffmpeg -v error -y -i "$MASTER" \
    -vf "select='between(n\,${start}\,${end})',setpts=PTS-STARTPTS" \
    -an -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
    -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart \
    "$OUTDIR/${name}.mp4"
  frames=$(ffprobe -v error -count_frames -select_streams v:0 \
    -show_entries stream=nb_read_frames -of csv=p=0 "$OUTDIR/${name}.mp4")
  printf '%-12s %4s frames  %6s\n' "$name" "$frames" "$(du -h "$OUTDIR/${name}.mp4" | cut -f1)"
done
```

- [ ] **Step 3: Skripte ausführbar machen und Master erzeugen**

```bash
cd "D:/web/synapticore.studio" && chmod +x scripts/*.sh && \
mkdir -p .work && ./scripts/make-test-master.sh .work/master-test.mp4
```

Erwartet: `master: .work/master-test.mp4 (1800 frames)`

Weicht die Framezahl von 1800 ab, stimmen die Segmentgrenzen nicht mehr — nicht weitermachen.

- [ ] **Step 4: Segmentieren**

```bash
cd "D:/web/synapticore.studio" && ./scripts/segment-world.sh .work/master-test.mp4 public/world/vid
```

Erwartete Framezahlen exakt: `origin 241`, `conn1 151`, `enterprise 241`, `conn2 151`, `neural 241`, `conn3 151`, `agentic 241`, `conn4 151`, `finale 240`.

- [ ] **Step 5: Nahtstellen messen**

Das ist der eigentliche Test dieser Task: Ist das letzte Frame von `origin` dasselbe Bild wie das erste von `conn1`?

```bash
cd "D:/web/synapticore.studio/.work" && \
ffmpeg -v error -y -sseof -0.04 -i ../public/world/vid/origin.mp4 -frames:v 1 seam_a.png && \
ffmpeg -v error -y -i ../public/world/vid/conn1.mp4 -frames:v 1 seam_b.png && \
ffmpeg -v error -i seam_a.png -i seam_b.png -lavfi psnr -f null - 2>&1 | grep -o "average:[0-9.]*"
```

Erwartet: `average:` mit einem Wert **über 40** (dB), typischerweise deutlich höher. Beide Frames stammen aus demselben Master-Frame, sind aber unabhängig re-encodiert — deshalb nicht bit-identisch, aber praktisch ununterscheidbar.

Liegt der Wert unter 40, ist die Frame-Arithmetik falsch: die Segmente überlappen nicht, sondern stoßen aneinander. Grenzen in `SEGMENTS` prüfen.

- [ ] **Step 6: Arbeitsverzeichnis und Testassets aus Git heraushalten**

An `.gitignore` anhängen:

```
.work/
public/world/vid/
public/world/still/
```

Videodateien gehören nicht ins Repo, solange es Testassets sind (Spec §7: GitHub-Pages-Limit). Task 10 entscheidet, was von den finalen Assets eingecheckt wird.

- [ ] **Step 7: Commit**

```bash
cd "D:/web/synapticore.studio" && git add scripts/ .gitignore && \
git commit -m "$(cat <<'EOF'
feat: add world segmentation pipeline

segment-world.sh schneidet einen durchgehenden Kameraflug frame-exakt in
die neun Engine-Segmente, mit einem Frame Ueberlappung an jeder Naht.
make-test-master.sh liefert synthetischen Input zum Verifizieren.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Laufende Seite mit Testclips

**Files:**
- Modify: `world/world.js`

**Interfaces:**
- Consumes: `mountScrollWorld` (Task 1), Segmente in `public/world/vid/` (Task 2).
- Produces: Engine-Config-Struktur, die Task 5 aus dem CMS füttert.

- [ ] **Step 1: Stills aus den Segmenten extrahieren**

Die Engine braucht pro Dive-Segment ein Poster — Frame 0 des jeweiligen Clips.

```bash
cd "D:/web/synapticore.studio" && mkdir -p public/world/still && \
for n in origin enterprise neural agentic finale; do \
  ffmpeg -v error -y -i "public/world/vid/$n.mp4" -frames:v 1 -c:v libwebp -quality 84 "public/world/still/$n.webp"; \
done && ls -la public/world/still/
```

Erwartet: fünf `.webp`-Dateien.

- [ ] **Step 2: `world/world.js` mit vollständiger Config**

Ersetze den Inhalt vollständig:

```js
import { mountScrollWorld } from '../src/lib/scrub-engine.js';

// Platzhalter-Content — Task 5 ersetzt ihn durch @content/world.json.
const SCENES = [
  { id: 'origin',     label: '2004', accent: '#f97316',
    eyebrow: '2004 · Blender Origin',
    title: 'Es begann mit einem CRT.',
    body: 'Blender 2.4, ein Röhrenmonitor und mehr Kabel als Verstand. Der Anfang von zwanzig Jahren DCC.',
    tags: ['Blender 2.4', 'Wireframe', 'Autodidakt'] },
  { id: 'enterprise', label: '2008', accent: '#fb923c',
    eyebrow: '2008 · VWAG Ökosystem',
    title: 'Dann kam der Maßstab.',
    body: 'Audi, Škoda, Seat, Bentley. Automotive-Visualisierung, in der ein Fehler tausendfach ausgeliefert wird.',
    tags: ['Automotive', 'Enterprise', 'Tier-1'] },
  { id: 'neural',     label: '2014', accent: '#22d3ee',
    eyebrow: '2014 · Neural Research',
    title: 'Und dann dachte es mit.',
    body: 'Neural Networks, als sie noch Forschung waren und kein Produkt. Der Punkt, an dem Pipelines anfingen zu lernen.',
    tags: ['Neural Networks', 'ML Research', 'Pipelines'] },
  { id: 'agentic',    label: '2024', accent: '#06b6d4',
    eyebrow: '2024 · Agentic DCC',
    title: 'Heute bedient sich das Werkzeug selbst.',
    body: 'Autonome Agenten in Blender und Unreal Engine 5. Von prozeduraler Generierung bis zur Post-Production.',
    tags: ['UE5', 'Agentic DCC', 'Automation'] },
  { id: 'finale',     label: 'Studio', accent: '#f97316',
    eyebrow: 'Invisible Architects',
    title: 'Engineering the Invisible Core.',
    body: 'Zwanzig Jahre Fundament, auf dem heute Agenten laufen.',
    tags: ['Agentic Pipelines', 'Virtual Production', 'Est. 2004'],
    cta: {
      primary:   { label: 'Studio ansehen', href: '/' },
      secondary: { label: 'Kontakt',        href: '/#contact' },
    } },
];

const sections = SCENES.map(s => ({
  ...s,
  still: `/world/still/${s.id}.webp`,
  clip:  `/world/vid/${s.id}.mp4`,
}));

const connectors = SCENES.slice(0, -1).map((_, i) => `/world/vid/conn${i + 1}.mp4`);

mountScrollWorld(document.getElementById('world'), {
  brand: { name: 'Synapticore Studio', href: '/' },
  cta: { label: 'Kontakt', href: '/#contact' },
  hint: 'scrollen',
  nav: true,
  atmosphere: true,
  diveScroll: 1.4,
  connScroll: 0.9,
  sections,
  connectors,
});
```

- [ ] **Step 3: Dev-Server starten**

```bash
cd "D:/web/synapticore.studio" && npm run dev
```

Erwartet: `Local: http://localhost:5173/`

- [ ] **Step 4: Im echten Browser verifizieren**

Über die `claude-in-chrome`-Tools (oder Playwright): `http://localhost:5173/world/` öffnen.

Zu prüfen:
1. Die Seite lädt ohne Console-Error. `read_console_messages` — erwartet: keine `404` auf `/world/vid/*.mp4`.
2. Scrollen bewegt das Video. Screenshot bei `scrollY = 0`, dann `window.scrollTo(0, 2000)`, erneut Screenshot — der Frame-Zähler von `testsrc2` muss sich unterscheiden.
3. Die Copy der ersten Szene ist beim Laden sichtbar und blendet beim Scrollen aus.
4. Die Route-Dots rechts sind da; ein Klick springt zur Szene.

Bricht Punkt 2 (Bild bewegt sich nicht), zuerst prüfen, ob `fetch` der Clips durchläuft — die Engine lädt sie als Blob und schluckt Fehler still (`scrub-engine.js:219`).

- [ ] **Step 5: Nahtstellen im laufenden Bild prüfen**

Langsam über eine Segmentgrenze scrollen (z.B. `scrollY` von 1400 bis 1700 in 50er-Schritten, je ein Screenshot). Der `testsrc2`-Zähler muss monoton weiterlaufen. Ein Sprung oder Rückwärtszähler bedeutet, dass die Segmentreihenfolge in der Config nicht der Renderreihenfolge entspricht.

- [ ] **Step 6: Commit**

```bash
cd "D:/web/synapticore.studio" && git add world/world.js && \
git commit -m "$(cat <<'EOF'
feat: wire full nine-segment chain into /world

Fuenf Szenen plus vier Connectors, Platzhalter-Content.
Verifiziert gegen synthetische Testclips im Browser.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: CMS-Content-Typ `world_scene`

**Files:**
- Modify: `../cms/src/cms/commands/export.py` (Funktion `_export_synapticore_studio`)
- Create: `../cms/scripts/seed-world-scenes.py`

**Interfaces:**
- Produces: `cms/data/synapticore-studio/world.json` — Array von Objekten mit `block_id`, `title`, `description`, `tags` (Array), `metadata` (Objekt), sortiert nach `sort_order`.

Keine neue Tabelle: `content_blocks` trägt bereits `block_type`, `tags` (JSON), `metadata` (JSON) und `sort_order` (`cms/schema/tables.sql`).

- [ ] **Step 1: Seed-Skript schreiben**

`cms/scripts/seed-world-scenes.py` — als Python-Script, weil `cms query` Umlaute und JSON-Literale über die Shell schlecht durchreicht (CLAUDE.md-Gotcha):

```python
"""Seed der world_scene content_blocks fuer synapticore.studio."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))
from cms.db import get_connection

SITE = "synapticore-studio"

SCENES = [
    ("ss-world-1", "origin", "2004", "2004 · Blender Origin",
     "Es begann mit einem CRT.",
     "Blender 2.4, ein Röhrenmonitor und mehr Kabel als Verstand. Der Anfang von zwanzig Jahren DCC.",
     ["Blender 2.4", "Wireframe", "Autodidakt"], "#f97316"),
    ("ss-world-2", "enterprise", "2008", "2008 · VWAG Ökosystem",
     "Dann kam der Maßstab.",
     "Audi, Škoda, Seat, Bentley. Automotive-Visualisierung, in der ein Fehler tausendfach ausgeliefert wird.",
     ["Automotive", "Enterprise", "Tier-1"], "#fb923c"),
    ("ss-world-3", "neural", "2014", "2014 · Neural Research",
     "Und dann dachte es mit.",
     "Neural Networks, als sie noch Forschung waren und kein Produkt. Der Punkt, an dem Pipelines anfingen zu lernen.",
     ["Neural Networks", "ML Research", "Pipelines"], "#22d3ee"),
    ("ss-world-4", "agentic", "2024", "2024 · Agentic DCC",
     "Heute bedient sich das Werkzeug selbst.",
     "Autonome Agenten in Blender und Unreal Engine 5. Von prozeduraler Generierung bis zur Post-Production.",
     ["UE5", "Agentic DCC", "Automation"], "#06b6d4"),
    ("ss-world-5", "finale", "Studio", "Invisible Architects",
     "Engineering the Invisible Core.",
     "Zwanzig Jahre Fundament, auf dem heute Agenten laufen.",
     ["Agentic Pipelines", "Virtual Production", "Est. 2004"], "#f97316"),
]

CTA = {
    "primary": {"label": "Studio ansehen", "href": "/"},
    "secondary": {"label": "Kontakt", "href": "/#contact"},
}


def main() -> None:
    con = get_connection()
    con.execute(
        "DELETE FROM content_blocks WHERE site_id = ? AND block_type = 'world_scene'",
        [SITE],
    )
    for order, (bid, scene, label, eyebrow, title, body, tags, accent) in enumerate(SCENES):
        meta = {
            "scene_id": scene,
            "label": label,
            "eyebrow": eyebrow,
            "accent": accent,
            "still": f"/world/still/{scene}.webp",
            "stillMobile": f"/world/still/{scene}-m.webp",
            "clip": f"/world/vid/{scene}.mp4",
            "clipMobile": f"/world/vid/{scene}-m.mp4",
        }
        if order < len(SCENES) - 1:
            meta["connector"] = f"/world/vid/conn{order + 1}.mp4"
            meta["connectorMobile"] = f"/world/vid/conn{order + 1}-m.mp4"
        else:
            meta["cta"] = CTA
        con.execute(
            "INSERT INTO content_blocks "
            "(block_id, site_id, block_type, title, description, icon, features, tags, metadata, sort_order) "
            "VALUES (?, ?, 'world_scene', ?, ?, NULL, NULL, ?, ?, ?)",
            [bid, SITE, title, body, json.dumps(tags), json.dumps(meta), order],
        )
    con.close()
    print(f"seeded {len(SCENES)} world_scene blocks")


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Seed ausführen**

```bash
cd "D:/web/cms" && uv run python scripts/seed-world-scenes.py
```

Erwartet: `seeded 5 world_scene blocks`

- [ ] **Step 3: Daten in der DB verifizieren**

```bash
cd "D:/web/cms" && uv run cms query "SELECT block_id, sort_order, title FROM content_blocks WHERE block_type='world_scene' ORDER BY sort_order"
```

Erwartet: fünf Zeilen, `ss-world-1` bis `ss-world-5`, `sort_order` 0–4, Umlaute korrekt („Maßstab", „Ökosystem").

- [ ] **Step 4: Export-Block ergänzen**

In `cms/src/cms/commands/export.py`, Funktion `_export_synapticore_studio`, **nach** dem `timeline`-Block und vor dem Funktionsende einfügen:

```python
    # world scenes
    rows = _rows_to_dicts(
        con,
        "SELECT block_id, title, description, tags, metadata FROM content_blocks "
        "WHERE site_id = ? AND block_type = 'world_scene' ORDER BY sort_order",
        [site_id],
    )
    for r in rows:
        _parse_json_fields(r, ["tags", "metadata"])
    _write_json(out / "world.json", rows)
    rprint("[green]  synapticore-studio/world.json[/green]")
```

- [ ] **Step 5: Export ausführen und Ergebnis prüfen**

```bash
cd "D:/web/cms" && uv run cms export --all && \
python -c "import json;d=json.load(open('data/synapticore-studio/world.json',encoding='utf-8'));print(len(d),'scenes');print(d[0]['metadata']['clip']);print(d[4]['metadata']['cta']['primary']['label']);print(d[1]['tags'])"
```

Erwartet:
```
5 scenes
/world/vid/origin.mp4
Studio ansehen
['Automotive', 'Enterprise', 'Tier-1']
```

Erscheinen `tags` oder `metadata` als String statt als Liste/Dict, fehlt der `_parse_json_fields`-Aufruf aus Step 4.

- [ ] **Step 6: Commit im CMS-Repo**

```bash
cd "D:/web/cms" && git checkout -b feat/world-scenes && \
git add src/cms/commands/export.py scripts/seed-world-scenes.py data/synapticore-studio/world.json && \
git commit -m "$(cat <<'EOF'
feat: add world_scene content type for synapticore.studio

Nutzt content_blocks mit block_type='world_scene'; engine-spezifische
Felder (accent, clip-Pfade, cta) liegen in metadata. Keine neue Tabelle.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: `world.js` auf CMS-Content umstellen

**Files:**
- Modify: `world/world.js`

**Interfaces:**
- Consumes: `@content/world.json` (Task 4), `mountScrollWorld` (Task 1).

- [ ] **Step 1: `world/world.js` vollständig ersetzen**

```js
import { mountScrollWorld } from '../src/lib/scrub-engine.js';
import worldData from '@content/world.json';

const sections = worldData.map(row => {
  const m = row.metadata;
  return {
    id: m.scene_id,
    label: m.label,
    eyebrow: m.eyebrow,
    title: row.title,
    body: row.description,
    tags: row.tags,
    accent: m.accent,
    still: m.still,
    stillMobile: m.stillMobile,
    clip: m.clip,
    clipMobile: m.clipMobile,
    ...(m.scroll ? { scroll: m.scroll } : {}),
    ...(m.linger ? { linger: m.linger } : {}),
    ...(m.cta ? { cta: m.cta } : {}),
  };
});

const connectors       = worldData.slice(0, -1).map(r => r.metadata.connector);
const connectorsMobile = worldData.slice(0, -1).map(r => r.metadata.connectorMobile);

mountScrollWorld(document.getElementById('world'), {
  brand: { name: 'Synapticore Studio', href: '/' },
  cta: { label: 'Kontakt', href: '/#contact' },
  hint: 'scrollen',
  nav: true,
  atmosphere: true,
  diveScroll: 1.4,
  connScroll: 0.9,
  sections,
  connectors,
  connectorsMobile,
});
```

`scroll` und `linger` werden nur durchgereicht, wenn in `metadata` gesetzt — sonst greifen die globalen Defaults. Das ist der Stellhebel für Task 8.

- [ ] **Step 2: Build verifizieren**

```bash
cd "D:/web/synapticore.studio" && npm run build
```

Erwartet: Build läuft durch. Fehler `Failed to resolve import "@content/world.json"` bedeutet, dass Task 4 Step 5 nicht gelaufen ist — die Datei muss existieren.

- [ ] **Step 3: Im Browser gegen Task 3 gegenprüfen**

Dev-Server starten, `http://localhost:5173/world/` öffnen. Die Seite muss **identisch** zu Task 3 aussehen — gleiche Texte, gleiche Farben, gleiche Reihenfolge. Der einzige Unterschied ist die Datenquelle.

Konkret prüfen: Szene 2 zeigt „Dann kam der Maßstab." mit korrektem ß, Szene 5 zeigt beide CTA-Buttons.

- [ ] **Step 4: Content-Roundtrip verifizieren**

Beweisen, dass die Pipeline wirklich durchgeht:

```bash
cd "D:/web/cms" && uv run cms query "UPDATE content_blocks SET title='Roundtrip-Test' WHERE block_id='ss-world-1'" && \
uv run cms export --all && grep -c "Roundtrip-Test" data/synapticore-studio/world.json
```

Erwartet: `1`. Browser neu laden — Szene 1 zeigt jetzt „Roundtrip-Test".

Danach zurücksetzen:

```bash
cd "D:/web/cms" && uv run python scripts/seed-world-scenes.py && uv run cms export --all
```

- [ ] **Step 5: Commit**

```bash
cd "D:/web/synapticore.studio" && git add world/world.js && \
git commit -m "$(cat <<'EOF'
feat: source /world content from CMS

Ersetzt hardcoded Platzhalter durch @content/world.json.
Roundtrip DuckDB -> export -> Seite verifiziert.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Mobile-Variante und Verlinkung

**Files:**
- Create: `scripts/encode-mobile.sh`
- Modify: `src/App.jsx` (ein Link)

**Interfaces:**
- Consumes: Segmente aus Task 2.
- Produces: `-m.mp4` und `-m.webp` Varianten für alle neun Segmente.

- [ ] **Step 1: Mobile-Encode-Skript schreiben**

`scripts/encode-mobile.sh`:

```bash
#!/usr/bin/env bash
# Erzeugt die Mobile-Varianten. Tightere GOP (-g 4) halbiert die Seek-Decode-
# Arbeit auf Telefonen — das ist der eigentliche Grund fuer diesen Schritt,
# nicht die Dateigroesse.
# Input ist die 9:16-Segmentserie (Task 9); solange es die nicht gibt,
# skaliert es die 16:9-Segmente als Zwischenstand.
set -euo pipefail
SRC="${1:?usage: encode-mobile.sh <srcdir>}"
for f in "$SRC"/*.mp4; do
  case "$f" in *-m.mp4) continue ;; esac
  out="${f%.mp4}-m.mp4"
  ffmpeg -v error -y -i "$f" -an -vf "scale=720:-2" \
    -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \
    -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "$out"
  printf '%-16s %6s\n' "$(basename "$out")" "$(du -h "$out" | cut -f1)"
done
```

- [ ] **Step 2: Mobile-Varianten und Poster erzeugen**

```bash
cd "D:/web/synapticore.studio" && chmod +x scripts/encode-mobile.sh && \
./scripts/encode-mobile.sh public/world/vid && \
for n in origin enterprise neural agentic finale; do \
  ffmpeg -v error -y -i "public/world/vid/$n-m.mp4" -frames:v 1 -c:v libwebp -quality 84 "public/world/still/$n-m.webp"; \
done && ls public/world/vid/ | wc -l
```

Erwartet: `18` (neun Desktop- plus neun Mobile-Clips).

- [ ] **Step 3: Gesamtgewicht messen — der Messpunkt aus Spec §7**

```bash
cd "D:/web/synapticore.studio" && \
echo "Desktop: $(du -ch public/world/vid/*.mp4 --exclude='*-m.mp4' 2>/dev/null | tail -1)" && \
echo "Mobile:  $(du -ch public/world/vid/*-m.mp4 | tail -1)" && \
echo "Stills:  $(du -ch public/world/still/*.webp | tail -1)"
```

Der Desktop-Wert ist die Zahl, gegen die der Spec seine Schätzung von 25–35 MB gestellt hat. **Ergebnis notieren** — bei synthetischem `testsrc2` ist er nicht aussagekräftig für die finalen Renders (Rauschmuster komprimiert schlecht), aber er ist die Obergrenze. Liegt er bei den echten Renders in Task 10 über 40 MB, greift die Eskalation aus Spec §7: `crf` 20→23, dann kürzen, dann Auflösung.

- [ ] **Step 4: Mobile im Browser verifizieren**

Browser-Fenster auf 390×844 setzen (`resize_window`), `http://localhost:5173/world/` laden.

Zu prüfen:
1. Die Copy sitzt unten statt links (Engine-Breakpoint ≤860px).
2. Die Nav-Pills oben sind ausgeblendet, die Route-Dots rechts sind größer.
3. Im Network-Panel: geladen werden die `-m.mp4`-Varianten, nicht die Desktop-Clips.

Punkt 3 ist der eigentliche Test. Werden Desktop-Clips geladen, kommt `clipMobile` nicht aus `metadata` durch — Task 4 Step 1 prüfen.

- [ ] **Step 5: Link von der Startseite setzen**

In `src/App.jsx`, in der Hero-Section (beginnt bei Zeile 102), neben dem bestehenden CTA einen zweiten Link ergänzen:

```jsx
<a
  href="/world/"
  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white/90 hover:border-orange-500/60 hover:text-white transition-colors text-sm tracking-wider uppercase"
>
  Zwanzig Jahre durchfliegen
  <ChevronRight className="w-4 h-4" />
</a>
```

`ChevronRight` ist bereits importiert (`src/App.jsx:5`). Die exakte Einfügestelle richtet sich nach dem bestehenden CTA-Markup — der Link gehört in denselben Flex-Container, damit die Buttons nebeneinander stehen.

- [ ] **Step 6: Beide Richtungen verifizieren**

```bash
cd "D:/web/synapticore.studio" && npm run build && \
grep -c 'href="/world/"' dist/assets/*.js
```

Erwartet: mindestens `1`.

Im Browser: `http://localhost:5173/` → Link klicken → landet auf `/world/`. Dort Brand-Logo oben links klicken → zurück auf `/`.

- [ ] **Step 7: Commit**

```bash
cd "D:/web/synapticore.studio" && git add scripts/encode-mobile.sh src/App.jsx && \
git commit -m "$(cat <<'EOF'
feat: add mobile encodes and link /world from landing page

Mobile-Encodes mit -g 4: kuerzere GOP macht Seeks auf Telefonen billig.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Reduced-Motion und Robustheit

**Files:**
- Keine Code-Änderung erwartet — diese Task verifiziert Engine-Verhalten und dokumentiert Ergebnisse.
- Modify: `docs/superpowers/specs/2026-07-18-scroll-world-design.md` (Messwerte nachtragen)

- [ ] **Step 1: `prefers-reduced-motion` verifizieren**

Im Browser die Einstellung erzwingen und `/world/` neu laden. Über die DevTools-Emulation oder per CDP.

Erwartet (Engine `scrub-engine.js:201`): **kein einziger** `.mp4`-Request im Network-Panel. Sichtbar sind nur die fünf Stills, die beim Scrollen crossfaden.

Das ist die Bestätigung, dass die Stills eigenständig funktionieren müssen — Spec §7. Falls die Szenenfolge ohne Bewegung unverständlich wirkt, gehört das in Task 9 als Anforderung an die Blender-Kadrierung, nicht in einen Code-Fix.

- [ ] **Step 2: Fehlenden Connector verifizieren**

Die Engine erlaubt `null`-Connectors und crossfadet dann direkt (`scrub-engine.js:96`). Temporär in DevTools testen, indem ein Connector-Pfad ins Leere zeigt:

```bash
cd "D:/web/synapticore.studio" && mv public/world/vid/conn2.mp4 public/world/vid/conn2.bak
```

Seite neu laden. Erwartet: Die Seite läuft weiter, zwischen `enterprise` und `neural` wird direkt übergeblendet, ein `404` steht in der Console. Kein Absturz, kein hängender Scroll.

Danach zurück:

```bash
cd "D:/web/synapticore.studio" && mv public/world/vid/conn2.bak public/world/vid/conn2.mp4
```

- [ ] **Step 3: Messwerte in den Spec nachtragen**

In `docs/superpowers/specs/2026-07-18-scroll-world-design.md`, §7, unter dem Absatz „Grobe Schätzung…" ergänzen:

```markdown
**Messung Phase A (2026-07-XX, synthetischer testsrc2-Master):** Desktop <WERT> MB,
Mobile <WERT> MB, Stills <WERT> KB. Synthetisches Rauschen komprimiert schlechter als
gerenderte Dioramen — der Wert ist eine Obergrenze, keine Prognose.
```

Platzhalter durch die Zahlen aus Task 6 Step 3 ersetzen und das Datum einsetzen.

- [ ] **Step 4: Commit**

```bash
cd "D:/web/synapticore.studio" && git add docs/ && \
git commit -m "$(cat <<'EOF'
docs: record phase A measurements and robustness checks

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Scroll-Timing justieren

Diese Task hat kein objektives Erfolgskriterium — sie ist Regie, keine Technik. Sie steht hier, weil das Timing die einzige Größe ist, die sich nur am laufenden Ding beurteilen lässt (Spec §6).

**Files:**
- Modify: `../cms/scripts/seed-world-scenes.py` (Werte in `meta`)

- [ ] **Step 1: Ausgangslage im Browser durchscrollen**

Von oben nach unten mit normalem Mausrad durchscrollen. Notieren, welche Szene sich zu schnell oder zu zäh anfühlt, und ob die Copy jeweils dann steht, wenn die Kamera zur Ruhe kommt.

- [ ] **Step 2: Werte pro Szene setzen**

In `seed-world-scenes.py`, `meta`-Dict, für die betroffenen Szenen ergänzen:

```python
            "scroll": 1.8,   # Viewport-Hoehen Scroll fuer diese Szene (default 1.4)
            "linger": 0.4,   # 0..1, verlangsamt die Mitte. Laut Engine <= 0.6 halten.
```

`linger` remappt die Zeit so, dass die Kamera in der Szenenmitte verweilt — genau dort, wo die Copy ihr Maximum hat (`scrub-engine.js:178`). Werte über 0.6 lassen die Bewegung an den Nahtstellen ruckartig wirken.

- [ ] **Step 3: Anwenden und erneut prüfen**

```bash
cd "D:/web/cms" && uv run python scripts/seed-world-scenes.py && uv run cms export --all
```

Browser neu laden, erneut durchscrollen. Schritte 1–3 wiederholen, bis es sitzt.

- [ ] **Step 4: Commit**

```bash
cd "D:/web/cms" && git add scripts/seed-world-scenes.py data/synapticore-studio/world.json && \
git commit -m "$(cat <<'EOF'
feat: tune per-scene scroll distance and dwell

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Blender-Greybox (Björn)

**Diese Task wird nicht von einem Agenten ausgeführt.** Sie ist die Schnittstelle zwischen der verdrahteten Kette und den echten Assets.

**Deliverable:** `.work/master-grey.mp4` — ein durchgehender Kameraflug, 1800 Frames @ 30fps, 1920×1080, durch fünf untexturierte Blockout-Dioramen.

**Anforderungen aus der bisherigen Arbeit:**

- **Exakt 1800 Frames.** Die Segmentgrenzen in `segment-world.sh` sind hart kodiert. Weicht die Länge ab, müssen sie mitgezogen werden.
- **Ankunftspunkte auf den Frames** 240, 630, 1020, 1410 — dort ist die Kamera jeweils im Inneren einer Szene angekommen und die Copy steht. Zwischen diesen Punkten fliegt sie zur nächsten Szene.
- **Hintergrund `#020202`**, passend zu `--sw-bg`. Sonst ist die Kante der Stills gegen den Seitenhintergrund sichtbar (Spec §5).
- **Frame 0, 390, 780, 1170, 1560 müssen als Standbild funktionieren** — das sind die Poster und zugleich die vollständige Darstellung unter `prefers-reduced-motion` (Task 7 Step 1).
- **Kadrierung mittig-oben**, die Engine setzt `object-position: center 42%` und beschneidet je nach Viewport.
- **Kein Motion Blur.** Beim Scrubben wird jedes Frame einzeln stehend betrachtet; Blur, der in Bewegung gut aussieht, wirkt im Stand wie ein Fehler.

**Zweiter Deliverable (Mobile):** `.work/master-grey-9x16.mp4`, dieselbe Kamerafahrt in 1080×1920, gleiche Framezahl und gleiche Ankunftspunkte. Kein Center-Crop des Landscape-Films — davon bleiben nur ~26% übrig (Spec §4).

- [ ] **Step 1: Master segmentieren**

```bash
cd "D:/web/synapticore.studio" && ./scripts/segment-world.sh .work/master-grey.mp4 public/world/vid
```

Framezahlen gegen die Tabelle in „Szenen-Konstanten" prüfen.

- [ ] **Step 2: Nahtstellen messen**

Identisch zu Task 2 Step 5. Erwartet: PSNR über 40 dB an jeder der vier Nahtstellen. Bei einem echten Render sollte der Wert deutlich höher liegen als beim Rausch-Testmaster.

- [ ] **Step 3: Portrait-Kette und Stills erzeugen**

```bash
cd "D:/web/synapticore.studio" && \
./scripts/segment-world.sh .work/master-grey-9x16.mp4 .work/vid9x16 && \
./scripts/encode-mobile.sh .work/vid9x16 && \
for f in .work/vid9x16/*-m.mp4; do cp "$f" public/world/vid/; done && \
for n in origin enterprise neural agentic finale; do \
  ffmpeg -v error -y -i "public/world/vid/$n.mp4"   -frames:v 1 -c:v libwebp -quality 84 "public/world/still/$n.webp"; \
  ffmpeg -v error -y -i "public/world/vid/$n-m.mp4" -frames:v 1 -c:v libwebp -quality 84 "public/world/still/$n-m.webp"; \
done
```

- [ ] **Step 4: Durchlauf im Browser**

Desktop und Mobile durchscrollen. Jetzt ist zum ersten Mal beurteilbar, ob die Dramaturgie trägt. Ergebnis fließt zurück in Task 8 (Timing) und gegebenenfalls in die Kamerafahrt.

---

## Task 10: Finale Renders und Deploy (Björn + Agent)

**Voraussetzung:** Task 9 durchlaufen, Timing aus Task 8 sitzt.

- [ ] **Step 1: Finale Master ersetzen**

`.work/master-final.mp4` und `.work/master-final-9x16.mp4` — gleiche Kamerafahrt, gleiche Framezahl, gleiche Ankunftspunkte wie die Greybox, nur mit Look-Dev. Dann Task 9 Steps 1–3 mit den finalen Mastern wiederholen.

- [ ] **Step 2: Gewicht messen und gegen den Spec halten**

```bash
cd "D:/web/synapticore.studio" && du -ch public/world/vid/*.mp4 | tail -1
```

Über 40 MB gesamt: Eskalation aus Spec §7 in dieser Reihenfolge — `crf` 20→23, Clips kürzen, Auflösung senken, Szenenzahl zuletzt.

- [ ] **Step 3: Greybox-Assets entfernen, finale Assets einchecken**

`.gitignore` (Task 2 Step 6) um die Asset-Zeilen bereinigen, damit die finalen Dateien ins Repo kommen:

```bash
cd "D:/web/synapticore.studio" && rm -rf .work && \
git rm -r --cached . -q && git add . && git status --short | head -30
```

Prüfen, dass **keine** Greybox-Zwischenstände in der Liste stehen — sie zählen dauerhaft gegen das Repo-Limit (Spec §7).

- [ ] **Step 4: Produktionsbuild und lokale Preview**

```bash
cd "D:/web/synapticore.studio" && npm run build && npm run preview
```

`http://localhost:4173/world/` — vollständig durchscrollen, Desktop und Mobile. Das ist der letzte Check vor dem Deploy; hier laufen echte Dateipfade statt Dev-Server-Auflösung.

- [ ] **Step 5: CMS-Änderungen zuerst deployen**

Die Site baut in CI gegen `../cms/data/` (CLAUDE.md). Der CMS-Branch muss vor der Site gemerged sein, sonst schlägt der Site-Build in Actions fehl.

```bash
cd "D:/web/cms" && git push -u origin feat/world-scenes
```

PR mergen, dann erst weiter.

- [ ] **Step 6: Site deployen**

```bash
cd "D:/web/synapticore.studio" && git push -u origin feat/scroll-world
```

PR mergen. Nach dem Actions-Lauf `https://synapticore.studio/world/` im echten Browser prüfen — insbesondere auf einem echten iPhone, weil das Video-Priming eine User-Geste braucht und im Desktop-Emulator nicht realistisch testbar ist (Spec §7).

---

## Selbstreview

**Spec-Abdeckung:** §1 Architektur → Task 1. §2 CMS → Task 4, 5. §3 Szenen → Konstanten-Tabelle, Task 3, 4. §4 Blender-Pipeline → Task 2, 9, 10. §5 Theme → Task 1 Step 4. §6 Phasing → Task 9 (Phase A), Task 10 (Phase B). §7 Risiken → Task 6 Step 3 (Gewicht), Task 7 (reduced-motion, fehlende Connectors), Task 10 Step 3 (Repo-Limit), Task 10 Step 6 (iOS). §8 Out-of-Scope → Global Constraints.

**Offen und bewusst so:** Die exakte Einfügestelle des Links in `src/App.jsx` (Task 6 Step 5) hängt vom bestehenden CTA-Markup ab und wird beim Implementieren gelesen. Die Timing-Werte in Task 8 haben kein objektives Kriterium — das ist eine Regie-Entscheidung.

**Namenskonsistenz geprüft:** `scene_id` heißt in `metadata`, `world.js` und `seed-world-scenes.py` durchgehend gleich; die Segment-Dateinamen (`origin`, `conn1`, …) sind in `segment-world.sh`, Task 3 und dem Seed identisch.
