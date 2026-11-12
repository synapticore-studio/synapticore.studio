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

Hero, Leistungen und Projekterfahrung werden im CMS gepflegt und mit `uv run cms export --site synapticore-studio` aus dem CMS-Verzeichnis exportiert. Der Pipeline-Ablauf und die Links zu Werkzeugen stehen in `src/App.jsx`.

## License

[MIT Ethical Use](LICENSE)

