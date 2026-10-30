/* Premium minimal header — elegant horizontal nav on desktop,
   touch-friendly slide-down menu on tablet/mobile. */
import { useEffect, useState } from 'react';
import { I, Logo } from './ui.jsx';

const LINKS = [
  ['Explore', '#explore'],
  ['Destinations', '#destinations'],
  ['Experiences', '#experiences'],
  ['Temples', '#temples'],
  ['About', '#about'],
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState('#explore');

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 24);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* Track the section in view to underline the current nav item. */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive('#' + e.target.id); }),
      { rootMargin: '-40% 0px -55% 0px' },
    );
    LINKS.forEach(([, hash]) => { const el = document.querySelector(hash); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const go = (hash, cb) => {
    setOpen(false);
    if (cb) cb();
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
  };

  const focusExploreSearch = () => setTimeout(() => document.querySelector('.xp-search input')?.focus({ preventScroll: true }), 500);

  return (
    <header className={'nav' + (solid ? ' nav-solid' : '')}>
      <div className="container nav-inner">
        <a href="#explore" className="nav-brand" aria-label="Gokarna Darshana Holidays — home" onClick={(e) => { e.preventDefault(); go('#explore'); }}><Logo /></a>

        <nav className={'nav-links' + (open ? ' open' : '')} aria-label="Primary">
          {LINKS.map(([label, hash]) => (
            <a key={hash} href={hash} className={active === hash ? 'active' : ''} onClick={(e) => { e.preventDefault(); go(hash); }}>{label}</a>
          ))}
          <a className="nav-cta" href="#enquiry" onClick={(e) => { e.preventDefault(); go('#enquiry'); }}>Book Your Trip <I n="arrowRight" size={15} /></a>
        </nav>

        <div className="nav-right">
          <button className="icon-btn" aria-label="Search destinations" onClick={() => go('#explore', focusExploreSearch)}><I n="search" size={17} /></button>
          <a className="btn btn-dark nav-book" href="#enquiry" onClick={(e) => { e.preventDefault(); go('#enquiry'); }}>Book Your Trip <I n="arrowRight" size={15} /></a>
          <button className={'burger' + (open ? ' is-open' : '')} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <I n="close" size={22} /> : <I n="menu" size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}