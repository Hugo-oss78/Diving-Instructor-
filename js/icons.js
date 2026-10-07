// Jeu d'icônes personnalisées (SVG, traits fins) — remplace les emoji.
// Toutes les icônes partagent le même langage graphique (contours, sans
// remplissage sauf mention contraire) pour rester cohérentes entre elles.

const PATHS = {
  home: `<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10.3V19a1 1 0 0 0 1 1h3v-5.2h4V20h3a1 1 0 0 0 1-1v-8.7"/>`,

  quiz: `<path d="M12 6.7c-1.5-1.4-3.7-2.2-6.6-2.2A1.4 1.4 0 0 0 4 5.9v11.7c0 .7.7 1.1 1.3.9 2.4-.8 4.6-.1 6 1 .4.3 1 .3 1.4 0 1.4-1.1 3.6-1.8 6-1 .6.2 1.3-.2 1.3-.9V5.9a1.4 1.4 0 0 0-1.4-1.4c-2.9 0-5.1.8-6.6 2.2Z"/><path d="M12 6.7V19"/>`,

  memo: `<path d="M5 4.5h11.2L19 7.3V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z"/><path d="M15.6 4.5v3.3H19"/><path d="M7.3 12h6.4M7.3 15.3h4.4"/>`,

  progress: `<path d="M4.5 20V13" stroke-width="3"/><path d="M12 20V6.5" stroke-width="3"/><path d="M19.5 20v-6.5" stroke-width="3"/>`,

  target: `<circle cx="12" cy="12" r="8.3"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>`,

  physique: `<path d="M2.7 9.2c2-2.4 3.8-2.4 5.8 0s3.8 2.4 5.8 0 3.8-2.4 5.8 0M2.7 15.3c2-2.4 3.8-2.4 5.8 0s3.8 2.4 5.8 0 3.8-2.4 5.8 0"/>`,

  physiologie: `<path d="M12 3.2v7.4"/><path d="M12 10.6c-.9-1.9-2.8-2-3.9-1-2 1.5-2.9 5.1-2.1 8.2.4 1.5 2.1 1.9 3 .9.6-.6.9-2 .9-3.4"/><path d="M12 10.6c.9-1.9 2.8-2 3.9-1 2 1.5 2.9 5.1 2.1 8.2-.4 1.5-2.1 1.9-3 .9-.6-.6-.9-2-.9-3.4"/>`,

  materiel: `<rect x="8.2" y="2.8" width="5.8" height="14.4" rx="2.3"/><path d="M10.1 2.8V1.4h2v1.4"/><path d="M14 7.6c2.1 0 3.2 1.1 3.2 2.7s-1.1 3-3.2 3"/><circle cx="17.6" cy="16.1" r="2.3"/>`,

  planification: `<circle cx="12" cy="12" r="8.3"/><path d="M14.7 9.3 13 13l-3.7 1.7L11 11z"/>`,

  environnement: `<circle cx="12" cy="12" r="8.3"/><path d="M3.7 12h16.6"/><path d="M12 3.7c2.7 2.2 2.7 14.4 0 16.6"/><path d="M12 3.7c-2.7 2.2-2.7 14.4 0 16.6"/>`,

  ssi: `<path d="M12 4.3 2.5 9l9.5 4.7L21.5 9Z"/><path d="M6.2 11.4v4.3c0 1.5 2.6 3 5.8 3s5.8-1.5 5.8-3v-4.3"/>`,

  warning: `<path d="M12 4.2 21.6 20H2.4Z"/><path d="M12 10v4.2"/><circle cx="12" cy="17" r="0.95" fill="currentColor" stroke="none"/>`,

  search: `<circle cx="10.3" cy="10.3" r="6.3"/><path d="M20 20 15.1 15.1"/>`,

  repeat: `<path d="M4 12a8 8 0 0 1 13.7-5.7L20 8"/><path d="M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-13.7 5.7L4 16"/><path d="M4 20v-4h4"/>`,

  install: `<path d="M12 4v11.5"/><path d="M7.5 11 12 15.5 16.5 11"/><path d="M5 18.5h14"/>`,

  diver: `<circle cx="12" cy="10.5" r="6"/><path d="M16.6 8.2c1.8.3 2.7 1.8 2.7 3.6"/><path d="M9 21c.5-2 1.8-3 3-3s2.5 1 3 3"/>`,

  chevron: `<path d="M7 9.5 12 14.5 17 9.5"/>`,

  timer: `<circle cx="12" cy="13" r="8"/><path d="M12 13 15 10.3"/><path d="M12 3.3V5"/><path d="M9.3 3.3h5.4"/>`,

  breath: `<path d="M12 4v5.5"/><circle cx="12" cy="3" r="1" fill="currentColor" stroke="none"/><path d="M12 9.5c-2.2 0-4 2-4 5 0 2.6 1.8 4 4 4s4-1.4 4-4"/>`,

  play: `<path d="M8 5.5v13l11-6.5z"/>`,

  pause: `<path d="M8 5.5v13"/><path d="M16 5.5v13"/>`,
};

export function icon(name, className = "") {
  const inner = PATHS[name] || PATHS.target;
  return `<svg viewBox="0 0 24 24" class="icon ${className}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
