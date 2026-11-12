# synapticore.studio

**Agentic DCC Pipelines & Interactive AI Experiences**

[\![Live](https://img.shields.io/badge/synapticore.studio-live-blue?style=flat-square)](https://synapticore.studio)

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- Content from DuckDB CMS (build-time JSON, zero runtime overhead)
- Deployed via GitHub Pages + GitHub Actions

## Development

```bash
npm install
npm run dev      # Dev server on port 5173
npm run build    # Production build → dist/
npm run preview  # Preview build on port 4173
```

Hero, Leistungen und Projekterfahrung werden im CMS gepflegt und mit `uv run cms export --site synapticore-studio` aus dem CMS-Verzeichnis exportiert. Der Abschnitt zu möglichen Ergebnissen, der Pipeline-Ablauf und die Links zu Werkzeugen stehen in `src/App.jsx`. Der räumliche Hintergrund und die Glaseffekte sind in `src/index.css` umgesetzt; die Animation respektiert `prefers-reduced-motion`.

Die responsiven Überschriften bleiben im Kontaktbereich auf zwei lesbaren Zeilen. Der Erfahrungsbereich zeigt die CMS-Inhalte als kompakte Textabschnitte statt als Bildplatzhalter. Dezente Scrollanimationen und der Modellwechsel berücksichtigen `prefers-reduced-motion`.

Die persönliche Projekterfahrung orientiert sich an der Inhaltsvorlage und dem [öffentlichen Profil](https://www.xing.com/profile/Bjoern_Bethge3); sie wird als Erfahrung aus Anstellungen und Projekten über Partner dargestellt.


## Interaktiver Roboter

Der Hero lädt wahlweise den DR02-pro oder den Unitree G1 als komprimiertes GLB. Three.js beleuchtet die PBR-Materialien mit einer vorgefilterten Umgebung und auf den dunklen Hintergrund abgestimmten neutralen und kühlen Lichtern; AgX-Tonemapping und ein dezenter Bloom-Pass stimmen die Darstellung auf den Hintergrund ab; nach der Begrüßung reagieren die Gelenke auf den Mauszeiger; beim Modellwechsel blendet die Figur nach unten aus, bevor die nächste erscheint. Nach der Begrüßung folgt eine dezente Ruhebewegung. Beim G1 bleibt der Kopf entsprechend dem Modell fest am Oberkörper; die Taillengelenke übernehmen die Blickrichtung. Auf großen Bildschirmen bleibt der Roboter beim Scrollen am linken Fensterrand sichtbar. Auf kleineren Bildschirmen steht er nach dem Hero im Seitenfluss, damit Figur und Modellauswahl vollständig sichtbar und bedienbar bleiben. Bei `prefers-reduced-motion` bleibt die Szene statisch. Quellen, Lizenzbedingungen und Änderungen stehen in `public/models/*/ATTRIBUTION.txt` und den jeweiligen `SOURCE_LICENSE.txt`-Dateien.

Die gemeinsame technische AI-Act-Sichtung und die Prüfanlässe stehen im Repository `agentic-dev.io` unter `docs/ai-act-website-sichtung.md`.

## License

[MIT Ethical Use](LICENSE)

