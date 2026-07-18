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
