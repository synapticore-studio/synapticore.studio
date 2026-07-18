import { mountScrollWorld } from '../src/lib/scrub-engine.js';

mountScrollWorld(document.getElementById('world'), {
  brand: { name: 'Synapticore Studio', href: '/' },
  hint: 'scrollen',
  sections: [
    { id: 'placeholder', label: 'Test', title: 'Mount-Test', accent: '#f97316' },
  ],
});
