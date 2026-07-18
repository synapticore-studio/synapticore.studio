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
