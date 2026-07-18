# Scroll-World `/world` — Design

**Datum:** 2026-07-18
**Repo:** `synapticore-studio/synapticore.studio` (+ Änderungen in `agentic-dev-io/cms`)
**Status:** Design freigegeben, Implementierungsplan ausstehend

## Ziel

Eine scroll-getriebene Landingpage unter `synapticore.studio/world`, auf der die Kamera
durch fünf isometrische Diorama-Szenen fliegt — die Studio-Historie von 2004 bis heute.
Scroll-Position steuert die Zeitachse eines Videos, nicht die Position eines Elements.

Die Scroll-Engine stammt aus [oso95/scroll-world](https://github.com/oso95/scroll-world)
(MIT). Übernommen wird ausschließlich `references/scrub-engine.js`. Die Asset-Pipeline des
Originals hängt an Higgsfield-Credits und wird vollständig durch Blender-Renders ersetzt.

## Was übernommen wird und was nicht

| Bestandteil des Originals | Übernahme |
|---|---|
| `references/scrub-engine.js` | vollständig, vendored |
| Encoding-Rezept (`crf 20`, `-g 8`, `+faststart`, kein Audio) | vollständig |
| Mobile-Encode-Rezept (720p, `-g 4`, `crf 23`) | vollständig |
| Higgsfield-CLI-Aufrufe (Stills, Dives, Connectors) | entfällt |
| Frame-Extraktion + Frame-Locking der Nahtstellen | entfällt, siehe §3 |
| Interview-/Budget-Phase | entfällt |
| `knockout.py`, `prompts.md`, `index-template.html` | entfällt |

## 1. Architektur

Die Site hat keinen Router, und die Engine ist Vanilla JS ohne Dependencies. Deshalb ein
zweiter Vite-Entry statt react-router:

```
synapticore.studio/
├── index.html                  # bestehende React-Landingpage, unverändert
├── world/
│   ├── index.html              # neuer Entry
│   └── world.js                # Config-Bau + mountScrollWorld()
├── src/lib/scrub-engine.js     # vendored, MIT-Header erhalten
└── public/world/
    ├── still/<scene>.webp      # + <scene>-m.webp (portrait)
    └── vid/<scene>.mp4         # + -m.mp4, conn<i>.mp4, conn<i>-m.mp4
```

`vite.config.js` erhält:

```js
build: {
  rollupOptions: {
    input: {
      main:  path.resolve(__dirname, 'index.html'),
      world: path.resolve(__dirname, 'world/index.html'),
    },
  },
},
```

Ergebnis auf GitHub Pages: eine echte Datei unter `/world/index.html`. Kein
SPA-404-Fallback, kein Eingriff in die bestehende React-App.

**Kein React auf dieser Seite.** Die Engine baut ihr eigenes DOM und fährt ihren eigenen
`requestAnimationFrame`-Loop. React drumherum wäre ein leerer `<div ref>` plus `useEffect`
— Overhead ohne Gegenwert.

**Verlinkung:** Ein Einstieg von der Startseite aus (Hero-CTA oder Navigation) und ein
Rückweg von `/world` auf `/`. Konkrete Platzierung im Implementierungsplan.

## 2. Content aus dem CMS

DuckDB bleibt Source of Truth. Keine neue Tabelle — `content_blocks` trägt bereits alles
Nötige (`block_type`, `title`, `description`, `tags` JSON, `metadata` JSON, `sort_order`).

**Mapping** (`block_type = 'world_scene'`, `block_id` nach bestehender Konvention `ss-world-<n>`):

| Spalte | Inhalt |
|---|---|
| `title` | Szenen-Headline (`sections[].title`) |
| `description` | Fließtext (`sections[].body`) |
| `tags` | Tag-Pills (`sections[].tags`) |
| `sort_order` | Reihenfolge im Flug |
| `metadata` | `{ label, eyebrow, accent, still, stillMobile, clip, clipMobile, connector, connectorMobile, scroll, linger, cta? }` |

`metadata.connector` ist der Clip **nach** dieser Szene; die letzte Szene hat keinen.
`world.js` baut daraus das Engine-Config:

```js
const sections   = scenes.map(toSection);
const connectors = scenes.slice(0, -1).map(s => s.metadata.connector);
```

**Export:** `_export_synapticore_studio()` in `cms/src/cms/commands/export.py` erhält einen
Block analog zu `capabilities`, mit `_parse_json_fields(r, ["tags", "metadata"])`, Ziel
`cms/data/synapticore-studio/world.json`. Import in `world.js` über den bestehenden
`@content`-Alias.

Der Workflow bleibt damit `cms query` → `cms export --all` → Build, wie überall sonst.

**Quelle der Texte:** `timeline_events` liefert die vier Ären inhaltlich, wird aber nicht
direkt verwendet — die Beschreibungen dort sind für eine Scroll-Bühne zu lang. Die
`world_scene`-Blocks bekommen eigene, kurze Fassungen.

## 3. Szenen

Fünf Szenen, vier Connectors dazwischen — neun Clips.

| # | id | Ära | Szene | Übergang danach |
|---|---|---|---|---|
| 1 | `origin` | 2004 · Blender Origin | CRT-Arbeitsplatz, Wireframe-Suzanne, Kabelchaos | Kamera zieht raus, Raum wird zur Halle |
| 2 | `enterprise` | 2008 · VWAG Ökosystem | Automotive-Studio, Turntable, Lightrig-Käfig | Halle löst sich in Datenstruktur auf |
| 3 | `neural` | 2014 · Neural Research | Server-Nische, Layer-Graphen als physische Ebenen | Graph wird zum Grundriss |
| 4 | `agentic` | 2024 · Agentic DCC | Studio, in dem die Werkzeuge sich selbst bedienen | Zoom-out auf das Ganze |
| 5 | `finale` | Invisible Architects | alle vier Räume als ein Bauwerk | — (trägt den CTA) |

Szene 5 ist die einzige mit `cta` — die Engine hält deren Copy am Ende stehen
(`scrub-engine.js:250`).

## 4. Blender-Pipeline

Der entscheidende Unterschied zum Original: **ein durchgehender Kameraflug**, danach
geschnitten.

```
Ein Blender-Render, alle 5 Dioramen, ~60s @ 30fps
   ↓  ffmpeg, frame-exakte Schnitte an den Ankunftspunkten
9 Segmente:  origin conn1 enterprise conn2 neural conn3 agentic conn4 finale
   ↓  enc()
public/world/vid/
```

Weil alle Segmente aus einem einzigen Render stammen, ist das letzte Frame von `origin`
physisch identisch mit dem ersten von `conn1`. Die Nahtstellen sind exakt statt
approximiert — der komplette Frame-Extraktions- und Frame-Locking-Apparat des Originals
(`pipeline.md` §3–4) entfällt ersatzlos.

Schnitte über Frame-Nummern, nicht über Zeitangaben, um Rundungsfehler auszuschließen.

**Encoding** (aus dem Original übernommen — `-g 8` ist der nicht-offensichtliche Teil:
eine kurze GOP macht `currentTime`-Seeks billig, weil der Decoder nie weit vom Keyframe
dekodieren muss):

```bash
enc() { ffmpeg -v error -y -i "$1" -an \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
  -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart "$2"; }
```

Der `unsharp`-Filter des Originals kompensiert AI-Video-Weichzeichnung und entfällt bei
Blender-Renders.

**Mobile:** eigener 9:16-Render derselben Kamerafahrt (kein Center-Crop des
Landscape-Films — bei 16:9→9:16 bleiben ~26% des Bildes übrig). Encode mit
`scale=720:-2`, `-g 4`, `crf 23`. Posters aus Frame 0 des jeweiligen Portrait-Segments,
damit beim Übergang Still→Video nichts springt.

**Stills:** Frame 0 jedes Dive-Segments → webp. Sie sind nicht nur Poster, sondern die
vollständige Fallback-Darstellung unter `prefers-reduced-motion` (siehe §7).

## 5. Theme

Die Engine liest `--sw-bg`, `--sw-ink`, `--sw-ink-soft`, `--sw-accent`,
`--sw-font-display`, `--sw-font-body` und wickelt ihre Defaults in `@layer sw`, damit
ungelayerte Overrides gewinnen (`scrub-engine.js:442`).

Für synapticore.studio: `--sw-bg: #020202`, Accents pro Szene entlang der bestehenden
Orange→Cyan-Gradienten (chronologisch warm → kalt). Die Defaults der Engine sind ein
helles Beige — sie müssen vollständig überschrieben werden, sonst blitzt Beige beim
Laden, bevor das eigene CSS greift. Deshalb: Theme-Variablen inline im `<head>` von
`world/index.html`, nicht in einem nachgeladenen Stylesheet.

`--sw-bg` muss dem Hintergrund der Blender-Szenen entsprechen, sonst ist die Kante der
Stills sichtbar.

## 6. Phasing

**Phase A — Greybox.** Untexturierte Blockouts, eine Kamerafahrt, Low-Res-Render, volle
Kette bis zur laufenden Seite. Hier wird alles justiert, was sich nur am laufenden Ding
beurteilen lässt: Scroll-Distanz pro Szene (`scroll`), Verweildauer (`linger`, laut Engine
≤ 0.6 halten), Crossfade-Breite, Copy-Timing, Theme, Mobile-Verhalten. Ein Re-Render
kostet hier Minuten statt Stunden.

Phase A ist außerdem der Messpunkt für das Seitengewicht (§7).

**Phase B — Finale Renders.** Erst wenn Timing und Dramaturgie sitzen: Look-Dev, finale
Renders, gleiche Kamerafahrt, gleiche Schnittpunkte. Nur die Dateien werden getauscht,
Config und Timing bleiben.

**Abnahme Phase A:** Seite läuft unter `npm run dev` auf `/world`, alle neun Segmente
scrubben ohne sichtbaren Sprung an den Nahtstellen, Copy erscheint zur richtigen Zeit,
Mobile-Variante lädt, `prefers-reduced-motion` zeigt die Still-Sequenz, gemessenes
Gesamtgewicht dokumentiert.

## 7. Risiken und Randbedingungen

**Seitengewicht — das reale Risiko.** Die Engine lädt jeden Clip per `fetch()` als
kompletten Blob in den Speicher (`scrub-engine.js:205`). Das ist bewusst so: Blobs sind
immer seekable und brauchen keinen HTTP-Range-Support. Folge: über den Scroll-Verlauf
landen alle neun Clips vollständig im RAM.

Grobe Schätzung bei 1080p/crf20/8s: 2–4 MB pro Clip, also 25–35 MB Desktop. **Das ist
keine gemessene Zahl** — sie hängt stark vom Bildinhalt ab, und dunkle Dioramen mit
ruhiger Kamera komprimieren deutlich besser. Messung in Phase A.

**Messung 2026-07-18, synthetischer `testsrc2`-Master:** Desktop **65 MB** (9 Clips,
8,7 MB je Dive / 5,4 MB je Connector), Mobile 7,5 MB, Stills 1,3 MB. Das liegt fast beim
Doppelten der Schätzung — aber `testsrc2` ist hochfrequentes Farbrauschen und damit der
ungünstigste denkbare H.264-Input. Der Wert ist eine **Obergrenze, keine Prognose** für
die gerenderten Dioramen. Die belastbare Messung ist die aus Task 9/10.

Wenn das Ergebnis zu schwer ausfällt, in dieser Reihenfolge: `crf` anheben (20 → 23),
Clips kürzen, Auflösung senken, Szenenzahl reduzieren. Die Szenenzahl zuletzt, weil sie
die Erzählung beschneidet.

Sollte auch der finale Render deutlich über ~40 MB liegen, ist der Ansatz selbst zu
hinterfragen: Echtzeit-3D (Three.js/WebGPU) statt vorgerenderter Clips würde das
Gewichtsproblem strukturell lösen, zum Preis von GPU-Last beim Besucher und deutlich mehr
Implementierungsarbeit. Nicht Teil dieses Spec — als Plan B notiert.

**Lazy-Loading mildert nur den Start**, nicht das Gesamtgewicht — geladen wird bei 1.6
Viewport-Höhen Abstand (`scrub-engine.js:230`); wer durchscrollt, lädt alles.

**GitHub Pages** hat ein Soft-Limit von 1 GB pro Repo mit Empfehlung unter 100 MB. Bei 18
Videodateien (Desktop + Mobile) über mehrere Iterationen wird das relevant: alte Renders
nicht im Repo mitschleppen, Phase-A-Greybox-Assets vor Phase B entfernen.

**`prefers-reduced-motion` lädt keine Clips** (`scrub-engine.js:201`) — es bleiben die
Stills mit Crossfade. Die Stills müssen deshalb für sich stehen können.
*Verifiziert 2026-07-18:* bei aktivem `reduce` und vollständigem Durchscrollen null
Video-Requests, null `<video>`-Elemente, alle 9 Stills vorhanden, Partikel deaktiviert.

**Fehlende Clips brechen die Seite nicht.** Verifiziert für beide Fälle: echter 404
(Element wird gar nicht erzeugt, `r.ok` false → catch) und HTTP 200 mit falschem Body
(totes `<video>` ohne Metadaten, kosmetisch). In beiden Fällen läuft der Scroll bis ans
Ende durch und der CTA steht.

**Testfallstrick:** Weder der Vite-Dev- noch der Preview-Server liefert für eine fehlende
Datei unter `public/` einen 404 — der Dev-Server cached das Verzeichnis im Speicher, der
Preview-Server greift auf den SPA-Fallback zurück und antwortet mit `index.html` und
Status 200. Wer Fehlerfälle lokal testen will, muss die Response abfangen
(`page.route(...)`), sonst testet er nichts.

**Scroll-Performance ist unkritisch.** Gemessen 2026-07-18 gegen den Production-Build,
1440×900, kompletter Durchlauf über 120 Scroll-Schritte:

| Metrik | Wert | Budget |
|---|---|---|
| Long Tasks | **0** | keine über 50 ms |
| Frame-Zeit Median | 8,3 ms | 16,7 ms (60 fps) |
| Frame-Zeit p95 | 25 ms | — |
| Frames > 50 ms | 3 von 173 | — |
| INP (Route-Dot-Klicks) | 24 / 40 / 64 ms | ≤ 200 ms |

Null Long Tasks bei neun gleichzeitig dekodierenden Clips ist das eigentliche Ergebnis —
es bestätigt die Seek-Koaleszenz der Engine (`scrub-engine.js:281`: nie ein neuer Seek,
solange der Decoder am vorigen arbeitet). Da `testsrc2`-Rauschen der teuerste denkbare
Decode ist, sind das Worst-Case-Werte; gerenderte Dioramen werden günstiger liegen.
Auf Desktop-Hardware gemessen — die Mobil-Messung steht aus und ist die relevantere.

**iOS** braucht eine User-Geste, bevor ein stummes Video zuverlässig dekodiert; die Engine
behandelt das (`primeVideo`, `scrub-engine.js:296`). Auf echtem Gerät zu verifizieren,
nicht im Desktop-Emulator.

**Die Engine setzt `html,body{margin:0;background:…}`** global. Auf `/world` unkritisch,
weil dort nichts anderes lebt — aber sie ist damit definitiv nicht in die bestehende
Startseite einbettbar. Diese Trennung ist Absicht, nicht Zwischenschritt.

**Vendoring statt Dependency:** Die Engine wird kopiert, nicht als Paket eingebunden — sie
wird auch nicht als npm-Paket veröffentlicht. Der MIT-Header bleibt im File. Upstream-Fixes
müssten manuell nachgezogen werden; bei 448 Zeilen ohne Dependencies ist das vertretbar.

## 8. Nicht im Scope

- Änderungen an der bestehenden Startseite außer einem Link auf `/world`
- Aufräumen von `index.jsx` im Projekt-Root (verwaiste Kopie von `src/App.jsx`, in keinem
  Build-Pfad — separat zu behandeln)
- Übernahme von `/world` als neue Startseite (später möglich, dann eigener Vorgang)
- Analytics, i18n, Preloading-Strategien jenseits des Engine-Defaults
