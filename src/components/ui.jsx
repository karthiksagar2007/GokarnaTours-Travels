/* Shared UI primitives: inline stroke icons, logo, stars, scroll-reveal hook. */
import { useEffect } from 'react';

/* Inline stroke icons (lucide-style paths). */
export const ICONS = {
  pin: ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'],
  calendar: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z', 'M16 2v4', 'M8 2v4', 'M3 10h18'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  compass: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z', 'm16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12Z'],
  search: ['M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z', 'm21 21-4.3-4.3'],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  close: ['M18 6 6 18', 'm6 6 12 12'],
  phone: ['M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z'],
  mail: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z', 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'],
  clock: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z', 'M12 6v6l4 2'],
  star: ['M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2Z'],
  check: ['M20 6 9 17l-5-5'],
  shield: ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z', 'm9 12 2 2 4-4'],
  headphones: ['M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3'],
  leaf: ['M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z', 'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'],
  route: ['M6 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', 'M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15', 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'],
  car: ['M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2', 'M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', 'M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'],
  bed: ['M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8', 'M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4', 'M12 4v6', 'M2 18h20'],
  receipt: ['M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z', 'M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8', 'M12 17.5v-11'],
  badge: ['M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z', 'm15 9-6 6', 'M9.5 9.5h.01', 'M14.5 14.5h.01'],
  arrowRight: ['M5 12h14', 'm12 5 7 7-7 7'],
  arrowUp: ['m5 12 7-7 7 7', 'M12 19V5'],
  chevronDown: ['m6 9 6 6 6-6'],
  facebook: ['M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'],
  instagram: ['M5 2h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Z', 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z', 'M17.5 6.5h.01'],
  youtube: ['M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 24.12 24.12 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0 2 2 0 0 1-1.4-1.4Z', 'm10 15 5-3-5-3v6Z'],
  whatsapp: ['M7.9 20A9 9 0 1 0 4 16.1L2 22l5.9-2Z', 'M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z', 'M14 15a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1Z'],
  waves: ['M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1', 'M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1', 'M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1'],
  landmark: ['M3 22h18', 'M6 18v-7', 'M10 18v-7', 'M14 18v-7', 'M18 18v-7', 'M12 2l8 5H4l8-5Z'],
  mountain: ['m8 3 4 8 5-5 5 15H2L8 3Z'],
  send: ['m22 2-7 20-4-9-9-4 20-7Z', 'M22 2 11 13'],
  locate: ['M12 2v3', 'M12 19v3', 'M2 12h3', 'M19 12h3', 'M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z', 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'],
  map: ['M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z', 'M9 4v14', 'M15 6v14'],
  list: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3.5 6h.01', 'M3.5 12h.01', 'M3.5 18h.01'],
};

export function I({ n, size = 18, className = '', filled = false }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[n].map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

/* Elegant wordmark: palm-and-wave mark + serif letterspaced name. */
export function Logo({ light = false }) {
  return (
    <span className={'logo' + (light ? ' logo-light' : '')}>
      <svg className="logo-mark" viewBox="0 0 48 40" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 29c.8-7.5-1.2-13.5-5.5-17.5" />
          <path d="M12.5 11.5C9.5 9.5 6 9.3 3 11c2.8-3.6 7-4.5 10.5-2.6" />
          <path d="M12.5 11.5c1-3.8 3.6-6.2 7.5-6.6-3.2 1.6-5 3.9-5.6 6.9" />
          <path d="M30 29c-.8-7.5 1.2-13.5 5.5-17.5" />
          <path d="M35.5 11.5c3-2 6.5-2.2 9.5-.5-2.8-3.6-7-4.5-10.5-2.6" />
          <path d="M35.5 11.5c-1-3.8-3.6-6.2-7.5-6.6 3.2 1.6 5 3.9 5.6 6.9" />
          <path d="M4 35c3.4 0 3.4-2.6 6.8-2.6s3.4 2.6 6.8 2.6 3.4-2.6 6.8-2.6 3.4 2.6 6.8 2.6 3.4-2.6 6.8-2.6S44.6 35 48 35" className="logo-wave" />
        </g>
      </svg>
      <span className="logo-text">
        <b>Gokarna Darshana</b>
        <span>Coastal Karnataka Â· Temples Â· Beaches</span>
      </span>
    </span>
  );
}

export function Stars({ n = 5 }) {
  return <span className="stars">{Array.from({ length: 5 }, (_, i) => <I key={i} n="star" size={14} filled={i < n} className={i < n ? 'star-on' : 'star-off'} />)}</span>;
}

/* Scroll-reveal via IntersectionObserver (respects prefers-reduced-motion in CSS). */
export function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
      { threshold: 0.12 },
    );
    document.querySelectorAll('.reveal:not(.revealed)').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}